import prisma from "../db.server";
import * as XLSX from "xlsx";
import type {
  ProxyReportData,
  BreakdownBarItem,
  HeavyMetalItem,
  MetalCardItem,
  PreciousMetalGraphItem,
  EarthElementItem,
  FoundElementItem,
  NotFoundElementItem,
  SoilFeatureItem,
} from "../lib/proxy-report-data";

export type ParsedReportRow = {
  element: string;
  rawValue: number;
  ppmValue: number;
  unit: string;
  category: string;
};

const UNIQUE_SOIL_RESULT_BY_SYMBOL: Record<string, number> = {
  o: 0,
  f: 0,
  na: 0.0966,
  mg: 0,
  al: 0.0251,
  si: 0.4414,
  p: 0.033,
  s: 0.0788,
  cl: 0.0075,
  k: 0.0059,
  ca: 0.0092,
  sc: 0,
  ti: 0,
  v: 0.0812,
  cr: 15.8755,
  mn: 1.3116,
  fe: 63.1272,
  co: 0.1558,
  ni: 6.7106,
  cu: 0.3264,
  zn: 0,
  ga: 0.0023,
  ge: 0.0017,
  as: 0,
  se: 0,
  br: 0,
  rb: 0,
  sr: 0.0001,
  y: 0.0002,
  zr: 0,
  nb: 0.0045,
  mo: 0.2868,
  ru: 0,
  rh: 0,
  pd: 0,
  ag: 0.0002,
  cd: 0,
  in: 0.0008,
  sn: 0.0025,
  sb: 0,
  te: 0.0002,
  i: 0.0169,
  cs: 0,
  ba: 0.0036,
  la: 0.0007,
  ce: 0,
  pr: 0,
  nd: 0,
  sm: 0.0018,
  eu: 0,
  gd: 0,
  tb: 0.1246,
  dy: 0.0366,
  ho: 0,
  er: 0,
  tm: 0,
  yb: 0.0618,
  lu: 0,
  hf: 0,
  ta: 0.0009,
  w: 0,
  re: 0.01,
  os: 0,
  ir: 0,
  pt: 0,
  au: 0,
  hg: 0,
  tl: 0,
  pb: 0,
  bi: 0,
  po: 0,
  at: 0,
  fr: 0,
  ra: 0.0005,
  ac: 0.0004,
  th: 0,
  pa: 0.0006,
  u: 0,
  co2: 11.1,
};

// ─── CSV Parsing ─────────────────────────────────────────────────────────────

function parseCsvRow(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  values.push(current.trim());
  return values;
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_");
}
function getElementClassName(input: string): string {
  const key = input.trim().toLowerCase();

  // symbol → name
  if (ELEMENT_NAME_MAP[key]) {
    return ELEMENT_NAME_MAP[key].toLowerCase(); // chromium
  }

  // name → symbol → name
  if (ELEMENT_SYMBOL_FROM_NAME[key]) {
    const symbol = ELEMENT_SYMBOL_FROM_NAME[key];
    return ELEMENT_NAME_MAP[symbol].toLowerCase();
  }

  return key;
}

const ELEMENT_STANDARD_DEVIATION_PPM_BY_SYMBOL: Record<string, number> = {
  o: 37500,
  f: 100,
  na: 2000,
  mg: 2250,
  al: 22500,
  si: 37500,
  p: 250,
  s: 225,
  cl: 40,
  k: 7500,
  ca: 12250,
  sc: 5,
  ti: 2250,
  v: 35,
  cr: 36.25,
  mn: 625,
  fe: 16250,
  co: 9.75,
  ni: 24.5,
  cu: 24.5,
  zn: 67.5,
  ga: 6.25,
  ge: 0.475,
  as: 4.75,
  se: 0.475,
  br: 1.25,
  rb: 17.5,
  sr: 75,
  y: 8.75,
  zr: 50,
  nb: 7,
  mo: 0.5,
  tc: 0.01,
  ru: 0.01,
  rh: 0.01,
  pd: 0.01,
  ag: 0.2475,
  cd: 0.2475,
  in: 0.1225,
  sn: 1.125,
  sb: 0.4875,
  te: 0.2475,
  i: 1.125,
  cs: 3.5,
  ba: 237.5,
  la: 11.25,
  ce: 22.5,
  pr: 2.75,
  nd: 11.25,
  pm: 0.01,
  sm: 2.25,
  eu: 0.7,
  gd: 2.25,
  tb: 0.475,
  dy: 1.335,
  ho: 0.475,
  er: 1.125,
  tm: 0.2,
  yb: 0.85,
  lu: 0.2375,
  hf: 1.125,
  ta: 1.125,
  w: 1.225,
  re: 0.01,
  os: 0.01,
  ir: 0.01,
  pt: 0.01,
  au: 0.002375,
  hg: 0.0475,
  tl: 0.05,
  pb: 6.25,
  bi: 0.2475,
  po: 0.01,
  at: 0.01,
  ra: 0.01,
  ac: 0.01,
  pa: 0.01,
  th: 3,
  u: 1.125,
};

const ELEMENT_STANDARD_DEVIATION_PPM_BY_NAME: Record<string, number> = {
  thorium: 0.01,
  protactinium: 3,
};

const ELEMENT_AVERAGE_PPM_BY_SYMBOL: Record<string, number> = {
  o: 425000,
  f: 300,
  na: 5500,
  mg: 5500,
  al: 55000,
  si: 275000,
  p: 700,
  s: 550,
  cl: 130,
  k: 20000,
  ca: 25500,
  sc: 20,
  ti: 5500,
  v: 80,
  cr: 77.5,
  mn: 1750,
  fe: 37500,
  co: 20.5,
  ni: 51,
  cu: 51,
  zn: 165,
  ga: 12.5,
  ge: 1.05,
  as: 10.5,
  se: 1.05,
  br: 2.5,
  rb: 65,
  sr: 260,
  y: 22.5,
  zr: 200,
  nb: 16,
  mo: 1,
  tc: 0,
  ru: 0,
  rh: 0,
  pd: 0,
  ag: 0.505,
  cd: 0.505,
  in: 0.255,
  sn: 2.75,
  sb: 1.025,
  te: 0.505,
  i: 2.75,
  cs: 6,
  ba: 700,
  la: 27.5,
  ce: 55,
  pr: 6.5,
  nd: 27.5,
  pm: 0,
  sm: 5.5,
  eu: 1.6,
  gd: 5.5,
  tb: 1.05,
  dy: 3,
  ho: 1.05,
  er: 2.25,
  tm: 0.4,
  yb: 2,
  lu: 0.525,
  hf: 2.75,
  ta: 2.75,
  w: 2.55,
  re: 0,
  os: 0,
  ir: 0,
  pt: 0,
  au: 0.00525,
  hg: 0.105,
  tl: 0.2,
  pb: 17.5,
  bi: 0.505,
  po: 0,
  at: 0,
  ra: 0,
  ac: 0,
  pa: 0,
  th: 7,
  u: 2.25,
};

