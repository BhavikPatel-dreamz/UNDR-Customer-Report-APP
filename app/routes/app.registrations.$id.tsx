import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useActionData, useLoaderData, useNavigation } from "react-router";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import {
  getRegistrationById,
  REPORT_PACKAGES,
  type ReportPackage,
  updateRegistrationReportPackageById,
} from "../models/registration.server";
import {
  parseCsv,
  parseSpreadsheet,
  extractReportRows,
  upsertReport,
  upsertManualPetroleumRowByRegistrationId,
} from "../models/report.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

// ── Loader ────────────────────────────────────────────────────────────────────

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const id = params.id as string;
  const registration = await getRegistrationById(id);
  if (!registration) {
    throw new Response("Not found", { status: 404 });
  }
  if (registration.shop !== session.shop) {
    throw new Response("Forbidden", { status: 403 });
  }
  return { registration, shopDomain: session.shop };
};

// ── Action ────────────────────────────────────────────────────────────────────

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const id = params.id as string;

  const registration = await getRegistrationById(id);
  if (!registration) {
    return { error: "Registration not found.", intent: "upload_csv" as const };
  }
  if (registration.shop !== session.shop) {
    return { error: "You are not allowed to update this registration.", intent: "upload_csv" as const };
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") || "upload_csv");

  if (intent === "package_config") {
    const selectedPackage = String(formData.get("reportPackage") || "").trim().toLowerCase();
    if (!REPORT_PACKAGES.includes(selectedPackage as ReportPackage)) {
      return { error: "Select a valid report package.", intent: "package_config" as const };
    }

    const result = await updateRegistrationReportPackageById({
      registrationId: registration.id,
      shop: session.shop,
      reportPackage: selectedPackage,
    });

    if (!result || result.count === 0) {
      return { error: "Could not update report package.", intent: "package_config" as const };
    }

    return { success: true, message: "Report package updated.", intent: "package_config" as const };
  }

  if (intent === "manual_config") {
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

    if (!petroleumType || !Number.isFinite(finalPpm) || finalPpm < 0) {
      return {
        error: "Enter a valid contaminant and a non-negative PPM value.",
        intent: "manual_config" as const,
      };
    }

    if (!registration.report) {
      return {
        error: "No report found. Upload CSV first, then apply manual config.",
        intent: "manual_config" as const,
      };
    }

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

    return { success: true, message: "Manual petroleum config saved.", intent: "manual_config" as const };
  }

  const file = formData.get("csv");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a CSV file to upload.", intent: "upload_csv" as const };
  }

  const MAX_CSV_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_CSV_BYTES) {
    return { error: "File is too large (max 5 MB).", intent: "upload_csv" as const };
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
    return { error: "Could not read the uploaded file.", intent: "upload_csv" as const };
  }

  if (inputRows.length === 0) {
    return {
      error:
        "The uploaded file appears to be empty or has no parseable rows.",
      intent: "upload_csv" as const,
    };
  }

  const rows = extractReportRows(inputRows);
  if (rows.length === 0) {
    return {
      error:
        "No element/value pairs found. Ensure the CSV has 'element' and 'value' (or 'raw_value') columns.",
      intent: "upload_csv" as const,
    };
  }

  // Validate rawValues are numbers
  const badRows = rows.filter((r) => isNaN(r.rawValue));
  if (badRows.length > 0) {
    return {
      error: `${badRows.length} row(s) had non-numeric values and were skipped.`,
      intent: "upload_csv" as const,
    };
  }

  await upsertReport(registration.id, file.name, rows);

  return {
    success: true,
    rowCount: rows.length,
    message: "CSV uploaded and report saved.",
    intent: "upload_csv" as const,
  };
};

export const headers: HeadersFunction = (args) => boundary.headers(args);

// ── Component ─────────────────────────────────────────────────────────────────

type LoaderData = Awaited<ReturnType<typeof loader>>;
type ActionData =
  | { success: true; message: string; rowCount?: number; intent?: "upload_csv" | "manual_config" | "package_config" }
  | { error: string; intent?: "upload_csv" | "manual_config" | "package_config" }
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

function buildPetroleumPpmValues(rows: Array<{ element: string; ppmValue: number }>) {
  return PETROLEUM_CONTAMINANTS.reduce<Record<string, string>>((acc, item) => {
    const matchedRow = rows.find((row) => row.element === item);
    acc[item] = matchedRow && Number.isFinite(matchedRow.ppmValue) ? String(matchedRow.ppmValue) : "0";
    return acc;
  }, {});
}

