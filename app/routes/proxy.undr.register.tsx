import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
  getRegistrationDefaults,
  getRegistrationByKitRegistrationNumber,
  saveRegistration,
  validateRegistration,
  type RegistrationFormErrors,
  type RegistrationFormState,
} from "../models/registration.server";
import { authenticate } from "../shopify.server";

// ─── Types ────────────────────────────────────────────────────────────────────

type RegistrationPageState = {
  errors?: RegistrationFormErrors;
  form: RegistrationFormState;
  loggedInCustomerId?: string | null;
  pageError?: string;
  success?: boolean;
  successMessage?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  return `<p style="color:#b42318;margin:4px 0 0;font-size:13px;">${escapeHtml(message)}</p>`;
}

function getLoggedInCustomerId(url: URL): string | null {
  return (
    url.searchParams.get("logged_in_customer_id")?.trim() ||
    url.searchParams.get("customer_id")?.trim() ||
    null
  );
}

function buildLoginRedirect(url: URL): string {
  const shop = url.searchParams.get("shop")?.trim();
  if (!shop) return "https://accounts.shopify.com/store-login";

  const pathPrefix =
    url.searchParams.get("path_prefix")?.trim() || "/apps/report";
  const returnPath = `${pathPrefix.replace(/\/$/, "")}/register`;
  return `https://${shop}/account/login?return_url=${encodeURIComponent(returnPath)}`;
}

function normalizeCustomerId(value?: string | null): string | null {
  if (!value) return null;
  const match = value.match(/(\d+)$/);
  return match?.[1] ?? null;
}

function isEmbedMode(url: URL) {
  const embed = url.searchParams.get("embed")?.trim().toLowerCase();
  return embed === "1" || embed === "true";
}

// ─── Template ─────────────────────────────────────────────────────────────────

