/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../db.server";
import { setReportStatusByRegistrationId } from "./report.server";
import { isReportPackage } from "../lib/report-packages";
import { generateKitNumber } from "../utils/generateKitNumber";

function isMissingUnlockTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

function normalizeNumericShopifyId(value?: string | null) {
  if (!value) return null;
  const match = value.match(/(\d+)$/);
  return match?.[1] ?? null;
}

function buildShopifyCustomerGid(customerId: string) {
  return `gid://shopify/Customer/${customerId}`;
}

export type RegistrationInput = {
  shop: string;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  kitRegistrationNumber: string;
  shopifyOrderId?: string | null;
  shopifyCustomerId?: string | null;
  agreedToTerms?: boolean;
  smsConsent?: boolean;
};

export type RegistrationFormState = {
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  kitRegistrationNumber: string;
  agreedToTerms?: boolean;
  smsConsent?: boolean;
  shopDomain?: string;
};

export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormState, string>>;

export interface ListRegistrationsOptions {
  page?: number;
  perPage?: number;
  query?: string;
  sort?: "asc" | "desc";
  shop?: string;
}

export function getRegistrationDefaults(): RegistrationFormState {
  return {
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    kitRegistrationNumber: "",
    agreedToTerms: false,
    smsConsent: true,
    shopDomain: "",
  };
}

export function validateRegistration(
  input: Partial<RegistrationFormState>,
): RegistrationFormErrors | null {
  const errors: RegistrationFormErrors = {};

  if (!input.name?.trim()) {
    errors.name = "Name is required.";
  }

  if (!input.email?.trim()) {
    errors.email = "Email is required.";
  }

  if (!input.phone?.trim()) {
    errors.phone = "Phone is required.";
  }
  else {
    // Require a full U.S. phone number with country code +1 and 10 digits.
    // Accept common separators and parentheses, e.g. +1 (555) 555-5555, +1-555-555-5555, +1 555 555 5555
    const phone = String(input.phone || '').trim();
    const usPhoneRegex = /^\+1\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (!usPhoneRegex.test(phone)) {
      errors.phone = "Phone must be a full U.S. number, e.g. +1 (555) 555-5555.";
    }
  }

  // Order number is optional (removed from public form); do not require it.

  if (!input.kitRegistrationNumber?.trim()) {
    errors.kitRegistrationNumber = "Kit registration number is required.";
  }

  return Object.keys(errors).length ? errors : null;
}

export async function saveRegistration(input: RegistrationInput) {
  return prisma.registration.create({
    data: {
      shop: input.shop,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      orderNumber: input.orderNumber.trim(),
      kitRegistrationNumber: input.kitRegistrationNumber.trim(),
      agreedToTerms: input.agreedToTerms ?? false,
      smsConsent: input.smsConsent ?? true,
      shopifyOrderId: input.shopifyOrderId ?? null,
      shopifyCustomerId: input.shopifyCustomerId ?? null,
    },
  });
}

export async function getRegistrationByKitNumber(kitRegistrationNumber: string) {
  try {
    return await prisma.registration.findFirst({
      where: { kitRegistrationNumber },
      include: {
        report: { include: { rows: true } },
        unlocks: true,
      },
    });
  } catch (error) {
    if (!isMissingUnlockTableError(error)) {
      throw error;
    }

    return prisma.registration.findFirst({
      where: { kitRegistrationNumber },
      include: { report: { include: { rows: true } } },
    });
  }
}

export async function updateRegistrationFieldsById(id: string, data: Partial<{ name: string; email: string; phone: string; orderNumber: string; shopifyCustomerId: string | null; shop?: string; agreedToTerms?: boolean; reportLinkEnabled?: boolean; smsConsent?: boolean }>) {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.email !== undefined) updateData.email = data.email.trim();
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.orderNumber !== undefined) updateData.orderNumber = data.orderNumber.trim();
  if (data.shopifyCustomerId !== undefined) updateData.shopifyCustomerId = data.shopifyCustomerId ?? null;
  if (data.shop !== undefined) updateData.shop = data.shop;
  if (data.reportLinkEnabled !== undefined) updateData.reportLinkEnabled = data.reportLinkEnabled;
  if (data.agreedToTerms !== undefined) updateData.agreedToTerms = data.agreedToTerms;
  if (data.smsConsent !== undefined) updateData.smsConsent = data.smsConsent;

  return prisma.registration.update({ where: { id }, data: updateData });
}

export async function getRegistrationByKitRegistrationNumber(
  kitRegistrationNumber: string,
) {
  return prisma.registration.findFirst({
    where: {
      kitRegistrationNumber: {
        equals: kitRegistrationNumber.trim(),
        mode: "insensitive",
      },
    },
  });
}

