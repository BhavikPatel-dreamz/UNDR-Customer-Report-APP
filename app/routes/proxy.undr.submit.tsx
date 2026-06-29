/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
	getRegistrationDefaults,
	getRegistrationByKitNumberWithReport, 
	saveRegistration,
	validateRegistration,
	validateRegistrationStep2,
	type RegistrationFormErrors,
	type RegistrationFormState,
} from "../models/registration.server";
import { updateRegistrationFieldsById } from "../models/registration.server";
import { setReportStatusByRegistrationId } from "../models/report.server";
import { authenticate } from "../shopify.server";

type LoaderData = {
	form: RegistrationFormState;
	showStep2?: boolean;
	reportAlreadyGenerated?: boolean;
};

type ActionData = {
	ok: boolean;
	message?: string;
	errors?: RegistrationFormErrors;
	form: RegistrationFormState;
	requireV2?: boolean;
	showStep2?: boolean;
	reportAlreadyGenerated?: boolean;
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

function renderStep2Section(form: RegistrationFormState, errors?: RegistrationFormErrors) {
	const escapeHtml = (value: string) => String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

	const depthOptions = ['surface', '3 inches', '6 inches', '9 inches', '1 foot', '2+feet'];
	const propertyOptions = ['residential', 'undeveloped', 'urban', 'industrial'];
	const landUseOptions = ['garden', 'farm', 'lawn', 'forest', 'pasture', 'idle', 'unknown'];
	const reasonOptions = ['curiosity', 'potential financial gain', 'health and safety concerns', 'environmental concerns', 'just for fun', 'other'];

	return `
	<div style="display: grid; gap: 16px; max-width: 600px; padding: 28px; border: 1px solid rgba(15, 23, 42, 0.12);
	border-radius: 20px; background: #fffdf8;">
		<h2 style="font-family: 'Anonymous Pro', monospace; font-weight:700; font-size:18px; line-height: 26px; color: #111827; margin:0; text-align:center; letter-spacing: 0.06rem;">Additional details</h2>
		<form method="post" style="display:grid; gap:16px;">
			<input type="hidden" name="step" value="2" />
			<input type="hidden" name="final" value="1" />
			<!-- Carry Step 1 values so final submission includes required fields -->
			<input type="hidden" name="name" value="${escapeHtml(String((form as any).name || ''))}" />
			<input type="hidden" name="email" value="${escapeHtml(String((form as any).email || ''))}" />
			<input type="hidden" name="phone" value="${escapeHtml(String((form as any).phone || ''))}" />
			<input type="hidden" name="orderNumber" value="${escapeHtml(String((form as any).orderNumber || ''))}" />
			<input type="hidden" name="kitRegistrationNumber" value="${escapeHtml(String((form as any).kitRegistrationNumber || ''))}" />
			<input type="hidden" name="agreeTerms" value="${(form as any).agreedToTerms ? '1' : ''}" />
			<input type="hidden" name="smsConsent" value="${(form as any).smsConsent ? '1' : ''}" />
			<input type="hidden" name="final" value="1" />

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Full address (street, city, state, ZIP) <span style="color:#b42318;">*</span></span>
				<input name="address" value="${escapeHtml(String((form as any).address || ''))}" placeholder="Example: 123 Main St, Springfield, IL 62704"
				style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%;" />
				${errors?.address ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.address)}</div>` : ''}
			</label>

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Depth of sample <span style="color:#b42318;">*</span></span>
				<select name="depth" style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%; background: #FFFFFF; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 35px;
				background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem; ">
					<option value="">Select depth</option>
					${depthOptions.map(o => `<option value="${escapeHtml(o)}" ${(String((form as any).depth || '') === o ? 'selected' : '')}>${escapeHtml(o)}</option>`).join('')}
				</select>
				${errors?.depth ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.depth)}</div>` : ''}
			</label>

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Property type <span style="color:#b42318;">*</span></span>
				<select name="propertyType" style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%; background: #FFFFFF; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 35px;
				background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem; ">
					<option value="">Select property type</option>
					${propertyOptions.map(o => `<option value="${escapeHtml(o)}" ${(String((form as any).propertyType || '') === o ? 'selected' : '')}>${escapeHtml(o)}</option>`).join('')}
				</select>
				${errors?.propertyType ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.propertyType)}</div>` : ''}
			</label>

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Land use <span style="color:#b42318;">*</span></span>
				<select name="landUse" style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%; background: #FFFFFF; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 35px;
				background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem; ">
					<option value="">Select land use</option>
					${landUseOptions.map(o => `<option value="${escapeHtml(o)}" ${(String((form as any).landUse || '') === o ? 'selected' : '')}>${escapeHtml(o)}</option>`).join('')}
				</select>
				${errors?.landUse ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.landUse)}</div>` : ''}
			</label>

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Approx. Acreage of property <span style="color:#b42318;">*</span></span>
				<input name="acreage" type="number" step="0.01" value="${escapeHtml(String((form as any).acreage || ''))}" style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%;" />
				${errors?.acreage ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.acreage)}</div>` : ''}
			</label>

			<label style="display:grid; gap:5px;">
				<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Reason for testing <span style="color:#b42318;">*</span></span>
				<select name="reason" id="reason-select" style="min-height: 44px; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(15, 23, 42, 0.2); font-size: 15px; box-sizing: border-box; width: 100%; background: #FFFFFF; appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 35px;
				background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22black%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem; ">
					<option value="">Select reason</option>
					${reasonOptions.map(o => `<option value="${escapeHtml(o)}" ${(String((form as any).reason || '') === o ? 'selected' : '')}>${escapeHtml(o)}</option>`).join('')}
				</select>
				${errors?.reason ? `<div style="color:#b42318;font-size:13px;">${escapeHtml(errors.reason)}</div>` : ''}
			</label>

			<div id="reason-other" style="display:${String((form as any).reason || '') === 'other' ? 'block' : 'none'};">
				<label style="display:grid; gap:5px;">
					<span style="font-family: 'Anonymous Pro', monospace; font-weight: 600; font-size: 14px; line-height: 20px; color: #111827; letter-spacing: 0.06rem;">Other (please specify)</span>
					<input name="reasonOther" value="${escapeHtml(String((form as any).reasonOther || ''))}" style="min-height:40px;padding:8px;border:1px solid rgba(15,23,42,0.12);border-radius:8px;" />
				</label>
			</div>

			<div style="display:flex;gap:8px;align-items:center;flex-wrap: wrap;margin-top:6px;">
				<button type="submit" style="min-height:44px;padding:0 24px;border:none;border-radius:999px;background:#111827;;color:#fff;font-size:15px;font-weight:600;cursor:pointer;text-transform: capitalize;">Complete registration</button>
				<button type="button" id="back-to-step1" style="min-height:44px;padding:0 24px;border:1px solid rgba(15,23,42,0.12);border-radius:999px;background:#fff;color:#111827;font-size:15px;font-weight:600;cursor:pointer;text-transform: capitalize;">Back</button>
			</div>

		</form>
	</div>
	<script>
		(function(){
			var back = document.getElementById('back-to-step1');
			if (back) back.addEventListener('click', function(){ window.location.href = window.location.pathname; });
			var reason = document.getElementById('reason-select');
			var other = document.getElementById('reason-other');
			if (reason && other) {
				reason.addEventListener('change', function(e){
					try {
						var val = '';
						try {
							val = (e && e.target && typeof e.target.value !== 'undefined') ? String(e.target.value) : '';
						} catch (_err) {
							val = (reason.value || '');
						}
						if (val === 'other') other.style.display = 'block'; else other.style.display = 'none';
					} catch(e){}
				});
			}
		})();
	</script>
	`;
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
	const showStep2 = Boolean((state as any).showStep2);
	const reportAlreadyGenerated = Boolean((state as any).reportAlreadyGenerated);
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

	// Phone input mask (progressive enhancement) using IMask from CDN.
	const maskScript = `
