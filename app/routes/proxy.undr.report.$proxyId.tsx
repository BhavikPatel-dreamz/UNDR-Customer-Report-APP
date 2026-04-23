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
    banner: {
      name: customerName,
      subtitle: `Kit Registration: ${proxyId}`,
    },
    reportDetails: {
      heavyMetals: [],
      oilIndicator: {
        crudeOil: "Crude oil: None",
        petroleum: "Petroleum: None",
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
  const { liquid } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const embed = isEmbedMode(url);
  const proxyId = params.proxyId || "";
  const appUrl = (process.env.SHOPIFY_APP_URL || "").replace(/\/$/, "");

  
  const registration = await getRegistrationByKitNumber(proxyId);
  
  const customerName = registration?.name || proxyId;
  const selectedReportPackage = normalizeReportPackage(
    (registration as unknown as { reportPackage?: string } | null)?.reportPackage,
  );

  let report: ProxyReportData | null = null;

  if (registration?.report?.status === "uploaded") {
    
    if (registration.report.rows && registration.report.rows.length > 0) {
      report = buildReportDataFromRows(
        registration.report.rows as Parameters<typeof buildReportDataFromRows>[0],
        customerName,
        proxyId,
      );
      report.reportPackage = selectedReportPackage;
    }
  }


  
  if (!report) {
    report = createEmptyReport(customerName, proxyId, selectedReportPackage);
  }

  report.reportPackage = selectedReportPackage;

  // Ensure heavyMetals are always normalized for both page HTML and injected JSON.
  if (report?.reportDetails?.heavyMetals) {
    const beforeCount = Array.isArray(report.reportDetails.heavyMetals) ? report.reportDetails.heavyMetals.length : 0;
    report.reportDetails.heavyMetals = mapHeavyMetals(report.reportDetails.heavyMetals);
 
  }
  if (report?.reportDetails?.preciousMetals) {
    const beforeCount = Array.isArray(report.reportDetails.preciousMetals) ? report.reportDetails.preciousMetals.length : 0;
    report.reportDetails.preciousMetals = mapPreciousMetals(report.reportDetails.preciousMetals);

  }
  if (report?.reportDetails?.rareEarthElements) {
    const beforeCount = Array.isArray(report.reportDetails.rareEarthElements) ? report.reportDetails.rareEarthElements.length : 0;
    report.reportDetails.rareEarthElements = mapRareEarthElements(report.reportDetails.rareEarthElements);

  }
  if (report?.foundElements) {
    const beforeCount = Array.isArray(report.foundElements) ? report.foundElements.length : 0;
    report.foundElements = mapFoundElements(report.foundElements);

  }
  if (report?.notFoundElements) {
    const beforeCount = Array.isArray(report.notFoundElements) ? report.notFoundElements.length : 0;
    report.notFoundElements = mapNotFoundElements(report.notFoundElements);

  }
  if (report?.earthElementsBreakdown?.items) {
    const beforeCount = Array.isArray(report.earthElementsBreakdown.items) ? report.earthElementsBreakdown.items.length : 0;
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
    report.petroleum_contaminants = petroleumContaminants;
    report.petroleum_contaminant = petroleumContaminants[0];
    
  }

  const pageHtml = renderToStaticMarkup(<IndexPage report={report} />);
  const reportJson = JSON.stringify(report).replaceAll("<", "\\u003c");

  const template = `
<link rel="stylesheet" href="${appUrl}/proxy-report.css">
<div data-proxy-id="${proxyId.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}">
  ${pageHtml}
</div>
<script id="proxy-report-data" type="application/json">${reportJson}</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js" defer></script>
<script src="${appUrl}/proxy-report-init.js" defer></script>
`;

  return liquid(template, { layout: !embed });
};