import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import {
  getRegistrationsByShopifyOrderId,
  upsertKitForLineItem,
} from "../models/registration.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId") || "";
  if (!orderId) return Response.json({ kitMap: {} });

  const registrations = await getRegistrationsByShopifyOrderId(orderId);

  const kitMap: Record<string, string> = {};
  for (const reg of registrations) {
    if (reg.lineItemId && reg.kitRegistrationNumber) {
      kitMap[reg.lineItemId] = reg.kitRegistrationNumber;
    }
  }

  return Response.json({ kitMap });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

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
  });
};
