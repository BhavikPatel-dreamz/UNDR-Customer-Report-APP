import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getRegistrationsByShopifyOrderId, setQrForLineItem } from "../models/registration.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Handle CORS preflight quickly without running auth (avoid redirects)
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '*';
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  } });

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";
  if (!orderId) return Response.json({ qrMap: {} });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const qrMap: Record<string, string> = {};
  for (const reg of registrations) {
    if (reg.lineItemId && reg.qrUrl) {
      qrMap[reg.lineItemId] = reg.qrUrl;
    }
  }

  return Response.json({ qrMap }, { headers: {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // Handle CORS preflight quickly without running auth (avoid redirects)
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '*';
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  } });

  const body = await request.json();
  const { orderId, qrUrl } = body;

  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400, headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    } });
  }

  const registration = await setQrForLineItem({
    orderId: orderId || "",
    qrUrl: qrUrl || null,
  });

  if (!registration) {
    return Response.json({ error: 'No registration found for this line item. Generate a kit first.' }, { status: 400, headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    } });
  }

  return Response.json({ qrUrl: registration.qrUrl }, { headers: {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  } });
};
