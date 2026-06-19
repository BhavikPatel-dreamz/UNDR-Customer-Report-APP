(function () {
  var reportData = getReportData();
  var reportChart;

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
    var minHeight = 42;

    // Compute numeric ppm values from formatted `ppm` strings (e.g. "631272ppm" or "4,414ppm")
    var numericValues = sortedData.map(function (it) {
      if (!it.ppm) return 0;
      var num = Number(String(it.ppm).replace(/[^0-9.\-]/g, ""));
      return isFinite(num) ? num : 0;
    });
    var nonZero = numericValues.filter(function (v) { return v > 0; });
    var minNonZero = nonZero.length ? Math.min.apply(null, nonZero) : 0;
    var maxVal = nonZero.length ? Math.max.apply(null, nonZero) : 0;
    var MIN_WIDTH = 30; // percent
    var MAX_WIDTH = 100; // percent

    function valueToWidth(v) {
      if (!v || maxVal <= 0) return MIN_WIDTH;
      if (minNonZero === maxVal) return MAX_WIDTH;
      // log scale mapping for perceptual differences
      var vis = Math.log10(v + 1);
      var minVis = Math.log10(minNonZero + 1);
      var maxVis = Math.log10(maxVal + 1);
      var ratio = (vis - minVis) / (maxVis - minVis);
      return Math.round(MIN_WIDTH + ratio * (MAX_WIDTH - MIN_WIDTH));
    }

    sortedData.forEach(function (item) {
      var bar = document.createElement("div");
      bar.className = "element_bar";
      // Fix bar height and use width to visually represent value (ppm)
      bar.style.height = minHeight + "px";
      var value = 0;
      if (item.ppm) {
        value = Number(String(item.ppm).replace(/[^0-9.\-]/g, "")) || 0;
      }
      var widthPct = valueToWidth(value);
      bar.style.width = widthPct + "%";
      bar.style.backgroundColor = item.color;

      var name = document.createElement("span");
      name.className = "element_bar_name";
      name.innerText = item.name;

      var value = document.createElement("span");
      value.className = "element_bar_value";
      value.innerText = item.ppm != null && item.ppm !== "" ? item.ppm.replace('ppm',' ppm') : "";

      bar.appendChild(name);
      bar.appendChild(value);
      chartBox.appendChild(bar);
    });

    if (window.innerWidth > 767) {
      var minChartHeight = sortedData.length * minHeight;
      chartBox.style.height = Math.max(leftContent.offsetHeight, minChartHeight) + "px";
    } else {
      chartBox.style.height = "auto";
    }
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

    sorted.forEach(function (item) {
      var ppm = Number(item.ppm) || 0;
      // Skip zero-value items so they are not displayed
      if (ppm <= 0) return;

      var heightPercent;
      if (minNonZeroPpm === maxPpm) {
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
      body.className = "bar_body";
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

  function initReportDetails() {
    var canvas = document.getElementById("element_layered_chart");
    if (!canvas || !window.Chart || !reportData) return;

    if (reportChart) {
      reportChart.destroy();
    }

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    function hasLayeredChartData(chart) {
      if (!chart || !Array.isArray(chart.elementNames) || chart.elementNames.length === 0) return false;
      var hasBelow = Array.isArray(chart.belowData) && chart.belowData.some(function (v) { return Number(v) > 0; });
      var hasRef = Array.isArray(chart.refData) && chart.refData.some(function (v) { return Number(v) > 0; });
      var hasAbove = Array.isArray(chart.aboveData) && chart.aboveData.some(function (v) { return Number(v) > 0; });
      return hasBelow || hasRef || hasAbove;
    }

    function normalizeNumber(value) {
      if (typeof value === "number" && isFinite(value)) return value;
      if (typeof value === "string") {
        var parsed = Number(value.replace(/,/g, "").trim());
        if (isFinite(parsed)) return parsed;
      }
      return 0;
    }

    function toElementChartVisualValue(value) {
      var n = normalizeNumber(value);
      if (n <= 0) return 0;

      return Math.log10(n + 1);
    }

    var reportChartData = (reportData.reportDetails && reportData.reportDetails.reportChart) || null;
    var chartInput = hasLayeredChartData(reportChartData)
      ? {
        labels: reportChartData.elementNames || [],
        belowData: reportChartData.belowData || [],
        refData: reportChartData.refData || [],
        aboveData: reportChartData.aboveData || [],
        calculations: reportChartData.calculations || []
      }
      : {
        labels: [],
        belowData: [],
        refData: [],
        aboveData: [],
        calculations: []
      };

    var chartRows = (chartInput.labels || []).map(function (label, index) {
      var below = normalizeNumber((chartInput.belowData || [])[index]);
      var reference = normalizeNumber((chartInput.refData || [])[index]);
      var above = normalizeNumber((chartInput.aboveData || [])[index]);
      var calculation = (chartInput.calculations || [])[index] || {};
      var adjustedPpm = normalizeNumber(calculation.adjustedPpm);
      var measuredPpm = Math.max(adjustedPpm, below, above);

      return {
        index: index,
        label: label,
        below: below,
        reference: reference,
        above: above,
        measuredPpm: measuredPpm,
        visualWeight: Math.max(toElementChartVisualValue(measuredPpm), toElementChartVisualValue(reference) * 0.35)
      };
    }).filter(function (row) {
      return row.measuredPpm > 0;
    });

    // Deduplicate chartRows by label (preserve existing classification logic).
    // If duplicates exist, merge them and prefer classification priority: above > reference > below.
    (function dedupeChartRows() {
      var seen = Object.create(null);
      var unique = [];
      chartRows.forEach(function (row) {
        var key = String(row.label || '').trim().toLowerCase();
        if (!key) {
          unique.push(row);
          return;
        }
        var existing = seen[key];
        if (!existing) {
          seen[key] = row;
          unique.push(row);
          return;
        }
        // Merge classifications with priority: above > reference > below
        function hasAbove(r) { return Number(r.above) > 0; }
        function hasRef(r) { return Number(r.reference) > 0; }
        function hasBelow(r) { return Number(r.below) > 0; }
        if (hasAbove(row) || hasAbove(existing)) {
          existing.above = Math.max(Number(existing.above) || 0, Number(row.above) || 0);
          existing.reference = 0;
          existing.below = 0;
        } else if (hasRef(row) || hasRef(existing)) {
          existing.reference = Math.max(Number(existing.reference) || 0, Number(row.reference) || 0);
          existing.below = 0;
        } else {
          existing.below = Math.max(Number(existing.below) || 0, Number(row.below) || 0);
        }
        // Keep measuredPpm as the max to be safe for any downstream logic
        existing.measuredPpm = Math.max(Number(existing.measuredPpm) || 0, Number(row.measuredPpm) || 0);
      });
      chartRows = unique;
    })();

    var visualValues = [];
    chartRows.forEach(function (row) {
      [row.below, row.reference, row.above].forEach(function (value) {
        var visualValue = toElementChartVisualValue(value);
        if (visualValue > 0) visualValues.push(visualValue);
      });
    });
    visualValues.sort(function (a, b) { return a - b; });

    var minVisualValue = visualValues.length ? visualValues[0] : 0;
    var capIndex = visualValues.length ? Math.floor((visualValues.length - 1) * 0.88) : 0;
    var cappedMaxVisualValue = visualValues.length ? visualValues[capIndex] : 0;

    function toReadableElementChartVisualValue(value) {
      var visualValue = toElementChartVisualValue(value);
      if (visualValue <= 0) return 0;
      if (cappedMaxVisualValue <= minVisualValue) return 60;

      var cappedValue = Math.min(visualValue, cappedMaxVisualValue);
      return 20 + ((cappedValue - minVisualValue) / (cappedMaxVisualValue - minVisualValue)) * 80;
    }

    var chartVisualInput = {
      labels: chartRows.map(function (row) { return row.label; }),
      belowData: chartRows.map(function (row) { return toReadableElementChartVisualValue(row.below); }),
      refData: chartRows.map(function (row) { return toReadableElementChartVisualValue(row.reference); }),
      aboveData: chartRows.map(function (row) { return toReadableElementChartVisualValue(row.above); })
    };

    // Preserve existing category assignment logic: whichever of below/ref/above is present
    // determines the element's category. We DO NOT scale bar length by ppm — instead
    // place each element onto one of three fixed ring radii.
    var INNER_RING = 33; // inner ring visual value
    var MID_RING = 66;   // middle ring visual value
    var OUTER_RING = 100; // outer ring visual value

    for (var i = 0; i < (chartVisualInput.labels || []).length; i++) {
      var wasAbove = Number((chartVisualInput.aboveData || [])[i]) > 0;
      var wasRef = Number((chartVisualInput.refData || [])[i]) > 0;
      var wasBelow = Number((chartVisualInput.belowData || [])[i]) > 0;
      // Clear all three then set only the appropriate ring to a fixed value
      chartVisualInput.aboveData[i] = 0;
      chartVisualInput.refData[i] = 0;
      chartVisualInput.belowData[i] = 0;
      if (wasAbove) chartVisualInput.aboveData[i] = OUTER_RING;
      else if (wasRef) chartVisualInput.refData[i] = MID_RING;
      else if (wasBelow) chartVisualInput.belowData[i] = INNER_RING;
    }

    // Use fixed visual scale (0-100) so ring positions are absolute and not scaled by data
    var chartMax = 100;

    // UNDR palette (cycled per-element)
    var undrPalette = [
      '#a32720', '#f6b315', '#2f8f46', '#1f78b4', '#8b2323', '#6b7280', '#7c3aed', '#d97706'
    ];

    // Build per-element color arrays so each label/bar uses a palette color
    var paletteForLabels = (chartVisualInput.labels || []).map(function (_lbl, idx) {
      return undrPalette[idx % undrPalette.length];
    });

    reportChart = new window.Chart(ctx, {
      // Plugin draws concentric rings and faint radial connector lines from center to each label
      plugins: [{
        id: 'elementVisuals',
        beforeDatasetsDraw: function (chart) {
          try {
            if (chart.config && chart.config.type !== 'polarArea') return;
            var ctx2 = chart.ctx;
            var scaleR = chart.scales && chart.scales.r;
            var cx = (chart.chartArea.left + chart.chartArea.right) / 2;
            var cy = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            var maxR = (scaleR && scaleR.drawingArea) || Math.min(chart.chartArea.width, chart.chartArea.height) / 2;
            // Outer -> dark, middle -> medium, inner -> light
            var outerR = maxR;
            var midR = Math.round(maxR * 0.66);
            var innerR = Math.round(maxR * 0.33);
            ctx2.save();
            // draw outer (dark grey)
            // Outer ring (Above Average) — dark grey
ctx2.beginPath();
ctx2.arc(cx, cy, outerR, 0, Math.PI * 2);
ctx2.fillStyle = 'rgba(55,65,81,0.32)';
ctx2.fill();
ctx2.beginPath();
ctx2.arc(cx, cy, outerR, 0, Math.PI * 2);
ctx2.strokeStyle = 'rgba(55,65,81,0.55)';
ctx2.lineWidth = 1.5;
ctx2.stroke();

// Middle ring (Average) — medium grey
ctx2.beginPath();
ctx2.arc(cx, cy, midR, 0, Math.PI * 2);
ctx2.fillStyle = 'rgba(148,163,184,0.22)';
ctx2.fill();
ctx2.beginPath();
ctx2.arc(cx, cy, midR, 0, Math.PI * 2);
ctx2.strokeStyle = 'rgba(100,116,139,0.50)';
ctx2.lineWidth = 1.5;
ctx2.stroke();

// Inner ring (Below Average) — light grey
ctx2.beginPath();
ctx2.arc(cx, cy, innerR, 0, Math.PI * 2);
ctx2.fillStyle = 'rgba(226,232,240,0.18)';
ctx2.fill();
ctx2.beginPath();
ctx2.arc(cx, cy, innerR, 0, Math.PI * 2);
ctx2.strokeStyle = 'rgba(148,163,184,0.45)';
ctx2.lineWidth = 1.5;
ctx2.stroke();

ctx2.restore();
          } catch (e) {
            // ignore
          }
        },
        afterDraw: function (chart) {
          try {
            if (chart.config && chart.config.type !== 'polarArea') return;
            var meta = chart.getDatasetMeta && chart.getDatasetMeta(0);
            if (!meta || !meta.data || !meta.data.length) return;
            var ctx2 = chart.ctx;
            ctx2.save();
            ctx2.lineWidth = 1.5;
            ctx2.strokeStyle = 'rgba(75,85,99,0.26)';
            if (ctx2.setLineDash) ctx2.setLineDash([3,3]);
            var scaleR = chart.scales && chart.scales.r;
            var outerLimit = (scaleR && scaleR.drawingArea) || Math.min(chart.chartArea.width, chart.chartArea.height) / 2;
            // labelPadding ensures lines extend beyond the drawing area to the label text
            var labelPadding = Math.round(Math.max(24, Math.min(chart.chartArea.width, chart.chartArea.height) * 0.06));
            meta.data.forEach(function (arc) {
              var start = arc.startAngle;
              var end = arc.endAngle;
              var mid = (start + end) / 2;
              var cx = arc.x || (chart.chartArea.left + chart.chartArea.right) / 2;
              var cy = arc.y || (chart.chartArea.top + chart.chartArea.bottom) / 2;
              var outer = outerLimit + labelPadding;
              var x2 = cx + Math.cos(mid) * outer;
              var y2 = cy + Math.sin(mid) * outer;
              ctx2.beginPath();
              ctx2.moveTo(cx, cy);
              ctx2.lineTo(x2, y2);
              ctx2.stroke();
            });
            if (ctx2.setLineDash) ctx2.setLineDash([]);
            ctx2.restore();
          } catch (e) {
            // fail silently to avoid breaking chart
          }
        }
      }],
      type: "polarArea",
      data: {
        labels: chartVisualInput.labels,
        datasets: [
          { label: "Reference Range", data: chartVisualInput.refData, backgroundColor: paletteForLabels, borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 3 },
          { label: "Below Range", data: chartVisualInput.belowData, backgroundColor: paletteForLabels, borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 2 },
          { label: "Above Range", data: chartVisualInput.aboveData, backgroundColor: paletteForLabels, borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 1 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        events: [],
        layout: { padding: 24 },
        scales: {
          r: {
            min: 0,
            max: chartMax,
            ticks: { display: false },
            angleLines: { color: "rgba(17, 24, 39, 0.08)" },
            grid: { color: "rgba(17, 24, 39, 0.12)" },
            pointLabels: { display: true, centerPointLabels: true, padding: 8, font: { size: 10, weight: "600" }, color: "#4b5563" }
          }
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
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
  // If there are no detected items, nothing to render
  if (!data.length) return;

  // Keep original detected count (before adding placeholders)
  var detectedCount = data.length;

  var minPpm = d3.min(data, function (item) { return item.ppm; }) || 2;
  var maxPpm = d3.max(data, function (item) { return item.ppm; }) || 31;
    var radiusScale = d3.scaleSqrt().domain([minPpm, maxPpm]).range([isMobile ? 45 : 40, isMobile ? 120 : 110]);
    function truncateLabel(text, maxChars) {
      if (!text || text.length <= maxChars) return text;
      return text.slice(0, Math.max(1, maxChars - 3)) + "...";
    }

    // If few elements detected, add unlabeled placeholder bubbles to reach a fuller-looking chart
    if (detectedCount > 0 && detectedCount < 5) {
      var targetTotal = 8; // desired total bubbles to display
      var placeholdersToAdd = Math.max(0, targetTotal - detectedCount);
      var palette = ["#a32720", "#f6b315", "#a6acb5", "#e99180", "#b46a5f", "#e8d3a5", "#c9d4e9", "#d48f7f"];
      // Determine the smallest detected bubble radius (in px) using radiusScale so placeholders match smallest element
      var detectedRadii = data.map(function (it) { return radiusScale(it.ppm); });
      var smallestRadius = detectedRadii.length ? Math.min.apply(null, detectedRadii) : (isMobile ? 160 : 75);
      // placeholderDiameter will match smallest detected bubble diameter (2 * radius)
      var placeholderDiameterFromSmallest = Math.max(6, Math.round(smallestRadius * 2));

      for (var p = 0; p < placeholdersToAdd; p += 1) {
        // Use a small ppm value for compatibility but set placeholderDiameter from smallest real bubble
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

    function getCircleLabelParts(item) {
      var rawName = String(item.name || "").trim();
      var match = rawName.match(/^(.*?)(?:\s*\(([A-Za-z0-9]{1,3})\))?$/);
      var fullName = match && match[1] ? match[1].trim() : rawName;
      // Format the chemical symbol as Title Case (e.g., 'Nd') instead of all-caps 'ND'
      var rawSymbol = match && match[2] ? match[2].trim() : "";
      var symbol = "";
      if (rawSymbol) {
        symbol = rawSymbol.charAt(0).toUpperCase() + rawSymbol.slice(1).toLowerCase();
      }
      var radius = radiusScale(item.ppm);

      // Defaults when there's no explicit chemical symbol
      if (!symbol) {
        if (radius <= (isMobile ? 65 : 58)) {
          return { symbol: truncateLabel(fullName, 4), symbolFont: isMobile ? "18px" : "14px", rest: "", restFont: "", ppmFont: isMobile ? "36px" : "28px" };
        }
        if (radius <= (isMobile ? 82 : 74)) {
          return { symbol: truncateLabel(fullName, 6), symbolFont: isMobile ? "14px" : "10px", rest: "", restFont: "", ppmFont: isMobile ? "38px" : "30px" };
        }
        if (radius <= (isMobile ? 100 : 90)) {
          return { symbol: truncateLabel(fullName, 10), symbolFont: isMobile ? "16px" : "12px", rest: "", restFont: "", ppmFont: isMobile ? "40px" : "32px" };
        }
        return { symbol: fullName, symbolFont: isMobile ? "20px" : "16px", rest: "", restFont: "", ppmFont: isMobile ? "44px" : "36px" };
      }

      // When a chemical symbol is available, render it prominently and show the full name smaller when space allows.
      if (radius <= (isMobile ? 65 : 58)) {
        return { symbol: symbol, symbolFont: isMobile ? "28px" : "22px", rest: "", restFont: "", ppmFont: isMobile ? "36px" : "28px" };
      }
      if (radius <= (isMobile ? 82 : 74)) {
        return {
          symbol: symbol,
          symbolFont: isMobile ? "24px" : "18px",
          rest: "(" + truncateLabel(fullName, 6).toLowerCase() + ")",
          restFont: isMobile ? "12px" : "10px",
          ppmFont: isMobile ? "38px" : "30px",
        };
      }
      if (radius <= (isMobile ? 100 : 90)) {
        return {
          symbol: symbol,
          symbolFont: isMobile ? "28px" : "22px",
          rest: "(" + truncateLabel(fullName, 10).toLowerCase() + ")",
          restFont: isMobile ? "14px" : "12px",
          ppmFont: isMobile ? "40px" : "32px",
        };
      }

      return {
        symbol: symbol,
        symbolFont: isMobile ? "34px" : "26px",
        rest: "(" + fullName.toLowerCase() + ")",
        restFont: isMobile ? "16px" : "14px",
        ppmFont: isMobile ? "44px" : "36px",
      };
    }
    var highest = data.reduce(function (prev, curr) { return prev.ppm > curr.ppm ? prev : curr; });
    var centerX = width / 2;
    var centerY = isMobile ? (height / 2) + 50 : height / 2;

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
        // Use fixed pixel radius for placeholders, otherwise use radiusScale
        var r = item && item.isPlaceholder ? ((item.placeholderDiameter || 150) / 2) : radiusScale(item.ppm);
        return r + 6;
      }))
      .stop();

    for (var i = 0; i < 600; i += 1) simulation.tick();

    

    var node = svg.selectAll(".node")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (item) { return "translate(" + item.x + "," + item.y + ")"; });

    node.append("circle")
      .attr("r", function (item) {
        if (item && item.isPlaceholder) {
          return (item.placeholderDiameter || (isMobile ? 320 : 150)) / 2;
        }
        return radiusScale(item.ppm);
      })
      .attr("fill", function (item) { return item.color; });

    // Append text only for real detected elements; placeholders are intentionally unlabeled
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
