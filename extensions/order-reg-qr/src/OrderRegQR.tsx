/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Image,
  Link,
  Box,
  Text,
  Button,
  TextField,
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
  const [qrLoading, setQrLoading] = useState<{ [id: string]: boolean }>({});
  const [qrErrors, setQrErrors] = useState<{ [id: string]: string }>({});
  const [orderSaveLoading, setOrderSaveLoading] = useState(false);
  const [orderSaveError, setOrderSaveError] = useState('');
  const [savedMap, setSavedMap] = useState<{ [id: string]: boolean }>({});
  const [generatedMap, setGeneratedMap] = useState<{ [id: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [id: string]: boolean }>({});
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
            if (r?.kitMap) setKitMap(r.kitMap);
            if (r?.kitMap) {
              const initialSaved: { [id: string]: boolean } = {};
              Object.keys(r.kitMap).forEach(k => { initialSaved[k] = true; });
              setSavedMap(prev => ({ ...prev, ...initialSaved }));
            }
          }

          try {
            const qrRes = await fetch(`${base}/order-kit-qr?orderId=${encodeURIComponent(orderId)}`).catch(() => null);
            if (qrRes?.ok) {
              const jr = await qrRes.json().catch(() => null);
              if (jr?.qrMap) {
                setQrMap(prev => ({ ...prev, ...jr.qrMap }));
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

  async function handleGenerate(item: LineItem) {
    setLoading(prev => ({ ...prev, [item.id]: true }));
    setErrors(prev => ({ ...prev, [item.id]: '' }));
    try {
      // Generate a local 10-digit registration number only — do not auto-save to backend.
      // Pass the line item id as a seed so generated numbers are unique per item.
      const registrationNumber = generateKitNumber(orderNumber || '', item.id);

      // Set the kit map locally so it can be reviewed, then persisted via Save.
      setKitMap(prev => ({ ...prev, [item.id]: registrationNumber }));
      // Mark this item as generated (disables Generate button) but not yet saved.
      setGeneratedMap(prev => ({ ...prev, [item.id]: true }));
      setSavedMap(prev => ({ ...prev, [item.id]: false }));
    } catch (err: any) {
      setErrors(prev => ({
        ...prev,
        [item.id]: err?.message || 'Error generating kit.',
      }));
    } finally {
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  }

  async function handleGenerateQr(item: LineItem, explicitKitNumber?: string) {
    setQrLoading(prev => ({ ...prev, [item.id]: true }));
    setQrErrors(prev => ({ ...prev, [item.id]: '' }));
    try {
      const kitNumber = explicitKitNumber || kitMap[item.id];
      if (!kitNumber) throw new Error('No kit number available to generate QR.');
      // QR should open the public registration page with the kit prefilled
      const link = `https://undrco.com/apps/undr/submit?kit=${encodeURIComponent(kitNumber)}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}&t=${Date.now()}`;
      const base = proxyBase || (typeof window !== 'undefined' && (window.location.origin || `${window.location.protocol}//${window.location.hostname}`)) || '';
      const res = await fetch(`${base}/apps/undr/order-kit-qr`.replace(/\/apps\/undr\/apps\/undr/, '/apps/undr'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, qrUrl, lineItemId: item.id }),
      }).catch(() => null);

      const body = res ? await res.json().catch(() => null) : null;
      if (!res || !res.ok) {
        throw new Error((body as any)?.error || 'Failed to persist QR. Generate kit first.');
      }

      // Prefer server-provided mapping if available, but only merge keys safely.
      if (body?.qrMap && typeof body.qrMap === 'object') {
        // only merge entries corresponding to known line item ids present in this order
        const safeMap: { [k: string]: string } = {};
        Object.keys(body.qrMap).forEach(k => {
          if (lineItems.find(li => li.id === k)) safeMap[k] = body.qrMap[k];
        });
        if (Object.keys(safeMap).length) {
          setQrMap(prev => ({ ...prev, ...safeMap }));
        } else {
          // fallback: set only the current item
          setQrMap(prev => ({ ...prev, [item.id]: qrUrl }));
        }
      } else if (body?.lineItemId) {
        setQrMap(prev => ({ ...prev, [body.lineItemId]: body.qrUrl || qrUrl }));
      } else {
        // fallback: set only the current item
        setQrMap(prev => ({ ...prev, [item.id]: qrUrl }));
      }
    } catch (err: any) {
      setQrErrors(prev => ({ ...prev, [item.id]: err?.message || 'Error generating QR.' }));
    } finally {
      setQrLoading(prev => ({ ...prev, [item.id]: false }));
    }
  }



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
                <Text tone="subdued">Kit registration number</Text>
                <InlineStack gap="xsmall" blockAlignment="center">
                  <Box style={{ flex: 1 }}>
                    <TextField
                      value={kitMap[item.id] ?? ''}
                      readOnly
                      labelHidden
                      onChange={() => { }}
                    />
                  </Box>
                  <Button
                    onPress={() => handleGenerate(item)}
                    disabled={loading[item.id] || !!kitMap[item.id] || generatedMap[item.id]}
                  >
                    {loading[item.id]
                      ? 'Generating…'
                      : kitMap[item.id]
                        ? 'Generated'
                        : generatedMap[item.id]
                          ? 'Generated'
                          : 'Generate'}
                  </Button>
                  {qrMap[item.id] ? (
                    <Button
                      onPress={() => {
                        const nav = api?.navigation;
                        const finalUrl = qrMap[item.id];
                        try {
                          if (nav && typeof nav.navigate === 'function') {
                            nav.navigate(finalUrl);
                            return;
                          }
                        } catch (e: any) {
                          setDebugMsg('Navigation failed: ' + (e?.message || String(e)));
                        }
                        try {
                          if (typeof window !== 'undefined') window.open(finalUrl, '_blank');
                        } catch (e: any) {
                          setDebugMsg('Window open failed: ' + (e?.message || String(e)));
                        }
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      View QR
                    </Button>
                  ) : (
                    <Button
                      onPress={() => handleGenerateQr(item, kitMap[item.id])}
                      disabled={qrLoading[item.id] || !kitMap[item.id]}
                      style={{ marginLeft: 8 }}
                    >
                      {qrLoading[item.id] ? 'Generating QR…' : 'Generate QR'}
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

            {qrErrors[item.id] && (
              <Text tone="critical">{qrErrors[item.id]}</Text>
            )}

            {/* QR view is shown beside the registration field; no duplicate button here. */}

            {/* Generate button moved beside the registration field above */}

            {/* per-item actions removed; order-level Save/QR placed after the list */}



            {/* per-item QR display removed; order-level QR shown below */}

          </BlockStack>
        ))}
        {/* Order-level actions: Save only (per-item QR generation replaces order-level QR) */}
        <InlineStack gap="base">
          <Button
            onPress={() => handleSaveOrder()}
            disabled={orderSaveLoading || !lineItems.some(li => kitMap[li.id] && !savedMap[li.id])}
          >
            {orderSaveLoading ? 'Saving…' : 'Save'}
          </Button>
          {orderSaveError ? <Text tone="critical">{orderSaveError}</Text> : null}
        </InlineStack>
      </BlockStack>
    </AdminBlock>
  );
}