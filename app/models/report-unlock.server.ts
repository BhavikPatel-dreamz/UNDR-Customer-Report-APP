import type { Prisma } from "@prisma/client";

import prisma from "../db.server";
import {
  getUnlockOffer,
  getUnlockOffersForShop,
  isReportPackage,
  isUnlockModule,
  type UnlockModule,
} from "../lib/report-packages";

type ShopifyLineItemProperty = {
  name?: string;
  value?: unknown;
};

type ShopifyLineItem = {
  variant_id?: number | string | null;
  sku?: string | null;
  price?: string | number | null;
  properties?: ShopifyLineItemProperty[] | null;
};

type ShopifyOrderPayload = {
  id?: number | string;
  admin_graphql_api_id?: string;
  currency?: string;
  line_items?: ShopifyLineItem[];
  note_attributes?: ShopifyLineItemProperty[] | null;
};

function getOrderId(payload: ShopifyOrderPayload) {
  return String(payload.admin_graphql_api_id || payload.id || "").trim();
}

function getProperty(lineItem: ShopifyLineItem, name: string) {
  return String(
    lineItem.properties?.find((property) => property.name === name)?.value || "",
  ).trim();
}

function getOrderAttribute(payload: ShopifyOrderPayload, name: string) {
  const attrs = payload.note_attributes || [];
  const keys = [name, `_${name}`, name.replace(/^_/, '')];
  for (const k of keys) {
    const found = attrs.find((a) => a.name === k);
    if (found?.value) return String(found.value).trim();
  }
  return '';
}

function findModuleFromLineItem(lineItem: ShopifyLineItem, shop: string, payload: ShopifyOrderPayload): UnlockModule | null {
  const explicitModule = (
    getProperty(lineItem, '_undr_unlock') ||
    getProperty(lineItem, 'undr_unlock') ||
    getOrderAttribute(payload, 'undr_unlock') ||
    getOrderAttribute(payload, '_undr_unlock')
  ).toLowerCase();
  if (isUnlockModule(explicitModule)) return explicitModule as UnlockModule;

  const variantId = String(lineItem.variant_id || "").trim();
  const sku = String(lineItem.sku || "").trim();
  const offer = getUnlockOffersForShop(shop).find(
    (item) => item.variantId === variantId || item.sku === sku,
  );

  return offer?.module || null;
}

function getLineItemAmountCents(lineItem: ShopifyLineItem, module: UnlockModule, shop: string) {
  const price = Number(lineItem.price);
  if (Number.isFinite(price) && price > 0) {
    return Math.round(price * 100);
  }

  return getUnlockOffer(module, shop).priceCents;
}

function jsonPayload(payload: ShopifyOrderPayload): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue;
}

export async function recordPaidReportUnlocks(input: {
  shop: string;
  payload: ShopifyOrderPayload;
}) {
  const orderId = getOrderId(input.payload);
  if (!orderId) return { unlocked: 0 };

  let unlocked = 0;
  const lineItems = input.payload.line_items || [];

  for (const lineItem of lineItems) {
    // Try to determine the module from the line item first, then fall back
    // to order-level note attributes (for flows that set note attributes)
    let module = findModuleFromLineItem(lineItem, input.shop, input.payload);
    if (!module) {
      const noteModule = getOrderAttribute(input.payload, 'undr_unlock') || getOrderAttribute(input.payload, '_undr_unlock');
      if (isUnlockModule(noteModule)) module = noteModule as UnlockModule;
    }
    if (!module) continue;
    // Kit/registration/report package may be present as line-item properties
    // (private keys with leading underscore) or as order note attributes
    const kitRegistrationNumber =
      getProperty(lineItem, '_undr_kit') ||
      getProperty(lineItem, 'undr_kit') ||
      getOrderAttribute(input.payload, 'undr_kit') ||
      getOrderAttribute(input.payload, '_undr_kit');

    const registrationId =
      getProperty(lineItem, '_undr_registration_id') ||
      getProperty(lineItem, 'undr_registration_id') ||
      getOrderAttribute(input.payload, 'undr_registration_id') ||
      getOrderAttribute(input.payload, '_undr_registration_id');

    const reportPackageProperty = (
      getProperty(lineItem, '_undr_report_package') ||
      getProperty(lineItem, 'undr_report_package') ||
      getOrderAttribute(input.payload, 'undr_report_package') ||
      getOrderAttribute(input.payload, '_undr_report_package')
    ).toLowerCase();

    if (!kitRegistrationNumber && !registrationId) continue;

    const registration = await prisma.registration.findFirst({
      where: {
        shop: input.shop,
        OR: [
          ...(registrationId ? [{ id: registrationId }] : []),
          ...(kitRegistrationNumber
            ? [{ kitRegistrationNumber: { equals: kitRegistrationNumber, mode: "insensitive" as const } }]
            : []),
        ],
      },
      select: { id: true, reportPackage: true, report: { select: { id: true } } },
    });

    if (!registration) continue;
    const paidReportPackage = isReportPackage(reportPackageProperty)
      ? reportPackageProperty
      : registration.reportPackage;

    await prisma.reportUnlock.upsert({
      where: {
        registrationId_module_reportPackage: {
          registrationId: registration.id,
          module,
          reportPackage: paidReportPackage,
        },
      },
      create: {
        registrationId: registration.id,
        reportId: registration.report?.id ?? null,
        module,
        reportPackage: paidReportPackage,
        amountCents: getLineItemAmountCents(lineItem, module, input.shop),
        currency: String(input.payload.currency || "USD").toUpperCase(),
        status: "paid",
        source: "shopify_order",
        shopifyOrderId: orderId,
        rawPayload: jsonPayload(input.payload),
      },
      update: {
        reportId: registration.report?.id ?? null,
        amountCents: getLineItemAmountCents(lineItem, module, input.shop),
        currency: String(input.payload.currency || "USD").toUpperCase(),
        status: "paid",
        source: "shopify_order",
        shopifyOrderId: orderId,
        rawPayload: jsonPayload(input.payload),
      },
    });

    unlocked += 1;
  }

  return { unlocked };
}
