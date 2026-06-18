import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getRegistrationsByShopifyOrderId, setQrForLineItem } from "../models/registration.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

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

  return Response.json({ qrMap });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { orderId, qrUrl } = body;

  if (!orderId) {
    return Response.json({ error: "orderId is required" }, { status: 400 });
  }

  const registration = await setQrForLineItem({
    orderId: orderId || "",
    qrUrl: qrUrl || null,
  });

  if (!registration) {
    return Response.json({ error: 'No registration found for this line item. Generate a kit first.' }, { status: 400 });
  }

  return Response.json({ qrUrl: registration.qrUrl });
};
