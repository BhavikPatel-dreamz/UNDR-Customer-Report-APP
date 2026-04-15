(function () {
  var STYLE_ID = "undr-simple-widget-styles";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = ""
      + ".undr-simple-widget{color:#1f2937;font-family:inherit}" 
      + ".undr-simple-widget__header{margin:0 0 14px}" 
      + ".undr-simple-widget__eyebrow{margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.68}" 
      + ".undr-simple-widget__title{margin:0 0 6px;font-size:28px;line-height:1.1}" 
      + ".undr-simple-widget__subtitle{margin:0;line-height:1.6;opacity:.82}" 
      + ".undr-simple-widget__grid{display:grid;gap:16px}" 
      + ".undr-simple-widget__grid--block,.undr-simple-widget__grid--list{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}" 
      + ".undr-simple-widget__grid--slider{grid-auto-flow:column;grid-auto-columns:minmax(240px,1fr);overflow-x:auto;padding-bottom:8px}" 
      + ".undr-simple-widget__card{padding:18px;border:1px solid rgba(0,0,0,.12);border-radius:18px;background:linear-gradient(180deg,#fffdf8,#fff)}" 
      + ".undr-simple-widget__card-title{margin:0 0 8px;font-size:18px;line-height:1.3}" 
      + ".undr-simple-widget__card-copy{margin:0;line-height:1.6;opacity:.84}" 
      + ".undr-simple-widget__card-link{display:inline-block;margin-top:12px;color:inherit;font-weight:600;text-decoration:underline;text-underline-offset:2px}";
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function samplePayload(proxyId) {
    return {
      title: proxyId + " simple widget",
      subtitle: "Replace this sample JSON with your own data.",
      items: [
        {
          title: proxyId + " overview",
          description: "Sample data rendered without calling an API.",
        },
        {
          title: proxyId + " details",
          description: "Use JSON to drive block, list, or slider layouts.",
        },
        {
          title: proxyId + " CTA",
          description: "You can later replace this with real content.",
        },
      ],
    };
  }

  function normalizePayload(rawPayload, proxyId) {
    var fallback = samplePayload(proxyId);

    if (Array.isArray(rawPayload)) {
      return {
        title: fallback.title,
        subtitle: fallback.subtitle,
        items: rawPayload.map(normalizeItem).filter(Boolean),
      };
    }

    if (!rawPayload || typeof rawPayload !== "object") {
      return fallback;
    }

    var payload = {
      title: typeof rawPayload.title === "string" && rawPayload.title.trim() ? rawPayload.title.trim() : fallback.title,
      subtitle: typeof rawPayload.subtitle === "string" && rawPayload.subtitle.trim() ? rawPayload.subtitle.trim() : fallback.subtitle,
      items: Array.isArray(rawPayload.items) ? rawPayload.items.map(normalizeItem).filter(Boolean) : fallback.items,
    };

    if (!payload.items.length) {
      payload.items = fallback.items;
    }

    return payload;
  }

  function normalizeItem(item) {
    if (!item || typeof item !== "object") {
      return null;
    }

    var title = typeof item.title === "string" && item.title.trim() ? item.title.trim() : "Untitled item";
    var description = typeof item.description === "string" ? item.description.trim() : "";

    return {
      title: title,
      description: description,
      image: typeof item.image === "string" ? item.image.trim() : "",
      link: typeof item.link === "string" ? item.link.trim() : "",
    };
  }

  function getPayload(container) {
    var proxyId = (container.dataset.undrProxyId || "simple-id").trim();
    var script = container.querySelector('script[type="application/json"]');

    if (!script || !script.textContent) {
      return samplePayload(proxyId);
    }

    try {
      return normalizePayload(JSON.parse(script.textContent), proxyId);
    } catch (error) {
      console.error("UNDR widget JSON parse failed", error);
      return samplePayload(proxyId);
    }
  }

  function buildItems(items) {
    return items.map(function (item) {
      var link = item.link
        ? '<a class="undr-simple-widget__card-link" href="' + escapeHtml(item.link) + '">Learn more</a>'
        : "";
      var image = item.image
        ? '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" style="width:100%;height:auto;border-radius:12px;margin:0 0 12px;display:block;">'
        : "";

      return ""
        + '<article class="undr-simple-widget__card">'
        + image
        + '<h3 class="undr-simple-widget__card-title">' + escapeHtml(item.title) + '</h3>'
        + '<p class="undr-simple-widget__card-copy">' + escapeHtml(item.description) + '</p>'
        + link
        + '</article>';
    }).join("");
  }

  function render(container, payloadOverride) {
    injectStyles();

    var proxyId = (container.dataset.undrProxyId || "simple-id").trim();
    var view = (container.dataset.undrProxyView || "block").trim().toLowerCase();
    var payload = normalizePayload(payloadOverride || getPayload(container), proxyId);

    if (view !== "list" && view !== "slider") {
      view = "block";
    }

    container.innerHTML = ""
      + '<section class="undr-simple-widget">'
      + '  <header class="undr-simple-widget__header">'
      + '    <p class="undr-simple-widget__eyebrow">' + escapeHtml(proxyId) + '</p>'
      + '    <h2 class="undr-simple-widget__title">' + escapeHtml(payload.title) + '</h2>'
      + '    <p class="undr-simple-widget__subtitle">' + escapeHtml(payload.subtitle) + '</p>'
      + '  </header>'
      + '  <div class="undr-simple-widget__grid undr-simple-widget__grid--' + escapeHtml(view) + '">'
      + buildItems(payload.items)
      + '  </div>'
      + '</section>';
  }

  function initContainer(container) {
    var proxyId = (container.dataset.undrProxyId || "").trim();

    if (!proxyId) {
      container.innerHTML = "<p>Missing data-undr-proxy-id.</p>";
      return;
    }

    render(container);
  }

  function init() {
    var containers = document.querySelectorAll("[data-undr-simple-widget]");

    containers.forEach(initContainer);
  }

  window.UNDRSimpleProxy = {
    render: render
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();