const ELEMENT_AVERAGE_PPM_BY_NAME: Record<string, number> = {
  thorium: 0,
  protactinium: 7,
};

function getElementStandardDeviationPpm(input: string) {
  const key = input.trim().toLowerCase();
  if (ELEMENT_STANDARD_DEVIATION_PPM_BY_NAME[key] !== undefined) {
    return ELEMENT_STANDARD_DEVIATION_PPM_BY_NAME[key];
  }

  const symbol = ELEMENT_STANDARD_DEVIATION_PPM_BY_SYMBOL[key] !== undefined
    ? key
    : ELEMENT_SYMBOL_FROM_NAME[key];

  if (!symbol) return null;
  const standardDeviation = ELEMENT_STANDARD_DEVIATION_PPM_BY_SYMBOL[symbol.toLowerCase()];
  return Number.isFinite(standardDeviation) ? standardDeviation : null;
}

function formatElementMargin(input: string) {
  const standardDeviation = getElementStandardDeviationPpm(input);
  return standardDeviation == null ? "± 0 ppm" : `± ${standardDeviation} ppm`;
}

function getElementAveragePpm(input: string) {
  const key = input.trim().toLowerCase();
  if (ELEMENT_AVERAGE_PPM_BY_NAME[key] !== undefined) {
    return ELEMENT_AVERAGE_PPM_BY_NAME[key];
  }

  const symbol = ELEMENT_AVERAGE_PPM_BY_SYMBOL[key] !== undefined
    ? key
    : ELEMENT_SYMBOL_FROM_NAME[key];

  if (!symbol) return null;
  const average = ELEMENT_AVERAGE_PPM_BY_SYMBOL[symbol.toLowerCase()];
  return Number.isFinite(average) ? average : null;
}

function formatElementSymbol(input: string) {
  const key = input.trim().toLowerCase();
  const symbol = ELEMENT_AVERAGE_PPM_BY_SYMBOL[key] !== undefined
    ? key
    : ELEMENT_SYMBOL_FROM_NAME[key] || key;

  return symbol.length <= 2
    ? symbol.charAt(0).toUpperCase() + symbol.slice(1)
    : input;
}

function getElementRangeChartValue(adjustedPpm: number, averagePpm: number) {
  if (!Number.isFinite(adjustedPpm) || adjustedPpm <= 0) return 0;
  if (!Number.isFinite(averagePpm) || averagePpm <= 0) return adjustedPpm;

  const percentOfAverage = (adjustedPpm / averagePpm) * 100;
  if (percentOfAverage <= 100) return Math.max(4, percentOfAverage);
  return 100 + Math.log10(percentOfAverage / 100) * 50;
}

function formatSoilFeatureDifference(resultPpm: number, averagePpm: number) {
  const ratio = averagePpm > 0 ? resultPpm / averagePpm : 0;

  if (ratio >= 10) {
    return `${Math.round(ratio).toLocaleString("en-US")} times higher`;
  }

  if (ratio >= 1) {
    const percentHigher = Math.round((ratio - 1) * 100);
    return `${percentHigher}% higher`;
  }

  const percentLower = Math.round((1 - ratio) * 100);
  return `${percentLower}% lower`;
}

function normalizeRows(
  rows: string[][],
  preferredHeaders: string[] = [],
): Record<string, string>[] {
  if (rows.length === 0) return [];

  const preferred = new Set(preferredHeaders.map((h) => normalizeHeader(h)));
  const elementCandidates = new Set([
    "element",
    "component",
    "name",
    "element_name",
    "analyte",
  ]);
  const valueCandidates = new Set([
    "raw_value",
    "value",
    "result",
    "concentration",
    "ppm",
    "mg_l",
    "mg_kg",
  ]);

  let headerIndex = 0;
  let bestScore = -1;

  for (let i = 0; i < rows.length; i++) {
    const rowHeaders = rows[i].map(normalizeHeader).filter(Boolean);
    if (rowHeaders.length === 0) continue;

    let score = 0;
    for (const header of rowHeaders) {
      if (preferred.has(header)) score += 2;
      if (elementCandidates.has(header)) score += 3;
      if (valueCandidates.has(header)) score += 3;
      if (header === "unit" || header === "units") score += 1;
      if (header === "category" || header === "type" || header === "group") score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      headerIndex = i;
    }
  }

  const headers = rows[headerIndex].map(normalizeHeader);

  return rows
    .slice(headerIndex + 1)
    .map((row) => {
      return headers.reduce(
        (obj, header, i) => {
          if (!header) return obj;
          obj[header] = String(row[i] ?? "").trim();
          return obj;
        },
        {} as Record<string, string>,
      );
    })
    .filter((row) => Object.values(row).some((v) => v !== ""));
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "");

  if (lines.length < 2) return [];

  const parsedRows = lines.map((line) => parseCsvRow(line));
  return normalizeRows(parsedRows, ["element", "component", "result", "raw_value", "value"]);
}

export function parseSpreadsheet(buffer: ArrayBuffer): Record<string, string>[] {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const firstSheet = workbook.Sheets[firstSheetName];
  if (!firstSheet) return [];

  const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false,
  }) as unknown[][];

  const asStrings = rows.map((row) => row.map((cell) => String(cell ?? "").trim()));
  return normalizeRows(asStrings, ["element", "component", "result", "raw_value", "value"]);
}