<script src="https://unpkg.com/imask@6.4.2/dist/imask.min.js"></script>
<script>
  (function(){
	function initPhoneMask(){
	  try {
		var el = document.querySelector('input[name="phone"]');
		if (!el || typeof IMask === 'undefined') return;
		// Remove any visual placeholder so nothing appears before typing
		el.placeholder = '';
		// Initialize IMask with a fixed +1 prefix and a lazy mask so prefix is hidden until typing
		IMask(el, {
		  mask: '+1 (000) 000-0000',
		  lazy: true,
		});
	  } catch (e) {
		// Fail silently; formatting is progressive enhancement only
		console.error('Phone mask init error', e);
	  }
	}

	if (document.readyState === 'complete' || document.readyState === 'interactive'){
	  setTimeout(initPhoneMask, 0);
	} else {
	  document.addEventListener('DOMContentLoaded', initPhoneMask);
	}
  })();
</script>
`;

	let instructionsLinkHtml = "";
	let redirectScript = "";
	if (ok) {
		const firstName = String(form.name || "").split(" ")[0] || "";
		const encoded = encodeURIComponent(firstName);
		const target = `https://undrco.com/pages/sampling-instructions?showPopup=1&name=${encoded}`;
		instructionsLinkHtml = `<div style="margin-bottom:8px;font-size:14px;"><a href="${escapeHtml(target)}" style="color:#065f46;font-weight:600;text-decoration:none;">See sampling instructions now</a></div>`;
		redirectScript = `<script>(function(){try{setTimeout(function(){window.location.href='${escapeJsString(target)}';},5000);}catch(e){console.error(e);}})();</script>`;
	}

	return `
	<div style="max-width:760px;margin:0 auto;padding:48px 20px 72px;color:#111827;">
	<div style="margin-bottom:28px;">
		<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.6;">UNDR CO</p>
		<h1 style="margin:0 0 10px;font-size:clamp(26px,5vw,42px);font-weight:700;line-height:1.1;">Register your test kit</h1>
		<p style="margin:0;font-size:16px;line-height:1.7;opacity:0.8;">Enter your details below to register your kit.</p>
		<div id="undr-kit-message" style="min-height:18px;margin-top:8px;color:#ff0000;font-size:16px;font-weight:600;"></div>
	</div>

	${message
			? `<div style="margin-bottom:20px;padding:14px 18px;border-radius:10px;background:${ok ? "#ecfdf3" : "#fef2f2"};color:${ok ? "#027a48" : "#b42318"};border:1px solid ${ok ? "#a7f3d0" : "#fecaca"};font-size:14px;">${escapeHtml(message)}</div>`
			: ""
		}

	${!showStep2 ? (
			`<form id="undr-registration-form" method="post" style="display:grid;gap:16px;max-width:600px;padding:28px;border:1px solid rgba(15,23,42,0.12);border-radius:20px;background:#fffdf8;">
			<input type="hidden" name="recaptchaToken" value="" />
			${requireV2 ? `<input type="hidden" name="requireV2" value="1" />` : ""}
			<label style="display:grid;gap:5px;">
				<span style="font-size:14px;font-weight:600;">Name <span style="color:#b42318;">*</span></span>
				<input name="name" value="${escapeHtml(form.name)}" autocomplete="name" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
				${renderError(errors?.name)}
			</label>

			<label style="display:grid;gap:5px;">
				<span style="font-size:14px;font-weight:600;">Email <span style="color:#b42318;">*</span></span>
				<input name="email" type="email" value="${escapeHtml(form.email)}" autocomplete="email" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
				${renderError(errors?.email)}
			</label>

					<label style="display:grid;gap:5px;">
						<span style="font-size:14px;font-weight:600;">Phone <span style="color:#b42318;">*</span></span>
						<input name="phone" type="tel" value="${escapeHtml(form.phone)}" autocomplete="tel"
							required
							pattern="^\\+1\\s*\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}$"
							title="Please enter a full U.S. phone number, e.g. +1 (555) 555-5555"
							inputmode="tel"
							style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
						${renderError(errors?.phone)}
					</label>

			<label style="display:flex;align-items:center;gap:10px;">
				<input type="checkbox" name="smsConsent" style="min-width: 18px; min-height: 18px; accent-color: #000;"  value="1" ${form.smsConsent ? 'checked' : ''} />
				<span style="font-size:13px;line-height:1.2;">I agree to receive SMS messages (Shopify messaging standard).</span>
			</label>



			<label style="display:grid;gap:5px;">
				<span style="font-size:14px;font-weight:600;">Kit Registration Number</span>
				<input name="kitRegistrationNumber" value="${escapeHtml(form.kitRegistrationNumber)}" autocomplete="off" style="min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;width:100%;" />
				${renderError(errors?.kitRegistrationNumber)}
			</label>

			<label style="display:flex;align-items:center;gap:10px;">
				<input type="checkbox" name="agreeTerms" style="min-width: 18px; min-height: 18px; accent-color: #000;" value="1" ${form.agreedToTerms ? 'checked' : ''} />
				<span style="font-size:13px;line-height:1.2;">I agree to the <a href="${escapeHtml(storeBase)}/pages/terms-of-service" style="color:#065f46;text-decoration:underline;">Terms of Service</a>, <a href="${escapeHtml(storeBase)}/pages/terms-of-use" style="color:#065f46;text-decoration:underline;">Terms of Use</a>, and the <a href="${escapeHtml(storeBase)}/pages/master-disclaimer-and-limitation-of-liability" style="color:#065f46;text-decoration:underline;">Disclaimer</a>.</span>
			</label>

			${requireV2 && recaptchaV2SiteKey ? `<div class="g-recaptcha" data-sitekey="${recaptchaV2SiteKeyHtml}" style="margin-top:4px;"></div>` : ""}
			<button type="button" id="go-step-2" style="min-height:44px;padding:0 24px;border:none;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">Register Kit</button>
		</form>`
			+ recaptchaScript + maskScript + instructionsLinkHtml + redirectScript + `
		<script>
		(function(){
			var btn = document.getElementById('go-step-2');
			if (!btn) return;
			btn.addEventListener('click', async function(){
				try {
					var mainForm = document.getElementById('undr-registration-form');
					var params = new URLSearchParams(window.location.search || '');
					params.set('step','2');
					var fields = ['name','email','phone','orderNumber','kitRegistrationNumber','shop'];
					fields.forEach(function(f){
						try {
							var el = mainForm ? mainForm.querySelector('[name="'+f+'"]') : null;
							if (el && typeof el.value !== 'undefined' && String(el.value || '').trim() !== '') {
								params.set(f, String(el.value));
							}
						} catch(e){}
					});

					// Inline error helper
					function setInlineError(msg) {
						try {
							// Primary: show in the page-level message area under intro
							var pageMsg = document.getElementById('undr-kit-message');
							if (pageMsg) {
								pageMsg.textContent = msg || '';
								return;
							}
							// Fallback: show under the kit input
							var input = mainForm ? mainForm.querySelector('[name="kitRegistrationNumber"]') : null;
							if (!input) return;
							var container = input.parentNode;
							if (!container) return;
							var existing = container.querySelector('.client-kit-error');
							if (!existing) {
								existing = document.createElement('div');
								existing.className = 'client-kit-error';
								existing.style.color = '#b42318';
								existing.style.fontSize = '13px';
								existing.style.marginTop = '6px';
								container.appendChild(existing);
							}
							existing.textContent = msg || '';
						} catch(e){}
					}

					// Clear previous inline error
					setInlineError('');

					var nameEl = mainForm ? mainForm.querySelector('[name="name"]') : null;
					var emailEl = mainForm ? mainForm.querySelector('[name="email"]') : null;
					var phoneEl = mainForm ? mainForm.querySelector('[name="phone"]') : null;
									if (!nameEl || !String(nameEl.value || '').trim()) { setInlineError('Name is required.'); return; }
					if (!emailEl || !String(emailEl.value || '').trim()) { setInlineError('Email is required.'); return; }
					var emailVal = String((emailEl && emailEl.value) || '').trim();
					var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailPattern.test(emailVal)) { setInlineError('Please enter a valid email address.'); return; }
					var phoneVal = String((phoneEl && phoneEl.value) || '').trim();
					var phonePattern = /^\\+1\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$/;
					if (!phoneEl || !phoneVal) { setInlineError('Phone number is required.'); return; }
					if (!phonePattern.test(phoneVal)) { setInlineError('Please enter a full U.S. phone number, e.g. +1 (555) 555-5555.'); return; }

					// Require that user agrees to terms before proceeding to step 2
					try {
						var agreeEl = mainForm ? mainForm.querySelector('[name="agreeTerms"]') : null;
						var agreed = false;
						if (agreeEl) {
							if (agreeEl.type === 'checkbox') agreed = Boolean(agreeEl.checked);
							else agreed = String(agreeEl.value || '') === '1' || String(agreeEl.value || '') === 'on';
						}
						if (!agreed) {
							setInlineError('You must agree to the Terms of Service, Terms of Use, and Disclaimer to continue.');
							return;
						}
					} catch (e) {}

					// Require a kit value and validate it server-side before navigating
					var kit = (params.get('kitRegistrationNumber') || '').trim();
					if (!kit) {
						setInlineError('Please enter your kit registration number.');
						return;
					}

					try {
						var body = 'intent=check-kit&kitRegistrationNumber=' + encodeURIComponent(kit);
						var resp = await fetch(window.location.pathname, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body, credentials: 'same-origin' });
						if (resp.ok) {
							var json = await resp.json();
							if (json && json.reportAlreadyGenerated) {
								setInlineError('Your report has already been generated. Please contact support if you need assistance.');
							} else if (json && json.alreadyRegistered) {
								setInlineError('This kit has already been registered. Please contact support if you need assistance.');
							} else if (json && json.exists) {
								window.location.href = window.location.pathname + '?' + params.toString();
							} else {
								setInlineError('Kit number not recognized. Please check your kit number or contact support.');
							}
						} else {
							setInlineError('Could not validate kit right now. Please try again.');
						}
					} catch (err) {
						setInlineError('Could not validate kit right now. Please try again.');
					}
				} catch (e) { console.error(e); }
			});
		})();
		</script>
	` ) : renderStep2Section(form, errors)}
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

	let reportAlreadyGenerated = false;

	// If a kit number is provided, try to load the existing registration and
	// autofill the form fields (only when the query params didn't already set them).
	if (defaults.kitRegistrationNumber) {
		try {
			const existing = await getRegistrationByKitNumberWithReport(defaults.kitRegistrationNumber);
			if (existing) {
				if (!String(url.searchParams.get('name') || '').trim()) defaults.name = existing.name || defaults.name;
				if (!String(url.searchParams.get('email') || '').trim()) defaults.email = existing.email || defaults.email;
				if (!String(url.searchParams.get('phone') || '').trim()) defaults.phone = existing.phone || defaults.phone;
				
				// Only treat a report as generated when its final generated/uploaded status is reached
				if (existing.report?.status === 'report_generated' || existing.report?.status === 'uploaded') {
					reportAlreadyGenerated = true;
				}
			}
		} catch (err) {
			// Non-fatal: if DB lookup fails, just proceed with query param values.
			console.error('[proxy.undr.submit] could not lookup registration for prefill', err);
		}
	}

	const data: LoaderData = { form: defaults, showStep2: url.searchParams.get('step') === '2', reportAlreadyGenerated };

	return proxyPageResponse(request, liquid, data);
}

