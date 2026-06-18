import type { LoaderFunctionArgs } from 'react-router';
import { authenticate } from '../shopify.server';
import { getRegistrationsByShopifyOrderId } from '../models/registration.server';
import { buildReportPath } from '../lib/report-url';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId') || '';
  if (!orderId) return Response.json({ statusMap: {} });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const statusMap: Record<string, { status?: string; reportUrl?: string }> = {};
  const shopDomain = session?.shop || undefined;
  const origin = shopDomain ? `https://${shopDomain}` : '';

  for (const reg of registrations) {
    if (!reg.lineItemId) continue;
    const status = reg.report?.status ?? undefined;
    const relative = reg.kitRegistrationNumber ? buildReportPath(reg.kitRegistrationNumber) : undefined;
    const reportUrl = relative ? (origin ? `${origin}${relative}` : relative) : undefined;
    statusMap[reg.lineItemId] = { status, reportUrl };
  }

  return Response.json({ statusMap });
};
