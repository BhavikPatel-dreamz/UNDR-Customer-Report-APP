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
  updateReportDataByRegistrationId,
  upsertManualPetroleumRowByRegistrationId,
} from "../models/report.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import type { ProxyReportData } from "../lib/proxy-report-data";

// ── Loader ────────────────────────────────────────────────────────────────────

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const id = params.id as string;
  const registration = await getRegistrationById(id);
  if (!registration) {
    throw new Response("Not found", { status: 404 });
  }
  return { registration, shopDomain: session.shop };
};

// ── Action ────────────────────────────────────────────────────────────────────

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await authenticate.admin(request);
  const id = params.id as string;

  const registration = await getRegistrationById(id);
  if (!registration) {
    return { error: "Registration not found." };
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "upload_csv");

  if (intent === "manual_config") {
    const existingReportData = registration.report?.reportData;
    let reportData: ProxyReportData;

    try {
      reportData = existingReportData
        ? (JSON.parse(existingReportData) as ProxyReportData)
        : buildReportDataFromRows(
            (registration.report?.rows || []) as Parameters<typeof buildReportDataFromRows>[0],
            registration.name,
            registration.kitRegistrationNumber,
          );
    } catch {
      reportData = buildReportDataFromRows(
        (registration.report?.rows || []) as Parameters<typeof buildReportDataFromRows>[0],
        registration.name,
        registration.kitRegistrationNumber,
      );
    }

    const petroleumType = String(formData.get("petroleumType") || "").trim();
    const petroleumPpmRaw = String(formData.get("petroleumPpm") || "").trim();
    const petroleumPpm = petroleumPpmRaw ? Number(petroleumPpmRaw) : NaN;
    const petroleumRawValueInput = String(formData.get("petroleumRawValue") || "").trim();
    const petroleumRawValue = petroleumRawValueInput ? Number(petroleumRawValueInput) : NaN;
    const derivedPpmFromRaw = Number.isFinite(petroleumRawValue) ? petroleumRawValue * 10000 : NaN;
    const finalPpm =
      Number.isFinite(petroleumPpm) && petroleumPpm >= 0
        ? petroleumPpm
        : Number.isFinite(derivedPpmFromRaw) && derivedPpmFromRaw >= 0
          ? derivedPpmFromRaw
          : NaN;

    if (petroleumType && Number.isFinite(finalPpm) && finalPpm >= 0) {
      const level = finalPpm <= 75 ? "Green" : finalPpm <= 1000 ? "Yellow" : "Red";
      reportData.oilContaminants.status = `${petroleumType} (${level})`;
      reportData.oilContaminants.value = `${Math.round(finalPpm)}ppm`;
      reportData.reportDetails.oilIndicator.petroleum = Number.isFinite(petroleumRawValue)
        ? `${petroleumType}: raw ${petroleumRawValue} (${Math.round(finalPpm)}ppm)`
        : `${petroleumType}: ${Math.round(finalPpm)}ppm`;
      reportData.petroleum_contaminant = {
        type: petroleumType,
        ppm: Math.round(finalPpm),
        rawValue: Number.isFinite(petroleumRawValue) ? petroleumRawValue : undefined,
        level,
      };
    }

    const updated = await updateReportDataByRegistrationId(registration.id, reportData);
    if (!updated) {
      return { error: "No report found. Upload CSV first, then apply manual config." };
    }

    if (petroleumType && Number.isFinite(finalPpm) && finalPpm >= 0) {
      const rawForDb =
        Number.isFinite(petroleumRawValue) && petroleumRawValue >= 0
          ? petroleumRawValue
          : finalPpm / 10000;
      await upsertManualPetroleumRowByRegistrationId({
        registrationId: registration.id,
        element: petroleumType,
        rawValue: rawForDb,
        ppmValue: finalPpm,
      });
    }

    return { success: true, message: "Manual petroleum config saved." };
  }

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

  return { success: true, rowCount: rows.length, message: "CSV uploaded and report saved." };
};

export const headers: HeadersFunction = (args) => boundary.headers(args);

// ── Component ─────────────────────────────────────────────────────────────────

type LoaderData = Awaited<ReturnType<typeof loader>>;
type ActionData =
  | { success: true; message: string; rowCount?: number }
  | { error: string }
  | undefined;

  const PETROLEUM_CONTAMINANTS = [
    "Gasoline",
    "Diesel",
    "Jet Fuel",
    "Heating Oil",
    "Heavy Fuel Oil",
    "Arochlor",
    "Aromatic compounds",
    "Waste Oil",
    "Motor Oil",
    "DDT Insecticide",
    "Lubricating Oil",
    "Benzene",
  ];

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
  const { registration, shopDomain } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const nav = useNavigation();
  const isUploading = nav.state === "submitting";

  const report = registration.report;
  const rows = report?.rows ?? [];
  const appUrl = (typeof process !== "undefined" ? process.env.SHOPIFY_APP_URL : "") || "";
  const normalizedShopDomain = String(shopDomain || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const reportPath = `/apps/undr/report/${encodeURIComponent(registration.kitRegistrationNumber)}`;
  const reportBaseUrl = normalizedShopDomain
    ? `https://${normalizedShopDomain}`
    : appUrl.replace(/\/$/, "");
  const reportUrl = `${reportBaseUrl}${reportPath}`;

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
            ✓ {actionData.message}
            {typeof actionData.rowCount === "number" ? ` (${actionData.rowCount} rows)` : ""}
          </div>
        )}

        <form
          method="post"
          encType="multipart/form-data"
          style={{ display: "grid", gap: "16px", maxWidth: "480px" }}
        >
          <input type="hidden" name="intent" value="upload_csv" />
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              CSV file{" "}
              <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                (supports element/raw_value or component/result exports)
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

        <div
          style={{
            marginTop: "18px",
            paddingTop: "14px",
            borderTop: "1px solid #e5e7eb",
            display: "grid",
            gap: "12px",
            maxWidth: "760px",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>Manual petroleum controls</h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Select contaminant and enter PPM or Raw value. Data will be saved in report JSON and report rows.
          </p>

          <form method="post" style={{ display: "grid", gap: "12px" }}>
            <input type="hidden" name="intent" value="manual_config" />
            <div style={{ display: "grid", gap: "8px", gridTemplateColumns: "1fr 180px 180px", alignItems: "end" }}>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Petroleum contaminant type</span>
                <select name="petroleumType" style={{ minHeight: "36px", padding: "0 10px" }}>
                  <option value="">Select type</option>
                  {PETROLEUM_CONTAMINANTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>PPM value</span>
                <input type="number" min="0" step="0.01" name="petroleumPpm" placeholder=" e.g. 125"  style={{ height: "36px" }}/>
              </label>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Raw value</span>
                <input type="number" min="0" step="0.0001" name="petroleumRawValue" placeholder=" e.g. 0.0125" style={{ height: "36px" }} />
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={isUploading}
                style={{
                  minHeight: "40px",
                  padding: "0 20px",
                  border: 0,
                  borderRadius: "999px",
                  background: isUploading ? "#9ca3af" : "#0f766e",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isUploading ? "default" : "pointer",
                }}
              >
                {isUploading ? "Saving…" : "Save petroleum config"}
              </button>
            </div>
          </form>
        </div>

        <details style={{ marginTop: "20px" }}>
          <summary style={{ fontSize: "13px", color: "#6b7280", cursor: "pointer" }}>
            Accepted file formats
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
{`Component,Result,Unit
Fe,63.1272,mass%
Cr,15.8755,mass%
Ni,6.7106,mass%`}
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