function inferCategoryFromElement(elementName: string): string {
  const normalized = elementName.trim().toLowerCase();
  if (!normalized) return "";

  const heavyMetals = new Set([
    "lead",
    "pb",
    "arsenic",
    "as",
    "mercury",
    "hg",
    "uranium",
    "u",
    "chromium",
    "cr",
    "cadmium",
    "cd",
    "antimony",
    "sb",
    "tellurium",
    "te",
    "thallium",
    "tl",
    "thorium",
    "th",
    // "nickel",
    // "ni",
    // "cobalt",
    // "co",
    // "manganese",
    // "mn",
    // "vanadium",
    // "v",
    // "barium",
    // "ba",
  ]);

  const preciousMetals = new Set([
    "gold",
    "au",
    "silver",
    "ag",
    "platinum",
    "pt",
    "ruthenium",
    "ru",
    "rhodium",
    "rh",
    "palladium",
    "pd",
    "osmium",
    "os",
    "iridium",
    "ir",
    // "re",
    // "rhenium",
  ]);

  const rareEarth = new Set([
    "scandium",
    "sc",
    "yttrium",
    "y",
    "lanthanum",
    "la",
    "cerium",
    "ce",
    "praseodymium",
    "pr",
    "neodymium",
    "nd",
    "promethium",
    "pm",
    "samarium",
    "sm",
    "europium",
    "eu",
    "gadolinium",
    "gd",
    "terbium",
    "tb",
    "dysprosium",
    "dy",
    "holmium",
    "ho",
    "erbium",
    "er",
    "thulium",
    "tm",
    "ytterbium",
    "yb",
    "lutetium",
    "lu",
  ]);

  if (heavyMetals.has(normalized)) return "heavy_metal";
  if (preciousMetals.has(normalized)) return "precious_metal";
  if (rareEarth.has(normalized)) return "rare_earth";
  if (normalized.includes("oil") || normalized.includes("petroleum") || normalized.includes("hydrocarbon")) {
    return "oil_contaminant";
  }

  return "trace_element";
}

export function extractReportRows(
  csvRows: Record<string, string>[],
): ParsedReportRow[] {
  // Resolve column names flexibly
  const findCol = (row: Record<string, string>, ...keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== "") return row[key];
    }
    return null;
  };

  return csvRows
    .map((row) => {
      const element =
        findCol(row, "element", "component", "name", "element_name", "analyte") ??
        Object.values(row)[0] ??
        "";

      const rawStr =
        findCol(
          row,
          "raw_value",
          "value",
          "raw",
          "concentration",
          "result",
          "ppm",
          "mg_l",
          "mg_kg",
        ) ?? Object.values(row)[1] ?? "0";

      const rawValue = Number.parseFloat(rawStr);
      const ppmValue = Number.isFinite(rawValue) ? rawValue * 10000 : Number.NaN;
      const unit = findCol(row, "unit", "units") ?? "ppm";
      const detectedCategory =
        findCol(row, "category", "type", "group", "class_") ?? "";
      const category = detectedCategory || inferCategoryFromElement(String(element));

      return {
        element: String(element).trim(),
        rawValue,
        ppmValue,
        unit: String(unit).trim(),
        category: String(category).trim().toLowerCase(),
      };
    })
    .filter((r) => r.element !== "");
}

// ─── ProxyReportData Builder ──────────────────────────────────────────────────

const BAR_COLORS = [
  "#4CAF50",
  "#2196F3",
  "#FF9800",
  "#9C27B0",
  "#F44336",
  "#00BCD4",
  "#8BC34A",
  "#FF5722",
];

function categoryIncludes(category: string, ...keywords: string[]) {
  return keywords.some((k) => category.includes(k));
}

const HEAVY_METAL_ELEMENTS = new Set([
  "arsenic",
  "as",
  "cadmium",
  "cd",
  "antimony",
  "sb",
  "tellurium",
  "te",
  "mercury",
  "hg",
  "thallium",
  "tl",
  "thorium",
  "th",
  "uranium",
  "u",
  "chromium",
  "cr",
  "lead",
  "pb",
]);

const HEAVY_METAL_DISPLAY_ORDER = [
  "arsenic",
  "cadmium",
  "antimony",
  "tellurium",
  "mercury",
  "thallium",
  "thorium",
  "uranium",
  "chromium",
  "lead",
] as const;

const HEAVY_METAL_DISPLAY_ORDER_INDEX = new Map<string, number>(
  HEAVY_METAL_DISPLAY_ORDER.map((name, index) => [name, index]),
);

const HEAVY_METAL_THRESHOLD_VALUES: Record<
  string,
  { safeVal: number; marginalVal: number }
> = {
  arsenic: { safeVal: 10, marginalVal: 20 },
  as: { safeVal: 10, marginalVal: 20 },

  cadmium: { safeVal: 2, marginalVal: 7.1 },
  cd: { safeVal: 2, marginalVal: 7.1 },

  lead: { safeVal: 80, marginalVal: 400 },
  pb: { safeVal: 80, marginalVal: 400 },

  mercury: { safeVal: 1, marginalVal: 23 },
  hg: { safeVal: 1, marginalVal: 23 },

  antimony: { safeVal: 5, marginalVal: 31 },
  sb: { safeVal: 5, marginalVal: 31 },

  thallium: { safeVal: 5, marginalVal: 25 },
  tl: { safeVal: 5, marginalVal: 25 },

  uranium: { safeVal: 3, marginalVal: 16 },
  u: { safeVal: 3, marginalVal: 16 },

  chromium: { safeVal: 100, marginalVal: 300 },
  cr: { safeVal: 100, marginalVal: 300 },

  thorium: { safeVal: 10, marginalVal: 30 },
  th: { safeVal: 10, marginalVal: 30 },

  tellurium: { safeVal: 5, marginalVal: 30 },
  te: { safeVal: 5, marginalVal: 30 },
};

function getHeavyMetalReference(input: string) {
  const key = input.trim().toLowerCase();
  return HEAVY_METAL_THRESHOLD_VALUES[key] || null;
}

function getHeavyMetalDisplayOrder(input: string) {
  const key = input.trim().toLowerCase();
  const normalizedName = ELEMENT_NAME_MAP[key]?.toLowerCase() || key;
  return HEAVY_METAL_DISPLAY_ORDER_INDEX.get(normalizedName) ?? Number.MAX_SAFE_INTEGER;
}

function buildScaleLabels(max: number, step: number) {
  const labels: string[] = [];
  for (let value = 0; value <= max; value += step) {
    labels.push(String(value));
  }
  if (labels[labels.length - 1] !== String(max)) {
    labels.push(String(max));
  }
  return labels;
}

