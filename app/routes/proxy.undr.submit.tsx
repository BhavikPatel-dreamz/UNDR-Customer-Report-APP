import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
	getRegistrationByKitRegistrationNumber,
	getRegistrationDefaults,
	saveRegistration,
	validateRegistration,
	type RegistrationFormErrors,
	type RegistrationFormState,
} from "../models/registration.server";
import { authenticate } from "../shopify.server";

type LoaderData = {
	form: RegistrationFormState;
};

type ActionData = {
	ok: boolean;
	message?: string;
	errors?: RegistrationFormErrors;
	form: RegistrationFormState;
};

function getLoggedInCustomerId(url: URL): string | null {
	return (
		url.searchParams.get("logged_in_customer_id")?.trim() ||
		url.searchParams.get("customer_id")?.trim() ||
		null
	);
}

function normalizeCustomerId(value?: string | null): string | null {
	if (!value) return null;
	const match = value.match(/(\d+)$/);
	return match?.[1] ?? null;
}

function buildLoginRedirect(url: URL): string {
	const shop = url.searchParams.get("shop")?.trim();
	if (!shop) return "https://accounts.shopify.com/store-login";

	const pathPrefix = url.searchParams.get("path_prefix")?.trim() || "/apps/report";
	const returnPath = `${pathPrefix.replace(/\/$/, "")}/submit`;
	return `https://${shop}/account/login?return_url=${encodeURIComponent(returnPath)}`;
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
	return `<p style="color:#b42318;margin:4px 0 0;font-size:13px;">${escapeHtml(message)}</p>`;
}

function renderRegistrationPage(state: ActionData | LoaderData) {
	const form = state.form;
	const errors = "errors" in state ? state.errors : undefined;
	const message = "message" in state ? state.message : undefined;
	const ok = "ok" in state ? state.ok : false;

	return `
<div style="max-width:760px;margin:0 auto;padding:48px 20px 72px;color:#111827;font-family:system-ui,sans-serif;">
	<div style="margin-bottom:28px;">
		<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.6;">UNDR</p>
		<h1 style="margin:0 0 10px;font-size:clamp(26px,5vw,42px);font-weight:700;line-height:1.1;">Register your test kit</h1>
		<p style="margin:0;font-size:16px;line-height:1.7;opacity:0.8;">Enter your details below to register your kit.</p>
	</div>

	${
		message
			? `<div style="margin-bottom:20px;padding:14px 18px;border-radius:10px;background:${ok ? "#ecfdf3" : "#fef2f2"};color:${ok ? "#027a48" : "#b42318"};border:1px solid ${ok ? "#a7f3d0" : "#fecaca"};font-size:14px;">${escapeHtml(message)}</div>`
			: ""
	}

	<form method="post" style="display:grid;gap:16px;max-width:600px;padding:28px;border:1px solid rgba(15,23,42,0.12);border-radius:20px;background:#fffdf8;">
		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Name</span>
			<input name="name" value="${escapeHtml(form.name)}" autocomplete="name" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.name)}
		</label>

		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Email</span>
			<input name="email" type="email" value="${escapeHtml(form.email)}" autocomplete="email" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.email)}
		</label>

		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Phone</span>
			<input name="phone" type="tel" value="${escapeHtml(form.phone)}" autocomplete="tel" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.phone)}
		</label>

		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Order Number</span>
			<input name="orderNumber" value="${escapeHtml(form.orderNumber)}" autocomplete="off" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.orderNumber)}
		</label>

		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Kit Registration Number</span>
			<input name="kitRegistrationNumber" value="${escapeHtml(form.kitRegistrationNumber)}" autocomplete="off" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.kitRegistrationNumber)}
		</label>

		<button type="submit" style="min-height:44px;padding:0 24px;border:none;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">Register Kit</button>
	</form>
