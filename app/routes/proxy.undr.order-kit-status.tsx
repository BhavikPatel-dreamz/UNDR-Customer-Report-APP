import type { LoaderFunctionArgs } from 'react-router';
import { authenticate } from '../shopify.server';
import { getRegistrationsByShopifyOrderId } from '../models/registration.server';
import { buildReportPath } from '../lib/report-url';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // CORS support for cross-origin requests from Shopify extensions
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  } as const;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });

  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId') || '';
  if (!orderId) return Response.json({ statusMap: {} }, { headers: CORS_HEADERS });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const statusMap: Record<string, { status?: string; reportUrl?: string }> = {};
  const shopDomain = session?.shop || undefined;
  const origin = shopDomain ? `https://${shopDomain}` : '';

  for (const reg of registrations) {
    if (!reg.lineItemId) continue;
    const status = reg.report?.status ?? undefined;
    // Include report URL and admin-controlled flag. The client will decide how to behave.
    const relative = reg.kitRegistrationNumber ? buildReportPath(reg.kitRegistrationNumber) : undefined;
    const reportUrl = relative ? (origin ? `${origin}${relative}` : relative) : undefined;
    const reportLinkEnabled = reg.reportLinkEnabled !== false;
    statusMap[reg.lineItemId] = { status, ...(reportUrl ? { reportUrl } : {}), reportLinkEnabled };
  }

  return Response.json({ statusMap }, { headers: CORS_HEADERS });
};
