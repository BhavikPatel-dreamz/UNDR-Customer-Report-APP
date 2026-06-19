import { redirect, type LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { authenticate } from "../shopify.server";
import { getUnlockOffer, isReportPackage, isUnlockModule } from "../lib/report-packages";

function buildCartUrl(input: {
  shop: string;
  variantId: string;
  kitRegistrationNumber: string;
  registrationId: string;
  module: string;
  reportPackage: string;
}) {
  const url = new URL(`/cart/${input.variantId}:1`, `https://${input.shop}`);
  // Use standard Shopify cart query params for line item properties so they
  // are persisted on the created order as `line_items[].properties`.
  url.searchParams.set("properties[_undr_kit]", input.kitRegistrationNumber);
  url.searchParams.set("properties[_undr_registration_id]", input.registrationId);
  url.searchParams.set("properties[_undr_unlock]", input.module);
  url.searchParams.set("properties[_undr_report_package]", input.reportPackage);
  return url.toString();
}

function renderUnlockError(message: string) {
  return `
<section style="padding:40px 20px;max-width:760px;margin:0 auto;">
  <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;color:#111827;">Unlock unavailable</h1>
  <p style="margin:0;font-size:16px;line-height:1.6;color:#4b5563;">${message}</p>
</section>
`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { liquid, session } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const kitRegistrationNumber = String(url.searchParams.get("kit") || "").trim();
  const module = String(url.searchParams.get("module") || "").trim().toLowerCase();
  const requestedReportPackage = String(url.searchParams.get("package") || "").trim().toLowerCase();
  const requestingShop = (session?.shop || url.searchParams.get("shop") || "").trim().toLowerCase();

  if (!kitRegistrationNumber || !isUnlockModule(module)) {
    return liquid(renderUnlockError("Please open this unlock link from your report."), { layout: true });
  }

  const registration = await getRegistrationByKitNumber(kitRegistrationNumber);
  const registrationShop = String(registration?.shop || "").trim().toLowerCase();

  if (!registration || !requestingShop || requestingShop !== registrationShop) {
    return liquid(renderUnlockError("We could not match this report to the current store."), { layout: true });
  }

  const offer = getUnlockOffer(module, requestingShop);
  const reportPackage = isReportPackage(requestedReportPackage)
    ? requestedReportPackage
    : registration.reportPackage;
  // Instead of issuing an immediate redirect, render a small page that opens the
  // shop cart in a new tab and polls the app until the webhook marks the unlock
  // as paid. When detected, the page will navigate back to the report so the
  // customer does not have to return manually.
  const cartUrl = buildCartUrl({
    shop: requestingShop,
    variantId: offer.variantId,
    kitRegistrationNumber,
    registrationId: registration.id,
    module,
    reportPackage,
  });

  const reportProxyId = encodeURIComponent(kitRegistrationNumber);
  const reportUrl = `/apps/undr/report/${reportProxyId}`;

  const html = `
<section style="padding:40px 20px;max-width:760px;margin:0 auto;text-align:center;">
  <h1 style="margin:0 0 12px;font-size:22px;line-height:1.2;color:#111827;">Proceed to payment</h1>
  <p style="margin:8px 0 20px;color:#4b5563;">A new tab will open to complete payment. After payment completes, this page will automatically return you to your report.</p>
  <p style="margin:0 0 12px;font-size:14px;color:#6b7280;">If the new tab did not open, <a id="openCartLink" href="${cartUrl}" target="_blank" rel="noopener">click here to open the cart</a>.</p>
  <p style="margin-top:18px;color:#6b7280;">Waiting for payment to complete…</p>
</section>
<script>
  (function(){
    try { window.open(${JSON.stringify(cartUrl)}, '_blank'); } catch(e) {}
    const kit = ${JSON.stringify(kitRegistrationNumber)};
    const module = ${JSON.stringify(module)};
    const pollUrl = '/apps/undr/unlock/poll?kit=' + encodeURIComponent(kit) + '&module=' + encodeURIComponent(module);
    const reportUrl = ${JSON.stringify(reportUrl)};
    let attempts = 0;
    const maxAttempts = 180; // ~6 minutes
    const interval = 2000;
    const timer = setInterval(async () => {
      attempts += 1;
      try {
        const r = await fetch(pollUrl, { credentials: 'include' });
        if (r.ok) {
          const j = await r.json();
          if (j && j.unlocked) {
            clearInterval(timer);
            window.location.replace(reportUrl);
          }
        }
      } catch (err) {
        // ignore and retry
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, interval);
  })();
</script>
`;

  return liquid(html, { layout: true });
};
