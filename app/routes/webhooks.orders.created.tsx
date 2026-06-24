import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { upsertKitForLineItem } from "../models/registration.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  let shop = "";
  try {
    const { shop: s, payload } = await authenticate.webhook(request);
    shop = s;

    const order = payload as any;

    // ── FULL PAYLOAD DUMP ──────────────────────────────────────────────
    // console.log("[webhooks/orders/created] RAW PAYLOAD", JSON.stringify({
    //   shop,
    //   orderId: order.id,
    //   adminGid: order.admin_graphql_api_id,
    //   orderName: order.name,
    //   orderNumber: order.order_number,
    //   hasCustomer: !!order.customer,
    //   customerId: order.customer?.id,
    //   lineItemsType: typeof order.line_items,
    //   lineItemsIsArray: Array.isArray(order.line_items),
    //   lineItemsCount: Array.isArray(order.line_items) ? order.line_items.length : "N/A",
    //   lineItemsSample: Array.isArray(order.line_items)
    //     ? order.line_items.map((li: any) => ({
    //         id: li.id,
    //         admin_graphql_api_id: li.admin_graphql_api_id,
    //         variant_id: li.variant_id,
    //         title: li.title,
    //         name: li.name,
    //       }))
    //     : order.line_items,
    //   // dump all top-level keys so we know what's in payload
    //   topLevelKeys: Object.keys(order),
    // }, null, 2));
    // ──────────────────────────────────────────────────────────────────

    const orderId = String(order.admin_graphql_api_id || order.id || "");
    const orderNumber = String(order.name || order.order_number || "");

    const customer = order.customer || {};
    const shopifyCustomerId = customer.id ? String(customer.id) : undefined;
    const customerName = [customer.first_name, customer.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    const customerEmail = customer.email || undefined;

    const lineItems: any[] = Array.isArray(order.line_items)
      ? order.line_items
      : [];

    if (lineItems.length === 0) {
      console.warn("[webhooks/orders/created]  NO LINE ITEMS — payload may be minimal", {
        shop,
        orderId,
        orderNumber,
        payloadKeys: Object.keys(order),
      });
      // Still return 200 — nothing to do
      return new Response(null, { status: 200 });
    }

    for (const li of lineItems) {
      const rawLineItemId = li.id ?? li.admin_graphql_api_id;
      if (!rawLineItemId) {
        console.warn("[webhooks/orders/created] skipping line item with no id", { shop, orderId, li });
        continue;
      }

      const lineItemId = String(rawLineItemId);
      const lineItemTitle = li.title || li.name || "";

      console.log("[webhooks/orders/created] upserting kit for line item", {
        shop, orderId, orderNumber, lineItemId, lineItemTitle,
      });

      try {
        const res = await upsertKitForLineItem({
          shop,
          orderId,
          orderNumber,
          lineItemId,
          lineItemTitle,
          registrationNumber: "",
          shopifyCustomerId,
          customerName: customerName || undefined,
          customerEmail: customerEmail || undefined,
        });

        console.log("[webhooks/orders/created]  upserted kit", {
          shop,
          orderId,
          orderNumber,
          lineItemId,
          registrationId: res?.id,
          kitNumber: res?.kitRegistrationNumber,
        });
      } catch (err: any) {
        if (err?.code === "P2002") {
          console.log("[webhooks/orders/created] duplicate (P2002), skipping", { shop, orderId, lineItemId });
          continue;
        }
        // Log full error with stack
        console.error("[webhooks/orders/created]  upsertKitForLineItem threw", {
          shop,
          orderId,
          lineItemId,
          errCode: err?.code,
          errMessage: err?.message,
          errStack: err?.stack,
          err,
        });
      }
    }

    console.log("[webhooks/orders/created]  done", {
      shop, orderId, orderNumber, lineItemCount: lineItems.length,
    });

  } catch (error: any) {
    console.error("[webhooks/orders/created]  outer catch", {
      shop,
      errMessage: error?.message,
      errStack: error?.stack,
      errCode: error?.code,
    });
  }

  return new Response(null, { status: 200 });
};