const nodes = [
  {
    Node_ID: "N-101",
    Region_Lat: -1.2921,
    Region_Lon: 36.8219,
    NDVI_Index: 0.21,
    NDVI_Label: "Low",
    Distance_to_Water_m: 45,
    Monthly_Precip_mm: 185.4,
    SCH_Prevalence: 64.2,
    STH_Prevalence: 71.0,
    Co_Endemic_Risk_Index: 0.89,
    Risk_Label: "Severe",
  },
  {
    Node_ID: "N-102",
    Region_Lat: -1.2985,
    Region_Lon: 36.8302,
    NDVI_Index: 0.65,
    NDVI_Label: "Dense",
    Distance_to_Water_m: 820,
    Monthly_Precip_mm: 92.1,
    SCH_Prevalence: 12.5,
    STH_Prevalence: 18.2,
    Co_Endemic_Risk_Index: 0.15,
    Risk_Label: "Low",
  },
  {
    Node_ID: "N-103",
    Region_Lat: -1.3042,
    Region_Lon: 36.8115,
    NDVI_Index: 0.42,
    NDVI_Label: "Med",
    Distance_to_Water_m: 120,
    Monthly_Precip_mm: 210.0,
    SCH_Prevalence: 48.0,
    STH_Prevalence: 66.5,
    Co_Endemic_Risk_Index: 0.72,
    Risk_Label: "High",
  },
];

const layerConfig = [
  { key: "ndvi", label: "NDVI Vegetation", icon: "▧", checked: true },
  { key: "water", label: "Water Proximity", icon: "💧", checked: true },
  { key: "sch", label: "SCH Prevalence", icon: "◆", checked: true },
  { key: "sth", label: "STH Prevalence", icon: "◆", checked: true },
  { key: "risk", label: "Co-Endemic Risk Index", icon: "▰", checked: true },
  { key: "boundaries", label: "Administrative Boundaries", icon: "▢", checked: false },
];

const colors = {
  Low: "#66ff57",
  High: "#ffbd25",
  Severe: "#ff3a2f",
};

const map = document.querySelector("#map");
const nodeLayer = document.querySelector("#node-layer");
const popup = document.querySelector("#node-popup");
const linesSvg = document.querySelector("#connection-lines");
const layerList = document.querySelector("#layer-list");
const summaryGrid = document.querySelector("#summary-grid");
const actionGrid = document.querySelector("#action-grid");
const kpiGrid = document.querySelector("#kpi-grid");
const importanceBars = document.querySelector("#importance-bars");
const selectedNodeLabel = document.querySelector("#selected-node-label");

let selectedNodeId = "N-101";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function riskColor(node) {
  return colors[node.Risk_Label] || colors.Low;
}

function nodePosition(node) {
  const latValues = nodes.map((item) => item.Region_Lat);
  const lonValues = nodes.map((item) => item.Region_Lon);
  const minLat = Math.min(...latValues);
  const maxLat = Math.max(...latValues);
  const minLon = Math.min(...lonValues);
  const maxLon = Math.max(...lonValues);

  const x = ((node.Region_Lon - minLon) / (maxLon - minLon || 1)) * 58 + 20;
  const y = (1 - (node.Region_Lat - minLat) / (maxLat - minLat || 1)) * 56 + 20;

  return {
    x: clamp(x, 15, 85),
    y: clamp(y, 15, 82),
  };
}

function environmentalTrigger(node) {
  if (node.Monthly_Precip_mm > 180 && node.Distance_to_Water_m < 150) {
    return "Rainfall > 180mm + Water distance < 150m";
  }

  if (node.Monthly_Precip_mm > 180) {
    return "Heavy rainfall is elevating snail-habitat suitability";
  }

  if (node.Distance_to_Water_m < 150) {
    return "Close water proximity increases transmission exposure";
  }

  return "No acute environmental trigger detected";
}

function recommendationsFor(node) {
  const byRisk = {
    Severe: [
      "Deploy MDA Mobile Unit immediately",
      "Prioritize sanitation barriers within 150m water perimeter",
    ],
    High: ["Increase active surveillance", "Prepare MDA stock and monitor rainfall"],
    Low: ["Routine monitoring", "Maintain community awareness"],
  };

  return byRisk[node.Risk_Label] || byRisk.Low;
}

function renderLayerToggles() {
  layerList.innerHTML = layerConfig
    .map(
      (layer) => `
        <label class="layer-toggle">
          <span><span class="layer-icon">${layer.icon}</span>${layer.label}</span>
          <span class="switch">
            <input type="checkbox" data-layer="${layer.key}" ${layer.checked ? "checked" : ""} />
            <i></i>
          </span>
        </label>
      `,
    )
    .join("");

  layerList.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", syncLayers);
  });

  syncLayers();
}

