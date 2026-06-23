import type { LoaderFunctionArgs } from "react-router";
import { getRegistrationsByShopifyOrderId } from "../models/registration.server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";

  if (!orderId) {
    return Response.json({ kitMap: {} }, { headers: CORS_HEADERS });
  }

  try {
    const registrations = await getRegistrationsByShopifyOrderId(orderId);

    const kitMap: Record<string, string> = {};
    for (const reg of registrations) {
      if (reg.lineItemId && reg.kitRegistrationNumber) {
        kitMap[reg.lineItemId] = reg.kitRegistrationNumber;
      }
    }

    return Response.json({ kitMap }, { headers: CORS_HEADERS });
  } catch (e) {
    return Response.json({ kitMap: {} }, { headers: CORS_HEADERS });
  }
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  return new Response(null, { status: 405, headers: CORS_HEADERS });
};