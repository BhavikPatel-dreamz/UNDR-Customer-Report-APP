/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
	getRegistrationByKitRegistrationNumber,
	getRegistrationDefaults,
	saveRegistration,
	validateRegistration,
	type RegistrationFormErrors,
	type RegistrationFormState,
} from "../models/registration.server";
import { updateRegistrationFieldsById } from "../models/registration.server";
import { setReportStatusByRegistrationId } from "../models/report.server";
import { authenticate } from "../shopify.server";

type LoaderData = {
	form: RegistrationFormState;
};

type ActionData = {
	ok: boolean;
	message?: string;
	errors?: RegistrationFormErrors;
	form: RegistrationFormState;
	requireV2?: boolean;
};

const RECAPTCHA_ACTION = "submit_kit_registration";
const RECAPTCHA_MIN_SCORE_DEFAULT = 0.5;

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

function getRecaptchaSiteKey() {
	return (
		process.env.RECAPTCHA_V3_SITE_KEY?.trim() ||
		process.env.RECAPTCHA_SITE_KEY?.trim() ||
		""
	);
}

function getRecaptchaSecretKey() {
	return (
		process.env.RECAPTCHA_V3_SECRET_KEY?.trim() ||
		process.env.RECAPTCHA_SECRET_KEY?.trim() ||
		""
	);
}

function getRecaptchaMinScore() {
	const configured = Number(process.env.RECAPTCHA_V3_MIN_SCORE);
	if (Number.isFinite(configured) && configured >= 0 && configured <= 1) {
		return configured;
	}
	return RECAPTCHA_MIN_SCORE_DEFAULT;
}

function getRecaptchaV2SiteKey() {
	return process.env.RECAPTCHA_V2_SITE_KEY?.trim() || "";
}

function getRecaptchaV2SecretKey() {
	return process.env.RECAPTCHA_V2_SECRET_KEY?.trim() || "";
}

function escapeJsString(value: string) {
	return value
		.replaceAll("\\", "\\\\")
		.replaceAll("'", "\\'")
		.replaceAll("\n", "\\n")
		.replaceAll("\r", "\\r");
}

export async function verifyRecaptchaV2Token(params: {
	token: string;
	remoteIp?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
	const secret = getRecaptchaV2SecretKey();
	if (!secret) {
		return {
			ok: false,
			message: "Security check is not configured. Please contact support.",
		};
	}

	if (!params.token.trim()) {
		return { ok: false, message: "Please complete the security check." };
	}

	try {
		const body = new URLSearchParams();
		body.set("secret", secret);
		body.set("response", params.token);
		if (params.remoteIp) body.set("remoteip", params.remoteIp);

		const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: body.toString(),
		});

		if (!response.ok) {
			return {
				ok: false,
				message: "Could not verify security check right now. Please try again.",
			};
		}

		const result = (await response.json()) as {
			success?: boolean;
			["error-codes"]?: string[];
		};

		if (!result.success) {
			return { ok: false, message: "Security check failed. Please try again." };
		}

		return { ok: true };
	} catch (error) {
		
		return {
			ok: false,
			message: "Could not verify security check right now. Please try again.",
		};
	}
}

export async function verifyRecaptchaToken(params: {
	token: string;
	remoteIp?: string;
}): Promise<{ ok: true } | { ok: false; requireV2?: boolean; message: string }> {
	const secret = getRecaptchaSecretKey();
	if (!secret) {
		if (process.env.NODE_ENV !== "production") {
			return { ok: true };
		}
		return {
			ok: false,
			message:
				"Spam protection is not configured yet. Please contact support.",
		};
	}

	if (!params.token.trim()) {
		return {
			ok: false,
			message: "Please complete the reCAPTCHA check and try again.",
		};
	}

	try {
		const body = new URLSearchParams();
		body.set("secret", secret);
		body.set("response", params.token);
		if (params.remoteIp) {
			body.set("remoteip", params.remoteIp);
		}

		const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		if (!response.ok) {
			return {
				ok: false,
				message: "Could not verify reCAPTCHA right now. Please try again.",
			};
		}

		const result = (await response.json()) as {
			success?: boolean;
			score?: number;
			action?: string;
			["error-codes"]?: string[];
		};

		if (!result.success) {
			return {
				ok: false,
				message: "reCAPTCHA verification failed. Please try again.",
			};
		}

		if (result.action && result.action !== RECAPTCHA_ACTION) {
			return {
				ok: false,
				message: "Security check failed. Please refresh and submit again.",
			};
		}

		if (
			typeof result.score === "number" &&
			result.score < getRecaptchaMinScore()
		) {
			if (getRecaptchaV2SecretKey()) {
				return {
					ok: false,
					requireV2: true,
					message: "Please complete the security check below to continue.",
				};
			}
			return {
				ok: false,
				message: "Submission looked suspicious. Please try again.",
			};
		}

		return { ok: true };
	} catch (error) {
		
		return {
			ok: false,
			message: "Could not verify reCAPTCHA right now. Please try again.",
		};
	}
}

