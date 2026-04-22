import type { ProxyReportData } from "./proxy-report-data";
import { sampleProxyReportData } from "./proxy-report-data";
import { mapHeavyMetals } from "../utils/mapHeavyMetals";
import { mapPreciousMetals } from "../utils/mapPreciousMetals";
import { mapRareEarthElements } from "../utils/mapRareEarthElements";
import { mapFoundElements } from "../utils/mapFoundElements";
import { mapNotFoundElements } from "../utils/mapNotFoundElements";
import { mapEarthElementsBreakdown } from "../utils/mapEarthElementsBreakdown";

function cloneSample(): ProxyReportData {
  return JSON.parse(JSON.stringify(sampleProxyReportData)) as ProxyReportData;
}

function mergeReportData(base: ProxyReportData, incoming: Partial<ProxyReportData>): ProxyReportData {
  const incomingHeavyMetals = (incoming as any)?.reportDetails?.heavyMetals;
  const mappedHeavyMetals = incomingHeavyMetals ? mapHeavyMetals(incomingHeavyMetals) : base.reportDetails.heavyMetals;
  const incomingPreciousMetals = (incoming as any)?.reportDetails?.preciousMetals;
  const mappedPreciousMetals = incomingPreciousMetals
    ? mapPreciousMetals(incomingPreciousMetals)
    : base.reportDetails.preciousMetals;
  const incomingRareEarthElements = (incoming as any)?.reportDetails?.rareEarthElements;
  const mappedRareEarthElements = incomingRareEarthElements
    ? mapRareEarthElements(incomingRareEarthElements)
    : base.reportDetails.rareEarthElements;
  const incomingFoundElements = (incoming as any)?.foundElements;
  const mappedFoundElements = incomingFoundElements ? mapFoundElements(incomingFoundElements) : base.foundElements;
  const incomingNotFoundElements = (incoming as any)?.notFoundElements;
  const mappedNotFoundElements = incomingNotFoundElements
    ? mapNotFoundElements(incomingNotFoundElements)
    : base.notFoundElements;
  const incomingEarthBreakdownItems = (incoming as any)?.earthElementsBreakdown?.items;
  const mappedEarthBreakdownItems = incomingEarthBreakdownItems
    ? mapEarthElementsBreakdown(incomingEarthBreakdownItems)
    : base.earthElementsBreakdown.items;

  if (incomingHeavyMetals) {
    console.log("[mergeReportData] heavyMetals mapped", {
      incomingType: Array.isArray(incomingHeavyMetals) ? "array" : typeof incomingHeavyMetals,
      incomingCount: Array.isArray(incomingHeavyMetals) ? incomingHeavyMetals.length : null,
      mappedCount: mappedHeavyMetals.length,
      firstMapped: mappedHeavyMetals[0] ?? null,
    });
  }
  if (incomingPreciousMetals) {
    console.log("[mergeReportData] preciousMetals mapped", {
      incomingType: Array.isArray(incomingPreciousMetals) ? "array" : typeof incomingPreciousMetals,
      incomingCount: Array.isArray(incomingPreciousMetals) ? incomingPreciousMetals.length : null,
      mappedCount: mappedPreciousMetals.length,
      firstMapped: mappedPreciousMetals[0] ?? null,
    });
  }
  if (incomingRareEarthElements) {
    console.log("[mergeReportData] rareEarthElements mapped", {
      incomingType: Array.isArray(incomingRareEarthElements) ? "array" : typeof incomingRareEarthElements,
      incomingCount: Array.isArray(incomingRareEarthElements) ? incomingRareEarthElements.length : null,
      mappedCount: mappedRareEarthElements.length,
      firstMapped: mappedRareEarthElements[0] ?? null,
    });
  }
  if (incomingFoundElements) {
    console.log("[mergeReportData] foundElements mapped", {
      incomingType: Array.isArray(incomingFoundElements) ? "array" : typeof incomingFoundElements,
      incomingCount: Array.isArray(incomingFoundElements) ? incomingFoundElements.length : null,
      mappedCount: mappedFoundElements.length,
      firstMapped: mappedFoundElements[0] ?? null,
    });
  }
  if (incomingNotFoundElements) {
    console.log("[mergeReportData] notFoundElements mapped", {
      incomingType: Array.isArray(incomingNotFoundElements) ? "array" : typeof incomingNotFoundElements,
      incomingCount: Array.isArray(incomingNotFoundElements) ? incomingNotFoundElements.length : null,
      mappedCount: mappedNotFoundElements.length,
      firstMapped: mappedNotFoundElements[0] ?? null,
    });
  }
  if (incomingEarthBreakdownItems) {
    console.log("[mergeReportData] earthElementsBreakdown mapped", {
      incomingCount: Array.isArray(incomingEarthBreakdownItems) ? incomingEarthBreakdownItems.length : 0,
      mappedCount: mappedEarthBreakdownItems.length,
      firstMapped: mappedEarthBreakdownItems[0] ?? null,
    });
  }
  return {
    ...base,
    ...incoming,
    banner: { ...base.banner, ...incoming.banner },
    reportDetails: {
      
      ...base.reportDetails,
      ...incoming.reportDetails,
      heavyMetals: mappedHeavyMetals,
      
      oilIndicator: { ...base.reportDetails.oilIndicator, ...incoming.reportDetails?.oilIndicator },
      preciousMetals: mappedPreciousMetals,
      rareEarthElements: mappedRareEarthElements,
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
    earthElementsBreakdown: { items: mappedEarthBreakdownItems },
    soilFeatures: incoming.soilFeatures || base.soilFeatures,
    foundElements: mappedFoundElements,
    notFoundElements: mappedNotFoundElements,
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