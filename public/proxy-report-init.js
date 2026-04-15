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
    var sortedData = items.slice().sort(function (a, b) { return b.percentage - a.percentage; });
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
      if (heightPercent < 18) heightPercent = 18;

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

    reportChart = new window.Chart(ctx, {
      type: "polarArea",
      data: {
        labels: reportData.reportDetails.reportChart.elementNames || [],
        datasets: [
          { label: "Above Range", data: reportData.reportDetails.reportChart.aboveData || [], backgroundColor: "#525961", borderWidth: 1, borderColor: "#ffffff", order: 1 },
          { label: "Reference Range", data: reportData.reportDetails.reportChart.refData || [], backgroundColor: "#a6acb5", borderWidth: 1, borderColor: "#ffffff", order: 2 },
          { label: "Below Range", data: reportData.reportDetails.reportChart.belowData || [], backgroundColor: "#d9dee4", borderWidth: 1, borderColor: "#ffffff", order: 3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        events: [],
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { display: false },
            grid: { color: "#e0e0e0" },
            pointLabels: { display: true, centerPointLabels: true, font: { size: 11, weight: "bold" }, color: "#666666" }
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
      .style("font-size", isMobile ? "22px" : "18px")
      .text(function (item) { return item.name; });

    text.append("tspan")
      .attr("x", 0)
      .attr("dy", "1.1em")
      .style("font-size", isMobile ? "44px" : "36px")
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
    initElementBreakdowns();
    initPreciousMetals();
    initReportDetails();
    initEarthElements();
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