function getPetroleumChartMax(ppmValue: number) {
  if (ppmValue <= 1000) return 1100;
  return Math.ceil(ppmValue / 100) * 100;
}

function createEmptyProxyReportData(customerName: string, kitNumber: string): ProxyReportData {
  return {
    banner: {
      name: customerName,
      subtitle: `Kit Registration: ${kitNumber}`,
    },
    reportDetails: {
      heavyMetals: [],
      oilIndicator: {
        crudeOil: "Crude oil: None",
        petroleum: "Petroleum: None",
        crudeOilClassName: "btn_gray",
        petroleumClassName: "btn_gray",
      },
      preciousMetals: [],
      rareEarthElements: [],
      reportChart: {
        elementNames: [],
        belowData: [],
        refData: [],
        aboveData: [],
        calculations: [],
      },
    },
    elementBreakdown: {
      items: [],
    },
    otherTraceElements: {
      items: [],
    },
    traceFound: {
      title: "Traces found in your land sample",
      subtitle: "Find more about the potential treasures in your soil below",
      max: 1100,
      rows: [],
      scaleLabels: ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100"],
    },
    petroleumTraceFound: {
      title: "Petroleum contaminants found in your land sample",
      subtitle: "Selected petroleum contaminant shown against ppm safety thresholds.",
      max: 1100,
      rows: [],
      scaleLabels: ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100"],
    },
    multiLevelCharts: {
      group1Max: 35,
      group1Rows: [],
      group1ScaleLabels: ["0", "5", "10", "15", "20", "25", "30", "35"],
      group2Max: 450,
      group2Rows: [],
      group2ScaleLabels: ["0", "50", "100", "150", "200", "250", "300", "350", "400", "450"],
    },
    oilContaminants: {
      status: "Not Detected",
      value: "0ppm",
    },
    preciousMetalPresent: {
      items: [],
    },
    earthElementsBreakdown: {
      items: [],
    },
    soilFeatures: [],
    foundElements: [],
    notFoundElements: [],
  };
}

