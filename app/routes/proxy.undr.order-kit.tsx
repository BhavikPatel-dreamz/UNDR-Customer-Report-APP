import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import {
  getRegistrationsByShopifyOrderId,
  upsertKitForLineItem,
} from "../models/registration.server";

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
  if (!orderId) return Response.json({ kitMap: {} });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const kitMap: Record<string, string> = {};
  const customerMap: Record<string, { name?: string; email?: string; phone?: string; orderNumber?: string; shopifyCustomerId?: string }> = {};
  for (const reg of registrations) {
    if (reg.lineItemId && reg.kitRegistrationNumber) {
      kitMap[reg.lineItemId] = reg.kitRegistrationNumber;
      customerMap[reg.lineItemId] = {
        name: reg.name || undefined,
        email: reg.email || undefined,
        phone: reg.phone || undefined,
        orderNumber: reg.orderNumber || undefined,
        shopifyCustomerId: reg.shopifyCustomerId || undefined,
      };
    }
  }

  return Response.json({ kitMap, customerMap }, { headers: {
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
  const { orderId, orderNumber, lineItemId, lineItemTitle, registrationNumber, shopifyCustomerId, customerName, customerEmail } = body;

  if (!lineItemId) {
    return Response.json({ error: "lineItemId is required" }, { status: 400 });
  }

  const registration = await upsertKitForLineItem({
    shop: session.shop,
    orderId: orderId || "",
    orderNumber: orderNumber || "",
    lineItemId: String(lineItemId),
    lineItemTitle: lineItemTitle || "",
    registrationNumber: String(registrationNumber || orderNumber).trim(),
    shopifyCustomerId: shopifyCustomerId || undefined,
    customerName: customerName || undefined,
    customerEmail: customerEmail || undefined,
  });

  return Response.json({
    kitRegistrationNumber: registration.kitRegistrationNumber,
    registrationId: registration.id,
  }, { headers: {
    'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
  } });
};