function syncLayers() {
  const states = Object.fromEntries(
    [...layerList.querySelectorAll("input")].map((input) => [input.dataset.layer, input.checked]),
  );

  map.classList.toggle("show-ndvi", states.ndvi);
  map.classList.toggle("show-water", states.water);
  map.classList.toggle("show-sch", states.sch);
  map.classList.toggle("show-sth", states.sth);
  map.classList.toggle("hide-risk", !states.risk);
  map.classList.toggle("show-boundaries", states.boundaries);
}

function renderConnections() {
  linesSvg.innerHTML = nodes
    .map((node, index) => {
      const next = nodes[(index + 1) % nodes.length];
      const start = nodePosition(node);
      const end = nodePosition(next);
      return `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" />`;
    })
    .join("");
}

function renderNodes() {
  nodeLayer.innerHTML = nodes
    .map((node) => {
      const position = nodePosition(node);
      const size = 24 + node.Co_Endemic_Risk_Index * 34;
      return `
        <button
          class="map-node ${node.Node_ID === selectedNodeId ? "is-selected" : ""}"
          type="button"
          data-node="${node.Node_ID}"
          style="--x:${position.x}%; --y:${position.y}%; --size:${size}px; --risk:${riskColor(node)}"
          aria-label="Select ${node.Node_ID}, ${node.Risk_Label} risk"
        >
          <span class="water-ring"></span>
          <span class="prevalence-aura"></span>
          <span class="node-label">${node.Node_ID}</span>
        </button>
      `;
    })
    .join("");

  nodeLayer.querySelectorAll(".map-node").forEach((marker) => {
    marker.addEventListener("click", () => selectNode(marker.dataset.node));
  });
}

function renderPopup(node) {
  const position = nodePosition(node);
  const popupX = clamp(position.x + 4, 8, 62);
  const popupY = clamp(position.y - 4, 10, 66);
  const isHotspot = node.Node_ID === "N-101";

  popup.style.setProperty("--popup-x", `${popupX}%`);
  popup.style.setProperty("--popup-y", `${popupY}%`);
  popup.style.setProperty("--popup-risk", riskColor(node));
  popup.innerHTML = `
    <h3>${node.Node_ID} Cluster</h3>
    <p class="hotspot-line">
      ${isHotspot ? "⚡ Predicted Outbreak Hotspot: Next 14 Days" : `${node.Risk_Label} Risk Surveillance Node`}
    </p>
    <div class="popup-grid">
      <span>Coordinates</span><strong>${node.Region_Lat}, ${node.Region_Lon}</strong>
      <span>NDVI</span><strong>${node.NDVI_Index} / ${node.NDVI_Label}</strong>
      <span>Water Distance</span><strong>${node.Distance_to_Water_m} m</strong>
      <span>Rainfall</span><strong>${node.Monthly_Precip_mm} mm</strong>
      <span>SCH</span><strong>${node.SCH_Prevalence}%</strong>
      <span>STH</span><strong>${node.STH_Prevalence}%</strong>
      <span>Risk Index</span><strong>${node.Co_Endemic_Risk_Index}</strong>
      <span>Risk Label</span><strong>${node.Risk_Label}</strong>
    </div>
    <p class="popup-trigger">Environmental Trigger: ${environmentalTrigger(node)}</p>
  `;
}

function selectNode(nodeId) {
  selectedNodeId = nodeId;
  const node = nodes.find((item) => item.Node_ID === selectedNodeId);

  selectedNodeLabel.textContent = `${node.Node_ID} Selected`;
  renderNodes();
  renderPopup(node);
  renderRecommendations();
}

function renderSummary() {
  const severe = nodes.filter((node) => node.Risk_Label === "Severe").length;
  const high = nodes.filter((node) => node.Risk_Label === "High").length;
  const low = nodes.filter((node) => node.Risk_Label === "Low").length;
  const avgRisk = average(nodes.map((node) => node.Co_Endemic_Risk_Index)).toFixed(2);

  const items = [
    ["Total Nodes", nodes.length, "#d8dfdc"],
    ["Severe Risk Nodes", severe, colors.Severe],
    ["High Risk Nodes", high, colors.High],
    ["Low Risk Nodes", low, colors.Low],
    ["Average Co-Endemic Risk", avgRisk, "#2bdcff"],
  ];

  summaryGrid.innerHTML = items
    .map(
      ([label, value, color]) => `
        <article class="summary-item" style="--value-color:${color}">
          <span>${label}</span>
          <strong>${value}</strong>
        </article>
      `,
    )
    .join("");

  document.querySelector("#alert-count").textContent = nodes.filter((node) => node.Risk_Label !== "Low").length + 1;
}

