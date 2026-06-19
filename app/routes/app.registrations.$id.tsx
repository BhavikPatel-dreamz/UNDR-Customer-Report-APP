import type { ActionFunctionArgs, HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useActionData, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { authenticate } from "../shopify.server";
import { isReportPackage } from "../lib/report-packages";
import { buildReportPath } from "../lib/report-url";
import {
  getRegistrationById,
  updateRegistrationQuickViewPackageById,
  updateRegistrationReportPackageById,
  updateRegistrationFieldsById,
} from "../models/registration.server";
import {
  parseCsv,
  parseSpreadsheet,
  extractReportRows,
  upsertReport,
  upsertManualPetroleumRowByRegistrationId,
  updateReportRowValuesByRegistrationId,
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
    if (!isReportPackage(selectedPackage)) {
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

    // Auto-sync quickViewPackage to the same value as reportPackage
    await updateRegistrationQuickViewPackageById({
      registrationId: registration.id,
      shop: session.shop,
      quickViewPackage: selectedPackage,
    });

    return { success: true, message: "Report package updated.", intent: "package_config" as const };
  }

  if (intent === "quick_view_config") {
    const selectedPackage = String(formData.get("quickViewPackage") || "").trim().toLowerCase();
    if (!isReportPackage(selectedPackage)) {
      return { error: "Select a valid Quick view package.", intent: "quick_view_config" as const };
    }

    const result = await updateRegistrationQuickViewPackageById({
      registrationId: registration.id,
      shop: session.shop,
      quickViewPackage: selectedPackage,
    });

    if (!result || result.count === 0) {
      return { error: "Could not update Quick view package.", intent: "quick_view_config" as const };
    }

    return { success: true, message: "Quick view package updated.", intent: "quick_view_config" as const };
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

  if (intent === "report_row_config") {
    const reportRowId = String(formData.get("reportRowId") || "").trim();
    const rawValue = Number(String(formData.get("rawValue") || "").trim());
    const ppmValue = Number(String(formData.get("ppmValue") || "").trim());

    if (!reportRowId || !Number.isFinite(rawValue) || rawValue < 0 || !Number.isFinite(ppmValue) || ppmValue < 0) {
      return {
        error: "Enter valid non-negative Raw value and PPM value.",
        intent: "report_row_config" as const,
      };
    }

    const result = await updateReportRowValuesByRegistrationId({
      registrationId: registration.id,
      rowId: reportRowId,
      rawValue,
      ppmValue,
    });

    if (!result || result.count === 0) {
      return {
        error: "Could not update that report row.",
        intent: "report_row_config" as const,
      };
    }

    return { success: true, message: "Element values updated.", intent: "report_row_config" as const };
  }

  if (intent === "toggle_report_link") {
    const enabledRaw = String(formData.get("reportLinkEnabled") || "").trim().toLowerCase();
    const enabled = enabledRaw === "1" || enabledRaw === "true" || enabledRaw === "on";

    try {
      await updateRegistrationFieldsById(registration.id, { reportLinkEnabled: enabled, shop: session.shop });
    } catch (err) {
      return { error: "Could not update report link state.", intent: "toggle_report_link" as const };
    }

    return { success: true, message: enabled ? "Report link enabled." : "Report link disabled.", intent: "toggle_report_link" as const };
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
  | { success: true; message: string; rowCount?: number; intent?: "upload_csv" | "manual_config" | "package_config" | "quick_view_config" | "report_row_config" }
  | { error: string; intent?: "upload_csv" | "manual_config" | "package_config" | "quick_view_config" | "report_row_config" | "toggle_report_link" }
  | { success: true; message: string; intent?: "toggle_report_link" }
  | { error: string; intent?: "toggle_report_link" }
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
  const manualPetroleumFetcher = useFetcher<ActionData>();
  const reportRowFetcher = useFetcher<ActionData>();
  const reportLinkFetcher = useFetcher<ActionData>();
  const packageConfigFetcher = useFetcher<ActionData>();
  const quickViewConfigFetcher = useFetcher<ActionData>();
  const uploadFetcher = useFetcher<ActionData>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigation();
  const isUploading = uploadFetcher.state !== "idle" || nav.state === "submitting";
  const isSavingPetroleum = manualPetroleumFetcher.state !== "idle";
  const isSavingReportRow = reportRowFetcher.state !== "idle";
  const isSavingReportLink = reportLinkFetcher.state !== "idle";
  const isSavingPackage = packageConfigFetcher.state !== "idle";
  const isSavingQuickViewPackage = quickViewConfigFetcher.state !== "idle";
  // referenced intentionally to satisfy TypeScript/ESLint when variable is unused
  void isSavingQuickViewPackage;
  void isSavingReportLink;
  const packageConfigData =
    packageConfigFetcher.data && packageConfigFetcher.data.intent === "package_config"
      ? packageConfigFetcher.data
      : actionData && actionData.intent === "package_config"
        ? actionData
        : undefined;
  const quickViewConfigData =
    quickViewConfigFetcher.data && quickViewConfigFetcher.data.intent === "quick_view_config"
      ? quickViewConfigFetcher.data
      : actionData && actionData.intent === "quick_view_config"
        ? actionData
        : undefined;
  const manualPetroleumData =
    manualPetroleumFetcher.data && manualPetroleumFetcher.data.intent === "manual_config"
      ? manualPetroleumFetcher.data
      : actionData && actionData.intent === "manual_config"
        ? actionData
        : undefined;
  const reportRowData =
    reportRowFetcher.data && reportRowFetcher.data.intent === "report_row_config"
      ? reportRowFetcher.data
      : actionData && actionData.intent === "report_row_config"
        ? actionData
        : undefined;
  const currentReportPackage = (() => {
    const rawValue = String(
      (registration as unknown as { reportPackage?: string }).reportPackage || "premium",
    )
      .trim()
      .toLowerCase();
    return isReportPackage(rawValue) ? rawValue : "premium";
  })();
  const currentQuickViewPackage = (() => {
    const rawValue = String(
      (registration as unknown as { quickViewPackage?: string }).quickViewPackage || currentReportPackage,
    )
      .trim()
      .toLowerCase();
    return isReportPackage(rawValue) ? rawValue : currentReportPackage;
  })();
  const [selectedReportPackage, setSelectedReportPackage] = useState(currentReportPackage);
  const [selectedQuickViewPackage, setSelectedQuickViewPackage] = useState(currentQuickViewPackage);

  const report = registration.report;
  const rows = useMemo(() => report?.rows ?? [], [report?.rows]);
  const [petroleumPpmValues, setPetroleumPpmValues] = useState<Record<string, string>>(() =>
    buildPetroleumPpmValues(rows),
  );
  const [editingPetroleum, setEditingPetroleum] = useState<string | null>(null);
  const [savingPetroleum, setSavingPetroleum] = useState<string | null>(null);
  const [editingReportRowId, setEditingReportRowId] = useState<string | null>(null);
  const [savingReportRowId, setSavingReportRowId] = useState<string | null>(null);
  const [reportRowDraft, setReportRowDraft] = useState({ rawValue: "", ppmValue: "" });

  useEffect(() => {
    setPetroleumPpmValues(buildPetroleumPpmValues(rows));
  }, [rows]);

  useEffect(() => {
    setSelectedReportPackage(currentReportPackage);
  }, [currentReportPackage]);

  useEffect(() => {
    setSelectedQuickViewPackage(currentQuickViewPackage);
  }, [currentQuickViewPackage]);

  useEffect(() => {
    if (actionData && actionData.intent === "manual_config" && "success" in actionData) {
      setEditingPetroleum(null);
    }
  }, [actionData]);

  useEffect(() => {
    if (manualPetroleumFetcher.state !== "idle") return;

    setSavingPetroleum(null);
    if (
      manualPetroleumFetcher.data &&
      manualPetroleumFetcher.data.intent === "manual_config" &&
      "success" in manualPetroleumFetcher.data
    ) {
      setEditingPetroleum(null);
    }
  }, [manualPetroleumFetcher.state, manualPetroleumFetcher.data]);

  useEffect(() => {
    if (reportRowFetcher.state !== "idle") return;

    setSavingReportRowId(null);
    if (
      reportRowFetcher.data &&
      reportRowFetcher.data.intent === "report_row_config" &&
      "success" in reportRowFetcher.data
    ) {
      setEditingReportRowId(null);
    }
  }, [reportRowFetcher.state, reportRowFetcher.data]);

  const onPetroleumPpmChange = (type: string, nextValue: string) => {
    setPetroleumPpmValues((prev) => ({ ...prev, [type]: nextValue }));
  };

  const savePetroleumValue = (type: string, ppmValue: string, rawDisplay: string) => {
    const formData = new FormData();
    formData.set("intent", "manual_config");
    formData.set("petroleumType", type);
    formData.set("petroleumRawValue", rawDisplay);
    formData.set("petroleumPpm", ppmValue);
    setSavingPetroleum(type);
    manualPetroleumFetcher.submit(formData, { method: "post" });
  };

  const startEditingReportRow = (row: { id: string; rawValue: number; ppmValue: number }) => {
    setEditingReportRowId(row.id);
    setReportRowDraft({
      rawValue: String(row.rawValue),
      ppmValue: String(row.ppmValue),
    });
  };

  const saveReportRowValues = (rowId: string) => {
    const formData = new FormData();
    formData.set("intent", "report_row_config");
    formData.set("reportRowId", rowId);
    formData.set("rawValue", reportRowDraft.rawValue);
    formData.set("ppmValue", reportRowDraft.ppmValue);
    setSavingReportRowId(rowId);
    reportRowFetcher.submit(formData, { method: "post" });
  };

  const saveReportPackage = () => {
    const formData = new FormData();
    formData.set("intent", "package_config");
    formData.set("reportPackage", selectedReportPackage);
    packageConfigFetcher.submit(formData, { method: "post" });
  };

  const saveQuickViewPackage = () => {
    const formData = new FormData();
    formData.set("intent", "quick_view_config");
    formData.set("quickViewPackage", selectedQuickViewPackage);
    quickViewConfigFetcher.submit(formData, { method: "post" });
  };

  // mark as referenced to satisfy TypeScript/ESLint when function is intentionally unused
  void saveQuickViewPackage;

  const appUrl = (typeof process !== "undefined" ? process.env.SHOPIFY_APP_URL : "") || "";
  const normalizedShopDomain = String(shopDomain || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const reportPath = buildReportPath(registration.kitRegistrationNumber);
  const reportBaseUrl = normalizedShopDomain
    ? `https://${normalizedShopDomain}`
    : appUrl.replace(/\/$/, "");
  const reportUrl = `${reportBaseUrl}${reportPath}`;

  const [reportLinkEnabled, setReportLinkEnabled] = useState(false);
  const [reportLinkError, setReportLinkError] = useState<string | null>(null);

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
            label={report?.status === "report_generated" || report?.status === "uploaded" ? "Report generated" : "Pending report"}
            variant={report?.status === "report_generated" || report?.status === "uploaded" ? "success" : "neutral"}
          />
        </div>
      </s-section>

      <s-section heading="Report package setup">
        {packageConfigData && "error" in packageConfigData && (
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
            {packageConfigData.error}
          </div>
        )}
        {packageConfigData && "success" in packageConfigData && (
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
            ✓ {packageConfigData.message}
          </div>
        )}

        <div style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Select package for this registration</span>
            <select
              name="reportPackage"
              value={selectedReportPackage}
              onChange={(event) => {
                const nextValue = event.currentTarget.value;
                if (isReportPackage(nextValue)) {
                  setSelectedReportPackage(nextValue);
                }
              }}
              disabled={isUploading || isSavingPackage}
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
              type="button"
              onClick={saveReportPackage}
              disabled={isUploading || isSavingPackage}
              style={{
                minHeight: "38px",
                padding: "0 16px",
                border: 0,
                borderRadius: "999px",
                background: isUploading || isSavingPackage ? "#9ca3af" : "#1f2937",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: isUploading || isSavingPackage ? "default" : "pointer",
              }}
            >
              {isSavingPackage ? "Saving..." : "Save package"}
            </button>
          </div>
        </div>
      </s-section>

      {/* Quick view package setup — hidden from UI; quickViewPackage is auto-synced
          from reportPackage on the server when "Save package" is clicked.
          Mapping: treasure_base→Treasure Hunting Kit, treasure_plus→Treasure Hunting Plus Kit,
                   hs_base→Health & Safety Kit, hs_plus→Health & Safety Plus Kit, premium→Premium Kit */}

      {/* ── Report link ── */}
      {(report?.status === "report_generated" || report?.status === "uploaded") && (
        <s-section heading="Customer report link">
          <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#6b7280" }}>
            Share this URL with the customer via email or QR code:
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                aria-pressed={reportLinkEnabled}
                onClick={() => {
                  const next = !reportLinkEnabled;
                  setReportLinkEnabled(next);
                  setReportLinkError(null);
                  const fd = new FormData();
                  fd.set("intent", "toggle_report_link");
                  fd.set("reportLinkEnabled", next ? "1" : "0");
                  reportLinkFetcher.submit(fd, { method: "post" });
                }}
                disabled={isSavingReportLink}
                title={reportLinkEnabled ? "Disable report link" : "Enable report link"}
                style={{
                  width: "46px",
                  height: "28px",
                  padding: "3px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  background: reportLinkEnabled ? "#6b7280" : "#9ca3af",
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: isSavingReportLink ? "default" : "pointer",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    transform: reportLinkEnabled ? "translateX(18px)" : "translateX(0)",
                    transition: "transform 140ms ease",
                    display: "inline-block",
                  }}
                />
              </button>
              <span style={{ fontSize: "13px", color: "#374151" }}>Enable report link</span>
            </div>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>(default: off)</span>
          </div>

          <a
            href={reportUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "14px", color: "#111827", fontWeight: 600, wordBreak: "break-all", cursor: "pointer" }}
          >
            {reportUrl}
          </a>

          {!reportLinkEnabled && (
            <div style={{ marginTop: "8px", color: "#b91c1c", fontSize: "13px" }}>
              Public access to this report is disabled. Customers will be denied access until you enable the report link.
            </div>
          )}
        </s-section>
      )}

      {/* ── CSV Upload ── */}
      <s-section heading={(report?.status === "report_generated" || report?.status === "uploaded") ? "Replace CSV report" : "Upload CSV report"}>
        {uploadFetcher.data && uploadFetcher.data.intent === "upload_csv" && "error" in uploadFetcher.data && (
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
            {uploadFetcher.data.error}
          </div>
        )}
        {uploadFetcher.data && uploadFetcher.data.intent === "upload_csv" && "success" in uploadFetcher.data && (
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
            ✓ {uploadFetcher.data.message}
            {typeof uploadFetcher.data.rowCount === "number" ? ` (${uploadFetcher.data.rowCount} rows)` : ""}
          </div>
        )}

        <div style={{ display: "grid", gap: "16px", maxWidth: "480px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              CSV file{" "}
              <span style={{ fontWeight: 400, color: "#9ca3af" }}>
                (supports element/raw_value or component/result exports)
              </span>
            </span>
            <input
              ref={fileInputRef}
              type="file"
              name="csv"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              style={{ fontSize: "14px" }}
            />
          </label>
          <div>
                <button
              type="button"
              disabled={isUploading}
              onClick={() => {
                const file = fileInputRef.current?.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.set("intent", "upload_csv");
                formData.set("csv", file);
                uploadFetcher.submit(formData, { method: "post", encType: "multipart/form-data" });
              }}
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
              {isUploading ? "Processing…" : (report?.status === "report_generated" || report?.status === "uploaded") ? "Replace report" : "Upload report"}
            </button>
          </div>
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

      <s-section heading="Manual petroleum controls">
        {manualPetroleumData && "error" in manualPetroleumData && (
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
            {manualPetroleumData.error}
          </div>
        )}
        {manualPetroleumData && "success" in manualPetroleumData && (
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
            ✓ {manualPetroleumData.message}
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
              <div
                key={item}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr 1fr auto",
                  gap: "10px",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{item}</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="petroleumPpm"
                  value={ppmValue}
                  onChange={(e) => onPetroleumPpmChange(item, e.currentTarget.value)}
                  disabled={!isEditing || isUploading || isSavingPetroleum}
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
                        type="button"
                        onClick={() => savePetroleumValue(item, ppmValue, rawDisplay)}
                        disabled={isUploading || isSavingPetroleum}
                        style={{
                          minHeight: "32px",
                          padding: "0 12px",
                          border: 0,
                          borderRadius: "999px",
                          background: isUploading || isSavingPetroleum ? "#9ca3af" : "#0f766e",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: isUploading || isSavingPetroleum ? "default" : "pointer",
                        }}
                      >
                        {savingPetroleum === item ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPetroleum(null)}
                        disabled={isUploading || isSavingPetroleum}
                        style={{
                          minHeight: "32px",
                          padding: "0 12px",
                          borderRadius: "999px",
                          border: "1px solid #d1d5db",
                          background: "#fff",
                          color: "#111827",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: isUploading || isSavingPetroleum ? "default" : "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </s-section>

      {/* ── Parsed rows table ── */}
      {rows.length > 0 && (
        <s-section heading={`Report data (${rows.length} elements)`}>
          {reportRowData && "error" in reportRowData && (
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
              {reportRowData.error}
            </div>
          )}
          {reportRowData && "success" in reportRowData && (
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
              ✓ {reportRowData.message}
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                  {["Element", "Raw value", "PPM value", "Unit", "Category", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", fontWeight: 600, color: "#374151" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isEditingRow = editingReportRowId === row.id;
                  const isSavingRow = isSavingReportRow && savingReportRowId === row.id;
                  return (
                    <tr key={row.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "8px 12px", fontWeight: 500 }}>{row.element}</td>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>
                        {isEditingRow ? (
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={reportRowDraft.rawValue}
                            onChange={(event) => {
                              const nextValue = event.currentTarget.value;
                              setReportRowDraft((prev) => ({ ...prev, rawValue: nextValue }));
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") event.preventDefault();
                            }}
                            disabled={isUploading || isSavingReportRow}
                            style={{
                              width: "130px",
                              minHeight: "32px",
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              fontFamily: "monospace",
                              fontSize: "13px",
                            }}
                          />
                        ) : (
                          row.rawValue
                        )}
                      </td>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", fontWeight: 600 }}>
                        {isEditingRow ? (
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={reportRowDraft.ppmValue}
                            onChange={(event) => {
                              const nextValue = event.currentTarget.value;
                              setReportRowDraft((prev) => ({ ...prev, ppmValue: nextValue }));
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") event.preventDefault();
                            }}
                            disabled={isUploading || isSavingReportRow}
                            style={{
                              width: "140px",
                              minHeight: "32px",
                              padding: "6px 8px",
                              borderRadius: "8px",
                              border: "1px solid #d1d5db",
                              fontFamily: "monospace",
                              fontSize: "13px",
                              fontWeight: 600,
                            }}
                          />
                        ) : (
                          row.ppmValue.toFixed(4)
                        )}
                      </td>
                      <td style={{ padding: "8px 12px", color: "#6b7280" }}>{row.unit}</td>
                      <td style={{ padding: "8px 12px", color: "#6b7280" }}>{row.category || "—"}</td>
                      <td style={{ padding: "8px 12px" }}>
                        {isEditingRow ? (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button
                              type="button"
                              onClick={() => saveReportRowValues(row.id)}
                              disabled={isUploading || isSavingReportRow}
                              style={{
                                minHeight: "32px",
                                padding: "0 12px",
                                border: 0,
                                borderRadius: "999px",
                                background: isUploading || isSavingReportRow ? "#9ca3af" : "#0f766e",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: isUploading || isSavingReportRow ? "default" : "pointer",
                              }}
                            >
                              {isSavingRow ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingReportRowId(null)}
                              disabled={isUploading || isSavingReportRow}
                              style={{
                                minHeight: "32px",
                                padding: "0 12px",
                                borderRadius: "999px",
                                border: "1px solid #d1d5db",
                                background: "#fff",
                                color: "#111827",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: isUploading || isSavingReportRow ? "default" : "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditingReportRow(row)}
                            disabled={isUploading || isSavingReportRow}
                            style={{
                              minHeight: "32px",
                              padding: "0 12px",
                              borderRadius: "999px",
                              border: "1px solid #d1d5db",
                              background: "#fff",
                              color: "#111827",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: isUploading || isSavingReportRow ? "default" : "pointer",
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </s-section>
      )}
    </s-page>
  );
}
