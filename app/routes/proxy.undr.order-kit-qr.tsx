import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getRegistrationsByShopifyOrderId, setQrForLineItem } from "../models/registration.server";

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
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";
  if (!orderId) return Response.json({ qrMap: {} }, { headers: CORS_HEADERS });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const qrMap: Record<string, string> = {};
  for (const reg of registrations) {
    if (reg.lineItemId && reg.qrUrl) {
      qrMap[reg.lineItemId] = reg.qrUrl;
    }
  }

  return Response.json({ qrMap }, { headers: CORS_HEADERS });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  } as const;

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { orderId, qrUrl } = body;

  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400, headers: CORS_HEADERS });
  }

  const registration = await setQrForLineItem({
    orderId: orderId || "",
    qrUrl: qrUrl || null,
  });

  if (!registration) {
    return Response.json({ error: 'No registration found for this line item. Generate a kit first.' }, { status: 400, headers: CORS_HEADERS });
  }

  return Response.json({ qrUrl: registration.qrUrl }, { headers: CORS_HEADERS });
};
