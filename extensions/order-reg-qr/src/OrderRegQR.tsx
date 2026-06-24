/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Image,
  Box,
  Text,
  Button,
  
  InlineStack,

} from '@shopify/ui-extensions-react/admin';
import { useState, useEffect } from 'react';
import { generateKitNumber } from '../../../app/utils/generateKitNumber';

const TARGET = 'admin.order-details.block.render';

export default reactExtension(TARGET, () => <App />);

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant?: { title?: string; sku?: string } | null;
  image?: string | null;
}

interface KitMap {
  [lineItemId: string]: string;
}

function App() {
  const api = useApi(TARGET) as any;
  const data = api.data;
  const query = api.query;
  const orderId = (data as any)?.selected?.[0]?.id ?? '';

  const [proxyBase, setProxyBase] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [shopifyCustomerId, setShopifyCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [kitMap, setKitMap] = useState<KitMap>({});
  const [qrMap, setQrMap] = useState<{ [id: string]: string }>({});
  const [orderSaveLoading, setOrderSaveLoading] = useState(false);
  const [orderSaveError, setOrderSaveError] = useState('');
  const [savedMap, setSavedMap] = useState<{ [id: string]: boolean }>({});
  
  const [errors, setErrors] = useState<{ [id: string]: string }>({});
  const [checking, setChecking] = useState(true);
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    if (!orderId) { setChecking(false); return; }

    async function load() {
      try {
        const orderRes = await (query as any)(
          `query GetOrder($id: ID!) {
            order(id: $id) {
              name
              customer {
                id
                email
                firstName
                lastName
              }
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    title
                    quantity
                          variant {
                            title
                            sku
                            image { url }
                            product { featuredImage { url } }
                          }
                  }
                }
              }
            }
          }`,
          { variables: { id: orderId } }
        );

        let resolvedName = '';
        let resolvedItems: LineItem[] = [];
        let resolvedCustomerId = '';
        let resolvedCustomerName = '';
        let resolvedCustomerEmail = '';

        if (orderRes?.data?.order) {
          resolvedName = orderRes.data.order.name ?? '';
          const c = orderRes.data.order.customer;
          if (c) {
            resolvedCustomerId = c.id || '';
            resolvedCustomerEmail = c.email || '';
            resolvedCustomerName = [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
          }
          resolvedItems = orderRes.data.order.lineItems.edges.map((e: any) => ({
            id: e.node.id,
            title: e.node.title,
            quantity: e.node.quantity,
            variant: e.node.variant,
            image: e.node.variant?.image?.url ?? e.node.variant?.product?.featuredImage?.url ?? null,
          }));
        } else {
          setDebugMsg('Could not load order. orderRes: ' + JSON.stringify(orderRes?.data));
          setChecking(false);
          return;
        }

        setOrderNumber(resolvedName);
        setShopifyCustomerId(resolvedCustomerId);
        setCustomerName(resolvedCustomerName);
        setCustomerEmail(resolvedCustomerEmail);
        setLineItems(resolvedItems);

        try {
          const shopRes = await (query as any)(`query { shop { myshopifyDomain primaryDomain { host } } }`);
          const shopDomain = shopRes?.data?.shop?.primaryDomain?.host || shopRes?.data?.shop?.myshopifyDomain;
          const storeOrigin = shopDomain
            ? `https://${shopDomain}`
            : (typeof window !== 'undefined' && (window.location.origin || `${window.location.protocol}//${window.location.hostname}`)) || '';
          const base = `${storeOrigin}/apps/undr`;
          setProxyBase(base);

          const kitRes = await fetch(
            `${base}/order-kit?orderId=${encodeURIComponent(orderId)}`
          ).catch(() => null);
            if (kitRes?.ok) {
              const r = await kitRes.json().catch(() => null);
              // Map server-side kitMap keys (which may be numeric ids or other
              // formats) to the GraphQL line item ids used in this UI. We try
              // exact match first, then numeric-suffix match.
              if (r?.kitMap) {
                const newKitMap: { [liId: string]: string } = {};
                const serverMap: { [k: string]: string } = r.kitMap || {};
                // build helper index by numeric suffix
                const suffixIndex: { [s: string]: string } = {};
                Object.keys(serverMap).forEach(k => {
                  const m = String(k).match(/(\d+)$/);
                  if (m) suffixIndex[m[1]] = serverMap[k];
                });
                // for each resolved line item, attempt to find its kit
                for (const li of resolvedItems) {
                  const exact = serverMap[li.id];
                  if (exact) {
                    newKitMap[li.id] = exact;
                    continue;
                  }
                  const liNum = String(li.id).match(/(\d+)$/)?.[1];
                  if (liNum && suffixIndex[liNum]) {
                    newKitMap[li.id] = suffixIndex[liNum];
                  }
                }
                setKitMap(prev => ({ ...prev, ...newKitMap }));
                const initialSaved: { [id: string]: boolean } = {};
                Object.keys(newKitMap).forEach(k => { initialSaved[k] = true; });
                setSavedMap(prev => ({ ...prev, ...initialSaved }));
              }
            // Do NOT auto-create kits here. Kits should be created by the order-created
            // webhook. If a kit is missing, we'll fetch the latest map when needed
            // (e.g. when generating a QR) instead of creating a new kit from the client.
            // Ensure the UI shows QR immediately for any existing kit numbers by
            // generating a local QR URL and updating state; persist to server
            // asynchronously but do not block rendering.
            try {
              if (r?.kitMap) {
                // build server map and suffix index again for QR mapping
                const serverMap: { [k: string]: string } = r.kitMap || {};
                const suffixIndex: { [s: string]: string } = {};
                Object.keys(serverMap).forEach(k => {
                  const m = String(k).match(/(\d+)$/);
                  if (m) suffixIndex[m[1]] = serverMap[k];
                });
                for (const li of resolvedItems) {
                  let kit = serverMap[li.id];
                  if (!kit) {
                    const liNum = String(li.id).match(/(\d+)$/)?.[1];
                    if (liNum) kit = suffixIndex[liNum];
                  }
                  if (kit && !qrMap[li.id]) {
                    const link = `https://undrco.com/apps/undr/submit?kit=${encodeURIComponent(kit)}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}&t=${Date.now()}`;
                    setQrMap(prev => ({ ...prev, [li.id]: qrUrl }));
                    (async () => {
                      try {
                        await fetch(`${base}/order-kit-qr`.replace(/\/apps\/undr\/apps\/undr/, '/apps/undr'), {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ orderId, qrUrl, lineItemId: kit }),
                        });
                      } catch (e) {
                        // ignore persist errors
                      }
                    })();
                  }
                }
              }
            } catch (e) {
              // ignore
            }
          }

          try {
            const qrRes = await fetch(`${base}/order-kit-qr?orderId=${encodeURIComponent(orderId)}`).catch(() => null);
            if (qrRes?.ok) {
              const jr = await qrRes.json().catch(() => null);
              if (jr?.qrMap) {
                setQrMap(prev => ({ ...prev, ...jr.qrMap }));
              }
              // If there are kits for items but missing QR entries, generate QR images
              // and persist them (do NOT create kits here).
              try {
                const existingQrMap: { [k: string]: string } = jr?.qrMap || {};
                const existingKitMap: { [k: string]: string } = (typeof r !== 'undefined' && r?.kitMap) || {};
                for (const li of resolvedItems) {
                  if (existingKitMap[li.id] && !existingQrMap[li.id]) {
                    const finalNumber = existingKitMap[li.id];
                    const link = `https://undrco.com/apps/undr/submit?kit=${encodeURIComponent(finalNumber)}`;
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}&t=${Date.now()}`;
                    const postRes = await fetch(`${base}/order-kit-qr`.replace(/\/apps\/undr\/apps\/undr/, '/apps/undr'), {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderId, qrUrl, lineItemId: li.id }),
                    }).catch(() => null);
                    const postJson = postRes?.ok ? await postRes.json().catch(() => null) : null;
                    if (postJson?.qrMap && typeof postJson.qrMap === 'object') {
                      const safeMap: { [k: string]: string } = {};
                      Object.keys(postJson.qrMap).forEach(k => { if (resolvedItems.find(x => x.id === k)) safeMap[k] = postJson.qrMap[k]; });
                      if (Object.keys(safeMap).length) setQrMap(prev => ({ ...prev, ...safeMap }));
                    } else if (postJson?.lineItemId) {
                      setQrMap(prev => ({ ...prev, [postJson.lineItemId]: postJson.qrUrl || qrUrl }));
                    } else {
                      setQrMap(prev => ({ ...prev, [li.id]: qrUrl }));
                    }
                  }
                }
              } catch (e) {
                // ignore QR generation errors
              }
            }
          } catch (err) {
            // ignore
          }
        } catch (err) {
          const base = (typeof window !== 'undefined' && (window.location.origin || `${window.location.protocol}//${window.location.hostname}`)) || '';
          setProxyBase(`${base}/apps/undr`);
        }
      } catch (err: any) {
        setDebugMsg('Error: ' + (err?.message || String(err)));
      } finally {
        setChecking(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  



  // Order-level QR generation removed: per-item QR generation is used instead.

  async function handleSaveOrder() {
    setOrderSaveLoading(true);
    setOrderSaveError('');
    try {
      const base = proxyBase || (typeof window !== 'undefined' && (window.location.origin || `${window.location.protocol}//${window.location.hostname}`)) || '';

      // Fetch existing kit numbers for this order to avoid persisting duplicates.
      const existingRes = await fetch(`${base}/order-kit?orderId=${encodeURIComponent(orderId)}`).catch(() => null);
      const existingJson = existingRes?.ok ? await existingRes.json().catch(() => null) : null;
      const existingKitMap: { [id: string]: string } = existingJson?.kitMap || {};
      const existingNumbers = new Set(Object.values(existingKitMap).filter(Boolean));

      for (const li of lineItems) {
        let kitNumber = kitMap[li.id];
        if (!kitNumber) continue; // skip items without a kit
        if (savedMap[li.id]) continue; // skip items already saved to avoid duplicates

        // If the desired kitNumber already exists (from previous saves), regenerate with a small salt.
        let attempt = 0;
        while (existingNumbers.has(kitNumber) && attempt < 5) {
          // append a short salt derived from Math.random and the attempt count
          const salt = String(Math.floor(Math.random() * 900) + 100) + String(attempt);
          kitNumber = generateKitNumber(orderNumber || '', li.id + '-' + salt);
          attempt += 1;
        }

        try {
          const res = await fetch(`${base}/apps/undr/order-kit`.replace(/\/apps\/undr\/apps\/undr/, '/apps/undr'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId,
              orderNumber,
              lineItemId: li.id,
              lineItemTitle: li.title,
              registrationNumber: kitNumber,
              shopifyCustomerId,
              customerName,
              customerEmail,
            }),
          }).catch(() => null);
          if (!res || !res.ok) {
            const body = await res?.json().catch(() => ({}));
            throw new Error((body as any)?.error || 'Failed to save kit.');
          }

          // mark saved and record the number so subsequent items avoid collisions in this run
          setSavedMap(prev => ({ ...prev, [li.id]: true }));
          existingNumbers.add(kitNumber);
        } catch (err: any) {
          setErrors(prev => ({ ...prev, [li.id]: err?.message || 'Error saving kit.' }));
        }
      }
    } catch (err: any) {
      setOrderSaveError(err?.message || 'Error saving kits for order.');
    } finally {
      setOrderSaveLoading(false);
    }
  }

  async function handlePrint(item: LineItem) {
    console.log('[Print] button clicked for item', item.id);
    try {
      const kit = kitMap[item.id] || '';
      const qr = qrMap[item.id] || '';
      const payload = {
        orderId: orderId || '',
        orderNumber: orderNumber || '',
        kitNumber: kit,
        productTitle: item.title || '',
        variant: item.variant?.title || '',
        variantNo: item.variant?.sku || '',
        quantity: String(item.quantity || ''),
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        qrUrl: qr || '',
      };

      // Build query string
      const qs = new URLSearchParams(payload as Record<string, string>).toString();
      const target = (proxyBase || '') + '/print-qr?' + qs;
      console.log('[Print] target URL', target);

      // Try Shopify navigation API first
      try {
        const nav = api?.navigation;
        if (nav && typeof nav.navigate === 'function') {
          console.log('[Print] attempting api.navigation.navigate', target);
          try {
            nav.navigate(target);
            console.log('[Print] api.navigation.navigate succeeded');
            return;
          } catch (e) {
            console.error('[Print] api.navigation.navigate threw', e);
          }
        } else {
          console.log('[Print] api.navigation.navigate not available');
        }
      } catch (e) {
        console.error('[Print] error checking api.navigation', e);
      }

      // Fallback: try opening a new window and writing content (may be blocked)
      try {
        console.log('[Print] attempting window.open', target);
        const w = (typeof window !== 'undefined' && window.open(target, '_blank')) || null;
        console.log('[Print] window.open returned', w);
        if (!w) throw new Error('Popup blocked or window.open returned null');
        // Note: do not document.write heavy content here — the hosted page will call print.
        try {
          w.focus && w.focus();
          console.log('[Print] window.focus succeeded');
        } catch (e) {
          console.warn('[Print] window.focus failed', e);
        }
        return;
      } catch (e: any) {
        console.error('[Print] window.open/document.write fallback failed', e);
        setDebugMsg('Print failed: ' + (e?.message || String(e)));
      }
    } catch (err: any) {
      console.error('[Print] unexpected error', err);
      setDebugMsg('Print failed: ' + (err?.message || String(err)));
    }
  }

  if (checking) {
    return (
      <AdminBlock title="Kit Registration">
        <Text tone="subdued">Loading…</Text>
      </AdminBlock>
    );
  }

  if (debugMsg) {
    return (
      <AdminBlock title="Kit Registration">
        <Text tone="critical">{debugMsg}</Text>
      </AdminBlock>
    );
  }

  if (!lineItems.length) {
    return (
      <AdminBlock title="Kit Registration">
        <Text tone="subdued">No products found for this order.</Text>
      </AdminBlock>
    );
  }

  return (
    <AdminBlock title="Kit Registration">
      <BlockStack gap="base">



        {lineItems.map(item => (
          <BlockStack key={item.id} gap="base">

            {/* ── Row: image + product info ── */}
            <InlineStack gap="base" blockAlignment="center">
              <Box
                minInlineSize="64px"
                maxInlineSize="64px"
                minBlockSize="64px"
                maxBlockSize="64px"
              >
                {item.image ? (
                  <Image source={item.image} alt={item.title} />
                ) : (
                  <Box
                    minInlineSize="64px"
                    minBlockSize="64px"
                    background="color-bg-secondary"
                    borderRadius="base"
                  />
                )}
              </Box>

              <BlockStack gap="none">
                <Text fontWeight="bold">{item.title}</Text>
                {item.variant?.title && item.variant.title !== 'Default Title' && (
                  <Text tone="subdued">Variant: {item.variant.title}</Text>
                )}
              </BlockStack>

                  <Box style={{ marginLeft: 'auto', minWidth: 220 }}>
                    <Text tone="subdued">Actions</Text>
                    <InlineStack gap="xsmall" blockAlignment="center">
                      {/* Auto-generate and persist kits on load; hide manual generate UI */}
                      {qrMap[item.id] ? (
                        <Button
                          onPress={() => handlePrint(item)}
                        >
                          Print
                        </Button>
                      ) : (
                        <Button disabled style={{ opacity: 0.6 }}>
                          Preparing…
                        </Button>
                      )}
                    </InlineStack>
                  </Box>
            </InlineStack>

            {/* Kit field moved beside product title */}

            {/* Generate kit button removed; Save now creates the kit */}

            {errors[item.id] && (
              <Text tone="critical">{errors[item.id]}</Text>
            )}

            

            {/* QR view is shown beside the registration field; no duplicate button here. */}

            {/* Generate button moved beside the registration field above */}

            {/* per-item actions removed; order-level Save/QR placed after the list */}



            {/* per-item QR display removed; order-level QR shown below */}

          </BlockStack>
        ))}
        {/* Order-level actions: Save only (per-item QR generation replaces order-level QR) */}
        {orderSaveError ? <Text tone="critical">{orderSaveError}</Text> : null}
      </BlockStack>
    </AdminBlock>
  );
}