function renderPage(state: RegistrationPageState): string {
  const v = (val: string) => escapeHtml(val);
  const f = state.form;

  return `
<div style="max-width:760px;margin:0 auto;padding:48px 20px 72px;color:#111827;font-family:system-ui,sans-serif;">

  <div style="margin-bottom:28px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.6;">UNDR</p>
    <h1 style="margin:0 0 10px;font-size:clamp(26px,5vw,42px);font-weight:700;line-height:1.1;">Register your test kit</h1>
    <p style="margin:0;font-size:16px;line-height:1.7;opacity:0.8;">
      Enter your details and kit number below to register your UNDR soil test kit.
    </p>
  </div>

  ${
    state.pageError
      ? `<div style="margin-bottom:20px;padding:14px 18px;border-radius:10px;background:#fef2f2;color:#b42318;border:1px solid #fecaca;font-size:14px;">
           ${escapeHtml(state.pageError)}
         </div>`
      : ""
  }

  ${
    state.success
      ? `<div style="margin-bottom:20px;padding:16px 20px;border-radius:10px;background:#ecfdf3;color:#027a48;border:1px solid #a7f3d0;font-size:15px;font-weight:600;">
           &#10003; ${escapeHtml(state.successMessage ?? "Your kit has been successfully registered.")}
         </div>`
      : ""
  }

  <form method="post" style="display:grid;gap:16px;max-width:600px;padding:28px;border:1px solid rgba(15,23,42,0.12);border-radius:20px;background:#fffdf8;">

    <label style="display:grid;gap:5px;">
      <span style="font-size:14px;font-weight:600;">Full name</span>
      <input name="name" value="${v(f.name)}" autocomplete="name" placeholder="Jane Smith"
        style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
      ${renderError(state.errors?.name)}
    </label>

    <label style="display:grid;gap:5px;">
      <span style="font-size:14px;font-weight:600;">Email address</span>
      <input name="email" type="email" value="${v(f.email)}" autocomplete="email" placeholder="jane@example.com"
        style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
      ${renderError(state.errors?.email)}
    </label>

    <label style="display:grid;gap:5px;">
      <span style="font-size:14px;font-weight:600;">Phone number</span>
      <input name="phone" type="tel" value="${v(f.phone)}" autocomplete="tel" placeholder="+1 555 000 0000"
        style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
      ${renderError(state.errors?.phone)}
    </label>

    <label style="display:grid;gap:5px;">
      <span style="font-size:14px;font-weight:600;">Order number</span>
      <input name="orderNumber" value="${v(f.orderNumber)}" autocomplete="off" placeholder="#1001"
        style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
      ${renderError(state.errors?.orderNumber)}
    </label>

    <label style="display:grid;gap:5px;">
      <span style="font-size:14px;font-weight:600;">Kit registration number</span>
      <input name="kitRegistrationNumber" value="${v(f.kitRegistrationNumber)}" autocomplete="off" placeholder="KIT-XXXXX"
        style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
      ${renderError(state.errors?.kitRegistrationNumber)}
    </label>

    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:4px;">
      <button type="submit"
        style="min-height:44px;padding:0 24px;border:none;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">
        Register kit
      </button>
      <button type="reset"
        style="min-height:44px;padding:0 24px;border-radius:999px;border:1px solid rgba(15,23,42,0.2);background:transparent;color:#111827;font-size:15px;font-weight:600;cursor:pointer;">
        Reset
      </button>
    </div>

  </form>
</div>
`;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

async function renderRegistrationResponse(
  request: Request,
  state: RegistrationPageState,
) {
  try {
    const { liquid } = await authenticate.public.appProxy(request);
    return await renderRegistrationWithLiquid(request, liquid, state);
  } catch (error) {
    console.error("[proxy.undr.register] app proxy auth/liquid failed:", error);
    return new Response(renderPage(state), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}

async function renderRegistrationWithLiquid(
  request: Request,
  liquid: Awaited<ReturnType<typeof authenticate.public.appProxy>>["liquid"],
  state: RegistrationPageState,
) {
  const embed = isEmbedMode(new URL(request.url));
  try {
    return await liquid(renderPage(state), { layout: !embed });
  } catch (error) {
    console.error("[proxy.undr.register] liquid render failed:", error);
    return new Response(renderPage(state), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Shopify injects `logged_in_customer_id` when a customer is logged in.
  const customerId = getLoggedInCustomerId(url);

  if (!customerId) {
    return Response.redirect(buildLoginRedirect(url), 302);
  }

  const customerEmail = url.searchParams.get("customer_email")?.trim() || "";

  return renderRegistrationResponse(request, {
      loggedInCustomerId: customerId,
      form: { ...getRegistrationDefaults(), email: customerEmail },
    });
}

// ─── Action ───────────────────────────────────────────────────────────────────

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);

  const { liquid, admin, session } =
    await authenticate.public.appProxy(request);

  const customerId = getLoggedInCustomerId(url);
  if (!customerId) {
    return Response.redirect(buildLoginRedirect(url), 302);
  }

  // ── Parse form ────────────────────────────────────────────────────────────
  const formData = await request.formData();
  const form: RegistrationFormState = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    orderNumber: String(formData.get("orderNumber") || ""),
    kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
  };

  // ── Validate ──────────────────────────────────────────────────────────────
  const errors = validateRegistration(form);
  if (errors) {
    return renderRegistrationWithLiquid(request, liquid, {
      errors,
      form,
      loggedInCustomerId: customerId,
    });
  }

  // ── Check kit not already registered ─────────────────────────────────────
  const existing = await getRegistrationByKitRegistrationNumber(
    form.kitRegistrationNumber,
  );
  if (existing) {
    return renderRegistrationWithLiquid(request, liquid, {
        errors: {
          kitRegistrationNumber:
            "This kit registration number has already been used.",
        },
        form,
        loggedInCustomerId: customerId,
      });
  }

  // ── Optional: verify order belongs to customer via Admin API ──────────────
  let shopifyOrderId: string | null = null;
  let shopifyCustomerId: string | null = normalizeCustomerId(customerId);

  if (admin) {
    try {
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
        errors?: Array<{ message?: string }>;
      };

      const order = json.data?.orders?.nodes?.[0];

      if (!order) {
        return renderRegistrationWithLiquid(request, liquid, {
            errors: {
              orderNumber:
                "We could not find that order number. Please check and try again.",
            },
            form,
            loggedInCustomerId: customerId,
          });
      }

      const orderCustomerId = normalizeCustomerId(order.customer?.id);
      const normalizedLoggedIn = normalizeCustomerId(customerId);

      if (!orderCustomerId || orderCustomerId !== normalizedLoggedIn) {
        return renderRegistrationWithLiquid(request, liquid, {
            errors: {
              orderNumber: "That order does not belong to your account.",
            },
            form,
            loggedInCustomerId: customerId,
          });
      }

      shopifyOrderId = order.id;
      shopifyCustomerId = orderCustomerId;
    } catch (err) {
      console.error("[proxy.undr.register] Order lookup failed:", err);
      // Non-fatal — continue with registration without order verification
    }
  }

  // ── Save to DB ────────────────────────────────────────────────────────────
  try {
    const shop =
      session?.shop ||
      url.searchParams.get("shop")?.trim() ||
      "";

    await saveRegistration({
      shop,
      name: form.name,
      email: form.email,
      phone: form.phone,
      orderNumber: form.orderNumber,
      kitRegistrationNumber: form.kitRegistrationNumber,
      shopifyOrderId,
      shopifyCustomerId,
    });
  } catch (err) {
    console.error("[proxy.undr.register] DB save failed:", err);
    return renderRegistrationWithLiquid(request, liquid, {
        form,
        loggedInCustomerId: customerId,
        pageError:
          "We could not save your registration right now. Please try again in a moment.",
      });
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return renderRegistrationWithLiquid(request, liquid, {
      form: getRegistrationDefaults(),
      loggedInCustomerId: customerId,
      success: true,
      successMessage:
        "Your kit has been successfully registered. You will receive an email when your report is ready.",
    });
}

// ─── Default export ───────────────────────────────────────────────────────────

export default function ProxyRegisterRoute() {
  return null;
}
