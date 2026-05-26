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
    var sortedData = items.slice().sort(function (a, b) {
      if (a.fixedLast && !b.fixedLast) return 1;
      if (!a.fixedLast && b.fixedLast) return -1;
      return b.percentage - a.percentage;
    });
    var minHeight = 42;

    sortedData.forEach(function (item) {
      var bar = document.createElement("div");
      bar.className = "element_bar";
      bar.style.minHeight = minHeight + "px";
      bar.style.flex = (item.percentage + 2) + " 0 auto";
      bar.style.backgroundColor = item.color;
      bar.innerText = item.name;
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

    function openModal(elementSymbol) {
      var key = String(elementSymbol || "").trim().toUpperCase();
      var blurb = blurbs[key];
      if (!blurb || !title || !symbol || !content) return;

      title.textContent = blurb.name || key;
      symbol.textContent = (blurb.symbol || key) + " · Atomic no. " + (blurb.atomicNumber || "");
      content.innerHTML = "";

      (blurb.sections || []).forEach(function (section) {
        var item = document.createElement("section");
        item.className = "element_blurb_section";

        var heading = document.createElement("h4");
        heading.textContent = section.title || "";

        var paragraph = document.createElement("p");
        paragraph.textContent = section.body || "";

        item.appendChild(heading);
        item.appendChild(paragraph);
        content.appendChild(item);
      });

      modal.classList.add("is_open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("element_blurb_modal_open");
    }

    document.querySelectorAll("[data-element-blurb-trigger]").forEach(function (button) {
      button.addEventListener("click", function () {
        openModal(button.getAttribute("data-element-symbol"));
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeModal);
    });

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

    var sorted = (reportData.preciousMetalPresent.items || []).slice().sort(function (a, b) { return b.ppm - a.ppm; });
    if (!sorted.length) return;
    var maxPpm = Math.max.apply(null, sorted.map(function (item) { return item.ppm; }));

    sorted.forEach(function (item) {
      var heightPercent = (item.ppm / maxPpm) * 100;
            // if (heightPercent < 18) heightPercent = 18;
      if (heightPercent < 8 && item.ppm > 0) heightPercent = 8;


      var barWrapper = document.createElement("div");
      barWrapper.className = "graph_bar_wrapper";
      barWrapper.style.display = "flex";

      var body = document.createElement("div");
      body.className = "bar_body";
      body.style.height = heightPercent + "%";
      body.style.backgroundColor = item.color;

      var ppmValue = document.createElement("span");
      ppmValue.className = "ppm_value";
      ppmValue.textContent = item.ppm + "ppm";
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

    var chartMax = Math.max.apply(
      null,
      [0].concat(chartVisualInput.belowData || [], chartVisualInput.refData || [], chartVisualInput.aboveData || []).map(normalizeNumber)
    );
    chartMax = chartMax > 0 ? Math.ceil((chartMax * 1.1) / 10) * 10 : 100;

    reportChart = new window.Chart(ctx, {
      type: "polarArea",
      data: {
        labels: chartVisualInput.labels,
        datasets: [
          { label: "Reference Range", data: chartVisualInput.refData, backgroundColor: "#a6acb5", borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 3 },
          { label: "Below Range", data: chartVisualInput.belowData, backgroundColor: "rgba(47, 143, 70, 0.92)", borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 2 },
          { label: "Above Range", data: chartVisualInput.aboveData, backgroundColor: "rgba(179, 38, 30, 0.92)", borderWidth: 1, borderColor: "#ffffff", borderRadius: 6, order: 1 }
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
    if (!data.length) return;
    var minPpm = d3.min(data, function (item) { return item.ppm; }) || 2;
    var maxPpm = d3.max(data, function (item) { return item.ppm; }) || 31;
    var radiusScale = d3.scaleSqrt().domain([minPpm, maxPpm]).range([isMobile ? 55 : 50, isMobile ? 130 : 120]);
    function truncateLabel(text, maxChars) {
      if (!text || text.length <= maxChars) return text;
      return text.slice(0, Math.max(1, maxChars - 3)) + "...";
    }

    function getCircleLabelParts(item) {
      var rawName = String(item.name || "").trim();
      var match = rawName.match(/^(.*?)(?:\s*\(([A-Za-z0-9]{1,3})\))?$/);
      var fullName = match && match[1] ? match[1].trim() : rawName;
      var symbol = match && match[2] ? match[2].trim().toUpperCase() : "";
      var radius = radiusScale(item.ppm);

      if (radius <= (isMobile ? 65 : 58)) {
        return {
          name: symbol || truncateLabel(fullName, 4),
          nameFont: isMobile ? "20px" : "16px",
          ppmFont: isMobile ? "36px" : "28px",
        };
      }

      if (radius <= (isMobile ? 82 : 74)) {
        return {
          name: truncateLabel(fullName, symbol ? 6 : 8) + (symbol ? "(" + symbol + ")" : ""),
          nameFont: isMobile ? "16px" : "12px",
          ppmFont: isMobile ? "38px" : "30px",
        };
      }

      if (radius <= (isMobile ? 100 : 90)) {
        return {
          name: truncateLabel(fullName, 10) + (symbol ? " (" + symbol + ")" : ""),
          nameFont: isMobile ? "18px" : "14px",
          ppmFont: isMobile ? "40px" : "32px",
        };
      }

      return {
        name: rawName,
        nameFont: isMobile ? "22px" : "18px",
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
      .force("collide", d3.forceCollide(function (item) { return radiusScale(item.ppm) + 6; }))
      .stop();

    for (var i = 0; i < 600; i += 1) simulation.tick();

    var node = svg.selectAll(".node")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (item) { return "translate(" + item.x + "," + item.y + ")"; });

    node.append("circle")
      .attr("r", function (item) { return radiusScale(item.ppm); })
      .attr("fill", function (item) { return item.color; });

    var text = node.append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .style("font-family", "Arial, sans-serif")
      .style("pointer-events", "none");

    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "-0.6em")
      .style("font-size", function (item) { return getCircleLabelParts(item).nameFont; })
      .text(function (item) { return getCircleLabelParts(item).name; });

    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "1.1em")
      .style("font-size", function (item) { return getCircleLabelParts(item).ppmFont; })
      .style("font-weight", "bold")
      .text(function (item) { return item.ppm; });

    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "1.2em")
      .style("font-size", isMobile ? "16px" : "14px")
      .text("ppm");
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
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(reportElement.scrollWidth, document.documentElement.scrollWidth),
          onclone: function (clonedDocument) {
            clonedDocument.querySelectorAll(".oil_label, .oil_found_text, .oil_ppm_value").forEach(function (element) {
              element.style.color = "#ffffff";
              element.style.opacity = "1";
              element.style.visibility = "visible";
              element.style.fontFamily = "Arial, sans-serif";
              element.style.textShadow = "0 0 0 #ffffff";
            });
            clonedDocument.querySelectorAll(".oil_found_text, .oil_ppm_value").forEach(function (element) {
              element.style.display = "inline-block";
              element.style.fontWeight = "700";
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

        sections.reduce(function (chain, section) {
          return chain.then(function (items) {
            return window.html2canvas(section, canvasOptions).then(function (canvas) {
              if (canvas.width > 0 && canvas.height > 0) {
                items.push({
                  canvas: canvas,
                  oilTexts: drawOilTextOnCanvas(canvas, section),
                  canSplit:
                    section.classList.contains("found_elements_list_section") ||
                    section.classList.contains("not_found_elements_list_section"),
                });
              }
              return items;
            });
          });
        }, Promise.resolve([]))
          .then(function (items) {
            var pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
            var pageWidth = pdf.internal.pageSize.getWidth();
            var pageHeight = pdf.internal.pageSize.getHeight();
            var pagePadding = 0;
            var availableWidth = pageWidth - (pagePadding * 2);
            var cursorY = 0;

            items.forEach(function (item, index) {
              var canvas = item.canvas;
              var imageData = canvas.toDataURL("image/jpeg", 0.98);
              var imageHeight = (canvas.height * availableWidth) / canvas.width;
              var remainingPageHeight = pageHeight - cursorY;

              if (
                index > 0 &&
                cursorY > 0 &&
                cursorY + imageHeight > pageHeight &&
                (!item.canSplit || remainingPageHeight < pageHeight * 0.25)
              ) {
                pdf.addPage();
                cursorY = 0;
                remainingPageHeight = pageHeight;
              }

              if (cursorY + imageHeight <= pageHeight) {
                pdf.addImage(imageData, "JPEG", pagePadding, cursorY, availableWidth, imageHeight);
                drawOilTextOnPdf(pdf, item.oilTexts, pagePadding, cursorY, availableWidth, imageHeight, canvas);
                cursorY += imageHeight;
                return;
              }

              var remainingHeight = imageHeight;
              var y = cursorY;
              var firstPageSpace = pageHeight - cursorY;
              pdf.addImage(imageData, "JPEG", pagePadding, y, availableWidth, imageHeight);
              drawOilTextOnPdf(pdf, item.oilTexts, pagePadding, y, availableWidth, imageHeight, canvas);
              remainingHeight -= firstPageSpace;

              while (remainingHeight > 0) {
                y = remainingHeight - imageHeight;
                pdf.addPage();
                pdf.addImage(imageData, "JPEG", pagePadding, y, availableWidth, imageHeight);
                remainingHeight -= pageHeight;
              }

              var usedOnLastPage = imageHeight - firstPageSpace;
              cursorY = usedOnLastPage > 0 ? usedOnLastPage % pageHeight : imageHeight;
              if (cursorY === 0) cursorY = pageHeight;
            });

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
