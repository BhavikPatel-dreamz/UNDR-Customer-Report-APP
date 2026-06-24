(function () {
  var reportData = getReportData();
  var reportChart;

  // Local ELEMENT_COLOR_MAP (mirrors server mapping) used to determine fingerprint bar colors.
  // Keep minimal and only define if not already provided on the window.
  if (!window.ELEMENT_COLOR_MAP) {
    window.ELEMENT_COLOR_MAP = {
      fe: { bg: "#D8816C", text: "#D8816C" },
        cr: { bg: "#86BAB9", text: "#86BAB9" },
        co2: { bg: "#9CA3AF", text: "#9CA3AF" },
        ni: { bg: "#86BAB9", text: "#86BAB9" },
        mn: { bg: "#AF6666", text: "#AF6666" },
        si: { bg: "#FFB624", text: "#FFB624" },
        cu: { bg: "#EFBD75", text: "#EFBD75" },
        mo: { bg: "#FDB923", text: "#FDB923" },
        co: { bg: "#B4C2D6", text: "#B4C2D6" },
        tb: { bg: "#AF6666", text: "#AF6666" },
        na: { bg: "#D6A091", text: "#D6A091" },
        v: { bg: "#808083", text: "#808083" },
        s: { bg: "#707768", text: "#707768" },
        yb: { bg: "#D8816C", text: "#D8816C" },
        dy: { bg: "#D8816C", text: "#D8816C" },
        p: { bg: "#D6A091", text: "#D6A091" },
        al: { bg: "#BFA6A6", text: "#BFA6A6" },
        i: { bg: "#808083", text: "#808083" },
        re: { bg: "#FDB923", text: "#FDB923" },
        ca: { bg: "#FED095", text: "#FED095" },
        cl: { bg: "#95AA8C", text: "#95AA8C" },
        k: { bg: "#9BAD7F", text: "#9BAD7F" },
        nb: { bg: "#B4C2D6", text: "#B4C2D6" },
        ba: { bg: "#707768", text: "#707768" },
        sn: { bg: "#95AA8C", text: "#95AA8C" },
        ga: { bg: "#869B9B", text: "#869B9B" },
        sm: { bg: "#B4C2D6", text: "#B4C2D6" },
        ge: { bg: "#FED095", text: "#FED095" },
        ta: { bg: "#9BAD7F", text: "#9BAD7F" },
        in: { bg: "#EFBD75", text: "#EFBD75" },
        la: { bg: "#F2CF91", text: "#F2CF91" },
        pa: { bg: "#AF6666", text: "#AF6666" },
        ra: { bg: "#FED095", text: "#FED095" },
        ac: { bg: "#B4C2D6", text: "#B4C2D6" },
        ag: { bg: "#808083", text: "#808083" },
        y: { bg: "#D6A091", text: "#D6A091" },
        te: { bg: "#AB4543", text: "#AB4543" },
        sr: { bg: "#F2CF91", text: "#F2CF91" },
        cs: { bg: "#3F443A", text: "#3F443A" },
        ce: { bg: "#FDB923", text: "#FDB923" },
        pr: { bg: "#869B9B", text: "#869B9B" },
        nd: { bg: "#808083", text: "#808083" },
        o: { bg: "#942320", text: "#942320" },
        eu: { bg: "#F2CF91", text: "#F2CF91" },
        gd: { bg: "#AB4543", text: "#AB4543" },
        zn: { bg: "#F2CF91", text: "#F2CF91" },
        ti: { bg: "#86BAB9", text: "#86BAB9" },
        ho: { bg: "#B4C2D6", text: "#B4C2D6" },
        er: { bg: "#D6A091", text: "#D6A091" },
        tm: { bg: "#3F443A", text: "#3F443A" },
        sc: { bg: "#EFBD75", text: "#EFBD75" },
        lu: { bg: "#869B9B", text: "#869B9B" },
        hf: { bg: "#3F443A", text: "#3F443A" },
        w: { bg: "#B4C2D6", text: "#B4C2D6" },
        mg: { bg: "#AB4543", text: "#AB4543" },
        os: { bg: "#95AA8C", text: "#95AA8C" },
        ir: { bg: "#942320", text: "#942320" },
        pt: { bg: "#F2CF91", text: "#F2CF91" },
        au: { bg: "#FDB923", text: "#FDB923" },
        hg: { bg: "#FED095", text: "#FED095" },
        tl: { bg: "#FED095", text: "#FED095" },
        pb: { bg: "#707768", text: "#707768" },
        bi: { bg: "#869B9B", text: "#869B9B" },
        po: { bg: "#707768", text: "#707768" },
        at: { bg: "#F2CF91", text: "#F2CF91" },
        fr: { bg: "#9BAD7F", text: "#9BAD7F" },
        th: { bg: "#FDB923", text: "#FDB923" },
        u: { bg: "#EFBD75", text: "#EFBD75" },
        f: { bg: "#707768", text: "#707768" },
        zr: { bg: "#707768", text: "#707768" },
        rb: { bg: "#95AA8C", text: "#95AA8C" },
        br: { bg: "#AB4543", text: "#AB4543" },
        ru: { bg: "#86BAB9", text: "#86BAB9" },
        rh: { bg: "#3F443A", text: "#3F443A" },
        pd: { bg: "#D8816C", text: "#D8816C" },
        cd: { bg: "#AF6666", text: "#AF6666" },
        se: { bg: "#D8816C", text: "#D8816C" },
        sb: { bg: "#d98670", text: "#d98670" },
        as: { bg: "#D6A091", text: "#D6A091" },
        tc: { bg: "#869B9B", text: "#869B9B" },
        pm: { bg: "#AB4543", text: "#AB4543" },
        default: { bg: "#9CA3AF", text: "#9CA3AF" },
    };
  }

  function getReportData() {
    var script = document.getElementById("proxy-report-data");
    if (!script || !script.textContent) return null;

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.error("Failed to parse proxy report data", error);
      return null;
    }
  }

  function renderBarChart(chartSelector, leftSelector, items) {
    var chartBox = document.querySelector(chartSelector);
    var leftContent = document.querySelector(leftSelector);
    if (!chartBox || !leftContent) return;

    chartBox.innerHTML = "";
    // Deduplicate items by a normalized key (prefer symbol, fallback to name).
    // If duplicates exist, keep the item with the larger numeric value (ppm or percentage).
    var seen = Object.create(null);
    var deduped = [];
    (items || []).forEach(function (it) {
      var key = String((it.symbol || it.name) || "").trim().toLowerCase();
      if (!key) {
        // preserve items without a name/symbol as-is
        deduped.push(it);
        return;
      }
      var existing = seen[key];
      if (!existing) {
        seen[key] = it;
        deduped.push(it);
        return;
      }
      function numericScore(x) {
        if (!x) return 0;
        var n = Number(String(x).replace(/[^0-9.\-]/g, ""));
        return isFinite(n) ? n : 0;
      }
      var curScore = numericScore(it.ppm || it.percentage);
      var prevScore = numericScore(existing.ppm || existing.percentage);
      if (curScore > prevScore) {
        // replace in-place in deduped array
        var idx = deduped.indexOf(existing);
        if (idx !== -1) deduped[idx] = it;
        seen[key] = it;
      }
    });

    var sortedData = deduped.slice().sort(function (a, b) {
      if (a.fixedLast && !b.fixedLast) return 1;
      if (!a.fixedLast && b.fixedLast) return -1;
      return (b.percentage || 0) - (a.percentage || 0);
    });
    // Compute numeric ppm values from formatted `ppm` strings (e.g. "631272ppm" or "4,414ppm")
    var numericValues = sortedData.map(function (it) {
      if (!it.ppm) return 0;
      var num = Number(String(it.ppm).replace(/[^0-9.\-]/g, ""));
      return isFinite(num) ? num : 0;
    });
    var nonZero = numericValues.filter(function (v) { return v > 0; });
    var minNonZero = nonZero.length ? Math.min.apply(null, nonZero) : 0;
    var maxVal = nonZero.length ? Math.max.apply(null, nonZero) : 0;
    // width mapping constants removed (unused) to satisfy linters

    sortedData.forEach(function (item) {
      var bar = document.createElement("div");
      bar.className = "element_bar";
      // Fix bar height and use width to visually represent value (ppm)
      var value = 0;
      if (item.ppm) {
        value = Number(String(item.ppm).replace(/[^0-9.\-]/g, "")) || 0;
      }

      var MIN_BAR_HEIGHT = 42;
      var MAX_BAR_HEIGHT = 100;

      var pxHeight;
      if (maxVal <= 0 || value <= 0) {
        pxHeight = MIN_BAR_HEIGHT;
      } else if (minNonZero === maxVal) {
        pxHeight = MAX_BAR_HEIGHT;
      } else {
  var linearRatio = (value - minNonZero) / (maxVal - minNonZero);
  pxHeight = Math.round(MIN_BAR_HEIGHT + linearRatio * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
}

      var isMobile = window.innerWidth <= 767;
      if (isMobile) {
        bar.style.minHeight = Math.max(pxHeight, MIN_BAR_HEIGHT) + "px";
      } else {
        bar.style.height = Math.max(pxHeight, MIN_BAR_HEIGHT) + "px";
      }
      bar.style.width = "100%";
      bar.style.backgroundColor = item.color;
      bar.style.borderRadius = "10px 0 0 0";

      var name = document.createElement("span");
      name.className = "element_bar_name";
      var ppmNum = Number(String(item.ppm || "").replace(/[^0-9.\-]/g, "")) || 0;
      var pctStr = ppmNum > 0 ? " (" + (ppmNum / 10000).toFixed(3) + "%)" : "";
      name.innerText = item.name + pctStr;

      var value = document.createElement("span");
      value.className = "element_bar_value";
      value.innerText = item.ppm != null && item.ppm !== "" ? item.ppm.replace('ppm',' ppm') : "";

      bar.appendChild(name);
      bar.appendChild(value);
      chartBox.appendChild(bar);
    });
    chartBox.style.height = "auto";
    chartBox.style.minHeight = (sortedData.length * 42) + "px";
  }

  function initElementBreakdowns() {
    if (!reportData) return;
    renderBarChart("#main-chart", ".elemental_breakdown_section .report_left_content", reportData.elementBreakdown.items || []);
    renderBarChart("#trace-chart", ".other_trace_elements_section .report_left_content", reportData.otherTraceElements.items || []);
  }

  function getElementBlurbs() {
    var script = document.getElementById("element-blurbs-data");
    if (!script || !script.textContent) return {};

    try {
      return JSON.parse(script.textContent);
    } catch (error) {
      console.error("Failed to parse element blurbs", error);
      return {};
    }
  }

  function initElementBlurbModal() {
    var modal = document.querySelector("[data-element-blurb-modal]");
    if (!modal) return;

    var blurbs = getElementBlurbs();
    var title = modal.querySelector("[data-element-blurb-title]");
    var symbol = modal.querySelector("[data-element-blurb-symbol]");
    var content = modal.querySelector("[data-element-blurb-content]");
    var closeButtons = modal.querySelectorAll("[data-element-blurb-close]");

    function closeModal() {
      modal.classList.remove("is_open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("element_blurb_modal_open");
    }

    function openModal(elementSymbol, elementColor) {
      var key = String(elementSymbol || "").trim().toUpperCase();
      var blurb = blurbs[key];
      if (!blurb || !title || !symbol || !content) return;

      var accentColor = String(elementColor || "").trim();
      modal.style.setProperty("--element-accent", accentColor || "#8b2323");
      title.textContent = blurb.name || key;
      // Render the eyebrow with the element symbol wrapped in a span so it can be styled separately.
      // Use innerHTML but ensure we escape any user-provided values to avoid XSS.
      var rawSymbol = String(blurb.symbol || key);
      var rawAtomic = String(blurb.atomicNumber || "");
      function escapeHtml(str) {
        return String(str).replace(/[&<>"'`=\/]/g, function (s) {
          return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#x60;',
            '=': '&#x3D;',
            '/': '&#x2F;'
          })[s];
        });
      }

      var escapedSymbol = escapeHtml(rawSymbol);
      var escapedAtomic = escapeHtml(rawAtomic);
      // Only wrap the leading chemical symbol (letters) in a span. If symbol contains extra text,
      // we take the first token (up to whitespace or punctuation).
      var firstTokenMatch = escapedSymbol.match(/^([A-Za-z]{1,3})/);
      var leading = firstTokenMatch ? firstTokenMatch[1] : escapedSymbol;
      var rest = escapedSymbol.slice(leading.length);
      symbol.innerHTML = '<span class="element_blurb_symbol_lead">' + leading + '</span>' + rest + ' · Atomic no. ' + escapedAtomic;
      content.innerHTML = "";

      (blurb.sections || []).forEach(function (section) {
        var item = document.createElement("section");
        item.className = "element_blurb_section";

        var heading = document.createElement("h4");
        heading.textContent = section.title || "";

  // Render section body. For "Famous Comparisons" we split sentences into
  // separate paragraphs so each sentence shows as its own <p> on the frontend.
  var bodyHtml = section.body || "";
  item.appendChild(heading);
  try {
    if (section.title && /famous comparisons/i.test(String(section.title))) {
      // Split on sentence endings (.!?), keeping the punctuation with the sentence.
      var sentences = String(bodyHtml).split(/(?<=[.!?])\s+/);
      sentences.forEach(function (s) {
        var p = document.createElement("p");
        p.innerHTML = s.trim();
        item.appendChild(p);
      });
    } else {
      var paragraph = document.createElement("p");
      // Render section body as HTML so links added in the element blurbs data will work.
      // Note: the blurb data comes from a local source file (app/lib/element-blurbs.ts).
      paragraph.innerHTML = bodyHtml;
      item.appendChild(paragraph);
    }
  } catch (err) {
    // Fallback to single paragraph if splitting fails for any reason
    var paragraph = document.createElement("p");
    paragraph.innerHTML = bodyHtml;
    item.appendChild(paragraph);
  }
        content.appendChild(item);
      });
      modal.classList.add("is_open");
      // Ensure the modal content is scrolled to the top each time we open it.
      // Do this after the modal becomes visible so the browser can apply layout
      // and the scrollTop assignment takes effect.
      try {
        if (content && typeof content.scrollTop !== 'undefined') {
          requestAnimationFrame(function () {
            try {
              content.scrollTop = 0;
            } catch (err) {
              // ignore
            }
          });
        }
      } catch (e) {
        // ignore if scroll reset fails
      }
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("element_blurb_modal_open");
    }

    document.querySelectorAll("[data-element-blurb-trigger]").forEach(function (button) {
      button.addEventListener("click", function () {
        openModal(
          button.getAttribute("data-element-symbol"),
          button.getAttribute("data-element-color")
        );
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

      // If a link inside the blurb content points to an in-page anchor (e.g. "#add_resources_section"),
      // close the modal and then navigate/scroll to that section.
      if (content) {
        content.addEventListener('click', function (evt) {
          try {
            var anchor = evt.target.closest ? evt.target.closest('a') : null;
            if (!anchor) return;
            var href = anchor.getAttribute('href') || '';
            if (href.charAt(0) === '#') {
              evt.preventDefault();
              var targetId = href.slice(1);
              closeModal();
              // Wait a short moment for modal close animations to run, then scroll to target smoothly.
              setTimeout(function () {
                var target = document.getElementById(targetId);
                if (target) {
                  try {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // update the URL hash without adding a new history entry
                    history.replaceState(null, '', '#' + targetId);
                  } catch (e) {
                    location.hash = href;
                  }
                } else {
                  // fallback: set hash so browser jumps
                  location.hash = href;
                }
              }, 160);
            }
          } catch (err) {
            // ignore errors from event handler
          }
        });
      }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is_open")) {
        closeModal();
      }
    });
  }

  function initPreciousMetals() {
    var wrapper = document.getElementById("graph_wrapper");
    if (!wrapper || !reportData) return;

    Array.from(wrapper.children).forEach(function (child) {
      if (child.id !== "master_bar_layout") {
        wrapper.removeChild(child);
      }
    });

    var sorted = (reportData.preciousMetalPresent.items || []).slice().sort(function (a, b) { return Number(b.ppm) - Number(a.ppm); });
    if (!sorted.length) return;
    var maxPpm = Math.max.apply(null, sorted.map(function (item) { return Number(item.ppm) || 0; }));
    if (maxPpm <= 0) return;

    // Collect all non-zero ppm values to find the range for proportional scaling
    var nonZeroPpms = sorted.map(function (item) { return Number(item.ppm) || 0; }).filter(function (v) { return v > 0; });
    var minNonZeroPpm = nonZeroPpms.length ? Math.min.apply(null, nonZeroPpms) : maxPpm;
    var MIN_BAR_HEIGHT = 22;  // minimum height % for any non-zero bar
    var MAX_BAR_HEIGHT = 100; // maximum height % for the highest bar
    var ZERO_BAR_HEIGHT = 8;  // fixed height % for zero-value bars

    sorted.forEach(function (item) {
      var ppm = Number(item.ppm) || 0;
      var isZeroValue = ppm <= 0;

      var heightPercent;
      if (isZeroValue) {
        heightPercent = ZERO_BAR_HEIGHT;
      } else if (minNonZeroPpm === maxPpm) {
        // Only one unique non-zero value → give it full height
        heightPercent = MAX_BAR_HEIGHT;
      } else {
        // Map [minNonZeroPpm, maxPpm] → [MIN_BAR_HEIGHT, MAX_BAR_HEIGHT]
        // so every distinct non-zero value has a unique proportional height
        heightPercent = MIN_BAR_HEIGHT + ((ppm - minNonZeroPpm) / (maxPpm - minNonZeroPpm)) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);
      }

      var barWrapper = document.createElement("div");
      barWrapper.className = "graph_bar_wrapper";
      barWrapper.style.display = "flex";

      var body = document.createElement("div");
      body.className = isZeroValue ? "bar_body zero_value" : "bar_body";
      body.style.height = heightPercent + "%";
      body.style.backgroundColor = item.color;

      var ppmValue = document.createElement("span");
      ppmValue.className = "ppm_value";
      ppmValue.textContent = ppm + " ppm";
      body.appendChild(ppmValue);

      var labelContainer = document.createElement("div");
      labelContainer.className = "label_container";

      var fullName = document.createElement("span");
      fullName.className = "metal_full_name";
      fullName.textContent = item.name;

      var shortSymbol = document.createElement("span");
      shortSymbol.className = "metal_short_symbol";
      shortSymbol.textContent = "(" + item.symbol + ")";

      labelContainer.appendChild(fullName);
      labelContainer.appendChild(shortSymbol);
      barWrapper.appendChild(body);
      barWrapper.appendChild(labelContainer);
      wrapper.appendChild(barWrapper);
    });
  }

  // Replace ONLY initReportDetails

  function initReportDetails() {
  var canvas = document.getElementById("element_layered_chart");
  if (!canvas || !window.Chart || !reportData) return;

  if (reportChart) {
    reportChart.destroy();
  }

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var ELEMENT_REFS = {
    "O":  { mean: 425000,   sd: 37500 },
    "F":  { mean: 300,      sd: 100 },
    "Na": { mean: 5500,     sd: 2000 },
    "Mg": { mean: 5500,     sd: 2250 },
    "Al": { mean: 55000,    sd: 22500 },
    "Si": { mean: 275000,   sd: 37500 },
    "P":  { mean: 700,      sd: 250 },
    "S":  { mean: 550,      sd: 225 },
    "Cl": { mean: 130,      sd: 40 },
    "K":  { mean: 20000,    sd: 7500 },
    "Ca": { mean: 25500,    sd: 12250 },
    "Sc": { mean: 20,       sd: 5 },
    "Ti": { mean: 5500,     sd: 2250 },
    "V":  { mean: 80,       sd: 35 },
    "Cr": { mean: 77.5,     sd: 36.25 },
    "Mn": { mean: 1750,     sd: 625 },
    "Fe": { mean: 37500,    sd: 16250 },
    "Co": { mean: 20.5,     sd: 9.75 },
    "Ni": { mean: 51,       sd: 24.5 },
    "Cu": { mean: 51,       sd: 24.5 },
    "Zn": { mean: 165,      sd: 67.5 },
    "Ga": { mean: 12.5,     sd: 6.25 },
    "Ge": { mean: 1.05,     sd: 0.475 },
    "As": { mean: 10.5,     sd: 4.75 },
    "Se": { mean: 1.05,     sd: 0.475 },
    "Br": { mean: 2.5,      sd: 1.25 },
    "Rb": { mean: 65,       sd: 17.5 },
    "Sr": { mean: 260,      sd: 75 },
    "Y":  { mean: 22.5,     sd: 8.75 },
    "Zr": { mean: 200,      sd: 50 },
    "Nb": { mean: 16,       sd: 7 },
    "Mo": { mean: 1,        sd: 0.5 },
    "Tc": { mean: 0,        sd: 0.01 },
    "Ru": { mean: 0,        sd: 0.01 },
    "Rh": { mean: 0,        sd: 0.01 },
    "Pd": { mean: 0,        sd: 0.01 },
    "Ag": { mean: 0.505,    sd: 0.2475 },
    "Cd": { mean: 0.505,    sd: 0.2475 },
    "In": { mean: 0.255,    sd: 0.1225 },
    "Sn": { mean: 2.75,     sd: 1.125 },
    "Sb": { mean: 1.025,    sd: 0.4875 },
    "Te": { mean: 0.505,    sd: 0.2475 },
    "I":  { mean: 2.75,     sd: 1.125 },
    "Cs": { mean: 6,        sd: 3.5 },
    "Ba": { mean: 700,      sd: 237.5 },
    "La": { mean: 27.5,     sd: 11.25 },
    "Ce": { mean: 55,       sd: 22.5 },
    "Pr": { mean: 6.5,      sd: 2.75 },
    "Nd": { mean: 27.5,     sd: 11.25 },
    "Pm": { mean: 0,        sd: 0.01 },
    "Sm": { mean: 5.5,      sd: 2.25 },
    "Eu": { mean: 1.6,      sd: 0.7 },
    "Gd": { mean: 5.5,      sd: 2.25 },
    "Tb": { mean: 1.05,     sd: 0.475 },
    "Dy": { mean: 3,        sd: 1.335 },
    "Ho": { mean: 1.05,     sd: 0.475 },
    "Er": { mean: 2.25,     sd: 1.125 },
    "Tm": { mean: 0.4,      sd: 0.2 },
    "Yb": { mean: 2,        sd: 0.85 },
    "Lu": { mean: 0.525,    sd: 0.2375 },
    "Hf": { mean: 2.75,     sd: 1.125 },
    "Ta": { mean: 2.75,     sd: 1.125 },
    "W":  { mean: 2.55,     sd: 1.225 },
    "Re": { mean: 0,        sd: 0.01 },
    "Os": { mean: 0,        sd: 0.01 },
    "Ir": { mean: 0,        sd: 0.01 },
    "Pt": { mean: 0,        sd: 0.01 },
    "Au": { mean: 0.00525,  sd: 0.002375 },
    "Hg": { mean: 0.105,    sd: 0.0475 },
    "Tl": { mean: 0.2,      sd: 0.05 },
    "Pb": { mean: 17.5,     sd: 6.25 },
    "Bi": { mean: 0.505,    sd: 0.2475 },
    "Po": { mean: 0,        sd: 0.01 },
    "At": { mean: 0,        sd: 0.01 },
    "Ra": { mean: 0,        sd: 0.01 },
    "Ac": { mean: 0,        sd: 0.01 },
    "Th": { mean: 7,        sd: 3 },
    "Pa": { mean: 0,        sd: 0.01 },
    "U":  { mean: 2.25,     sd: 1.125 }
  };

  // ── z-score → visual radius (0–100) ─────────────────────────────
  // Axis: z=-2 → 0 (center), z=-1 → 25, z=0 → 50, z=+1 → 75, z=+2 → 100 (edge)
  // Each SD unit = 25 visual units
  function zToVisual(z) {
    var clamped = Math.max(-2, Math.min(2, z));
    return (clamped + 2) / 4 * 100;
  }

  function calcZAndVisual(ppm, symbol) {
    var ref = ELEMENT_REFS[symbol];
    if (!ref || ref.sd <= 0) return null;
    var z = (ppm - ref.mean) / ref.sd;
    var visual = zToVisual(z);
    return { z: z, visual: visual };
  }

  // Band boundaries in visual units
  var V_NEG2 = 0;   // z = -2  (white center)
  var V_NEG1 = 25;  // z = -1  (inner ring boundary)
  var V_MEAN = 50;  // z =  0  (mean — dashed line)
  var V_POS1 = 75;  // z = +1  (outer ring boundary)
  var V_POS2 = 100; // z = +2  (outer edge)

  var reportChartData = (reportData.reportDetails && reportData.reportDetails.reportChart) || null;
  if (!reportChartData) return;

  var undrPalette = [
    '#a32720','#f6b315','#2f8f46','#1f78b4',
    '#8b2323','#e67e22','#7c3aed','#0891b2',
    '#be185d','#065f46','#92400e','#1e40af',
    '#6d28d9','#047857','#b45309','#dc2626',
    '#7c2d12','#15803d','#1d4ed8','#9333ea'
  ];

  var labels     = [];
  var visualData = [];
  var barColors  = [];

  // ── CONSOLE LOG TABLE ─────────────────────────────────────────────
  var debugRows = [];

  (reportChartData.elementNames || []).forEach(function (symbol, idx) {
    var calc = (reportChartData.calculations || [])[idx] || {};
    var ppm  = Number(calc.adjustedPpm) || 0;
    if (ppm <= 0) return;

    var result = calcZAndVisual(ppm, symbol);
    if (result === null) return;

    var z = result.z;
    var visual = result.visual;

    // Determine SD zone label
    var sdZone;
    if (z >= 2)       sdZone = "≥ +2 SD (extreme high)";
    else if (z >= 1)  sdZone = "+1 to +2 SD (above avg)";
    else if (z >= 0)  sdZone = "0 to +1 SD (avg-high)";
    else if (z >= -1) sdZone = "-1 to 0 SD (avg-low)";
    else if (z >= -2) sdZone = "-2 to -1 SD (below avg)";
    else              sdZone = "< -2 SD (extreme low)";

    // ── DEBUG LOG ──────────────────────────────────────────────────
    // Add a detailed console group showing the calculation steps for each element
    try {
      var _refMean = (ELEMENT_REFS[symbol] || {}).mean;
      var _refSd = (ELEMENT_REFS[symbol] || {}).sd;
      console.groupCollapsed("Calc: " + symbol + " — z-score details");
      console.log("ppm:", ppm);
      console.log("mean:", _refMean, "sd:", _refSd);
      console.log("z = (ppm - mean) / sd =>", "(" + ppm + " - " + _refMean + ") / " + _refSd + " =", z.toFixed(3));
      var _clamped = Math.max(-2, Math.min(2, z));
      console.log("clamped z:", _clamped.toFixed(3), "→ visual:", zToVisual(z).toFixed(1), "(0-100)");
      console.log("sd zone:", sdZone, "(based on z)");
      console.groupEnd();
    } catch (e) {
      /* ignore logging errors */
    }

    debugRows.push({
      symbol:     symbol,
      ppm:        ppm,
      mean:       (ELEMENT_REFS[symbol] || {}).mean,
      sd:         (ELEMENT_REFS[symbol] || {}).sd,
      z_score:    parseFloat(z.toFixed(3)),
      visual_val: parseFloat(visual.toFixed(1)),
      sd_zone:    sdZone
    });

    // Minimum visible bar — z=-2 gets visual=0, push to 2 so label shows
    if (visual <= 0) return;
    visual = Math.max(2, Math.min(100, visual));

    labels.push(symbol);
    visualData.push(visual);
    // Prefer per-element color from a provided ELEMENT_COLOR_MAP (server-injected
    // on the window) or from reportData.elementColorMap. Fall back to palette.
    var symKey = String(symbol || "").trim().toLowerCase();
    var color = (
      (window.ELEMENT_COLOR_MAP && window.ELEMENT_COLOR_MAP[symKey] && (window.ELEMENT_COLOR_MAP[symKey].bg || window.ELEMENT_COLOR_MAP[symKey].color)) ||
      (reportData && reportData.elementColorMap && reportData.elementColorMap[symKey]) ||
      undrPalette[labels.length % undrPalette.length]
    );
    barColors.push(color);
  });

  // Print the debug table
  console.group("🔬 Soil Fingerprint Chart — Z-Score Debug");
  console.table(debugRows);
  console.groupEnd();

  // ── Ring plugin — drawn AFTER datasets so rings are BEHIND bars ──
  var ringPlugin = {
    id: 'zScoreRings',

    // Draw rings BEFORE datasets so bars render ON TOP
    beforeDatasetsDraw: function (chart) {
  try {
    var c   = chart.ctx;
    var scR = chart.scales && chart.scales.r;
    if (!scR) return;
    var cx   = (chart.chartArea.left + chart.chartArea.right)  / 2;
    var cy   = (chart.chartArea.top  + chart.chartArea.bottom) / 2;
    var maxR = scR.drawingArea;

    // eslint-disable-next-line no-inner-declarations
    function vR(v) { return (v / 100) * maxR; }

    c.save();

    // Zone 5 — outermost: fully dark grey
    c.beginPath();
    c.arc(cx, cy, vR(V_POS2), 0, Math.PI * 2);
    c.fillStyle = '#939598';
    c.fill();

    // Zone 4 — second ring: medium dark grey
    c.beginPath();
    c.arc(cx, cy, vR(V_POS1), 0, Math.PI * 2);
    c.fillStyle = '#a6a8ab';
    c.fill();

    // Zone 3 — middle: dark grey
    c.beginPath();
    c.arc(cx, cy, vR(V_MEAN), 0, Math.PI * 2);
    c.fillStyle = '#d3d3d3';
    c.fill();

    // Zone 2 — inner: light grey
    c.beginPath();
    c.arc(cx, cy, vR(V_NEG1), 0, Math.PI * 2);
    c.fillStyle = '#e5e6e7';
    c.fill();

    // Zone 1 — center: white
    c.beginPath();
    c.arc(cx, cy, vR(V_NEG2) + 3, 0, Math.PI * 2);
    c.fillStyle = '#e5e6e7';
    c.fill();

    // White boundary lines between zones
    [V_NEG1, V_MEAN, V_POS1, V_POS2].forEach(function (v, i) {
      c.beginPath();
      c.arc(cx, cy, vR(v), 0, Math.PI * 2);
      c.strokeStyle = 'rgba(255,255,255,1)';
      c.lineWidth = i === 3 ? 3 : 2.5;
      if (c.setLineDash) c.setLineDash([]);
      c.stroke();
    });

     c.beginPath();
    c.arc(cx, cy, vR(V_POS2), 0, Math.PI * 2);
    c.clip();
    // Note: no c.restore() here — clip must stay active while bars are drawn
  } catch (e) { /* ignore */ }
},
  };

  reportChart = new window.Chart(ctx, {
    plugins: [ringPlugin],
    type: "polarArea",
    data: {
      labels: labels,
      datasets: [{
        label: "Element Z-Score",
        data: visualData,
        backgroundColor: barColors,   // Full solid — no opacity
        borderWidth: 1.5,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      events: [],
      layout: { padding: 28 },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          angleLines: { color: "rgba(17,24,39,0.06)" },
          grid: { display: false },
          pointLabels: {
            display: true,
            centerPointLabels: true,
            padding: 8,
            font: { size: 10, weight: "600" },
            color: "#4b5563"
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

  function initEarthElements() {
    var chartRef = document.getElementById("chart_wrapper");
    if (!chartRef || !window.d3 || !reportData) return;

    var d3 = window.d3;
    d3.select(chartRef).selectAll("*").remove();

    var isMobile = window.innerWidth < 767;
    var width = 1000;
    var height = isMobile ? 1100 : 900;

    var svg = d3.select(chartRef)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMidYMid meet");

    var data = (reportData.earthElementsBreakdown.items || []).map(function (item) { return Object.assign({}, item); });
    if (!data.length) return;

    var detectedCount = data.length;

    function computeMaxBubbleRadius(count, layoutWidth, layoutHeight) {
      if (count <= 0) return isMobile ? 118 : 108;
      var sidePad = 24;
      var labelPad = 36;
      var minGap = 10;
      var usableW = layoutWidth - sidePad * 2;
      var usableH = layoutHeight - sidePad * 2 - labelPad;
      var grid = Math.ceil(Math.sqrt(count));
      var maxFromW = (usableW - minGap * Math.max(0, grid - 1)) / (grid * 2);
      var maxFromH = (usableH - minGap * Math.max(0, grid - 1)) / (grid * 2);
      var absoluteMax = isMobile ? 118 : 108;
      var absoluteMin = isMobile ? 42 : 38;
      var fitMax = Math.min(maxFromW, maxFromH) - minGap;
      return Math.max(absoluteMin, Math.min(absoluteMax, fitMax));
    }

    var maxBubbleRadius = computeMaxBubbleRadius(detectedCount, width, height);
    var minBubbleRadius = Math.max(isMobile ? 42 : 38, Math.round(maxBubbleRadius * 0.38));

    var minPpm = d3.min(data, function (item) { return item.ppm; }) || 2;
    var maxPpm = d3.max(data, function (item) { return item.ppm; }) || minPpm || 31;
    if (minPpm >= maxPpm) {
      minPpm = maxPpm > 0 ? maxPpm * 0.01 : 1;
    }

    var radiusScale = d3.scaleSqrt()
      .domain([minPpm, maxPpm])
      .range([minBubbleRadius, maxBubbleRadius]);

    function getNodeRadius(item) {
      if (item && item.isPlaceholder) {
        return (item.placeholderDiameter || 150) / 2;
      }
      return radiusScale(item.ppm);
    }

    function truncateLabel(text, maxChars) {
      if (!text || text.length <= maxChars) return text;
      return text.slice(0, Math.max(1, maxChars - 3)) + "...";
    }

    // If few elements detected, add unlabeled placeholder bubbles to reach a fuller-looking chart
    if (detectedCount > 0 && detectedCount < 5) {
      var targetTotal = 8;
      var placeholdersToAdd = Math.max(0, targetTotal - detectedCount);
      var palette = ["#a32720", "#f6b315", "#a6acb5", "#e99180", "#b46a5f", "#e8d3a5", "#c9d4e9", "#d48f7f"];
      var detectedRadii = data.map(function (it) { return getNodeRadius(it); });
      var smallestRadius = detectedRadii.length ? Math.min.apply(null, detectedRadii) : (isMobile ? 160 : 75);
      var placeholderDiameterFromSmallest = Math.max(6, Math.round(smallestRadius * 2));

      for (var p = 0; p < placeholdersToAdd; p += 1) {
        data.push({
          name: "",
          ppm: Math.max(0.5, Math.round((minPpm || 1) * 0.5)),
          color: palette[(p + detectedCount) % palette.length],
          isPlaceholder: true,
          fixedLast: false,
          placeholderDiameter: placeholderDiameterFromSmallest
        });
      }
    }

    function formatRestName(fullName, maxChars) {
      if (!fullName) return "";
      return "(" + truncateLabel(fullName, maxChars).toLowerCase() + ")";
    }

    function getCircleLabelParts(item) {
      var rawName = String(item.name || "").trim();
      var match = rawName.match(/^(.*?)(?:\s*\(([A-Za-z0-9]{1,3})\))?$/);
      var fullName = match && match[1] ? match[1].trim() : rawName;
      var rawSymbol = match && match[2] ? match[2].trim() : "";
      var symbol = "";
      if (rawSymbol) {
        symbol = rawSymbol.charAt(0).toUpperCase() + rawSymbol.slice(1).toLowerCase();
      }
      var radius = getNodeRadius(item);

      if (!symbol) {
        if (radius <= (isMobile ? 65 : 58)) {
          return { symbol: truncateLabel(fullName, 4), symbolFont: isMobile ? "18px" : "14px", rest: formatRestName(fullName, 6), restFont: isMobile ? "10px" : "9px", ppmFont: isMobile ? "36px" : "28px" };
        }
        if (radius <= (isMobile ? 82 : 74)) {
          return { symbol: truncateLabel(fullName, 6), symbolFont: isMobile ? "14px" : "10px", rest: formatRestName(fullName, 8), restFont: isMobile ? "12px" : "10px", ppmFont: isMobile ? "38px" : "30px" };
        }
        if (radius <= (isMobile ? 100 : 90)) {
          return { symbol: truncateLabel(fullName, 10), symbolFont: isMobile ? "16px" : "12px", rest: formatRestName(fullName, 10), restFont: isMobile ? "14px" : "12px", ppmFont: isMobile ? "40px" : "32px" };
        }
        return { symbol: fullName, symbolFont: isMobile ? "20px" : "16px", rest: formatRestName(fullName, fullName.length), restFont: isMobile ? "16px" : "14px", ppmFont: isMobile ? "44px" : "36px" };
      }

      if (radius <= (isMobile ? 65 : 58)) {
        return { symbol: symbol, symbolFont: isMobile ? "28px" : "22px", rest: formatRestName(fullName, 6), restFont: isMobile ? "10px" : "9px", ppmFont: isMobile ? "36px" : "28px" };
      }
      if (radius <= (isMobile ? 82 : 74)) {
        return {
          symbol: symbol,
          symbolFont: isMobile ? "24px" : "18px",
          rest: formatRestName(fullName, 6),
          restFont: isMobile ? "12px" : "10px",
          ppmFont: isMobile ? "38px" : "30px",
        };
      }
      if (radius <= (isMobile ? 100 : 90)) {
        return {
          symbol: symbol,
          symbolFont: isMobile ? "28px" : "22px",
          rest: formatRestName(fullName, 10),
          restFont: isMobile ? "14px" : "12px",
          ppmFont: isMobile ? "40px" : "32px",
        };
      }

      return {
        symbol: symbol,
        symbolFont: isMobile ? "34px" : "26px",
        rest: formatRestName(fullName, fullName.length),
        restFont: isMobile ? "16px" : "14px",
        ppmFont: isMobile ? "44px" : "36px",
      };
    }

    function fitChartViewBox(items) {
      var edgePad = 22;
      var labelPad = 36;
      var minX = Infinity;
      var minY = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;

      items.forEach(function (item) {
        var r = getNodeRadius(item);
        var textPad = item.isPlaceholder ? 0 : labelPad;
        minX = Math.min(minX, item.x - r);
        minY = Math.min(minY, item.y - r);
        maxX = Math.max(maxX, item.x + r);
        maxY = Math.max(maxY, item.y + r + textPad);
      });

      if (!Number.isFinite(minX)) return;

      svg.attr("viewBox", [
        minX - edgePad,
        minY - edgePad,
        maxX - minX + edgePad * 2,
        maxY - minY + edgePad * 2,
      ].join(" "));
    }

    var highest = data.reduce(function (prev, curr) { return prev.ppm > curr.ppm ? prev : curr; });
    var centerX = width / 2;
    var centerY = height / 2;

    data.forEach(function (item) {
      if (item === highest) {
        item.fx = centerX;
        item.fy = centerY;
      } else {
        item.fx = null;
        item.fy = null;
      }
    });

    var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(centerX).strength(0.5))
      .force("y", d3.forceY(centerY).strength(0.5))
      .force("collide", d3.forceCollide(function (item) {
        return getNodeRadius(item) + 6;
      }))
      .stop();

    for (var i = 0; i < 600; i += 1) simulation.tick();

    fitChartViewBox(data);

    var node = svg.selectAll(".node")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (item) { return "translate(" + item.x + "," + item.y + ")"; });

    node.append("circle")
      .attr("r", function (item) { return getNodeRadius(item); })
      .attr("fill", function (item) { return item.color; });

    node.each(function (item) {
      if (item.isPlaceholder) return;
      var g = d3.select(this);
      var text = g.append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .style("font-family", "'Obviously', Arial, sans-serif")
        .style("pointer-events", "none");

      text.append("tspan")
        .attr("x", 0)
        .attr("dy", "-0.6em")
        .style("font-size", function (d) { return getCircleLabelParts(d).symbolFont; })
        .style("font-weight", "700")
        .text(function (d) { return getCircleLabelParts(d).symbol; });

      text.append("tspan")
        .attr("dy", "0")
        .style("font-size", function (d) { return getCircleLabelParts(d).restFont || (isMobile ? "14px" : "12px"); })
        .style("font-weight", "600")
        .text(function (d) { return getCircleLabelParts(d).rest || ""; });

      text.append("tspan")
        .attr("x", 0)
        .attr("dy", "1.1em")
        .style("font-size", function (d) { return getCircleLabelParts(d).ppmFont; })
        .style("font-weight", "bold")
        .text(function (d) { return d.ppm; });

      text.append("tspan")
        .attr("x", 0)
        .attr("dy", "1.2em")
        .style("font-size", isMobile ? "16px" : "14px")
        .text("ppm");
    });
  }

  function initAll() {
    if (!reportData) return;
    document.querySelectorAll("[data-pdf-download]").forEach(function (button) {
      button.addEventListener("click", function () {
        var reportElement = document.querySelector("[data-proxy-id]");
        var jsPDF = window.jspdf && window.jspdf.jsPDF;
        if (!reportElement || !window.html2canvas || !jsPDF) {
          window.print();
          return;
        }

        var originalText = button.textContent;
        button.disabled = true;
        button.classList.add("is_loading");
        button.querySelector("span").textContent = "Saving...";

        var customerName = String((reportData.banner && reportData.banner.name) || "report")
          .trim()
          .replace(/[^a-z0-9]+/gi, "-")
          .replace(/^-+|-+$/g, "")
          .toLowerCase();

        var reportRoot = reportElement.children[0] || reportElement;
        var sections = Array.from(reportRoot.children).filter(function (element) {
          return !(element.classList && element.classList.contains("pdf_download_footer"));
        });

        var canvasOptions = {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(reportElement.scrollWidth, document.documentElement.scrollWidth),
          onclone: function (clonedDocument) {
            clonedDocument.querySelectorAll(".pdf_download_footer").forEach(function (element) {
              element.remove();
            });
            clonedDocument.querySelectorAll(".oil_label, .oil_found_text, .oil_ppm_value, .crude_oil_title, .crude_oil_result_status, .crude_oil_result_value").forEach(function (element) {
              element.style.color = "#ffffff";
              element.style.opacity = "1";
              element.style.visibility = "visible";
              element.style.fontFamily = "Arial, sans-serif";
              element.style.textShadow = "0 0 0 #ffffff";
            });
            clonedDocument.querySelectorAll(".oil_found_text, .oil_ppm_value, .crude_oil_title, .crude_oil_result_status, .crude_oil_result_value").forEach(function (element) {
              element.style.display = "inline-block";
              element.style.fontWeight = "700";
            });
            clonedDocument.querySelectorAll(".precious_zero_unit").forEach(function (element) {
              element.style.webkitTextFillColor = "#9e2a1f";
              element.style.color = "#9e2a1f";
            });
            clonedDocument.querySelectorAll(".precious_zero_value").forEach(function (element) {
              var rect = element.getBoundingClientRect();
              var svg = clonedDocument.createElementNS("http://www.w3.org/2000/svg", "svg");
              svg.setAttribute("class", element.getAttribute("class") || "precious_zero_value");
              svg.setAttribute("viewBox", "0 0 260 360");
              svg.setAttribute("aria-label", "0");
              svg.innerHTML =
                '<ellipse cx="130" cy="178" rx="70" ry="128" fill="none" stroke="#a32720" stroke-width="48"></ellipse>' +
                '<path d="M130 50A70 128 0 0 0 60 178" fill="none" stroke="#85878a" stroke-width="48" stroke-linecap="butt"></path>' +
                '<path d="M130 50A70 128 0 0 1 190 244" fill="none" stroke="#f6b315" stroke-width="48" stroke-linecap="butt"></path>' +
                '<path d="M60 178A70 128 0 0 0 130 306" fill="none" stroke="#a32720" stroke-width="48" stroke-linecap="butt"></path>';
              svg.style.width = Math.round(rect.width * 0.9) + "px";
              svg.style.height = Math.round(rect.height * 0.9) + "px";
              svg.style.display = "block";
              svg.style.flex = "0 0 auto";
              element.replaceWith(svg);
            });
          },
        };

        function drawOilTextOnCanvas(canvas, section) {
          if (!section.classList || !section.classList.contains("oil_contaminants_section")) return [];

          var context = canvas.getContext("2d");
          var sectionRect = section.getBoundingClientRect();
          var scaleX = canvas.width / sectionRect.width;
          var scaleY = canvas.height / sectionRect.height;
          var overlays = [];

          function drawElementText(selector, weight) {
            var element = section.querySelector(selector);
            if (!element) return;
            if (element.closest(".crude_oil_result_card_locked")) return;

            var rect = element.getBoundingClientRect();
            var styles = window.getComputedStyle(element);
            var fontSize = parseFloat(styles.fontSize || "16");
            var lineHeight = parseFloat(styles.lineHeight || String(fontSize * 1.2));
            var x = (rect.left - sectionRect.left) * scaleX;
            var y = (rect.top - sectionRect.top) * scaleY;
            var fontSizeOnCanvas = fontSize * scaleY;
            var textY = y + Math.max(0, ((lineHeight - fontSize) / 2) * scaleY);
            var text = element.textContent || "";

            context.save();
            context.fillStyle = "#ffffff";
            context.textBaseline = "top";
            context.font = (weight || styles.fontWeight || "400") + " " + fontSizeOnCanvas + "px Arial, sans-serif";
            context.fillText(text, x, textY);
            context.restore();
            overlays.push({
              text: text,
              x: x,
              y: textY,
              fontSize: fontSizeOnCanvas,
              weight: weight || styles.fontWeight || "400",
            });
          }

          drawElementText(".oil_label", "400");
          drawElementText(".oil_found_text", "700");
          drawElementText(".oil_ppm_value", "700");
          drawElementText(".crude_oil_title", "700");
          drawElementText(".crude_oil_result_status", "700");
          drawElementText(".crude_oil_result_value", "700");
          return overlays;
        }

        function drawOilTextOnPdf(pdf, oilTexts, pagePadding, pageY, imageWidth, imageHeight, canvas) {
          if (!oilTexts || oilTexts.length === 0) return;

          var scaleX = imageWidth / canvas.width;
          var scaleY = imageHeight / canvas.height;

          pdf.setTextColor(255, 255, 255);
          oilTexts.forEach(function (item) {
            pdf.setFont("helvetica", String(item.weight) === "700" ? "bold" : "normal");
            pdf.setFontSize(item.fontSize * scaleY);
            pdf.text(item.text, pagePadding + (item.x * scaleX), pageY + (item.y * scaleY) + (item.fontSize * scaleY));
          });
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(0, 0, 0);
        }

        window.html2canvas(reportRoot, canvasOptions)
          .then(function (canvas) {
            if (!canvas.width || !canvas.height) {
              window.print();
              return;
            }

            var pdfWidth = 1152;
            var pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            var pdf = new jsPDF({
              unit: "pt",
              format: [pdfWidth, pdfHeight],
              orientation: "portrait",
            });
            var imageData = canvas.toDataURL("image/jpeg", 0.96);
            pdf.addImage(imageData, "JPEG", 0, 0, pdfWidth, pdfHeight);

            pdf.save((customerName || "report") + "-undr-report.pdf");
          })
          .catch(function () {
            window.print();
          })
          .finally(function () {
            button.disabled = false;
            button.classList.remove("is_loading");
            button.querySelector("span").textContent = originalText.trim() || "PDF";
          });
      });
    });
    initElementBreakdowns();
    initPreciousMetals();
    initReportDetails();
    initEarthElements();
    initElementBlurbModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  window.addEventListener("resize", function () {
    initElementBreakdowns();
    initEarthElements();
  });
})();