export async function action({ request }: ActionFunctionArgs) {
	const url = new URL(request.url);
	const { admin, session, liquid } = await authenticate.public.appProxy(request);

	const formData = await request.formData();
	const intent = String(formData.get("intent") || "");
	const form: RegistrationFormState = {
		name: String(formData.get("name") || ""),
		email: String(formData.get("email") || ""),
		phone: String(formData.get("phone") || ""),
		orderNumber: String(formData.get("orderNumber") || ""),
		kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
		agreedToTerms: Boolean(String(formData.get("agreeTerms") || "") === "1" || String(formData.get("agreeTerms") || "") === "on"),
		smsConsent: Boolean(formData.get("smsConsent")),
	};

	const step = String(formData.get('step') || '1');
	const final = String(formData.get('final') || '0');

	const page2Values = {
		address: String(formData.get('address') || ''),
		depth: String(formData.get('depth') || ''),
		propertyType: String(formData.get('propertyType') || ''),
		landUse: String(formData.get('landUse') || ''),
		acreage: formData.get('acreage') ? Number(String(formData.get('acreage'))) : undefined,
		reason: String(formData.get('reason') || ''),
		reasonOther: String(formData.get('reasonOther') || ''),
	};

	// If the request is a quick kit existence check (AJAX), respond with JSON
	if (intent === 'check-kit') {
		const kit = String(formData.get('kitRegistrationNumber') || '').trim();
		const rawKitInputCheck = kit;
		const trailing10Check = rawKitInputCheck.match(/(\d{10})$/);
		const lookupKitCheck = trailing10Check ? trailing10Check[1] : rawKitInputCheck;
		const kitCheckReg = await getRegistrationByKitNumberWithReport(lookupKitCheck);
		const exists = Boolean(kitCheckReg);
		const alreadyRegistered = Boolean(kitCheckReg && kitCheckReg.report?.status === 'register_submitted');
		const reportAlreadyGenerated = Boolean(
			kitCheckReg &&
			(kitCheckReg.report?.status === 'report_generated' || kitCheckReg.report?.status === 'uploaded')
		);
		return new Response(JSON.stringify({ exists, alreadyRegistered, reportAlreadyGenerated }), { headers: { 'Content-Type': 'application/json' } });
	}

	// If the user clicked Register Kit to advance to step 2, render step 2 without final validation/save
	if (step === '2' && final !== '1') {
		const data: ActionData = { ok: false, form: Object.assign(getRegistrationDefaults(), form, page2Values), showStep2: true };
		return proxyPageResponse(request, liquid, data);
	}
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

	// Validate step 1 fields
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

	// If final submission from step 2, validate step 2 fields too
	if (final === '1') {
		const merged = Object.assign({}, form, page2Values) as RegistrationFormState;
		const step2Errors = validateRegistrationStep2(merged);
		if (step2Errors) {
			const data: ActionData = { ok: false, message: 'Please fill required fields on this page.', errors: step2Errors, form: merged, showStep2: true };
			return proxyPageResponse(request, liquid, data);
		}
		// merge page2 into form for saving
		form.address = page2Values.address;
		form.depth = page2Values.depth;
		form.propertyType = page2Values.propertyType;
		form.landUse = page2Values.landUse;
		form.acreage = page2Values.acreage as any;
		form.reason = page2Values.reason;
		form.reasonOther = page2Values.reasonOther;
	}

	// Normalize kit input for lookup: prefer a trailing 10-digit kit number when present
	const rawKitInput = String(form.kitRegistrationNumber || "").trim();
	const trailing10 = rawKitInput.match(/(\d{10})$/);
	const lookupKit = trailing10 ? trailing10[1] : rawKitInput;
	const existing = await getRegistrationByKitNumberWithReport(lookupKit);
	
	// Check if report is already generated for this kit
	let reportAlreadyGenerated = false;
	if (existing?.report?.status === 'report_generated' || existing?.report?.status === 'uploaded') {
		reportAlreadyGenerated = true;
	}
	
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

			// Persist SMS consent explicitly (true when checked, false when unchecked)
			if (typeof form.smsConsent !== 'undefined') {
				updateData.smsConsent = Boolean(form.smsConsent);
			}

			// If final submission from step 2, include page 2 fields
			if (String(formData.get('final') || '') === '1') {
				updateData.address = String(formData.get('address') || '');
				updateData.depth = String(formData.get('depth') || '');
				updateData.propertyType = String(formData.get('propertyType') || '');
				updateData.landUse = String(formData.get('landUse') || '');
				if (formData.get('acreage')) updateData.acreage = Number(String(formData.get('acreage')));
				updateData.reason = String(formData.get('reason') || '');
				updateData.reasonOther = String(formData.get('reasonOther') || '');
			}

			await updateRegistrationFieldsById(existing.id, updateData);

			try {
				await setReportStatusByRegistrationId(existing.id, "register_submitted");
			} catch (err) {
				console.error("[proxy.undr.submit] could not set report status for existing registration", err);
			}

			const data: ActionData = {
				ok: true,
				message: `Thanks, ${String(form.name || '').split(' ')[0] || 'there'}! Your kit has been successfully registered. Let\u2019s get digging!`,
				form: Object.assign(getRegistrationDefaults(), { shopDomain: shop }),
				reportAlreadyGenerated,
			};
			return proxyPageResponse(request, liquid, data);
		} catch (err) {
			console.error("[proxy.undr.submit] could not update existing registration", err);
			const data: ActionData = {
				ok: false,
				message: "Could not update the existing registration. Please try again.",
				form,
				reportAlreadyGenerated,
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
			smsConsent: Boolean(form.smsConsent),
			shopifyOrderId: null,
			shopifyCustomerId,
			// Page 2 fields (if provided)
			address: form.address || undefined,
			depth: form.depth || undefined,
			propertyType: form.propertyType || undefined,
			landUse: form.landUse || undefined,
			acreage: typeof form.acreage !== 'undefined' && form.acreage !== '' ? Number(form.acreage as any) : undefined,
			reason: form.reason || undefined,
			reasonOther: form.reasonOther || undefined,
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
			reportAlreadyGenerated,
		};
		return proxyPageResponse(request, liquid, data);
	}

	const data: ActionData = {
		ok: true,
		message: `Thanks, ${String(form.name || '').split(' ')[0] || 'there'}! Your kit has been successfully registered. Let\u2019s get digging!`,
		form: Object.assign(getRegistrationDefaults(), { shopDomain: session?.shop || url.searchParams.get('shop')?.trim() || '' }),
		reportAlreadyGenerated,
	};
	return proxyPageResponse(request, liquid, data);
}

// Intentionally no default component export.
// This route acts as a proxy/resource endpoint and returns HTML from loader/action.