export function buildReportDataFromRows(
  rows: ParsedReportRow[],
  customerName: string,
  kitNumber: string,
): ProxyReportData {
  const base = createEmptyProxyReportData(customerName, kitNumber);

  console.log("[Unique Soil] buildReportDataFromRows", {
    rowCount: rows.length,
    customerName,
    kitNumber,
  });

  if (rows.length === 0) return base;

  const resultColumnValues = Object.entries(UNIQUE_SOIL_RESULT_BY_SYMBOL).map(([element, result]) => ({
    element: formatElementSymbol(element),
    result,
  }));

  console.log("[Unique Soil] result column", resultColumnValues);

  // Separate rows by known categories
  const heavyMetalRows = rows.filter((r) => {
    const elementKey = String(r.element || "").trim().toLowerCase();
    return (
      categoryIncludes(r.category, "heavy", "metal", "toxic") &&
      HEAVY_METAL_ELEMENTS.has(elementKey)
    );
  });
  const preciousRows = rows.filter((r) =>
    categoryIncludes(r.category, "precious", "gold", "silver", "platinum"),
  );
  const earthRows = rows.filter((r) =>
    categoryIncludes(r.category, "earth", "rare", "ree"),
  );
  const oilRows = rows.filter((r) =>
    categoryIncludes(r.category, "oil", "petroleum", "hydrocarbon"),
  );
  const allElements = rows;

  // --- Found / Not Found
  const found = allElements.filter((r) => r.ppmValue > 0);
  const notFound = allElements.filter((r) => r.ppmValue === 0);

base.foundElements = found.slice(0, 60)
.sort((a, b) => a.element.localeCompare(b.element)) // alphabetical sort
.map(
  (r): FoundElementItem => {
    
    const key = r.element.toLowerCase();
    const colors = ELEMENT_COLOR_MAP[key] ?? ELEMENT_COLOR_MAP.default;

    const mapped: FoundElementItem = {
      symbol: ELEMENT_SYMBOL_FROM_NAME[key]?.toUpperCase() || key.substring(0, 2).toUpperCase(),
      name: formatElementName(r.element).replace(/\s*\([^)]+\)\s*$/, ""),
      // ppm: r.ppmValue.toFixed(2),
      ppm: Math.floor(r.ppmValue).toString().slice(0, 2) +"ppm",
      margin: formatElementMargin(r.element),
      valueStyle: {
        backgroundColor: colors.bg,
        color: colors.text,
      },
      bgClass: "bg-green-50",
      colorClass: "text-green-700",
    };


    return mapped;
  },
);

  // base.notFoundElements = notFound.slice(0, 60).map(
  //   (r): NotFoundElementItem => ({
  //     symbol: r.element.substring(0, 2).toUpperCase(),
  //     name: r.element,
  //     bgClass: "bg-gray-50",
  //     textClass: "text-gray-400",
  //   }),
  // );

  base.notFoundElements = notFound.slice(0, 60)
  .sort((a, b) => a.element.localeCompare(b.element)) // alphabetical sort
  .map(
  (r): NotFoundElementItem => {
    const key = r.element.toLowerCase();
    const colors = ELEMENT_COLOR_MAP[key] ?? ELEMENT_COLOR_MAP.default;
    

    return {
      symbol: ELEMENT_SYMBOL_FROM_NAME[key]?.toUpperCase() || key.substring(0, 2).toUpperCase(),
      name: formatElementName(r.element).replace(/\s*\([^)]+\)\s*$/, ""),
      valueStyle: {
        backgroundColor: colors.bg,
        color: colors.text,
      },

      bgClass: "bg-gray-50",
      textClass: "text-gray-400",
    };
    
  }
);

  // --- Element Breakdown (all found elements by ppmValue)
  const sorted = [...found].sort((a, b) => b.ppmValue - a.ppmValue);
  // const elementBreakdownRows = sorted;
  const elementBreakdownRows = sorted.slice(0, 15);

  // const top8 = sorted.slice(0, 8);
  // const next8 = sorted.slice(8, 16);
  const top8 = elementBreakdownRows.slice(0, 8); // (optional, jo use hoy to)
  const next8 = sorted.slice(15, 23); // <-- IMPORTANT CHANGE
  // const totalPpm = elementBreakdownRows.reduce((s, r) => s + r.ppmValue, 0);
  const totalPpm = elementBreakdownRows.reduce((s, r) => s + r.ppmValue, 0);
  const otherTraceTotalPpm = next8.reduce((s, r) => s + r.ppmValue, 0);

  // const otherTraceTotalPpm = next8.reduce((s, r) => s + r.ppmValue, 0);

  if (elementBreakdownRows.length > 0) {
    const breakdownItems = elementBreakdownRows.map(
      (r): BreakdownBarItem => ({
        name: r.element,
        percentage: totalPpm > 0 ? Math.round((r.ppmValue / totalPpm) * 100) : 0,
        color: (ELEMENT_COLOR_MAP[r.element.trim().toLowerCase()] ?? ELEMENT_COLOR_MAP.default).bg,
      }),
    );

    base.elementBreakdown.items = breakdownItems;
  }

  const soilFeatureCardClasses = ["iron_card", "potas_card", "sodium_card"];
  const soilFeatureCalculations = Object.entries(UNIQUE_SOIL_RESULT_BY_SYMBOL)
    .map(([element, rawResult]) => {
      const elementKey = element.trim().toLowerCase();
      const resultPpm = Number(rawResult) * 10000;
      const averagePpm = getElementAveragePpm(elementKey);
      const standardDeviationPpm = getElementStandardDeviationPpm(elementKey);

      if (
        averagePpm === null ||
        standardDeviationPpm === null ||
        !Number.isFinite(resultPpm) ||
        !Number.isFinite(averagePpm) ||
        !Number.isFinite(standardDeviationPpm) ||
        resultPpm <= 0 ||
        averagePpm <= 0 ||
        standardDeviationPpm <= 0
      ) {
        return null;
      }

      const standardDeviationDistance = (resultPpm - averagePpm) / standardDeviationPpm;
      return {
        element,
        rawResult,
        resultPpm,
        averagePpm,
        standardDeviationPpm,
        standardDeviationDistance,
      };
    })
    .filter((item): item is {
      element: string;
      rawResult: number;
      resultPpm: number;
      averagePpm: number;
      standardDeviationPpm: number;
      standardDeviationDistance: number;
    } => item !== null);

  const topSoilFeatureCalculations = [...soilFeatureCalculations]
    .sort((a, b) => Math.abs(b.standardDeviationDistance) - Math.abs(a.standardDeviationDistance))
    .slice(0, 3);

  const uniqueSoilCalculationsLog = soilFeatureCalculations.map((item) => ({
    element: formatElementSymbol(item.element),
    calculation: `((${item.rawResult} * 10000) - ${item.averagePpm}) / ${item.standardDeviationPpm}`,
    value: item.standardDeviationDistance,
    output: item.resultPpm / item.averagePpm,
  }));
  const uniqueSoilTop3Log = topSoilFeatureCalculations.map((item) => ({
    element: formatElementSymbol(item.element),
    value: item.standardDeviationDistance,
    output: item.resultPpm / item.averagePpm,
  }));

  console.log(
    "[Unique Soil] calculations",
    uniqueSoilCalculationsLog,
  );

  console.log(
    "[Unique Soil] top 3",
    uniqueSoilTop3Log,
  );

  base.soilFeatureCalculations = uniqueSoilCalculationsLog;

  base.soilFeatures = topSoilFeatureCalculations.map((item, index): SoilFeatureItem => {
    const elementName = formatElementName(item.element).replace(/\s*\([^)]+\)\s*$/, "");
    return {
      title: `${elementName} is ${formatSoilFeatureDifference(item.resultPpm, item.averagePpm)}`,
      description: "than commonly found in soil samples",
      cardClassName: soilFeatureCardClasses[index % soilFeatureCardClasses.length],
      result: item.rawResult,
      calculation: `((${item.rawResult} * 10000) - ${item.averagePpm}) / ${item.standardDeviationPpm}`,
      value: item.standardDeviationDistance,
      output: item.resultPpm / item.averagePpm,
    };
  });

  const reportChartRows = [...allElements]
    .filter((r) => {
      const category = String(r.category || "").trim().toLowerCase();
      const elementKey = String(r.element || "").trim().toLowerCase();
      return category !== "petroleum_contaminant" && getElementAveragePpm(elementKey) !== null;
    })
    .sort((a, b) => formatElementSymbol(a.element).localeCompare(formatElementSymbol(b.element)));

  // Element Breakdown Chart:
  // Result is already adjusted to ppm in extractReportRows as Result * 10,000.
  // Compare adjusted ppm against static average ppm, then pass 3 values per element.
  base.reportDetails.reportChart = reportChartRows.reduce(
    (acc, item) => {
      const elementKey = String(item.element || "").trim().toLowerCase();
      const elementLabel = formatElementSymbol(item.element);
      const adjustedPpm = Number(item.ppmValue);
      const averagePpm = getElementAveragePpm(elementKey);
      if (averagePpm === null || !Number.isFinite(adjustedPpm)) return acc;

      const isBelowAverage = adjustedPpm < averagePpm;
      const isAboveAverage = adjustedPpm > averagePpm;
      const chartValue = getElementRangeChartValue(adjustedPpm, averagePpm);
      const referenceChartValue = averagePpm > 0 ? 100 : 0;
      const percentOfAverage = averagePpm > 0 ? (adjustedPpm / averagePpm) * 100 : null;
      const comparisonOperator = isBelowAverage ? "<" : isAboveAverage ? ">" : "=";
      const range = isBelowAverage
        ? "Below Range"
        : isAboveAverage
          ? "Above Range"
          : "Reference Range";
      const calculation = `${item.rawValue} * 10000 = ${adjustedPpm}`;
      const comparison = `${adjustedPpm} ${comparisonOperator} ${averagePpm}`;

      acc.elementNames.push(elementLabel);
      acc.belowData.push(isBelowAverage ? chartValue : 0);
      acc.refData.push(referenceChartValue);
      acc.aboveData.push(isAboveAverage ? chartValue : 0);
      acc.calculations.push({
        element: elementLabel,
        elementName: formatElementName(item.element).replace(/\s*\([^)]+\)\s*$/, ""),
        reportedResult: item.rawValue,
        adjustedPpm,
        averagePpm,
        calculation,
        comparison,
        percentOfAverage,
        range,
      });

      console.log("[Element Breakdown Chart]", {
        element: elementLabel,
        elementName: formatElementName(item.element).replace(/\s*\([^)]+\)\s*$/, ""),
        elementKey,
        reportedResult: item.rawValue,
        adjustedPpm,
        averagePpm,
        calculation,
        comparison,
        percentOfAverage,
        range,
        belowRangePpm: isBelowAverage ? adjustedPpm : 0,
        referenceRangePpm: averagePpm,
        aboveRangePpm: isAboveAverage ? adjustedPpm : 0,
        visualScale: "Reference = 100. Below = percent of average. Above = 100 + log10(percent / 100) * 50.",
        belowRangeChartValue: isBelowAverage ? chartValue : 0,
        referenceRangeChartValue: referenceChartValue,
        aboveRangeChartValue: isAboveAverage ? chartValue : 0,
      });

      return acc;
    },
    {
      elementNames: [] as string[],
      belowData: [] as number[],
      refData: [] as number[],
      aboveData: [] as number[],
      calculations: [] as Array<{
        element: string;
        elementName: string;
        reportedResult: number;
        adjustedPpm: number;
        averagePpm: number;
        calculation: string;
        comparison: string;
        percentOfAverage: number | null;
        range: "Below Range" | "Reference Range" | "Above Range";
      }>,
    },
  );

  if (next8.length > 0) {
    base.otherTraceElements.items = next8.map(
      (r): BreakdownBarItem => ({
        name: r.element,
        percentage:
          otherTraceTotalPpm > 0
            ? Math.round((r.ppmValue / otherTraceTotalPpm) * 100)
            : 0,
        color: (ELEMENT_COLOR_MAP[r.element.trim().toLowerCase()] ?? ELEMENT_COLOR_MAP.default).bg,
      }),
    );
  }

  // --- Heavy Metals
  // if (heavyMetalRows.length > 0) {
  //   base.reportDetails.heavyMetals = heavyMetalRows
  //     .slice(0, 6)
  //     .map((r): HeavyMetalItem => ({
  //       name: r.element,
  //       value: r.ppmValue.toFixed(4),
  //       valueClassName: `bg_${r.element}` /* r.ppmValue > 100 ? `text-red-600` : "text-green-600" */,
  //       textClassName: "text-gray-700"
  //     }));
  // }
  function getElementColors(input: string) {
    const key = input.trim().toLowerCase();
    return ELEMENT_COLOR_MAP[key] || ELEMENT_COLOR_MAP.default;
  }
  // --- Heavy Metals
  if (heavyMetalRows.length > 0) {
    base.reportDetails.heavyMetals = heavyMetalRows
      .sort((a, b) => b.ppmValue - a.ppmValue) //  HIGH PPM first
      .slice(0, 3) //  ONLY top 3
      .map((r): HeavyMetalItem => {
        const colors = getElementColors(r.element);
        const className = getElementClassName(r.element);

        return {
          name: formatElementName(r.element),
          value: r.ppmValue.toFixed(2) + "ppm",
          valueClassName: `bg_${className}`,
          valueStyle: {
            backgroundColor: colors.bg,
            color: colors.text,
          },
          textClassName: "text-gray-700",
        };
      });

    const sortedHeavyMetalRows = [...heavyMetalRows].sort((a, b) => {
      const orderDiff = getHeavyMetalDisplayOrder(a.element) - getHeavyMetalDisplayOrder(b.element);
      if (orderDiff !== 0) return orderDiff;
      return a.ppmValue - b.ppmValue;
    });
    const group1Threshold = 35;
    const group1Source = sortedHeavyMetalRows.filter((r) => r.ppmValue <= group1Threshold);
    const group2Source = sortedHeavyMetalRows.filter((r) => r.ppmValue > group1Threshold);

    base.multiLevelCharts.group1Rows = group1Source.map((r) => {
      const maxVal = base.multiLevelCharts.group1Max;
      const threshold = getHeavyMetalReference(r.element);
      const safeVal = threshold
        ? Math.max(0, Math.min(maxVal, threshold.safeVal))
        : maxVal * 0.3;
      const marginalVal = threshold
        ? Math.max(safeVal, Math.min(maxVal, threshold.marginalVal))
        : maxVal * 0.85;

      return {
        label: formatElementName(r.element).replace(/\s*\([^)]+\)\s*$/, ""),
        userVal: Math.min(r.ppmValue, maxVal),
        safeVal,
        marginalVal,
        displayVal: `${Math.round(r.ppmValue)}ppm`,
      };
    });

    base.multiLevelCharts.group2Rows = group2Source.map((r) => {
      const maxVal = base.multiLevelCharts.group2Max;
      const threshold = getHeavyMetalReference(r.element);
      const safeVal = threshold
        ? Math.max(0, Math.min(maxVal, threshold.safeVal))
        : maxVal * 0.3;
      const marginalVal = threshold
        ? Math.max(safeVal, Math.min(maxVal, threshold.marginalVal))
        : maxVal * 0.78;

      return {
        label: formatElementName(r.element).replace(/\s*\([^)]+\)\s*$/, ""),
        userVal: Math.min(r.ppmValue, maxVal),
        safeVal,
        marginalVal,
        displayVal: `${Math.round(r.ppmValue)}ppm`,
      };
    });
  }

  // --- Precious Metals
  if (preciousRows.length > 0) {
    base.reportDetails.preciousMetals = preciousRows
      .sort((a, b) => b.ppmValue - a.ppmValue)
      .slice(0, 3)
      .map((r): MetalCardItem => ({
        name: r.element,
        ppm: r.ppmValue.toFixed(6),
        className: "bg_"+r.element,
      }));

    base.preciousMetalPresent.items = preciousRows
      // .filter((r) => r.ppmValue > 0)
      .sort((a, b) => b.ppmValue - a.ppmValue)
      .slice(0, 8)
      .map((r): PreciousMetalGraphItem => {
        const key = r.element.trim().toLowerCase();
        return {
          name: ELEMENT_NAME_MAP[key] || r.element,
          symbol: ELEMENT_SYMBOL_FROM_NAME[key]?.toUpperCase() || key.substring(0, 2).toUpperCase(),
          ppm: Number(r.ppmValue.toFixed(6)),
          color: (ELEMENT_COLOR_MAP[key] ?? ELEMENT_COLOR_MAP.default).bg,
        };
      });
  }

  // --- Rare Earth Elements
  if (earthRows.length > 0) {
    base.reportDetails.rareEarthElements = earthRows
      .slice(0, 3)
      .map((r): MetalCardItem => ({
        name: r.element,
        ppm: r.ppmValue.toFixed(4),
        className: "bg_"+r.element,
      }));

    base.earthElementsBreakdown.items = earthRows
      .filter((r) => r.ppmValue > 0)
      .sort((a, b) => b.ppmValue - a.ppmValue)
      .map((r): EarthElementItem => {
        const key = r.element.trim().toLowerCase();

        return {
          name: formatElementName(r.element),
          ppm: Number(r.ppmValue.toFixed(4)),
          color: (ELEMENT_COLOR_MAP[key] ?? ELEMENT_COLOR_MAP.default).bg,
        };
      });
  }

  // --- Oil / Petroleum contaminants
  if (oilRows.length > 0) {
    const firstOil = oilRows[0];
    base.oilContaminants.value = firstOil.ppmValue.toFixed(2);
    base.oilContaminants.status =
      firstOil.ppmValue > 50 ? "Detected" : "Not Detected";
  }

  // --- Trace Found chart – use top 10 elements
  const top10 = sorted.slice(0, 10);
  if (top10.length > 0) {
    base.traceFound.rows = top10.map((r) => ({
      label: r.element,
      userVal: Math.min(r.ppmValue, base.traceFound.max),
      safeVal: base.traceFound.max * 0.3,
      marginalVal: base.traceFound.max * 0.6,
      displayVal: r.ppmValue.toFixed(2),
    }));
  }

  const petroleumRows = rows.filter(
    (r) => String(r.category || "").trim().toLowerCase() === "petroleum_contaminant",
  );
  const petroleumRow = petroleumRows.find((r) => Number.isFinite(r.ppmValue) && r.ppmValue >= 0);

  if (petroleumRow) {
    const petroleumPpm = Number.isFinite(petroleumRow.ppmValue) ? petroleumRow.ppmValue : 0;
    const petroleumMax = getPetroleumChartMax(petroleumPpm);
    base.petroleumTraceFound.max = petroleumMax;
    base.petroleumTraceFound.scaleLabels = buildScaleLabels(petroleumMax, petroleumMax <= 1100 ? 100 : 200);
    base.petroleumTraceFound.rows = [
      {
        label: petroleumRow.element,
        userVal: Math.min(petroleumPpm, petroleumMax),
        safeVal: 75,
        marginalVal: 1000,
        displayVal: `${petroleumPpm.toFixed(2)}ppm`,
      },
    ];
  }

  return base;
}

