import { authenticate } from "../shopify.server";

type RenderAppProxyOptions = {
	proxyId?: string;
};

type ProxyView = "block" | "list" | "slider";

type WidgetItem = {
  title: string;
  description: string;
  image?: string;
  link?: string;
};

type WidgetPayload = {
  title: string;
  subtitle: string;
  items: WidgetItem[];
};

function escapeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function resolveProxyId(url: URL, proxyId?: string) {
	return (
		proxyId?.trim() ||
		url.searchParams.get("id")?.trim() ||
		url.searchParams.get("resourceId")?.trim() ||
		url.searchParams.get("targetId")?.trim() ||
		"default"
	);
}

function resolveView(url: URL): ProxyView {
  const view = url.searchParams.get("view")?.trim().toLowerCase();

  if (view === "list" || view === "slider") {
    return view;
  }

  return "block";
}

function isEmbedMode(url: URL) {
  const embed = url.searchParams.get("embed")?.trim().toLowerCase();
  return embed === "1" || embed === "true";
}

function buildSamplePayload(proxyId: string): WidgetPayload {
  return {
    title: `${proxyId} simple widget`,
    subtitle: "This is sample JSON data. Replace it with your own payload whenever you are ready.",
    items: [
      {
        title: `${proxyId} overview`,
        description: `Primary content for ${proxyId}. Replace this with your own JSON item content.`,
      },
      {
        title: `${proxyId} details`,
        description: "Use this area for list items, slider cards, promotional copy, or product-specific text.",
      },
      {
        title: `${proxyId} call to action`,
        description: "Later you can send real JSON here and the widget will render it without any API fetch.",
      },
    ],
  };
}

function normalizePayload(rawPayload: unknown, proxyId: string): WidgetPayload {
  const fallback = buildSamplePayload(proxyId);

  if (Array.isArray(rawPayload)) {
    const items = rawPayload
      .map((item) => normalizeItem(item))
      .filter(Boolean) as WidgetItem[];

    return {
      ...fallback,
      items: items.length ? items : fallback.items,
    };
  }

  if (rawPayload && typeof rawPayload === "object") {
    const source = rawPayload as Record<string, unknown>;
    const items = Array.isArray(source.items)
      ? (source.items.map((item) => normalizeItem(item)).filter(Boolean) as WidgetItem[])
      : fallback.items;

    return {
      title:
        typeof source.title === "string" && source.title.trim()
          ? source.title.trim()
          : fallback.title,
      subtitle:
        typeof source.subtitle === "string" && source.subtitle.trim()
          ? source.subtitle.trim()
          : fallback.subtitle,
      items: items.length ? items : fallback.items,
    };
  }

  return fallback;
}

function normalizeItem(rawItem: unknown): WidgetItem | null {
  if (!rawItem || typeof rawItem !== "object") {
    return null;
  }

  const source = rawItem as Record<string, unknown>;
  const title = typeof source.title === "string" ? source.title.trim() : "";
  const description =
    typeof source.description === "string" ? source.description.trim() : "";

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Untitled item",
    description: description || "",
    image: typeof source.image === "string" ? source.image.trim() : undefined,
    link: typeof source.link === "string" ? source.link.trim() : undefined,
  };
}

function resolvePayload(url: URL, proxyId: string) {
  const rawData = url.searchParams.get("data")?.trim();

  if (!rawData) {
    return buildSamplePayload(proxyId);
  }

  try {
    return normalizePayload(JSON.parse(rawData), proxyId);
  } catch {
    return buildSamplePayload(proxyId);
  }
}

function buildWidgetMarkup(input: {
  proxyId: string;
  view: ProxyView;
  payload: WidgetPayload;
  embed: boolean;
}) {
  const payloadJson = escapeHtml(JSON.stringify(input.payload, null, 2));

  return `
<div
  data-undr-simple-widget
  data-undr-proxy-id="${escapeHtml(input.proxyId)}"
  data-undr-proxy-view="${escapeHtml(input.view)}"
>
  <script type="application/json">${payloadJson}</script>
</div>
<script src="/undr-product-proxy-component.js" defer></script>
${input.embed ? "" : ""}
`;
}

function buildLandingTemplate() {
  const samplePayload = JSON.stringify(buildSamplePayload("sample-id"), null, 2);

	return `
<div style="max-width: 760px; margin: 0 auto; padding: 48px 20px 72px; color: #1f2937;">
  <div style="margin-bottom: 26px;">
    <p style="margin: 0 0 10px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.72;">UNDR App Proxy</p>
    <h1 style="margin: 0 0 12px; font-size: clamp(30px, 5vw, 48px); line-height: 1.05;">Simple HTML, CSS and JS widget</h1>
    <p style="margin: 0; font-size: 16px; line-height: 1.7; opacity: 0.84;">
      Enter an ID, paste JSON, and preview the widget. This version does not fetch data from an API. It renders directly from the JSON you provide.
    </p>
  </div>

  <form id="undr-proxy-form" style="display: grid; gap: 16px; padding: 24px; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 22px; background: linear-gradient(180deg, #fffdf8, #ffffff);">
    <label style="display: grid; gap: 8px;">
      <span style="font-size: 14px; font-weight: 600;">Dynamic ID</span>
      <input id="undr-proxy-id" name="proxyId" type="text" placeholder="product-123 or campaign-a" style="height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.16); font-size: 16px;" required>
    </label>

    <label style="display: grid; gap: 8px;">
      <span style="font-size: 14px; font-weight: 600;">View type</span>
      <select id="undr-proxy-view" name="view" style="height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.16); font-size: 16px; background: #fff;">
        <option value="block">Block</option>
        <option value="list">List</option>
        <option value="slider">Slider</option>
      </select>
    </label>

    <label style="display: grid; gap: 8px;">
      <span style="font-size: 14px; font-weight: 600;">JSON data</span>
      <textarea id="undr-proxy-data" name="data" rows="12" style="padding: 14px; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.16); font-size: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; resize: vertical;">${escapeHtml(samplePayload)}</textarea>
    </label>

    <button type="submit" style="height: 48px; border: 0; border-radius: 14px; background: #111827; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer;">Open dynamic page</button>
  </form>

  <script>
    (function () {
      var form = document.getElementById("undr-proxy-form");
      var input = document.getElementById("undr-proxy-id");
      var view = document.getElementById("undr-proxy-view");
      var data = document.getElementById("undr-proxy-data");

      if (!form || !input || !view || !data) return;

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var rawId = (input.value || "").trim();
        if (!rawId) return;

        var basePath = window.location.pathname.endsWith("/")
          ? window.location.pathname.slice(0, -1)
          : window.location.pathname;
        var target = basePath + "/" + encodeURIComponent(rawId);
        var url = new URL(target, window.location.origin);
        url.searchParams.set("view", view.value || "block");
        url.searchParams.set("data", data.value || "{}");
        window.location.href = url.toString();
      });
    })();
  </script>
</div>
`;
}

