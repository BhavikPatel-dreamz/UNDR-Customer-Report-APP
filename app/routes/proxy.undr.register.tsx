import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
  getRegistrationDefaults,
  saveRegistration,
  validateRegistration,
  type RegistrationFormErrors,
  type RegistrationFormState,
} from "../models/registration.server";
import { authenticate, unauthenticated } from "../shopify.server";

type RegistrationPageState = {
  errors?: RegistrationFormErrors;
  form: RegistrationFormState;
  success?: boolean;
  successMessage?: string;
};

function isEmbedMode(url: URL) {
  const embed = url.searchParams.get("embed")?.trim().toLowerCase();
  return embed === "1" || embed === "true";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderError(message?: string) {
  if (!message) return "";
  return `<div style="color: #b42318; margin-top: 6px; font-size: 13px;">${escapeHtml(message)}</div>`;
}

function renderValue(value: string) {
  return escapeHtml(value);
}

function renderRegistrationTemplate(state: RegistrationPageState) {
  return `
<div style="max-width: 760px; margin: 0 auto; padding: 48px 20px 72px; color: #111827;">
  <div style="margin-bottom: 26px;">
    <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.72;">UNDR Registration</p>
    <h1 style="margin: 0 0 12px; font-size: clamp(28px, 5vw, 44px); line-height: 1.1; font-weight: 700;">Register your test kit</h1>
    <p style="margin: 0; font-size: 16px; line-height: 1.7; opacity: 0.84;">
      Enter your details and kit number below to register your UNDR soil test kit.
    </p>
  </div>

  <form method="post" style="display: grid; gap: 16px; max-width: 640px; padding: 28px; border: 1px solid rgba(15, 23, 42, 0.12); border-radius: 22px; background: linear-gradient(180deg, #fffdf8, #ffffff);">
    <label style="display: grid; gap: 6px;">
      <span style="font-size: 14px; font-weight: 600;">Full name</span>
      <input name="name" value="${renderValue(state.form.name)}" autocomplete="name" placeholder="Jane Smith"
        style="width: 100%; min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box;" />
      ${renderError(state.errors?.name)}
    </label>

    <label style="display: grid; gap: 6px;">
      <span style="font-size: 14px; font-weight: 600;">Email address</span>
      <input name="email" type="email" value="${renderValue(state.form.email)}" autocomplete="email" placeholder="jane@example.com"
        style="width: 100%; min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box;" />
      ${renderError(state.errors?.email)}
    </label>

    <label style="display: grid; gap: 6px;">
      <span style="font-size: 14px; font-weight: 600;">Phone number</span>
      <input name="phone" type="tel" value="${renderValue(state.form.phone)}" autocomplete="tel" placeholder="+1 555 000 0000"
        style="width: 100%; min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box;" />
      ${renderError(state.errors?.phone)}
    </label>

    <label style="display: grid; gap: 6px;">
      <span style="font-size: 14px; font-weight: 600;">Order number</span>
      <input name="orderNumber" value="${renderValue(state.form.orderNumber)}" autocomplete="off" placeholder="#1001"
        style="width: 100%; min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box;" />
      ${renderError(state.errors?.orderNumber)}
    </label>

    <label style="display: grid; gap: 6px;">
      <span style="font-size: 14px; font-weight: 600;">Kit registration number</span>
      <input name="kitRegistrationNumber" value="${renderValue(state.form.kitRegistrationNumber)}" autocomplete="off" placeholder="KIT-XXXXX"
        style="width: 100%; min-height: 44px; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box;" />
      ${renderError(state.errors?.kitRegistrationNumber)}
    </label>

    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px;">
      <button type="submit"
        style="min-height: 44px; padding: 0 22px; border: 0; border-radius: 999px; background: #111827; color: #ffffff; font-size: 15px; font-weight: 600; cursor: pointer; letter-spacing: 0.01em;">
        Register kit
      </button>
      <button type="reset"
        style="min-height: 44px; padding: 0 22px; border-radius: 999px; border: 1px solid rgba(15, 23, 42, 0.2); background: transparent; color: #111827; font-size: 15px; font-weight: 600; cursor: pointer;">
        Reset
      </button>
    </div>

    ${
      state.success
        ? `<div style="padding: 14px 18px; border-radius: 12px; background: #ecfdf3; color: #027a48; font-weight: 600; font-size: 15px; border: 1px solid #a7f3d0;">
             ✓ ${escapeHtml(state.successMessage ?? "Your kit has been successfully registered.")}
           </div>`
        : ""
    }
  </form>
</div>
`;
}

async function renderRegistrationPage(
  request: Request,
  state: RegistrationPageState,
) {
  const { liquid } = await authenticate.public.appProxy(request);
  const embed = isEmbedMode(new URL(request.url));
  return liquid(renderRegistrationTemplate(state), { layout: !embed });
}

export async function loader({ request }: LoaderFunctionArgs) {
  return renderRegistrationPage(request, { form: getRegistrationDefaults() });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const form: RegistrationFormState = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    orderNumber: String(formData.get("orderNumber") || ""),
    kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
  };

  const errors = validateRegistration(form);
  if (errors) {
    return renderRegistrationPage(request, { errors, form });
  }

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";

  let shopifyOrderId: string | null = null;
  let shopifyCustomerId: string | null = null;

  if (shop) {
    try {
      const { admin } = await unauthenticated.admin(shop);
      const orderName = form.orderNumber.startsWith("#")
        ? form.orderNumber
        : `#${form.orderNumber}`;

      const resp = await admin.graphql(
        `#graphql
          query getOrderByName($query: String!) {
            orders(first: 1, query: $query) {
              nodes {
                id
                name
                customer { id }
              }
            }
          }
        `,
        { variables: { query: `name:${orderName}` } },
      );

      const json = (await resp.json()) as {
        data?: {
          orders?: {
            nodes?: Array<{
              id: string;
              name: string;
              customer?: { id: string } | null;
            }>;
          };
        };
      };

      const order = json.data?.orders?.nodes?.[0];
      if (!order) {
        return renderRegistrationPage(request, {
          errors: {
            orderNumber:
              "We could not find that order number. Please check and try again.",
          },
          form,
        });
      }

      shopifyOrderId = order.id;
      shopifyCustomerId = order.customer?.id ?? null;
    } catch (err) {
      console.error("[proxy.undr.register] Admin API order lookup failed:", err);
    }
  }

  await saveRegistration({
    shop,
    ...form,
    shopifyOrderId,
    shopifyCustomerId,
  });

  return renderRegistrationPage(request, {
    form: getRegistrationDefaults(),
    success: true,
    successMessage: "Your kit has been successfully registered. You will receive an email when your report is ready.",
  });
}

export default function ProxyRegisterRoute() {
  return null;
}