export async function getRegistrationById(id: string) {
  return prisma.registration.findUnique({
    where: { id },
    include: { report: { include: { rows: { orderBy: { ppmValue: "desc" } } } } },
  });
}

export async function listRegistrations(options: ListRegistrationsOptions = {}) {
  const { page = 1, perPage = 25, query = "", sort = "desc", shop } = options;
  const skip = (page - 1) * perPage;

  const where = {
    ...(shop ? { shop } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
            { orderNumber: { contains: query, mode: "insensitive" as const } },
            { kitRegistrationNumber: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: sort },
      skip,
      take: perPage,
      include: { report: { select: { id: true, status: true } } },
    }),
    prisma.registration.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
}

export async function listRegistrationsByCustomerId(shopifyCustomerId: string) {
  const normalizedCustomerId = normalizeNumericShopifyId(shopifyCustomerId) ?? shopifyCustomerId.trim();
  return prisma.registration.findMany({
    where: {
      shopifyCustomerId: {
        in: [normalizedCustomerId, buildShopifyCustomerGid(normalizedCustomerId)],
      },
    },
    orderBy: { createdAt: "desc" },
    include: { report: { select: { id: true, status: true } } },
  });
}

export async function findRegistrationForGuestLookup(input: {
  email: string;
  orderNumber?: string;
  kitRegistrationNumber?: string;
  date?: string;
}) {
  const date = input.date?.trim();
  const createdAtFilter = date
    ? {
        gte: new Date(`${date}T00:00:00.000Z`),
        lt: new Date(`${date}T23:59:59.999Z`),
      }
    : undefined;

  return prisma.registration.findFirst({
    where: {
      email: { equals: input.email.trim(), mode: "insensitive" },
      ...(input.orderNumber?.trim()
        ? {
            orderNumber: {
              equals: input.orderNumber.trim(),
              mode: "insensitive",
            },
          }
        : {}),
      ...(input.kitRegistrationNumber?.trim()
        ? {
            kitRegistrationNumber: {
              equals: input.kitRegistrationNumber.trim(),
              mode: "insensitive",
            },
          }
        : {}),
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    },
    include: { report: { select: { id: true, status: true } } },
  });
}

export async function updateRegistrationReportPackageById(input: {
  registrationId: string;
  shop: string;
  reportPackage: string;
}) {
  const normalizedPackage = input.reportPackage.trim().toLowerCase();
  if (!isReportPackage(normalizedPackage)) {
    return null;
  }

  return prisma.registration.updateMany({
    where: { id: input.registrationId, shop: input.shop },
    data: { reportPackage: normalizedPackage },
  });
}

export async function updateRegistrationQuickViewPackageById(input: {
  registrationId: string;
  shop: string;
  quickViewPackage: string;
}) {
  const normalizedPackage = input.quickViewPackage.trim().toLowerCase();
  if (!isReportPackage(normalizedPackage)) {
    return null;
  }

  return prisma.registration.updateMany({
    where: { id: input.registrationId, shop: input.shop },
    data: { quickViewPackage: normalizedPackage },
  });
}

