import { renderToStaticMarkup } from "react-dom/server";
import type { LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { buildReportDataFromRows } from "../models/report.server";
import { getProxyReportData } from "../lib/proxy-report-data.server";
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

  if (!registration) {
    return liquid(
      `<div style="max-width:640px;margin:60px auto;padding:0 20px;text-align:center;font-family:sans-serif;">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;">Kit not registered</h2>
        <p style="color:#6b7280;line-height:1.6;">
          We couldn&apos;t find a registration for kit number
          <strong>${proxyId.replace(/[<>"'&]/g, "")}</strong>.
        </p>
        <p style="color:#6b7280;line-height:1.6;">
          Please
          <a href="/apps/undr/register" style="color:#111827;font-weight:600;">register your kit</a>
          first, and your report will appear here once it is ready.
        </p>
      </div>`,
      { layout: !embed },
    );
  }

  if (!registration.report || registration.report.status !== "uploaded") {
    return liquid(
      `<div style="max-width:640px;margin:60px auto;padding:0 20px;text-align:center;font-family:sans-serif;">
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;">Report being prepared</h2>
        <p style="color:#6b7280;line-height:1.6;">
          Hi <strong>${registration.name.replace(/[<>"'&]/g, "")}</strong>,
          your kit is registered! Your analysis report will appear here once it has been processed.
        </p>
        <p style="color:#6b7280;line-height:1.6;">Expected within 5–7 business days of lab receipt.</p>
      </div>`,
      { layout: !embed },
    );
  }

  let report;

  if (registration.report.reportData) {
    try {
      report = JSON.parse(registration.report.reportData);
    } catch {
      // fall through to row-based reconstruction
    }
  }

  if (!report) {
    if (registration.report.rows && registration.report.rows.length > 0) {
      report = buildReportDataFromRows(
        registration.report.rows as Parameters<typeof buildReportDataFromRows>[0],
        registration.name,
        proxyId,
      );
    } else {
      report = await getProxyReportData(proxyId, request);
    }
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