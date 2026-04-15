import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
	findRegistrationForGuestLookup,
	listRegistrationsByCustomerId,
} from "../models/registration.server";
import { authenticate } from "../shopify.server";

type GuestLookupFormState = {
	orderNumber: string;
	kitRegistrationNumber: string;
	email: string;
	date: string;
};

type GuestLookupErrors = Partial<Record<keyof GuestLookupFormState, string>>;

type GuestLookupResult = {
	kitRegistrationNumber: string;
	orderNumber: string;
	reportReady: boolean;
};

type DashboardState = {
	loggedInCustomerId: string | null;
	registrations: Array<{
		id: string;
		kitRegistrationNumber: string;
		orderNumber: string;
		createdAt: Date;
		report?: { status: string } | null;
	}>;
	guestForm: GuestLookupFormState;
	guestErrors?: GuestLookupErrors;
	guestLookupResult?: GuestLookupResult;
	guestLookupMessage?: string;
};

function getGuestLookupDefaults(): GuestLookupFormState {
	return {
		orderNumber: "",
		kitRegistrationNumber: "",
		email: "",
		date: "",
	};
}

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

function resolveLoggedInCustomerId(url: URL) {
	return (
		url.searchParams.get("logged_in_customer_id")?.trim() ||
		url.searchParams.get("customer_id")?.trim() ||
		null
	);
}

function validateGuestLookup(form: GuestLookupFormState): GuestLookupErrors | null {
	const errors: GuestLookupErrors = {};

	if (!form.email.trim()) {
		errors.email = "Email is required.";
	}

	if (!form.orderNumber.trim() && !form.kitRegistrationNumber.trim()) {
		errors.orderNumber = "Enter an order ID or a kit registration number.";
		errors.kitRegistrationNumber = "Enter a kit registration number or an order ID.";
	}

	if (form.date.trim()) {
		const parsedDate = new Date(`${form.date}T00:00:00.000Z`);
		if (Number.isNaN(parsedDate.getTime())) {
			errors.date = "Enter a valid date.";
		}
	}

	return Object.keys(errors).length ? errors : null;
}

function renderFieldError(message?: string) {
	if (!message) return "";
	return `<div style="color:#b42318;font-size:13px;margin-top:6px;">${escapeHtml(message)}</div>`;
}

function renderLoggedInSection(state: DashboardState) {
	const registrationsMarkup = state.registrations.length
		? state.registrations
				.map((registration) => {
					const reportReady = registration.report?.status === "uploaded";
					const actionLabel = reportReady ? "View report" : "Report pending";
					const actionHref = reportReady
						? `/apps/undr/report/${encodeURIComponent(registration.kitRegistrationNumber)}`
						: "#";

					return `
						<article style="padding:20px;border:1px solid rgba(15,23,42,0.1);border-radius:18px;background:#fff;display:grid;gap:12px;">
							<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start;">
								<div>
									<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Kit</p>
									<h3 style="margin:0;font-size:22px;line-height:1.2;">${escapeHtml(registration.kitRegistrationNumber)}</h3>
								</div>
								<span style="display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;background:${reportReady ? "#ecfdf3" : "#f3f4f6"};color:${reportReady ? "#027a48" : "#4b5563"};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
									${reportReady ? "Report ready" : "Pending"}
								</span>
							</div>
							<div style="display:grid;gap:6px;color:#4b5563;font-size:14px;">
								<div><strong style="color:#111827;">Order:</strong> ${escapeHtml(registration.orderNumber)}</div>
								<div><strong style="color:#111827;">Registered:</strong> ${escapeHtml(new Date(registration.createdAt).toLocaleDateString())}</div>
							</div>
							<div style="display:flex;gap:12px;flex-wrap:wrap;">
								<a href="/apps/undr/register" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;border:1px solid rgba(15,23,42,0.14);color:#111827;font-size:14px;font-weight:600;text-decoration:none;">Register new kit</a>
								<a href="${actionHref}" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:${reportReady ? "#111827" : "#e5e7eb"};color:${reportReady ? "#fff" : "#6b7280"};font-size:14px;font-weight:600;text-decoration:none;pointer-events:${reportReady ? "auto" : "none"};">
									${actionLabel}
								</a>
							</div>
						</article>
					`;
				})
				.join("")
		: `
			<div style="padding:24px;border:1px dashed rgba(15,23,42,0.18);border-radius:18px;background:rgba(255,255,255,0.72);">
				<h3 style="margin:0 0 8px;font-size:22px;">No kits registered yet</h3>
				<p style="margin:0 0 16px;color:#4b5563;line-height:1.6;">We could not find any kits linked to your customer account yet.</p>
				<a href="/apps/undr/register" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 20px;border-radius:999px;background:#111827;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Register New Kit</a>
			</div>
		`;

	return `
		<section style="display:grid;gap:22px;">
			<div style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-start;">
				<div>
					<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;">Customer Dashboard</p>
					<h1 style="margin:0 0 10px;font-size:clamp(32px,5vw,48px);line-height:1.05;">Your registered kits</h1>
					<p style="margin:0;color:#4b5563;font-size:16px;line-height:1.7;max-width:620px;">Review kits linked to your customer account and open any report that is ready.</p>
				</div>
				<a href="/apps/undr/register" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 22px;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:700;text-decoration:none;">Register New Kit</a>
			</div>
			<div style="display:grid;gap:16px;">${registrationsMarkup}</div>
		</section>
	`;
}