</div>
`;
}

function isEmbedMode(url: URL) {
	const embed = url.searchParams.get("embed")?.trim().toLowerCase();
	return embed === "1" || embed === "true";
}

function shouldBypassOrderValidation(url: URL) {
	void url;
	const isDev = process.env.NODE_ENV !== "production";
	return isDev;
}

async function proxyPageResponse(
	request: Request,
	liquid: (content: string, options?: { layout?: boolean }) => Response | Promise<Response>,
	state: ActionData | LoaderData,
) {
	const embed = isEmbedMode(new URL(request.url));
	return liquid(renderRegistrationPage(state), { layout: !embed });
}

export async function loader({ request }: LoaderFunctionArgs) {
	const { liquid } = await authenticate.public.appProxy(request);

	const url = new URL(request.url);
	const customerId = getLoggedInCustomerId(url);
	if (!customerId) {
		return Response.redirect(buildLoginRedirect(url), 302);
	}

	const data: LoaderData = {
		form: getRegistrationDefaults(),
	};

	return proxyPageResponse(request, liquid, data);
}

export async function action({ request }: ActionFunctionArgs) {
	const url = new URL(request.url);
	const { admin, session, liquid } = await authenticate.public.appProxy(request);

	const customerId = getLoggedInCustomerId(url);
	if (!customerId) {
		return Response.redirect(buildLoginRedirect(url), 302);
	}

	const formData = await request.formData();
	const form: RegistrationFormState = {
		name: String(formData.get("name") || ""),
		email: String(formData.get("email") || ""),
		phone: String(formData.get("phone") || ""),
		orderNumber: String(formData.get("orderNumber") || ""),
		kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
	};

	const validationErrors = validateRegistration(form);
	if (validationErrors) {
		const data: ActionData = {
			ok: false,
			message: "Please fill all required fields.",
			errors: validationErrors,
			form,
		};
		return proxyPageResponse(request, liquid, data);
	}

	const existing = await getRegistrationByKitRegistrationNumber(
		form.kitRegistrationNumber,
	);
	if (existing) {
		const data: ActionData = {
			ok: false,
			message: "Kit registration number is already used.",
			errors: {
				kitRegistrationNumber: "This kit registration number has already been used.",
			},
			form,
		};
		return proxyPageResponse(request, liquid, data);
	}

	let shopifyOrderId: string | null = null;
	let shopifyCustomerId: string | null = normalizeCustomerId(customerId);
	const bypassOrderValidation = shouldBypassOrderValidation(url);

	if (bypassOrderValidation) {
		shopifyOrderId = form.orderNumber.trim();
		shopifyCustomerId = normalizeCustomerId(customerId) ?? customerId;
	} else {
		if (!admin) {
			const data: ActionData = {
				ok: false,
				message: "Could not validate order right now. Please try again.",
				errors: {
					orderNumber: "Order validation is temporarily unavailable.",
				},
				form,
			};
			return proxyPageResponse(request, liquid, data);
		}

		try {
			const rawOrderNumber = form.orderNumber.trim();
			const normalizedInput = rawOrderNumber.replace(/^#/, "").trim();
			const orderNameCandidates = Array.from(
				new Set([
					rawOrderNumber,
					rawOrderNumber.startsWith("#") ? rawOrderNumber.slice(1) : `#${rawOrderNumber}`,
				]),
			);
			const orderQueryCandidates = Array.from(
				new Set(
					orderNameCandidates.flatMap((candidate) => [
						`name:${candidate}`,
						`name:"${candidate}"`,
					]),
				),
			);

			let order:
				| {
						id: string;
						name: string;
						customer?: { id: string } | null;
					}
				| undefined;

			for (const orderQuery of orderQueryCandidates) {
				const resp = await admin.graphql(
					`#graphql
						query getOrderByName($query: String!) {
							orders(first: 10, query: $query) {
								nodes {
									id
									name
									customer { id }
								}
							}
						}
					`,
					{ variables: { query: orderQuery } },
				);

				const json = (await resp.json()) as {
					errors?: Array<{ message?: string }>;
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

				if (json.errors?.length) {
					console.error("[proxy.undr.submit] Shopify order query errors", {
						orderQuery,
						errors: json.errors,
					});
					continue;
				}

				const nodes = json.data?.orders?.nodes ?? [];
				const exactMatch = nodes.find((node) => {
					const normalizedNodeName = node.name.replace(/^#/, "").trim();
					return normalizedNodeName === normalizedInput;
				});

				if (exactMatch) {
					order = exactMatch;
					break;
				}
			}

			if (!order) {
				const data: ActionData = {
					ok: false,
					message: "Order number could not be found.",
					errors: {
						orderNumber: "We could not find that order number. Please check and try again.",
					},
					form,
				};
				return proxyPageResponse(request, liquid, data);
			}

			const normalizedOrderCustomerId = normalizeCustomerId(order.customer?.id);
			const normalizedLoggedInCustomerId = normalizeCustomerId(customerId);

			if (
				!normalizedOrderCustomerId ||
				normalizedOrderCustomerId !== normalizedLoggedInCustomerId
			) {
				const data: ActionData = {
					ok: false,
					message: "Order does not belong to this customer.",
					errors: {
						orderNumber: "That order does not belong to your account.",
					},
					form,
				};
				return proxyPageResponse(request, liquid, data);
			}

			shopifyOrderId = order.id;
			shopifyCustomerId = normalizedOrderCustomerId;
		} catch (error) {
			console.error("[proxy.undr.submit] Shopify order validation failed", error);
			const data: ActionData = {
				ok: false,
				message: "Could not validate order right now. Please try again.",
				errors: {
					orderNumber: "Order validation failed. Please try again.",
				},
				form,
			};
			return proxyPageResponse(request, liquid, data);
		}
	}

	try {
		const shop = session?.shop || url.searchParams.get("shop")?.trim() || "";

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
	} catch (error) {
		console.error("[proxy.undr.submit] Save registration failed", error);
		const data: ActionData = {
			ok: false,
			message: "Could not save registration right now. Please try again.",
			form,
		};
		return proxyPageResponse(request, liquid, data);
	}

	const data: ActionData = {
		ok: true,
		message: "Your kit has been successfully registered.",
		form: getRegistrationDefaults(),
	};
	return proxyPageResponse(request, liquid, data);
}

// Intentionally no default component export.
// This route acts as a proxy/resource endpoint and returns HTML from loader/action.