export async function getRegistrationsByShopifyOrderId(shopifyOrderId: string) {
  if (!shopifyOrderId) return [];

  // Support several stored formats: full GraphQL gid (gid://shopify/Order/123),
  // numeric id (123), or a stored orderNumber (with or without leading '#').
  const numeric = normalizeNumericShopifyId(shopifyOrderId) ?? shopifyOrderId;
  const withoutHash = String(shopifyOrderId).replace(/^#/, '');

  return prisma.registration.findMany({
    where: {
      OR: [
        { shopifyOrderId: shopifyOrderId },
        { shopifyOrderId: numeric },
        { orderNumber: { equals: shopifyOrderId, mode: 'insensitive' as const } },
        { orderNumber: { equals: withoutHash, mode: 'insensitive' as const } },
      ],
    },
    include: { report: { select: { id: true, status: true } } },
  });
}

export async function deleteRegistrationById(id: string, shop?: string) {
  if (!id) return null;
  // Use deleteMany to ensure shop constraint when provided
  const where: any = { id };
  if (shop) where.shop = shop;
  const result = await prisma.registration.deleteMany({ where });
  return result.count > 0;
}

export async function setQrForLineItem(params: {
  orderId: string;
  qrUrl: string | null;
}) {
  const { orderId, qrUrl } = params;

  // Persist QR at the order level: only update existing registrations for
  // this shopify order. If there are no registrations (i.e. no kit yet),
  // return null so the caller can surface an error.
  const numeric = normalizeNumericShopifyId(orderId) ?? orderId;
  const withoutHash = String(orderId).replace(/^#/, '');

  const whereClause: any = {
    OR: [
      { shopifyOrderId: orderId },
      { shopifyOrderId: numeric },
      { orderNumber: { equals: orderId, mode: 'insensitive' as const } },
      { orderNumber: { equals: withoutHash, mode: 'insensitive' as const } },
    ],
  };

  const any = await prisma.registration.findFirst({ where: whereClause });
  if (!any) return null;

  await prisma.registration.updateMany({
    where: whereClause,
    data: { qrUrl },
  });

  return prisma.registration.findFirst({ where: whereClause });
}

export async function upsertKitForLineItem(params: {
  shop: string;
  orderId: string;
  orderNumber: string;
  lineItemId: string;
  lineItemTitle: string;
  registrationNumber: string;
  shopifyCustomerId?: string;
  customerName?: string;
  customerEmail?: string;
}) {
  const { shop, orderId, orderNumber, lineItemId, registrationNumber } = params;
  // If caller provided a final 10-digit kit number, respect it. Otherwise
  // generate deterministically from the orderNumber and lineItemId so
  // client-side generation and server-side generation match.
  let kitRegistrationNumber: string;
  if (registrationNumber && /^\d{10}$/.test(String(registrationNumber))) {
    kitRegistrationNumber = String(registrationNumber);
  } else {
    kitRegistrationNumber = generateKitNumber(orderNumber || "", String(lineItemId || ""));
  }

  const numericOrderId = normalizeNumericShopifyId(orderId) ?? null;
  const existing = await prisma.registration.findFirst({
    where: {
      lineItemId,
      OR: [
        { shopifyOrderId: orderId },
        ...(numericOrderId ? [{ shopifyOrderId: numericOrderId }] : []),
      ],
    },
  });

  if (existing) {
    const updated = await prisma.registration.update({
      where: { id: existing.id },
      data: {
        kitRegistrationNumber,
        ...(params.shopifyCustomerId ? { shopifyCustomerId: params.shopifyCustomerId } : {}),
        ...(params.customerName ? { name: params.customerName.trim() } : {}),
        ...(params.customerEmail ? { email: params.customerEmail.trim() } : {}),
      },
    });
    // mark as kit_generated
    try {
      await setReportStatusByRegistrationId(updated.id, "kit_generated");
    } catch (err) {
      console.error("[upsertKitForLineItem] could not set kit_generated status", err);
    }
    return updated;
  }

  // Fallback: try to find an existing registration for this shop/order
  // that may have been created manually (no lineItemId). Prefer matching
  // by `shopifyOrderId`, then by `orderNumber` (try with and without leading '#').
  const normalizedOrderNumber = String(orderNumber || "").trim();
  const withoutHash = normalizedOrderNumber.replace(/^#/, "");

  const fallback = await prisma.registration.findFirst({
    where: {
      shop,
      // only match registrations that are not yet tied to a specific line item
      lineItemId: null,
      OR: [
        { shopifyOrderId: orderId },
        { orderNumber: { equals: normalizedOrderNumber, mode: "insensitive" as const } },
        ...(withoutHash && withoutHash !== normalizedOrderNumber
          ? [{ orderNumber: { equals: withoutHash, mode: "insensitive" as const } }]
          : []),
      ],
    },
  });

  if (fallback) {
    const updated = await prisma.registration.update({
      where: { id: fallback.id },
      data: {
        kitRegistrationNumber,
        lineItemId,
        shopifyOrderId: orderId || fallback.shopifyOrderId,
        ...(params.shopifyCustomerId ? { shopifyCustomerId: params.shopifyCustomerId } : {}),
        ...(params.customerName ? { name: params.customerName.trim() } : {}),
        ...(params.customerEmail ? { email: params.customerEmail.trim() } : {}),
      },
    });
    try {
      await setReportStatusByRegistrationId(updated.id, "kit_generated");
    } catch (err) {
      console.error("[upsertKitForLineItem] could not set kit_generated status", err);
    }
    return updated;
  }

  const created = await prisma.registration.create({
    data: {
      shop,
      name: params.customerName?.trim() || "",
      email: params.customerEmail?.trim() || "",
      phone: "",
      orderNumber: orderNumber || "",
      shopifyOrderId: orderId || null,
      shopifyCustomerId: params.shopifyCustomerId ?? null,
      lineItemId,
      kitRegistrationNumber,
    },
  });
  try {
    await setReportStatusByRegistrationId(created.id, "kit_generated");
  } catch (err) {
    console.error("[upsertKitForLineItem] could not set kit_generated status", err);
  }
  return created;
}
