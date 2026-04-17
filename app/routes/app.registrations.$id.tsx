import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useActionData, useLoaderData, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";
import { getRegistrationById } from "../models/registration.server";
import {
  parseCsv,
  parseSpreadsheet,
  extractReportRows,
  buildReportDataFromRows,
  upsertReport,
} from "../models/report.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

// ── Loader ────────────────────────────────────────────────────────────────────

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const id = params.id as string;
  const registration = await getRegistrationById(id);
  if (!registration) {
    throw new Response("Not found", { status: 404 });
  }
  return { registration };
};

// ── Action ────────────────────────────────────────────────────────────────────

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const id = params.id as string;

  const registration = await getRegistrationById(id);
  if (!registration) {
    return { error: "Registration not found." };
  }

  const intent = request.headers.get("content-type") || "";
  if (!intent.includes("multipart/form-data")) {
    return { error: "Expected a multipart form submission." };
  }

  const formData = await request.formData();
  const file = formData.get("csv");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a CSV file to upload." };
  }

  const MAX_CSV_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_CSV_BYTES) {
    return { error: "File is too large (max 5 MB)." };
  }

  let inputRows: Record<string, string>[];
  const lowerFileName = file.name.toLowerCase();
  const isExcel = lowerFileName.endsWith(".xlsx") || lowerFileName.endsWith(".xls");

  try {
    if (isExcel) {
      const buffer = await file.arrayBuffer();
      inputRows = parseSpreadsheet(buffer);
    } else {
      const text = await file.text();
      inputRows = parseCsv(text);
    }
  } catch {
    return { error: "Could not read the uploaded file." };
  }

  if (inputRows.length === 0) {
    return {
      error:
        "The uploaded file appears to be empty or has no parseable rows.",
    };
  }

  const rows = extractReportRows(inputRows);
  if (rows.length === 0) {
    return {
      error:
        "No element/value pairs found. Ensure the CSV has 'element' and 'value' (or 'raw_value') columns.",
    };
  }

  // Validate rawValues are numbers
  const badRows = rows.filter((r) => isNaN(r.rawValue));
  if (badRows.length > 0) {
    return { error: `${badRows.length} row(s) had non-numeric values and were skipped.` };
  }

  const reportData = buildReportDataFromRows(
    rows,
    registration.name,
    registration.kitRegistrationNumber,
  );

  await upsertReport(registration.id, file.name, rows, reportData);

  return { success: true, rowCount: rows.length };
};

export const headers: HeadersFunction = (args) => boundary.headers(args);

// ── Component ─────────────────────────────────────────────────────────────────

type LoaderData = Awaited<ReturnType<typeof loader>>;
type ActionData =
  | { success: true; rowCount: number }
  | { error: string }
  | undefined;

function Badge({
  label,
  variant,
}: {
  label: string;
  variant: "success" | "neutral";
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "999px",
        background: variant === "success" ? "#d1fae5" : "#f3f4f6",
        color: variant === "success" ? "#065f46" : "#6b7280",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ width: "200px", color: "#6b7280", fontSize: "14px", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function RegistrationDetail() {
  const { registration } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const nav = useNavigation();
  const isUploading = nav.state === "submitting";

  const report = registration.report;
  const rows = report?.rows ?? [];
  const appUrl = (typeof process !== "undefined" ? process.env.SHOPIFY_APP_URL : "") || "";
  const reportUrl = `${appUrl.replace(/\/$/, "")}/apps/undr/report/${registration.kitRegistrationNumber}`;

  return (
    <s-page
      heading={`Registration: ${registration.kitRegistrationNumber}`}
      back-action-href="/app"
      back-action-label="All registrations"
    >
      {/* ── Registration info ── */}
      <s-section heading="Customer information">
        <InfoRow label="Name" value={registration.name} />
        <InfoRow label="Email" value={registration.email} />
        <InfoRow label="Phone" value={registration.phone} />
        <InfoRow label="Order number" value={registration.orderNumber} />
        <InfoRow label="Kit number" value={registration.kitRegistrationNumber} />
        {registration.shopifyOrderId && (
          <InfoRow label="Shopify order ID" value={registration.shopifyOrderId} />
        )}
        {registration.shopifyCustomerId && (
          <InfoRow label="Shopify customer ID" value={registration.shopifyCustomerId} />
        )}
        <InfoRow label="Registered on" value={new Date(registration.createdAt).toLocaleString()} />
        <div style={{ paddingTop: "12px" }}>
          <Badge
            label={report?.status === "uploaded" ? "Report uploaded" : "Pending report"}
            variant={report?.status === "uploaded" ? "success" : "neutral"}
          />
        </div>
      </s-section>

      {/* ── Report link ── */}
      {report?.status === "uploaded" && (
        <s-section heading="Customer report link">
          <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#6b7280" }}>
            Share this URL with the customer via email or QR code:
          </p>
          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "14px", color: "#111827", fontWeight: 600, wordBreak: "break-all" }}
          >
            {reportUrl}
          </a>
        </s-section>
      )}

      {/* ── CSV Upload ── */}
      <s-section heading={report?.status === "uploaded" ? "Replace CSV report" : "Upload CSV report"}>
        {actionData && "error" in actionData && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "14px",
            }}
          >
            {actionData.error}
          </div>
        )}
        {actionData && "success" in actionData && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "#ecfdf3",
              color: "#065f46",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ✓ {actionData.rowCount} element rows processed and report saved.
          </div>
        )}

        <form
          method="post"
          encType="multipart/form-data"
          style={{ display: "grid", gap: "16px", maxWidth: "480px" }}
        >
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              CSV file{" "}
              <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                (headers: element, raw_value, unit, category)
              </span>
            </span>
            <input
              type="file"
              name="csv"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              required
              style={{ fontSize: "14px" }}
            />
          </label>
          <div>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                minHeight: "40px",
                padding: "0 20px",
                border: 0,
                borderRadius: "999px",
                background: isUploading ? "#9ca3af" : "#111827",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isUploading ? "default" : "pointer",
              }}
            >
              {isUploading ? "Processing…" : report?.status === "uploaded" ? "Replace report" : "Upload report"}
            </button>
          </div>
        </form>

        <details style={{ marginTop: "20px" }}>
          <summary style={{ fontSize: "13px", color: "#6b7280", cursor: "pointer" }}>
            Expected CSV format
          </summary>
          <pre
            style={{
              marginTop: "10px",
              padding: "14px",
              background: "#f9fafb",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#374151",
              overflowX: "auto",
            }}
          >
{`element,raw_value,unit,category
Lead,0.0023,ppm,heavy_metal
Gold,0.000001,ppm,precious_metal
Iron,1.5400,ppm,trace_element
Uranium,0.0000,ppm,heavy_metal`}
          </pre>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#9ca3af" }}>
            ppm_value = raw_value × 10,000. Category is optional but helps organise the report.
          </p>
        </details>
      </s-section>

      {/* ── Parsed rows table ── */}
      {rows.length > 0 && (
        <s-section heading={`Report data (${rows.length} elements)`}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  {["Element", "Raw value", "PPM value", "Unit", "Category"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", fontWeight: 600, color: "#374151" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 500 }}>{row.element}</td>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{row.rawValue}</td>
                    <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 600 }}>
                      {row.ppmValue.toFixed(4)}
                    </td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{row.unit}</td>
                    <td style={{ padding: "8px 12px", color: "#6b7280" }}>{row.category || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </s-section>
      )}
    </s-page>
  );
}
