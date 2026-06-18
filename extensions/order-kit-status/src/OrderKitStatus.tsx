/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  extension,
  BlockStack,
  InlineStack,
  Text,
  View,
  Pressable,
  Divider,
} from '@shopify/ui-extensions/customer-account';

const TARGET = 'customer-account.order-status.cart-line-item.render-after' as const;

type StatusMap = Record<string, { status?: string; reportUrl?: string; reportLinkEnabled?: boolean }>;


const orderDataCache = new Map<string, Promise<{ kitMap: Record<string, string>; statusMap: StatusMap; customerMap: Record<string, { name?: string; email?: string; phone?: string }> }>>();

function deriveOriginFromReferrer() {
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      const u = new URL(document.referrer);
      return `${u.protocol}//${u.hostname}`;
    } catch (e) {
      return '';
    }
  }
  return '';
}

async function fetchOrderData(orderId: string, api: any) {
  if (orderDataCache.has(orderId)) {
    const cached = await orderDataCache.get(orderId)!;
    if (cached && (Object.keys(cached.kitMap || {}).length || Object.keys(cached.statusMap || {}).length)) return cached;
  }

  const promise = (async () => {
    try {
      const apiShop = (api as any)?.shop;
      const storefrontUrl = apiShop?.storefrontUrl;
      const myshop = apiShop?.myshopifyDomain;

      const deriveOriginFromReferrer = () => {
        if (typeof document !== 'undefined' && document.referrer) {
          try {
            const u = new URL(document.referrer);
            return `${u.protocol}//${u.hostname}`;
          } catch (e) {
            return '';
          }
        }
        return '';
      };

      let origin = '';
      if (storefrontUrl) origin = String(storefrontUrl).replace(/\/$/, '');
      else if (myshop) origin = `https://${myshop}`;
      else origin = deriveOriginFromReferrer() || (typeof window !== 'undefined' ? (window.location.origin || `${window.location.protocol}//${window.location.hostname}`) : '');

      const base = origin ? `${origin}/apps/undr` : `/apps/undr`;

      const kitUrl = `${base}/order-kit?orderId=${encodeURIComponent(orderId)}`;
      const statusUrl = `${base}/order-kit-status?orderId=${encodeURIComponent(orderId)}`;

      const [kitRes, statusRes] = await Promise.all([
        fetch(kitUrl).catch(() => null),
        fetch(statusUrl).catch(() => null),
      ]);

      const kitData = kitRes?.ok ? await kitRes.json().catch(() => null) : null;
      const statusData = statusRes?.ok ? await statusRes.json().catch(() => null) : null;

      return { kitMap: kitData?.kitMap ?? {}, statusMap: statusData?.statusMap ?? {}, customerMap: kitData?.customerMap ?? {} };
    } catch (e) {
      return { kitMap: {}, statusMap: {} };
    }
  })();

  orderDataCache.set(orderId, promise);
  return promise;
}

function formatStatus(status?: string): string {
  if (!status) return 'Not registered';
  switch (status) {
    case 'registered': return 'Registered';
    case 'kit_generated': return 'Registration pending';
    case 'register_submitted': return 'Registration submitted';
    case 'in_progress': return 'In progress';
    case 'report_generated': return 'Report ready';
    default: return status.replace(/_/g, ' ');
  }
}

function labeledText(root: any, label: string, value: string, bold = false) {
  const block = root.createComponent(BlockStack, { spacing: 'none' });
  const labelText = root.createComponent(Text, { size: 'small', appearance: 'subdued' });
  labelText.appendChild(root.createText(label));
  block.appendChild(labelText);
  const valueText = root.createComponent(Text, bold ? { size: 'small', emphasis: 'bold' } : { size: 'small' });
  valueText.appendChild(root.createText(value));
  block.appendChild(valueText);
  return block;
}


