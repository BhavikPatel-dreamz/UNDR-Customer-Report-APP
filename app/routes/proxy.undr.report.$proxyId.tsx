import { renderToStaticMarkup } from "react-dom/server";
import type { LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { buildReportDataFromRows } from "../models/report.server";
import { getProxyReportData } from "../lib/proxy-report-data.server";
import type { ProxyReportData } from "../lib/proxy-report-data";
import IndexPage from "../pages/Index";
import { authenticate } from "../shopify.server";

function isEmbedMode(url: URL) {
  const embed = url.searchParams.get("embed")?.trim().toLowerCase();
  return embed === "1" || embed === "true";
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { liquid } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const embed = isEmbedMode(url);
  const proxyId = params.proxyId || "";
  const appUrl = (process.env.SHOPIFY_APP_URL || "").replace(/\/$/, "");

  const registration = await getRegistrationByKitNumber(proxyId);
  
  const customerName = registration?.name || proxyId;

  let report: ProxyReportData | null = null;

  if (registration?.report?.status === "uploaded") {
    if (registration.report.reportData) {
      try {
        report = JSON.parse(registration.report.reportData) as ProxyReportData;
      } catch {
        // Fall through to row-based reconstruction or static fallback.
      }
    }

    if (!report && registration.report.rows && registration.report.rows.length > 0) {
      report = buildReportDataFromRows(
        registration.report.rows as Parameters<typeof buildReportDataFromRows>[0],
        customerName,
        proxyId,
      );
    }
  }

  if (!report) {
    report = await getProxyReportData(proxyId, request);
    report.banner.name = customerName || report.banner.name;
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