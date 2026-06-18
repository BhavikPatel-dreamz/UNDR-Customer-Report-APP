import { renderToStaticMarkup } from "react-dom/server";
import type { LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { buildReportDataFromRows } from "../models/report.server";
import type { ProxyReportData } from "../lib/proxy-report-data";
import { mapHeavyMetals } from "../utils/mapHeavyMetals";
import { mapPreciousMetals } from "../utils/mapPreciousMetals";
import { mapRareEarthElements } from "../utils/mapRareEarthElements";
import { mapFoundElements } from "../utils/mapFoundElements";
import { mapNotFoundElements } from "../utils/mapNotFoundElements";
import { mapEarthElementsBreakdown } from "../utils/mapEarthElementsBreakdown";
import IndexPage from "../pages/Index";
import { authenticate } from "../shopify.server";
import { isUnlockModule } from "../lib/report-packages";
import { decodeReportProxyId } from "../lib/report-url";

const REPORT_PACKAGES = ["treasure_base", "treasure_plus", "hs_base", "hs_plus", "premium"] as const;

function normalizeReportPackage(input: unknown): ProxyReportData["reportPackage"] {
  const value = String(input || "").trim().toLowerCase();
  return REPORT_PACKAGES.includes(value as (typeof REPORT_PACKAGES)[number])
    ? (value as (typeof REPORT_PACKAGES)[number])
    : "premium";
}

function isEmbedMode(url: URL) {
  const embed = url.searchParams.get("embed")?.trim().toLowerCase();
  return embed === "1" || embed === "true";
}

function resolveLoggedInCustomerId(url: URL) {
  return (
    url.searchParams.get("logged_in_customer_id")?.trim() ||
    url.searchParams.get("customer_id")?.trim() ||
    null
  );
}

function normalizeShopifyCustomerId(value?: string | null) {
  if (!value) return null;
  const match = value.match(/(\d+)$/);
  return match?.[1] ?? null;
}

function buildCustomerLoginRedirect(proxyId: string) {
  const returnUrl = `/apps/undr/report/${encodeURIComponent(proxyId)}`;
  return `/customer_authentication/login?return_to=${encodeURIComponent(returnUrl)}`;
}

function renderCustomerLoginRedirectPage(proxyId: string) {
  const loginUrl = buildCustomerLoginRedirect(proxyId);

  return `
<script>
window.location.replace(${JSON.stringify(loginUrl)});
</script>
<noscript><meta http-equiv="refresh" content="0;url=${loginUrl}"></noscript>
`;
}

function customerLoginRedirectResponse(proxyId: string) {
  return new Response(renderCustomerLoginRedirectPage(proxyId), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function renderReportNotFoundPage() {
  return `
<section style="padding:40px 20px;max-width:760px;margin:0 auto;">
  <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;color:#111827;">Report not found</h1>
  <p style="margin:0;font-size:16px;line-height:1.6;color:#4b5563;">We could not find a report for this kit on the current store.</p>
</section>
`;
}

function renderReportAccessDeniedPage() {
  return `
<section class="ar_section" style="min-height:70vh;padding:56px 20px;display:grid;place-items:center;color:#111827;">
  <!-- Background intentionally disabled: background:linear-gradient(180deg,#faf9f5 0%,#f4f1ea 100%); -->
  
  <div class="ar_wrapper" style="width:100%;max-width:560px;border:1px solid rgba(17,24,39,0.12);border-radius:18px;background:#ffffff;box-shadow:0 18px 45px rgba(17,24,39,0.08);padding:34px 30px;text-align:center;">
    
  <div class="ar_icon" style="width:54px;height:54px;border-radius:999px;background:#fff7ed;border:1px solid #fed7aa;display:grid;place-items:center;margin:0 auto 20px;color:#c2410c;font-size:26px;font-weight:800;">!</div>
    
  <p class="ar_note" style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;">Access restricted</p>
    
  <h1 class="ar_heading" style="font-family: 'Obviously', Arial, sans-serif; margin:0 0 15px;font-size:clamp(26px,5vw,36px);line-height:1.12;color:#111827;">You do not have access to this report</h1>
    
  <p class="ar_para" style="margin:0 ;font-size:16px;line-height:1.7;color:#4b5563;">This report is linked to a different customer account. Please log in with the account used for this kit.</p>
    
    <!-- Action buttons intentionally hidden for now.
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a href="#" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;background:#111827;color:#fff;font-size:14px;font-weight:700;text-decoration:none;">Log in with another account</a>
        <a href="/account/orders" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 20px;border-radius:999px;border:1px solid rgba(17,24,39,0.16);color:#111827;background:#fff;font-size:14px;font-weight:700;text-decoration:none;">Back to account</a>
      </div>
    -->
  </div>
</section>
`;
}

function ensurePetroleumContaminant(report: ProxyReportData) {
  if (report.petroleum_contaminant) return;

  const valueText = String(report.oilContaminants?.value || "");
  const statusText = String(report.oilContaminants?.status || "");
  const labelText = String(report.reportDetails?.oilIndicator?.petroleum || "");

  const ppmFromValue = Number((valueText.match(/(\d+(?:\.\d+)?)\s*ppm/i)?.[1] || "").trim());
  const ppmFromLabel = Number((labelText.match(/(\d+(?:\.\d+)?)\s*ppm/i)?.[1] || "").trim());
  const ppm = Number.isFinite(ppmFromLabel) ? ppmFromLabel : Number.isFinite(ppmFromValue) ? ppmFromValue : 0;

  const typeFromLabel = (labelText.split(":")[0] || "").trim();
  const typeFromStatus = (statusText.split("(")[0] || "").trim();
  const type = typeFromLabel || typeFromStatus || "Petroleum";
  const level =
    ppm <= 75 ? "Green" : ppm <= 1000 ? "Yellow" : "Red";

  report.petroleum_contaminant = {
    type,
    ppm: Math.round(ppm),
    level,
  };
}

function createEmptyReport(
  customerName: string,
  proxyId: string,
  reportPackage: ProxyReportData["reportPackage"],
): ProxyReportData {
  return {
    reportPackage,
    unlockedModules: [],
    kitRegistrationNumber: proxyId,
    banner: {
      name: customerName,
      subtitle: `Kit Registration: ${proxyId}`,
    },
    reportDetails: {
      heavyMetals: [],
      oilIndicator: {
        crudeOil: "Crude oil: 0 ppm",
        petroleum: "Petroleum Contaminants: None Detected",
        crudeOilClassName: "btn_gray",
        petroleumClassName: "btn_gray",
      },
      preciousMetals: [],
      rareEarthElements: [],
      reportChart: {
        elementNames: [],
        belowData: [],
        refData: [],
        aboveData: [],
      },
    },
    elementBreakdown: { items: [] },
    otherTraceElements: { items: [] },
    traceFound: {
      title: "Traces found in your land sample",
      subtitle: "No report rows are available yet.",
      max: 1000,
      rows: [],
      scaleLabels: ["0", "200", "400", "600", "800", "1000"],
    },
    petroleumTraceFound: {
      title: "Petroleum contaminants found in your land sample",
      subtitle: "No petroleum contaminant rows are available yet.",
      max: 1000,
      rows: [],
      scaleLabels: ["0", "200", "400", "600", "800", "1000"],
    },
    multiLevelCharts: {
      group1Max: 100,
      group1Rows: [],
      group1ScaleLabels: ["0", "25", "50", "75", "100"],
      group2Max: 100,
      group2Rows: [],
      group2ScaleLabels: ["0", "25", "50", "75", "100"],
    },
    oilContaminants: {
      status: "Not Detected",
      value: "0ppm",
    },
    preciousMetalPresent: { items: [] },
    earthElementsBreakdown: { items: [] },
    soilFeatures: [],
    foundElements: [],
    notFoundElements: [],
  };
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { liquid, session } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const embed = isEmbedMode(url);
  const proxyId = params.proxyId || "";
  const kitRegistrationNumber = decodeReportProxyId(proxyId);
  const appUrl = (process.env.SHOPIFY_APP_URL || "").replace(/\/$/, "");
  const requestingShop = (session?.shop || url.searchParams.get("shop") || "").trim().toLowerCase();
  const rawLoggedInCustomerId = resolveLoggedInCustomerId(url);
  const loggedInCustomerId = normalizeShopifyCustomerId(rawLoggedInCustomerId);

  if (!loggedInCustomerId) {
    return customerLoginRedirectResponse(proxyId);
  }

  
  const registration = await getRegistrationByKitNumber(kitRegistrationNumber);

  if (!registration) {
    return liquid(renderReportNotFoundPage(), { layout: !embed });
  }

  const registrationShop = String(registration.shop || "").trim().toLowerCase();
  if (!requestingShop || !registrationShop || requestingShop !== registrationShop) {
    return liquid(renderReportNotFoundPage(), { layout: !embed });
  }

  const reportCustomerId = normalizeShopifyCustomerId(registration.shopifyCustomerId);

  if (!reportCustomerId || loggedInCustomerId !== reportCustomerId) {
    return liquid(renderReportAccessDeniedPage(), { layout: !embed });
  }

  
  const customerName = registration?.name || kitRegistrationNumber;
  const selectedReportPackage = normalizeReportPackage(
    (registration as unknown as { reportPackage?: string } | null)?.reportPackage,
  );
  const selectedQuickViewPackage = normalizeReportPackage(
    (registration as unknown as { quickViewPackage?: string } | null)?.quickViewPackage,
  );

  let report: ProxyReportData | null = null;

  if (registration?.report?.status === "report_generated" || registration?.report?.status === "uploaded") {
    
    if (registration.report.rows && registration.report.rows.length > 0) {
      report = buildReportDataFromRows(                                                                                                       
        registration.report.rows as Parameters<typeof buildReportDataFromRows>[0],
        customerName,
        kitRegistrationNumber,
      );
      report.reportPackage = selectedReportPackage;
      report.quickViewPackage = selectedQuickViewPackage;

    }


  }


  
  if (!report) {
    report = createEmptyReport(customerName, kitRegistrationNumber, selectedReportPackage);
  }

  report.reportPackage = selectedReportPackage;
  report.quickViewPackage = selectedQuickViewPackage;
  report.kitRegistrationNumber = kitRegistrationNumber;
  const registrationUnlocks =
    "unlocks" in registration && Array.isArray(registration.unlocks)
      ? registration.unlocks
      : [];
  report.unlockedModules = registrationUnlocks
    .filter((unlock) => {
      const unlockPackage = String(
        (unlock as { reportPackage?: string }).reportPackage || "",
      ).trim().toLowerCase();
      const unlockReportId = String(
        (unlock as { reportId?: string | null }).reportId || "",
      ).trim();
      const currentReportId = registration.report?.id || "";
      const packageMatches = !unlockPackage || unlockPackage === selectedReportPackage;
      const reportMatches = !unlockReportId || !currentReportId || unlockReportId === currentReportId;
      return packageMatches && reportMatches;
    })
    .map((unlock) => String(unlock.module || "").trim().toLowerCase())
    .filter(isUnlockModule);

  // Ensure heavyMetals are always normalized for both page HTML and injected JSON.
  if (report?.reportDetails?.heavyMetals) {
    report.reportDetails.heavyMetals = mapHeavyMetals(report.reportDetails.heavyMetals);
 
  }
  if (report?.reportDetails?.preciousMetals) {
    report.reportDetails.preciousMetals = mapPreciousMetals(report.reportDetails.preciousMetals);

  }
  if (report?.reportDetails?.rareEarthElements) {
    report.reportDetails.rareEarthElements = mapRareEarthElements(report.reportDetails.rareEarthElements);

  }
  if (report?.foundElements) {
    report.foundElements = mapFoundElements(report.foundElements);

  }
  if (report?.notFoundElements) {
    report.notFoundElements = mapNotFoundElements(report.notFoundElements);

  }
  if (report?.earthElementsBreakdown?.items) {
    report.earthElementsBreakdown.items = mapEarthElementsBreakdown(report.earthElementsBreakdown.items);

  }
  ensurePetroleumContaminant(report);

  const petroleumRows = (registration?.report?.rows || []).filter((row) =>
    String(row?.category || "").toLowerCase() === "petroleum_contaminant",
  );
  const petroleumContaminants = petroleumRows
    .map((row) => {
      const ppm = Number(row?.ppmValue);
      const rawValue = Number(row?.rawValue);
      return {
        type: String(row?.element || "").trim(),
        ppm: Number.isFinite(ppm) ? Math.round(ppm) : 0,
        rawValue: Number.isFinite(rawValue) ? rawValue : undefined,
      };
    })
    .filter((item) => item.type.length > 0);

  if (petroleumContaminants.length > 0) {
    report.petroleum_contaminant = petroleumContaminants[0];
  }

  const pageHtml = renderToStaticMarkup(<IndexPage report={report} appUrl={appUrl} />);
  const reportJson = JSON.stringify(report).replaceAll("<", "\\u003c");

  const template = `
<link rel="stylesheet" href="${appUrl}/proxy-report.css?v=20260529-pdf-zero-size-v2">
<div data-proxy-id="${proxyId.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}">
  ${pageHtml}
</div>
<script id="proxy-report-data" type="application/json">${reportJson}</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/jspdf@3.0.3/dist/jspdf.umd.min.js" defer></script>
<script src="${appUrl}/proxy-report-init.js?v=20260529-pdf-zero-size-v2" defer></script>
`;

  return liquid(template, { layout: !embed });
};