const ELEMENT_NAME_MAP: Record<string, string> = {
  fe: "Iron",
  cr: "Chromium",
  co2: "Carbon Dioxide",
  ni: "Nickel",
  mn: "Manganese",
  si: "Silicon",
  cu: "Copper",
  mo: "Molybdenum",
  co: "Cobalt",
  tb: "Terbium",
  na: "Sodium",
  v: "Vanadium",
  s: "Sulfur",
  yb: "Ytterbium",
  dy: "Dysprosium",
  p: "Phosphorus",
  al: "Aluminum",
  i: "Iodine",
  re: "Rhenium",
  ca: "Calcium",
  cl: "Chlorine",
  k: "Potassium",
  nb: "Niobium",
  ba: "Barium",
  sn: "Tin",
  ga: "Gallium",
  sm: "Samarium",
  ge: "Germanium",
  ta: "Tantalum",
  in: "Indium",
  la: "Lanthanum",
  pa: "Protactinium",
  ra: "Radium",
  ac: "Actinium",
  ag: "Silver",
  y: "Yttrium",
  te: "Tellurium",
  sr: "Strontium",
  cs: "Cesium",
  ce: "Cerium",
  pr: "Praseodymium",
  nd: "Neodymium",
  o: "Oxygen",
  eu: "Europium",
  gd: "Gadolinium",
  zn: "Zinc",
  ti: "Titanium",
  ho: "Holmium",
  er: "Erbium",
  tm: "Thulium",
  sc: "Scandium",
  lu: "Lutetium",
  hf: "Hafnium",
  w: "Tungsten",
  mg: "Magnesium",
  os: "Osmium",
  ir: "Iridium",
  pt: "Platinum",
  au: "Gold",
  hg: "Mercury",
  tl: "Thallium",
  pb: "Lead",
  bi: "Bismuth",
  po: "Polonium",
  at: "Astatine",
  fr: "Francium",
  th: "Thorium",
  u: "Uranium",
  f: "Fluorine",
  zr: "Zirconium",
  rb: "Rubidium",
  br: "Bromine",
  ru: "Ruthenium",
  rh: "Rhodium",
  pd: "Palladium",
  cd: "Cadmium",
  se: "Selenium",
  sb: "Antimony",
  as: "Arsenic",
};