async function findCustomerIdByEmail(params: {
	admin: Awaited<ReturnType<typeof authenticate.public.appProxy>>["admin"];
	email: string;
}): Promise<string | null> {
	const { admin, email } = params;
	if (!admin || !email.trim()) return null;

	try {
		const response = await admin.graphql(
			`#graphql
				query getCustomerByEmail($query: String!) {
					customers(first: 5, query: $query) {
						nodes {
							id
							defaultEmailAddress {
								emailAddress
							}
						}
					}
				}
			`,
			{ variables: { query: `email:${email.trim()}` } },
		);

		const json = (await response.json()) as {
			errors?: Array<{ message?: string }>;
			data?: {
				customers?: {
					nodes?: Array<{
						id: string;
						defaultEmailAddress?: { emailAddress?: string | null } | null;
					}>;
				};
			};
		};

		if (json.errors?.length) {
		
			return null;
		}

		const nodes = json.data?.customers?.nodes ?? [];
		const match = nodes.find((node) =>
			(node.defaultEmailAddress?.emailAddress || "").trim().toLowerCase() ===
			email.trim().toLowerCase(),
		);

		return normalizeCustomerId(match?.id ?? null);
	} catch (error) {
		console.error("[proxy.undr.submit] Shopify customer lookup failed", {
			error,
			email,
		});
		return null;
	}
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
	const requireV2 = "requireV2" in state ? Boolean(state.requireV2) : false;
	const recaptchaSiteKey = getRecaptchaSiteKey();
	const recaptchaV2SiteKey = getRecaptchaV2SiteKey();
	const recaptchaSiteKeyHtml = escapeHtml(recaptchaSiteKey);
	const recaptchaV2SiteKeyHtml = escapeHtml(recaptchaV2SiteKey);
	const recaptchaSiteKeyJs = escapeJsString(recaptchaSiteKey);
	const recaptchaActionJs = escapeJsString(RECAPTCHA_ACTION);

	// Use the shop domain dynamically for policy links when available,
	// otherwise fall back to undrco.com
	const shopHost = String(form.shopDomain || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
	const storeBase = shopHost ? `https://${shopHost}` : "https://undrco.com";

	let recaptchaScript = "";
	if (requireV2 && recaptchaV2SiteKey) {
		// v2 checkbox widget — api.js auto-renders divs with class g-recaptcha
		recaptchaScript = `<script src="https://www.google.com/recaptcha/api.js" async defer></script>`;
	} else if (recaptchaSiteKey) {
		recaptchaScript = `<script src="https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKeyHtml}"></script>
<script>
(function () {
	var form = document.getElementById("undr-registration-form");
	if (!form || typeof window.grecaptcha === "undefined") {
		return;
	}

	form.addEventListener("submit", function (event) {
		var tokenInput = form.querySelector('input[name="recaptchaToken"]');
		if (!tokenInput || tokenInput.value) {
			return;
		}

		event.preventDefault();
		window.grecaptcha.ready(function () {
			window.grecaptcha
				.execute('${recaptchaSiteKeyJs}', { action: '${recaptchaActionJs}' })
				.then(function (token) {
					tokenInput.value = token;
					form.submit();
				});
		});
	});
})();
</script>`;
	}

	let instructionsLinkHtml = "";
	let redirectScript = "";
	if (ok) {
		const firstName = String(form.name || "").split(" ")[0] || "";
		const encoded = encodeURIComponent(firstName);
		const target = `/apps/undr/instructions?showPopup=1&name=${encoded}`;
		instructionsLinkHtml = `<div style="margin-bottom:8px;font-size:14px;"><a href="${escapeHtml(target)}" style="color:#065f46;font-weight:600;text-decoration:none;">See sampling instructions now</a></div>`;
		redirectScript = `<script>(function(){try{setTimeout(function(){window.location.href='${escapeJsString(target)}';},5000);}catch(e){console.error(e);}})();</script>`;
	}

	return `
	<div style="max-width:760px;margin:0 auto;padding:48px 20px 72px;color:#111827;">
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

	<form id="undr-registration-form" method="post" style="display:grid;gap:16px;max-width:600px;padding:28px;border:1px solid rgba(15,23,42,0.12);border-radius:20px;background:#fffdf8;">
		<input type="hidden" name="recaptchaToken" value="" />
		${requireV2 ? `<input type="hidden" name="requireV2" value="1" />` : ""}
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

		<label style="display:flex;align-items:center;gap:10px;">
			<input type="checkbox" name="smsConsent" value="1" checked />
			<span style="font-size:13px;line-height:1.2;">I agree to receive SMS messages (Shopify messaging standard).</span>
		</label>



		<label style="display:grid;gap:5px;">
			<span style="font-size:14px;font-weight:600;">Kit Registration Number</span>
			<input name="kitRegistrationNumber" value="${escapeHtml(form.kitRegistrationNumber)}" autocomplete="off" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
			${renderError(errors?.kitRegistrationNumber)}
		</label>

		<label style="display:flex;align-items:center;gap:10px;">
			<input type="checkbox" name="agreeTerms" value="1" ${form.agreedToTerms ? 'checked' : ''} />
			<span style="font-size:13px;line-height:1.2;">I agree to the <a href="${escapeHtml(storeBase)}/pages/terms-of-service" style="color:#065f46;text-decoration:underline;">Terms of Service</a>, <a href="${escapeHtml(storeBase)}/pages/terms-of-use" style="color:#065f46;text-decoration:underline;">Terms of Use</a>, and the <a href="${escapeHtml(storeBase)}/pages/master-disclaimer-and-limitation-of-liability" style="color:#065f46;text-decoration:underline;">Disclaimer</a>.</span>
		</label>

		${requireV2 && recaptchaV2SiteKey ? `<div class="g-recaptcha" data-sitekey="${recaptchaV2SiteKeyHtml}" style="margin-top:4px;"></div>` : ""}
		<button type="submit" style="min-height:44px;padding:0 24px;border:none;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">Register Kit</button>
	</form>
	${recaptchaScript}
	${instructionsLinkHtml}
	${redirectScript}
</div>
`;
}


function isEmbedMode(url: URL) {
	const embed = url.searchParams.get("embed")?.trim().toLowerCase();
	return embed === "1" || embed === "true";
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
	const { liquid, session } = await authenticate.public.appProxy(request);

	const url = new URL(request.url);
	const defaults = getRegistrationDefaults();
	// Prefill from query params if provided (kit, name, email, phone)
	defaults.kitRegistrationNumber = String(url.searchParams.get('kit') || url.searchParams.get('kitRegistrationNumber') || '');
	defaults.name = String(url.searchParams.get('name') || '');
	defaults.email = String(url.searchParams.get('email') || '');
	defaults.phone = String(url.searchParams.get('phone') || '');
	defaults.shopDomain = session?.shop || String(url.searchParams.get('shop') || '');

	const data: LoaderData = { form: defaults };

	return proxyPageResponse(request, liquid, data);
}

export async function action({ request }: ActionFunctionArgs) {
	const url = new URL(request.url);
	const { admin, session, liquid } = await authenticate.public.appProxy(request);

	const formData = await request.formData();
	const form: RegistrationFormState = {
		name: String(formData.get("name") || ""),
		email: String(formData.get("email") || ""),
		phone: String(formData.get("phone") || ""),
		orderNumber: String(formData.get("orderNumber") || ""),
		kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
		agreedToTerms: Boolean(String(formData.get("agreeTerms") || "") === "1" || String(formData.get("agreeTerms") || "") === "on"),
	};
	// reCAPTCHA check disabled for now; submit continues directly to validation/save.
	// const requireV2 = formData.get("requireV2") === "1";
	// const recaptchaToken = String(formData.get("recaptchaToken") || "");
	// const recaptchaV2Token = String(formData.get("g-recaptcha-response") || "");
	// const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	// const captchaResult = requireV2
	// 	? await verifyRecaptchaV2Token({ token: recaptchaV2Token, remoteIp })
	// 	: await verifyRecaptchaToken({ token: recaptchaToken, remoteIp });
	// if (!captchaResult.ok) {
	// 	const data: ActionData = {
	// 		ok: false,
	// 		message: captchaResult.message,
	// 		requireV2: requireV2 || ("requireV2" in captchaResult ? Boolean(captchaResult.requireV2) : false),
	// 		form,
	// 	};
	// 	return proxyPageResponse(request, liquid, data);
	// }

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

	const existing = await getRegistrationByKitRegistrationNumber(form.kitRegistrationNumber);
	const shop = session?.shop || url.searchParams.get("shop")?.trim() || "";
	if (existing) {
		// Update existing registration with latest submitter info and mark as submitted
		try {
			const updateData: any = {
				name: form.name,
				email: form.email,
				phone: form.phone,
				shopifyCustomerId: normalizeCustomerId(getLoggedInCustomerId(url)) || undefined,
				shop,
			};
			// Only overwrite orderNumber if the submitter provided a non-empty value
			if (String(form.orderNumber || '').trim()) {
				updateData.orderNumber = form.orderNumber;
			}

			// Persist that the user agreed to terms if they checked the box
			if (form.agreedToTerms) {
				updateData.agreedToTerms = true;
			}

			await updateRegistrationFieldsById(existing.id, updateData);

			try {
				await setReportStatusByRegistrationId(existing.id, "register_submitted");
			} catch (err) {
				console.error("[proxy.undr.submit] could not set report status for existing registration", err);
			}

			const data: ActionData = {
				ok: true,
				message: `Thanks, ${String(form.name || '').split(' ')[0] || 'there'}! Your kit has been successfully registered. Let\u2019s get digging! Click here to see a quick sampling instruction video or stay on this page to be automatically redirected.`,
				form: Object.assign(getRegistrationDefaults(), { shopDomain: shop }),
			};
			return proxyPageResponse(request, liquid, data);
		} catch (err) {
			console.error("[proxy.undr.submit] could not update existing registration", err);
			const data: ActionData = {
				ok: false,
				message: "Could not update the existing registration. Please try again.",
				form,
			};
			return proxyPageResponse(request, liquid, data);
		}
	}

	const rawLoggedInCustomerId = getLoggedInCustomerId(url);
	let shopifyCustomerId: string | null = normalizeCustomerId(
		rawLoggedInCustomerId,
	);

	if (!shopifyCustomerId) {
		shopifyCustomerId = await findCustomerIdByEmail({
			admin,
			email: form.email,
		});
	}

	// For security and consistency: only allow submitting a registration for
	// a kit number that already exists in the system. Do not create new
	// registrations for arbitrary kit numbers via the public form.
	if (!existing) {
		const data: ActionData = {
			ok: false,
			message: "Kit number not recognized. Please check your kit number or contact support.",
			form,
		};
		return proxyPageResponse(request, liquid, data);
	}

	try {
		const shop = session?.shop || url.searchParams.get("shop")?.trim() || "";

		const saved = await saveRegistration({
			shop,
			name: form.name,
			email: form.email,
			phone: form.phone,
			orderNumber: form.orderNumber,
			kitRegistrationNumber: form.kitRegistrationNumber,
			agreedToTerms: Boolean(form.agreedToTerms),
			shopifyOrderId: null,
			shopifyCustomerId,
		});

		// Mark registration as submitted so UI shows `register_submitted` status
		try {
			await setReportStatusByRegistrationId(saved.id, "register_submitted");
		} catch (err) {
			// Non-fatal: proceed even if status update fails
			console.error("[proxy.undr.submit] could not set report status", err);
		}
	} catch (error) {
		const data: ActionData = {
			ok: false,
			message: "Could not save registration right now. Please try again.",
			form,
		};
		return proxyPageResponse(request, liquid, data);
	}

	const data: ActionData = {
		ok: true,
		message: `Thanks, ${String(form.name || '').split(' ')[0] || 'there'}! Your kit has been successfully registered. Let\u2019s get digging! Click here to see a quick sampling instruction video or stay on this page to be automatically redirected.`,
		form: Object.assign(getRegistrationDefaults(), { shopDomain: session?.shop || url.searchParams.get('shop')?.trim() || '' }),
	};
	return proxyPageResponse(request, liquid, data);
}

// Intentionally no default component export.
// This route acts as a proxy/resource endpoint and returns HTML from loader/action.