function renderRecommendations() {
  const selected = nodes.find((node) => node.Node_ID === selectedNodeId);

  actionGrid.innerHTML = nodes
    .map((node) => {
      const actions = recommendationsFor(node);
      const priorityText =
        node.Node_ID === "N-101" ? "Deploy MDA Mobile Unit #4 to Zone B by: June 25, 2026." : "";
      return `
        <article class="action-card ${node.Node_ID === selected.Node_ID ? "is-priority" : ""}" style="--risk:${riskColor(node)}">
          <h3>${node.Node_ID} / ${node.Risk_Label}</h3>
          <p>${actions.join(". ")}.</p>
          ${priorityText ? `<strong>${priorityText}</strong>` : ""}
        </article>
      `;
    })
    .join("");
}

function renderKpis() {
  const kpis = [
    ["Population at Risk", 12450, "number"],
    ["MDA Priority", "High", "text"],
    ["Forecast Window", "Next 14 Days", "text"],
    ["Next Update", "June 25, 2026", "text"],
  ];

  kpiGrid.innerHTML = kpis
    .map(
      ([label, value, type]) => `
        <article class="kpi-card">
          <span>${label}</span>
          <strong ${type === "number" ? `data-count="${value}"` : ""}>${type === "number" ? "0" : value}</strong>
        </article>
      `,
    )
    .join("");

  animateNumbers();
}

function animateNumbers() {
  document.querySelectorAll("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);
    const duration = 900;
    const startedAt = performance.now();

    function tick(now) {
      const progress = clamp((now - startedAt) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  });
}

function renderImportance() {
  const features = [
    ["Distance to Water", 94, colors.Cyan || "#2bdcff"],
    ["Monthly Precipitation", 90, "#2bdcff"],
    ["SCH Prevalence", 74, colors.Severe],
    ["STH Prevalence", 68, "#ff6c35"],
    ["NDVI Index", 52, colors.Low],
  ];

  importanceBars.innerHTML = features
    .map(
      ([label, value, color]) => `
        <div class="importance-row">
          <span>${label}</span>
          <span class="importance-track"><i style="--width:${value}%; --bar-color:${color}"></i></span>
          <strong>${value}</strong>
        </div>
      `,
    )
    .join("");
}

function renderChart() {
  const ctx = document.querySelector("#trend-chart");
  const infectionRisk = nodes.map((node) =>
    Math.round(average([node.SCH_Prevalence, node.STH_Prevalence, node.Co_Endemic_Risk_Index * 100])),
  );

  new Chart(ctx, {
    type: "line",
    data: {
      labels: nodes.map((node) => node.Node_ID),
      datasets: [
        {
          label: "Rainfall (mm)",
          data: nodes.map((node) => node.Monthly_Precip_mm),
          borderColor: "#2bdcff",
          backgroundColor: "rgba(43, 220, 255, 0.14)",
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#2bdcff",
          pointBorderColor: "#e9fbff",
          tension: 0.38,
          yAxisID: "y",
        },
        {
          label: "Infection Risk (%)",
          data: infectionRisk,
          borderColor: "#ff4a37",
          backgroundColor: "rgba(255, 74, 55, 0.12)",
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#ff4a37",
          pointBorderColor: "#fff0ee",
          tension: 0.38,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          labels: {
            color: "#dbe6e2",
            boxWidth: 22,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(2, 8, 10, 0.92)",
          borderColor: "rgba(255, 255, 255, 0.18)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.08)" },
          ticks: { color: "#c4cfca", font: { weight: 800 } },
        },
        y: {
          min: 0,
          max: 240,
          grid: { color: "rgba(43, 220, 255, 0.12)" },
          ticks: { color: "#2bdcff" },
          title: { display: true, text: "mm", color: "#2bdcff" },
        },
        y1: {
          min: 0,
          max: 100,
          position: "right",
          grid: { drawOnChartArea: false },
          ticks: { color: "#ff4a37", callback: (value) => `${value}%` },
          title: { display: true, text: "Risk", color: "#ff4a37" },
        },
      },
    },
  });
}

function setDateLabels() {
  document.querySelector("#date-label").textContent = "May 24, 2026";
  document.querySelector("#time-label").textContent = "10:42 AM EAT";
}

renderLayerToggles();
renderConnections();
renderNodes();
renderSummary();
renderRecommendations();
renderKpis();
renderImportance();
renderChart();
setDateLabels();
selectNode(selectedNodeId);