const ELEMENT_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  fe: { bg: "#F2CF91", text: "#F2CF91" }, 
  cr: { bg: "#8A99C7", text: "#8A99C7" },
  co2:{ bg: "#9CA3AF", text: "#9CA3AF" },
  ni: { bg: "#F2CF91", text: "#F2CF91" },
  mn: { bg: "#707768", text: "#707768" },
  si: { bg: "#F0C8A0", text: "#F0C8A0" },
  cu: { bg: "#A83F3F", text: "#A83F3F" },
  mo: { bg: "#D6A09A", text: "#D6A09A" },
  co: { bg: "#F090A0", text: "#F090A0" },
  tb: { bg: "#942320", text: "#942320" },
  na: { bg: "#707768", text: "#707768" },
  v:  { bg: "#A6A6AB", text: "#A6A6AB" },
  s:  { bg: "#FFFF30", text: "#FFFF30" },
  yb: { bg: "#00BF38", text: "#00BF38" },
  dy: { bg: "#707768", text: "#707768" },
  p:  { bg: "#FF8000", text: "#FF8000" },
  al: { bg: "#BFA6A6", text: "#BFA6A6" },
  i:  { bg: "#940094", text: "#940094" },
  re: { bg: "#267DAB", text: "#267DAB" },
  ca: { bg: "#707768", text: "#707768" },
  cl: { bg: "#D8816C", text: "#D8816C" },
  k:  { bg: "#D8816C", text: "#D8816C" },
  nb: { bg: "#73C2C9", text: "#73C2C9" },
  ba: { bg: "#00C900", text: "#00C900" },
  sn: { bg: "#668080", text: "#668080" },
  ga: { bg: "#C28F8F", text: "#C28F8F" },
  sm: { bg: "#707768", text: "#707768" },
  ge: { bg: "#668F8F", text: "#668F8F" },
  ta: { bg: "#4DA6FF", text: "#4DA6FF" },
  in: { bg: "#A67573", text: "#A67573" },
  la: { bg: "#F2C394", text: "#F2C394" },
  pa: { bg: "#00A1FF", text: "#00A1FF" },
  ra: { bg: "#00FF00", text: "#00FF00" },
  ac: { bg: "#70ABFA", text: "#70ABFA" },
  ag: { bg: "#869B9B", text: "#869B9B" },
  y:  { bg: "#B4C2D6", text: "#B4C2D6" },
  te: { bg: "#D47A00", text: "#D47A00" },
  sr: { bg: "#00FF00", text: "#00FF00" },
  cs: { bg: "#57178F", text: "#57178F" },
  ce: { bg: "#869B9B", text: "#869B9B" },
  pr: { bg: "#AF6666", text: "#AF6666" },
  nd: { bg: "#707768", text: "#707768" },
  o:  { bg: "#D8816C", text: "#D8816C" },
  eu: { bg: "#D8816C", text: "#D8816C" },
  gd: { bg: "#AF6666", text: "#AF6666" },
  zn: { bg: "#869B9B", text: "#869B9B" },
  ti: { bg: "#D6A091", text: "#D6A091" },
  ho: { bg: "#E5AB91", text: "#E5AB91" },
  er: { bg: "#D8816C", text: "#D8816C" },
  tm: { bg: "#707768", text: "#707768" },
  sc: { bg: "#E6E6E6", text: "#E6E6E6" },
  lu: { bg: "#869B9B", text: "#869B9B" },
  hf: { bg: "#4DC2FF", text: "#4DC2FF" },
  w:  { bg: "#2194D6", text: "#2194D6" },
  mg: { bg: "#D6A091", text: "#D6A091" },
  os: { bg: "#707768", text: "#707768" },
  ir: { bg: "#AA3F3F", text: "#AA3F3F" },
  pt: { bg: "#D0D0E0", text: "#D0D0E0" },
  au: { bg: "#B4C2D6", text: "#B4C2D6" },
  hg: { bg: "#B8B8D0", text: "#B8B8D0" },
  tl: { bg: "#A6544D", text: "#A6544D" },
  pb: { bg: "#942320", text: "#942320" },
  bi: { bg: "#707768", text: "#707768" },
  po: { bg: "#AB5C00", text: "#AB5C00" },
  at: { bg: "#754F45", text: "#754F45" },
  fr: { bg: "#420066", text: "#420066" },
  th: { bg: "#F2CF91", text: "#F2CF91" },
  u:  { bg: "#008FFF", text: "#008FFF" },
  f:  { bg: "#90E050", text: "#90E050" },
  zr: { bg: "#94E0E0", text: "#94E0E0" },
  rb: { bg: "#702EB0", text: "#702EB0" },
  br: { bg: "#A62929", text: "#A62929" },
  ru: { bg: "#D6A091", text: "#D6A091" },
  rh: { bg: "#A83F3F", text: "#A83F3F" },
  pd: { bg: "#869B9B", text: "#869B9B" },
  cd: { bg: "#D6A091", text: "#D6A091" },
  se: { bg: "#D8816C", text: "#D8816C" },
  sb: { bg: "#F2CF91", text: "#F2CF91" },
  as: { bg: "#BD80E3", text: "#BD80E3" },

  default: { bg: "#9CA3AF", text: "#9CA3AF" }
};



