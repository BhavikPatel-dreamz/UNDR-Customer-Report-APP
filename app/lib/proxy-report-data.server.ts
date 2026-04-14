import type { ProxyReportData } from "./proxy-report-data";
import { sampleProxyReportData } from "./proxy-report-data";

function cloneSample(): ProxyReportData {
  return JSON.parse(JSON.stringify(sampleProxyReportData)) as ProxyReportData;
}

function mergeReportData(base: ProxyReportData, incoming: Partial<ProxyReportData>): ProxyReportData {
  return {
    ...base,
    ...incoming,
    banner: { ...base.banner, ...incoming.banner },
    reportDetails: {
      ...base.reportDetails,
      ...incoming.reportDetails,
      heavyMetals: incoming.reportDetails?.heavyMetals || base.reportDetails.heavyMetals,
      oilIndicator: { ...base.reportDetails.oilIndicator, ...incoming.reportDetails?.oilIndicator },
      preciousMetals: incoming.reportDetails?.preciousMetals || base.reportDetails.preciousMetals,
      rareEarthElements: incoming.reportDetails?.rareEarthElements || base.reportDetails.rareEarthElements,
      reportChart: { ...base.reportDetails.reportChart, ...incoming.reportDetails?.reportChart },
    },
    elementBreakdown: { items: incoming.elementBreakdown?.items || base.elementBreakdown.items },
    otherTraceElements: { items: incoming.otherTraceElements?.items || base.otherTraceElements.items },
    traceFound: {
      ...base.traceFound,
      ...incoming.traceFound,
      rows: incoming.traceFound?.rows || base.traceFound.rows,
      scaleLabels: incoming.traceFound?.scaleLabels || base.traceFound.scaleLabels,
    },
    multiLevelCharts: {
      ...base.multiLevelCharts,
      ...incoming.multiLevelCharts,
      group1Rows: incoming.multiLevelCharts?.group1Rows || base.multiLevelCharts.group1Rows,
      group1ScaleLabels: incoming.multiLevelCharts?.group1ScaleLabels || base.multiLevelCharts.group1ScaleLabels,
      group2Rows: incoming.multiLevelCharts?.group2Rows || base.multiLevelCharts.group2Rows,
      group2ScaleLabels: incoming.multiLevelCharts?.group2ScaleLabels || base.multiLevelCharts.group2ScaleLabels,
    },
    oilContaminants: { ...base.oilContaminants, ...incoming.oilContaminants },
    preciousMetalPresent: { items: incoming.preciousMetalPresent?.items || base.preciousMetalPresent.items },
    earthElementsBreakdown: { items: incoming.earthElementsBreakdown?.items || base.earthElementsBreakdown.items },
    soilFeatures: incoming.soilFeatures || base.soilFeatures,
    foundElements: incoming.foundElements || base.foundElements,
    notFoundElements: incoming.notFoundElements || base.notFoundElements,
  };
}

async function fetchRemoteReport(proxyId: string): Promise<Partial<ProxyReportData> | null> {
  const baseUrl = process.env.PROXY_REPORT_API_URL?.trim();
  if (!baseUrl) return null;

  const url = baseUrl.includes(":id")
    ? baseUrl.replace(":id", encodeURIComponent(proxyId))
    : `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}id=${encodeURIComponent(proxyId)}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Proxy report API request failed with status ${response.status}`);
  }

  return (await response.json()) as Partial<ProxyReportData>;
}

export async function getProxyReportData(proxyId: string, request: Request): Promise<ProxyReportData> {
  const base = cloneSample();
  base.banner.name = proxyId || base.banner.name;

  const url = new URL(request.url);
  const rawData = url.searchParams.get("data")?.trim();
  if (rawData) {
    try {
      return mergeReportData(base, JSON.parse(rawData) as Partial<ProxyReportData>);
    } catch {
      return base;
    }
  }

  try {
    const remote = await fetchRemoteReport(proxyId);
    if (remote) {
      return mergeReportData(base, remote);
    }
  } catch (error) {
    console.error("getProxyReportData failed to fetch remote data", error);
  }

  return base;
}