function smallButton(root: any, label: string, onPress: () => void) {
  const pressable = root.createComponent(Pressable, { onPress });
  const box = root.createComponent(View, {
    padding: ['extraTight', 'tight'],
    cornerRadius: 'base',
    border: 'base',
    background: 'subdued',
  });
  const text = root.createComponent(Text, { size: 'small' });
  text.appendChild(root.createText(label));
  box.appendChild(text);
  pressable.appendChild(box);
  return pressable;
}


export default extension(TARGET, async (root, api) => {
  const orderId: string = (api as any)?.order?.current?.id ?? '';
  const lineItemId: string = (api as any)?.target?.current?.id ?? '';
  if (!orderId || !lineItemId) return;

  const { kitMap, statusMap, customerMap } = await fetchOrderData(orderId, api);
  if (!kitMap || !Object.keys(kitMap).length) return;

  const extractId = (gid: string) => (String(gid).split('/').pop() || gid);

  let foundKey: string | undefined;
  let kitNumber: string | undefined = kitMap[lineItemId];

  if (kitNumber) foundKey = lineItemId;
  else {
    const numeric = extractId(lineItemId);
    if (kitMap[numeric]) {
      foundKey = numeric;
      kitNumber = kitMap[numeric];
    } else {
      const endingKey = Object.keys(kitMap).find(k => k.endsWith(numeric));
      if (endingKey) {
        foundKey = endingKey;
        kitNumber = kitMap[endingKey];
      }
    }
  }

  if (!kitNumber) {
    const variant = (api as any)?.target?.current?.variant?.id;
    const product = (api as any)?.target?.current?.variant?.product?.id || (api as any)?.target?.current?.product?.id;
    for (const id of [variant, product].filter(Boolean) as string[]) {
      if (kitMap[id]) {
        foundKey = id;
        kitNumber = kitMap[id];
        break;
      }
      const extracted = extractId(id);
      if (kitMap[extracted]) {
        foundKey = extracted;
        kitNumber = kitMap[extracted];
        break;
      }
      const endingKey = Object.keys(kitMap).find(k => k.endsWith(extracted));
      if (endingKey) {
        foundKey = endingKey;
        kitNumber = kitMap[endingKey];
        break;
      }
    }
  }

  if (!kitNumber || !foundKey) return;

  const status = statusMap[foundKey]?.status;
  const reportUrl = statusMap[foundKey]?.reportUrl;

  // Compute a full URL for the report. Prefer absolute URL from server; if server returned a relative path, build origin from api.shop or referrer/window.
  let fullReportUrl: string | undefined = undefined;
  if (reportUrl) {
    if (reportUrl.startsWith('http://') || reportUrl.startsWith('https://')) {
      fullReportUrl = reportUrl;
    } else if (reportUrl.startsWith('/')) {
      const apiShop = (api as any)?.shop;
      const storefrontUrl = apiShop?.storefrontUrl;
      const myshop = apiShop?.myshopifyDomain;
      let origin = '';
      if (storefrontUrl) origin = String(storefrontUrl).replace(/\/$/, '');
      else if (myshop) origin = `https://${myshop}`;
      else origin = deriveOriginFromReferrer() || (typeof window !== 'undefined' ? (window.location.origin || `${window.location.protocol}//${window.location.hostname}`) : '');
      fullReportUrl = origin ? `${origin}${reportUrl}` : reportUrl;
    } else {
      fullReportUrl = reportUrl;
    }
  }

  root.appendChild(root.createComponent(Divider, {}));
  const row = root.createComponent(InlineStack, { spacing: 'base', blockAlignment: 'center' });
  row.appendChild(labeledText(root, 'Kit number', kitNumber, true));
  // Custom status block so we can render the status text and the View button inline.
  const statusBlock = root.createComponent(BlockStack, { spacing: 'none' });
  const statusLabel = root.createComponent(Text, { size: 'small', appearance: 'subdued' });
  statusLabel.appendChild(root.createText('Status'));
  statusBlock.appendChild(statusLabel);
  const statusValueInline = root.createComponent(InlineStack, { spacing: 'tight', blockAlignment: 'center' });
  const statusValueText = root.createComponent(Text, { size: 'small', emphasis: 'bold' });
  statusValueText.appendChild(root.createText(formatStatus(status)));
  statusValueInline.appendChild(statusValueText);
  statusBlock.appendChild(statusValueInline);
  row.appendChild(statusBlock);

  // If not already registered/submitted, show a Register button that opens the public registration page.
  const showRegisterButton = !(status === 'register_submitted' || status === 'registered' || status === 'report_generated');
  if (showRegisterButton) {
    const apiShop = (api as any)?.shop;
    const storefrontUrl = apiShop?.storefrontUrl;
    const myshop = apiShop?.myshopifyDomain;
    let origin = '';
    if (storefrontUrl) origin = String(storefrontUrl).replace(/\/$/, '');
    else if (myshop) origin = `https://${myshop}`;
    else origin = deriveOriginFromReferrer() || (typeof window !== 'undefined' ? (window.location.origin || `${window.location.protocol}//${window.location.hostname}`) : '');

    const params = new URLSearchParams();
    params.set('kit', String(kitNumber));

    // Prefer customer details returned from the server (database) for this line item
    const dbCustomer = customerMap?.[foundKey || ''];
    if (dbCustomer) {
      if (dbCustomer.name) params.set('name', String(dbCustomer.name));
      if (dbCustomer.email) params.set('email', String(dbCustomer.email));
      if (dbCustomer.phone) params.set('phone', String(dbCustomer.phone));
    }

    const rel = `/apps/undr/submit?${params.toString()}`;
    const registerUrl = origin ? `${origin}${rel}` : rel;

    const navigateToRegister = () => {
      const nav = (api as any)?.navigation;
      if (nav && typeof nav.navigate === 'function') {
        try {
          nav.navigate(registerUrl);
          return;
        } catch (e) {
          // fallthrough
        }
      }
      if (typeof window !== 'undefined') window.open(registerUrl, '_blank');
    };

    const regBtn = smallButton(root, 'Register', navigateToRegister);
    row.appendChild(regBtn);
  }

  if (status === 'report_generated' && reportUrl) {
      const navigateTo = () => {
      const reportEnabled = statusMap[foundKey]?.reportLinkEnabled !== false;
      if (!reportEnabled) {
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          window.alert('Report access is disabled by the store.');
        }
        return;
      }
      const nav = (api as any)?.navigation;
      const tryUrl = fullReportUrl || reportUrl;

      // If the computed origin looks like Shopify CDN, attempt to derive origin from referrer and use that instead
      const shouldReplaceCdnOrigin = tryUrl && tryUrl.includes('extensions.shopifycdn.com');
      let finalUrl = tryUrl;
      if (shouldReplaceCdnOrigin) {
        const refOrigin = deriveOriginFromReferrer();
        if (refOrigin) finalUrl = tryUrl.replace(/^https?:\/\/[^/]+/, refOrigin);
      }

      if (nav && typeof nav.navigate === 'function') {
        try {
          nav.navigate(finalUrl);
          return;
        } catch (e) {
          // fallthrough to window.open
        }
      }
      if (typeof window !== 'undefined') window.open(finalUrl, '_blank');
    };

    const btn = smallButton(root, 'View report', navigateTo);
    // Place button and optional note inline so the button stays on the same line as Status.
    const inline = root.createComponent(InlineStack, { spacing: 'tight', blockAlignment: 'center' });
    inline.appendChild(btn);
    if (statusMap[foundKey]?.reportLinkEnabled === false) {
      const note = root.createComponent(Text, { size: 'small', appearance: 'subdued' });
      note.appendChild(root.createText('Report access is disabled by the store.'));
      inline.appendChild(note);
    }
    row.appendChild(inline);
  }

  root.appendChild(row);
});