function buildPageTemplate(input: {
	proxyId: string;
	view: ProxyView;
	payload: WidgetPayload;
	embed: boolean;
}) {
	const textareaValue = escapeHtml(JSON.stringify(input.payload, null, 2));
	const widgetMarkup = buildWidgetMarkup({
		proxyId: input.proxyId,
		view: input.view,
		payload: input.payload,
		embed: input.embed,
	});

	return `
<div style="max-width: 1100px; margin: 0 auto; padding: 48px 20px 72px;">
  <div style="margin-bottom: 28px;">
    <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.72;">
      UNDR Simple Widget
    </p>
    <h1 style="margin: 0 0 12px; font-size: clamp(32px, 5vw, 52px); line-height: 1.05;">
      Simple proxy page
    </h1>
    <p style="margin: 0; max-width: 760px; font-size: 17px; line-height: 1.7; opacity: 0.88;">
      This page is rendered with plain HTML, CSS, and JavaScript. The widget content comes directly from JSON in the page URL or on the page itself.
    </p>
  </div>

  <div style="display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-bottom: 24px;">
    <div style="padding: 22px; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 18px; background: rgba(255, 255, 255, 0.76);">
      <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65;">Proxy ID</p>
      <p style="margin: 0; font-size: 22px; font-weight: 600; line-height: 1.3;">${escapeHtml(input.proxyId)}</p>
    </div>

    <div style="padding: 22px; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 18px; background: rgba(255, 255, 255, 0.76);">
      <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65;">View type</p>
      <p style="margin: 0; font-size: 22px; font-weight: 600; line-height: 1.3; text-transform: capitalize;">${escapeHtml(input.view)}</p>
    </div>

    <div style="padding: 22px; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 18px; background: rgba(255, 255, 255, 0.76);">
      <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65;">Items</p>
      <p style="margin: 0; font-size: 22px; font-weight: 600; line-height: 1.3;">${input.payload.items.length}</p>
    </div>

    <div style="padding: 22px; border: 1px solid rgba(0, 0, 0, 0.12); border-radius: 18px; background: rgba(255, 255, 255, 0.76);">
      <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.65;">Shop</p>
      <p style="margin: 0; font-size: 22px; font-weight: 600; line-height: 1.3;">{{ shop.name }}</p>
    </div>
  </div>

  <div style="padding: 28px; border-radius: 24px; background: linear-gradient(135deg, rgba(245, 242, 235, 0.95), rgba(255, 255, 255, 0.98)); border: 1px solid rgba(0, 0, 0, 0.08); margin-bottom: 24px;">
    <h2 style="margin: 0 0 12px; font-size: 24px; line-height: 1.2;">Simple renderer is active</h2>
    <p style="margin: 0 0 16px; max-width: 720px; font-size: 16px; line-height: 1.7; opacity: 0.88;">
      Open the storefront path <strong>/apps/my-app-proxy/${escapeHtml(input.proxyId)}</strong> and switch the widget between block, list, or slider using the same JSON.
    </p>
    <p style="margin: 0; font-size: 15px; line-height: 1.7; opacity: 0.8;">
      There is no client-side API call here. The browser renders the JSON directly with simple JavaScript.
    </p>
  </div>

	<div style="display: grid; gap: 16px; margin-bottom: 24px;">
	  <label style="display: grid; gap: 8px;">
	    <span style="font-size: 14px; font-weight: 600; color: #1f2937;">Current JSON data</span>
	    <textarea readonly rows="12" style="padding: 14px; border-radius: 14px; border: 1px solid rgba(15, 23, 42, 0.16); font-size: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; resize: vertical; background: #fff;">${textareaValue}</textarea>
	  </label>
	</div>

	${widgetMarkup}
</div>
`;
}

export async function renderAppProxyPage(
	request: Request,
	options: RenderAppProxyOptions = {},
) {
	const { liquid } = await authenticate.public.appProxy(request);
	const url = new URL(request.url);
  const requestedProxyId = options.proxyId?.trim();
  if (!requestedProxyId && !url.searchParams.get("id")?.trim()) {
    return liquid(buildLandingTemplate());
  }

  const proxyId = resolveProxyId(url, requestedProxyId);
  const view = resolveView(url);
  const embed = isEmbedMode(url);
  const payload = resolvePayload(url, proxyId);
  const template = buildPageTemplate({
    proxyId,
    view,
    payload,
    embed,
  });

  return liquid(template, { layout: !embed });
}