function renderGuestSection(state: DashboardState) {
	const resultMarkup = state.guestLookupResult
		? `
			<div style="padding:16px 18px;border-radius:16px;background:${state.guestLookupResult.reportReady ? "#ecfdf3" : "#fff7ed"};border:1px solid ${state.guestLookupResult.reportReady ? "#a7f3d0" : "#fed7aa"};display:grid;gap:10px;">
				<div style="font-size:15px;font-weight:700;color:${state.guestLookupResult.reportReady ? "#027a48" : "#9a3412"};">
					${state.guestLookupResult.reportReady ? "Report located" : "Registration located"}
				</div>
				<div style="color:#374151;font-size:14px;line-height:1.6;">
					Kit <strong>${escapeHtml(state.guestLookupResult.kitRegistrationNumber)}</strong> matched order <strong>${escapeHtml(state.guestLookupResult.orderNumber)}</strong>.
				</div>
				${state.guestLookupResult.reportReady
					? `<a href="/apps/undr/report/${encodeURIComponent(state.guestLookupResult.kitRegistrationNumber)}" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;border-radius:999px;background:#111827;color:#fff;font-size:14px;font-weight:600;text-decoration:none;width:max-content;">View Report</a>`
					: `<div style="color:#9a3412;font-size:14px;">Your report is not ready yet. Please check back later.</div>`}
			</div>
		`
		: state.guestLookupMessage
			? `<div style="padding:16px 18px;border-radius:16px;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;font-size:14px;line-height:1.6;">${escapeHtml(state.guestLookupMessage)}</div>`
			: "";

	return `
		<section style="display:grid;gap:22px;">
			<div>
				<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;">Guest Lookup</p>
				<h1 style="margin:0 0 10px;font-size:clamp(32px,5vw,48px);line-height:1.05;">Find your kit report</h1>
				<p style="margin:0;color:#4b5563;font-size:16px;line-height:1.7;max-width:620px;">If you are not logged in, use your order details and kit registration number to find the right report.</p>
			</div>
			<form method="post" style="display:grid;gap:16px;max-width:720px;padding:28px;border:1px solid rgba(15,23,42,0.12);border-radius:22px;background:linear-gradient(180deg,#fffdf8,#ffffff);">
				<input type="hidden" name="intent" value="guest-lookup" />
				<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
					<label style="display:grid;gap:6px;">
						<span style="font-size:14px;font-weight:600;">Order ID</span>
						<input name="orderNumber" value="${escapeHtml(state.guestForm.orderNumber)}" placeholder="#1001" style="width:100%;min-height:44px;padding:10px 14px;border-radius:12px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;" />
						${renderFieldError(state.guestErrors?.orderNumber)}
					</label>
					<label style="display:grid;gap:6px;">
						<span style="font-size:14px;font-weight:600;">Kit Registration Number</span>
						<input name="kitRegistrationNumber" value="${escapeHtml(state.guestForm.kitRegistrationNumber)}" placeholder="KIT-XXXXX" style="width:100%;min-height:44px;padding:10px 14px;border-radius:12px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;" />
						${renderFieldError(state.guestErrors?.kitRegistrationNumber)}
					</label>
				</div>
				<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
					<label style="display:grid;gap:6px;">
						<span style="font-size:14px;font-weight:600;">Email</span>
						<input name="email" type="email" value="${escapeHtml(state.guestForm.email)}" placeholder="jane@example.com" style="width:100%;min-height:44px;padding:10px 14px;border-radius:12px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;" />
						${renderFieldError(state.guestErrors?.email)}
					</label>
					<label style="display:grid;gap:6px;">
						<span style="font-size:14px;font-weight:600;">Date</span>
						<input name="date" type="date" value="${escapeHtml(state.guestForm.date)}" style="width:100%;min-height:44px;padding:10px 14px;border-radius:12px;border:1px solid rgba(15,23,42,0.2);font-size:15px;box-sizing:border-box;" />
						${renderFieldError(state.guestErrors?.date)}
					</label>
				</div>
				<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
					<button type="submit" style="min-height:46px;padding:0 22px;border:0;border-radius:999px;background:#111827;color:#fff;font-size:15px;font-weight:700;cursor:pointer;">Validate and Fetch Report</button>
					<a href="/apps/undr/register" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 22px;border:1px solid rgba(15,23,42,0.14);border-radius:999px;color:#111827;font-size:15px;font-weight:600;text-decoration:none;">Need to register a kit?</a>
				</div>
				${resultMarkup}
			</form>
		</section>
	`;
}

function renderDashboardTemplate(state: DashboardState) {
	return `
