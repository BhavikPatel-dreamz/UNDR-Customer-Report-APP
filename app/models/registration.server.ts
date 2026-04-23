import prisma from "../db.server";

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
};

export type RegistrationFormState = {
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  kitRegistrationNumber: string;
};

export type RegistrationFormErrors = Partial<Record<keyof RegistrationFormState, string>>;

export interface ListRegistrationsOptions {
  page?: number;
  perPage?: number;
  query?: string;
  sort?: "asc" | "desc";
  shop?: string;
}

export const REPORT_PACKAGES = [
  "treasure_base",
  "treasure_plus",
  "hs_base",
  "hs_plus",
  "premium",
] as const;

export type ReportPackage = (typeof REPORT_PACKAGES)[number];

export function getRegistrationDefaults(): RegistrationFormState {
  return {
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    kitRegistrationNumber: "",
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

  if (!input.orderNumber?.trim()) {
    errors.orderNumber = "Order number is required.";
  }

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
      shopifyOrderId: input.shopifyOrderId ?? null,
      shopifyCustomerId: input.shopifyCustomerId ?? null,
    },
  });
}

export async function getRegistrationByKitNumber(kitRegistrationNumber: string) {
  return prisma.registration.findFirst({
    where: { kitRegistrationNumber },
    include: { report: { include: { rows: true } } },
  });
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
  if (!REPORT_PACKAGES.includes(normalizedPackage as ReportPackage)) {
    return null;
  }

  return prisma.registration.updateMany({
    where: { id: input.registrationId, shop: input.shop },
    data: { reportPackage: normalizedPackage },
  });
}
