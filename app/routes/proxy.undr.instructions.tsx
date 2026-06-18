import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderInstructionsPage(opts: { name?: string; showPopup?: boolean }) {
  const name = opts.name ? escapeHtml(opts.name) : "";
  const showPopup = Boolean(opts.showPopup);

  const popupHtml = showPopup
    ? `
  <div id="undr-success-popup" style="position:fixed;right:16px;bottom:16px;max-width:360px;padding:16px;border-radius:12px;background:#ecfdf3;border:1px solid #a7f3d0;color:#065f46;box-shadow:0 6px 24px rgba(2,6,23,0.08);font-weight:600;z-index:9999;">
    Thanks, ${name || "there"}! Your kit has been successfully registered. Let's get digging!
  </div>
  <script>
    (function(){
      try{
        setTimeout(function(){
          var el = document.getElementById('undr-success-popup');
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }, 6000);
      }catch(e){console.error(e)}
    })();
  </script>
  `
    : "";

  return `
  <div style="max-width:900px;margin:0 auto;padding:48px 20px;color:#111827;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.6;">UNDR</p>
    <h1 style="margin:8px 0 18px;font-size:clamp(20px,4vw,32px);font-weight:700;">How to take your sample</h1>

    <div style="display:grid;gap:18px;grid-template-columns:1fr 320px;align-items:start;">
      <div>
        <h2 style="margin:0 0 8px;font-size:18px;">Quick steps</h2>
        <ol style="margin:0 0 12px;padding-left:20px;line-height:1.7;color:#374151;">
          <li>Wash your hands thoroughly.</li>
          <li>Open the kit and remove the swab without touching the tip.</li>
          <li>Swab the sample area for 30 seconds as shown in the video.</li>
          <li>Place the swab into the provided tube and seal it.</li>
          <li>Complete the form and send the kit back using the provided label.</li>
        </ol>
        <p style="margin:0 0 12px;color:#6b7280;">If you prefer, watch the short video on the right for a visual walkthrough.</p>
        <p style="margin:0 0 24px;color:#6b7280;">If you have questions, contact our support at <a href="mailto:support@undrco.com">support@undrco.com</a>.</p>
        <a href="/apps/undr/submit" style="display:inline-block;padding:10px 16px;border-radius:10px;background:#111827;color:#fff;text-decoration:none;font-weight:600;">Back to registration</a>
      </div>

      <div>
        <!-- Placeholder video -->
        <div style="width:100%;height:0;padding-bottom:56%;position:relative;background:#000;border-radius:10px;overflow:hidden;">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Sampling instructions" style="position:absolute;left:0;top:0;width:100%;height:100%;border:0;" allowfullscreen></iframe>
        </div>
        <div style="margin-top:10px;color:#6b7280;font-size:13px;">Short sampling instructions (approx 1 minute)</div>
      </div>
    </div>

    ${popupHtml}
  </div>
  `;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { liquid } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const showPopup = (url.searchParams.get("showPopup") || "").toLowerCase() === "1" || (url.searchParams.get("showPopup") || "").toLowerCase() === "true";
  const name = url.searchParams.get("name") || "";

  const html = renderInstructionsPage({ name, showPopup });
  const embed = (url.searchParams.get("embed") || "").toLowerCase();
  const useLayout = embed !== "1" && embed !== "true";
  return liquid(html, { layout: useLayout });
}