<div style="background:radial-gradient(circle at top left, rgba(255,244,214,0.8), transparent 34%), linear-gradient(180deg, #fcfbf8 0%, #f7f4ee 100%); min-height:100vh;">
	<div style="max-width:980px;margin:0 auto;padding:48px 20px 72px;color:#111827;display:grid;gap:26px;">
		${state.loggedInCustomerId ? renderLoggedInSection(state) : renderGuestSection(state)}
	</div>
</div>
`;
}

async function buildDashboardState(
	request: Request,
	overrides: Partial<DashboardState> = {},
) {
	const url = new URL(request.url);
	const loggedInCustomerId = overrides.loggedInCustomerId ?? resolveLoggedInCustomerId(url);
	const registrations = loggedInCustomerId
		? await listRegistrationsByCustomerId(loggedInCustomerId)
		: [];

	return {
		loggedInCustomerId,
		registrations,
		guestForm: overrides.guestForm ?? getGuestLookupDefaults(),
		guestErrors: overrides.guestErrors,
		guestLookupResult: overrides.guestLookupResult,
		guestLookupMessage: overrides.guestLookupMessage,
	} satisfies DashboardState;
}

async function renderDashboardPage(
	request: Request,
	overrides: Partial<DashboardState> = {},
) {
	const state = await buildDashboardState(request, overrides);
	const { liquid } = await authenticate.public.appProxy(request);
	const embed = isEmbedMode(new URL(request.url));
	return liquid(renderDashboardTemplate(state), { layout: !embed });
}

export async function loader({ request }: LoaderFunctionArgs) {
	return renderDashboardPage(request);
}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = String(formData.get("intent") || "");

	if (intent !== "guest-lookup") {
		return renderDashboardPage(request);
	}

	const guestForm: GuestLookupFormState = {
		orderNumber: String(formData.get("orderNumber") || ""),
		kitRegistrationNumber: String(formData.get("kitRegistrationNumber") || ""),
		email: String(formData.get("email") || ""),
		date: String(formData.get("date") || ""),
	};

	const guestErrors = validateGuestLookup(guestForm);
	if (guestErrors) {
		return renderDashboardPage(request, { guestForm, guestErrors });
	}

	const registration = await findRegistrationForGuestLookup({
		email: guestForm.email,
		orderNumber: guestForm.orderNumber,
		kitRegistrationNumber: guestForm.kitRegistrationNumber,
		date: guestForm.date,
	});

	if (!registration) {
		return renderDashboardPage(request, {
			guestForm,
			guestLookupMessage:
				"We could not find a registration that matches those details. Check your email, order ID, and kit registration number and try again.",
		});
	}

	return renderDashboardPage(request, {
		guestForm,
		guestLookupResult: {
			kitRegistrationNumber: registration.kitRegistrationNumber,
			orderNumber: registration.orderNumber,
			reportReady: registration.report?.status === "uploaded",
		},
	});
}