export default function RegistrationDetail() {
  const { registration, shopDomain } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const nav = useNavigation();
  const isUploading = nav.state === "submitting";
  const currentReportPackage = (() => {
    const rawValue = String(
      (registration as unknown as { reportPackage?: string }).reportPackage || "premium",
    )
      .trim()
      .toLowerCase();
    return REPORT_PACKAGES.includes(rawValue as ReportPackage) ? (rawValue as ReportPackage) : "premium";
  })();

  const report = registration.report;
  const rows = report?.rows ?? [];
  const [petroleumPpmValues, setPetroleumPpmValues] = useState<Record<string, string>>(() =>
    buildPetroleumPpmValues(rows),
  );
  const [editingPetroleum, setEditingPetroleum] = useState<string | null>(null);

  useEffect(() => {
    setPetroleumPpmValues(buildPetroleumPpmValues(rows));
  }, [rows]);

  useEffect(() => {
    if (actionData && actionData.intent === "manual_config" && "success" in actionData) {
      setEditingPetroleum(null);
    }
  }, [actionData]);

  const onPetroleumPpmChange = (type: string, nextValue: string) => {
    setPetroleumPpmValues((prev) => ({ ...prev, [type]: nextValue }));
  };
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
        <InfoRow
          label="Report package"
          value={
            currentReportPackage === "treasure_base"
              ? "Treasure Base"
              : currentReportPackage === "treasure_plus"
                ? "Treasure Plus"
                : currentReportPackage === "hs_base"
                  ? "H&S Base"
                  : currentReportPackage === "hs_plus"
                    ? "H&S Plus"
                    : "Premium"
          }
        />
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

      <s-section heading="Report package setup">
        {actionData && actionData.intent === "package_config" && "error" in actionData && (
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
        {actionData && actionData.intent === "package_config" && "success" in actionData && (
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
          </div>
        )}

        <form method="post" style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
          <input type="hidden" name="intent" value="package_config" />
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Select package for this registration</span>
            <select
              name="reportPackage"
              defaultValue={currentReportPackage}
              disabled={isUploading}
              style={{ minHeight: "36px", borderRadius: "8px", border: "1px solid #d1d5db", padding: "0 10px" }}
            >
              <option value="treasure_base">Treasure Base</option>
              <option value="treasure_plus">Treasure Plus</option>
              <option value="hs_base">H&S Base</option>
              <option value="hs_plus">H&S Plus</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <div>
            <button
              type="submit"
              disabled={isUploading}
              style={{
                minHeight: "38px",
                padding: "0 16px",
                border: 0,
                borderRadius: "999px",
                background: isUploading ? "#9ca3af" : "#1f2937",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isUploading ? "default" : "pointer",
              }}
            >
              {isUploading ? "Saving..." : "Save package"}
            </button>
          </div>
        </form>
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
        {actionData && actionData.intent === "upload_csv" && "error" in actionData && (
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
        {actionData && actionData.intent === "upload_csv" && "success" in actionData && (
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

      <s-section heading="Manual petroleum controls">
        {actionData && actionData.intent === "manual_config" && "error" in actionData && (
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
        {actionData && actionData.intent === "manual_config" && "success" in actionData && (
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
          </div>
        )}

        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#6b7280" }}>
          All petroleum contaminant values are listed below. Default PPM is 0. Click the pencil icon to edit, then save.
        </p>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.8fr 1fr 1fr auto",
              gap: "10px",
              padding: "10px 12px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              fontSize: "12px",
              fontWeight: 700,
              color: "#374151",
            }}
          >
            <span>Contaminant</span>
            <span>PPM value</span>
            <span>Raw value</span>
            <span>Action</span>
          </div>

          {PETROLEUM_CONTAMINANTS.map((item) => {
            const ppmValue = petroleumPpmValues[item] ?? "0";
            const numericPpm = Number(ppmValue);
            const rawDisplay = Number.isFinite(numericPpm) ? (numericPpm / 10000).toFixed(4) : "0.0000";
            const isEditing = editingPetroleum === item;

            return (
              <form
                key={item}
                method="post"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr 1fr auto",
                  gap: "10px",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <input type="hidden" name="intent" value="manual_config" />
                <input type="hidden" name="petroleumType" value={item} />
                <input type="hidden" name="petroleumRawValue" value={rawDisplay} />

                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{item}</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="petroleumPpm"
                  value={ppmValue}
                  onChange={(e) => onPetroleumPpmChange(item, e.currentTarget.value)}
                  disabled={!isEditing || isUploading}
                  style={{
                    height: "34px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    padding: "0 10px",
                    fontSize: "13px",
                    background: !isEditing ? "#f9fafb" : "#ffffff",
                  }}
                />

                <span style={{ fontSize: "13px", color: "#4b5563", fontFamily: "monospace" }}>{rawDisplay}</span>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setEditingPetroleum(item)}
                      style={{
                        height: "32px",
                        width: "32px",
                        borderRadius: "999px",
                        border: "1px solid #d1d5db",
                        background: "#fff",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      aria-label={`Edit ${item}`}
                      title={`Edit ${item}`}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path
                          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1 1 0 0 0 0-1.41l-2.51-2.51a1 1 0 0 0-1.41 0l-1.96 1.96 3.75 3.75 2.13-2z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={isUploading}
                        style={{
                          minHeight: "32px",
                          padding: "0 12px",
                          border: 0,
                          borderRadius: "999px",
                          background: isUploading ? "#9ca3af" : "#0f766e",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: isUploading ? "default" : "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPetroleum(null)}
                        disabled={isUploading}
                        style={{
                          minHeight: "32px",
                          padding: "0 12px",
                          borderRadius: "999px",
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          color: "#111827",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: isUploading ? "default" : "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </form>
            );
          })}
        </div>
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
