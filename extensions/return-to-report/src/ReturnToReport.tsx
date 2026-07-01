/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  extension,
  BlockStack,
  InlineStack,
  Text,
  Link,
  Divider,
  Banner,
  Icon,
} from '@shopify/ui-extensions/checkout';

const TARGET = 'purchase.thank-you.block.render' as const;

function encodeReportProxyId(kitRegistrationNumber: string): string {
  const value = kitRegistrationNumber.trim();
  const base64 = btoa(
    String.fromCharCode(...new TextEncoder().encode(value))
  );
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function buildReportUrl(origin: string, kitNumber: string): string {
  const proxyId = encodeReportProxyId(kitNumber);
  return `${origin}/apps/undr/report/${encodeURIComponent(proxyId)}`;
}

export default extension(TARGET, (root, api) => {
  // ── 1. Get store origin ───────────────────────────────────────────
  const apiShop = (api as any)?.shop;
  const storefrontUrl: string = apiShop?.storefrontUrl ?? '';
  const myshopDomain: string =
    apiShop?.myshopifyDomain ??
    apiShop?.primaryDomain?.host ??
    '';

  let origin = '';
  if (storefrontUrl) origin = String(storefrontUrl).replace(/\/$/, '');
  else if (myshopDomain) origin = `https://${myshopDomain}`;

  if (!origin) return;

  // ── 2. Read kit + unlocked module from order attributes ──────────
  let kitNumber = '';
  let unlockedModule = '';

  try {
    const attrs = (api as any)?.attributes?.current ?? [];
    for (const attr of attrs) {
      const key = String(attr?.key || attr?.name || '')
        .toLowerCase()
        .replace(/^_+/, '');
      const val = String(attr?.value || '').trim();
      if (!val) continue;
      if (key === 'undr_kit' || key === 'undr_kit_number') kitNumber = val;
      else if (key === 'undr_unlock') unlockedModule = val.toLowerCase();
    }
  } catch (e) {
    // ignore
  }

  if (!kitNumber) return;

  // ── 3. Build report URL ───────────────────────────────────────────
  // Append the just-purchased module so the report page can poll for the
  // async orders/paid unlock and auto-refresh once it lands (no manual reload).
  let reportUrl = buildReportUrl(origin, kitNumber);
  if (unlockedModule) {
    reportUrl += `?unlocked=${encodeURIComponent(unlockedModule)}`;
  }

  // ── 4. Render ─────────────────────────────────────────────────────
  root.appendChild(root.createComponent(Divider, {}));

  const container = root.createComponent(BlockStack, { spacing: 'loose' });
  root.appendChild(container);

  const banner = root.createComponent(Banner, { status: 'success' });

  // Use a BlockStack inside the banner so items render on separate lines
  const bannerStack = root.createComponent(BlockStack, { spacing: 'tight' });
  banner.appendChild(bannerStack);

  // ── Thank you message ─────────────────────────────────────────────
  const thankYou = root.createComponent(Text, {
    size: 'large',
    emphasis: 'bold',
  });
  thankYou.appendChild(root.createText('🎉 Thank you for your purchase!'));
  bannerStack.appendChild(thankYou);

  // ── Unlock confirmation ───────────────────────────────────────────
  const unlockMsg = root.createComponent(Text, { size: 'base' });
  unlockMsg.appendChild(
    root.createText('Your report tab has been unlocked successfully.')
  );
  bannerStack.appendChild(unlockMsg);


  // ── Return to report link ─────────────────────────────────────────
  const link = root.createComponent(Link, {
    to: reportUrl,
    appearance: 'monochrome',
  });

  const linkInner = root.createComponent(InlineStack, {
    spacing: 'tight',
    blockAlignment: 'center',
  });

  const linkText = root.createComponent(Text, {
    size: 'base',
    emphasis: 'bold',
  });
  linkText.appendChild(root.createText('Return to report →'));
  linkInner.appendChild(linkText);
  link.appendChild(linkInner);
  bannerStack.appendChild(link);

  container.appendChild(banner);
});