// reverse map
const ELEMENT_SYMBOL_FROM_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(ELEMENT_NAME_MAP).map(([symbol, name]) => [
    name.toLowerCase(),
    symbol,
  ])
);

function formatElementName(input: string): string {
  const key = input.trim().toLowerCase();
  if (ELEMENT_NAME_MAP[key]) {
    return `${ELEMENT_NAME_MAP[key]} (${key.toUpperCase()})`;
  }
  if (ELEMENT_SYMBOL_FROM_NAME[key]) {
    const symbol = ELEMENT_SYMBOL_FROM_NAME[key];
    return `${ELEMENT_NAME_MAP[symbol]} (${symbol.toUpperCase()})`;
  }
  return input;
}
// ─── DB Operations ────────────────────────────────────────────────────────────

export async function getReportByRegistrationId(registrationId: string) {
  return prisma.report.findUnique({
    where: { registrationId },
    include: { rows: { orderBy: { ppmValue: "desc" } } },
  });
}

export async function upsertReport(
  registrationId: string,
  csvFileName: string,
  rows: ParsedReportRow[],
) {
  const existing = await prisma.report.findUnique({ where: { registrationId } });

  if (existing) {
    // Replace rows and report data
    await prisma.reportRow.deleteMany({ where: { reportId: existing.id } });
    await prisma.report.update({
      where: { id: existing.id },
      data: {
        csvFileName,
        status: "uploaded",
        updatedAt: new Date(),
      },
    });
    await prisma.reportRow.createMany({
      data: rows.map((r) => ({ ...r, reportId: existing.id })),
    });
    return prisma.report.findUnique({
      where: { id: existing.id },
      include: { rows: true },
    });
  }

  return prisma.report.create({
    data: {
      registrationId,
      csvFileName,
      status: "uploaded",
      rows: {
        createMany: { data: rows.map((r) => ({ ...r })) },
      },
    },
    include: { rows: true },
  });
}

export async function upsertManualPetroleumRowByRegistrationId(input: {
  registrationId: string;
  element: string;
  rawValue: number;
  ppmValue: number;
}) {
  const report = await prisma.report.findUnique({
    where: { registrationId: input.registrationId },
  });
  if (!report) return null;

  await prisma.reportRow.deleteMany({
    where: {
      reportId: report.id,
      category: "petroleum_contaminant",
    },
  });

  return prisma.reportRow.create({
    data: {
      reportId: report.id,
      element: input.element.trim(),
      rawValue: input.rawValue,
      ppmValue: input.ppmValue,
      unit: "ppm",
      category: "petroleum_contaminant",
    },
  });
}
