import prisma from "../db.server";
import { sampleProxyReportData } from "../lib/proxy-report-data";
import type {
  ProxyReportData,
  BreakdownBarItem,
  HeavyMetalItem,
  MetalCardItem,
  FoundElementItem,
  NotFoundElementItem,
} from "../lib/proxy-report-data";

export type ParsedReportRow = {
  element: string;
  rawValue: number;
  ppmValue: number;
  unit: string;
  category: string;
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

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim() !== "");

  if (lines.length < 2) return [];

  const headers = parseCsvRow(lines[0]).map((h) =>
    h.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
  );

  return lines
    .slice(1)
    .map((line) => {
      const values = parseCsvRow(line);
      return headers.reduce(
        (obj, header, i) => {
          obj[header] = values[i] ?? "";
          return obj;
        },
        {} as Record<string, string>,
      );
    })
    .filter((row) => Object.values(row).some((v) => v !== ""));
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
        findCol(row, "element", "name", "element_name", "analyte") ??
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

      const rawValue = parseFloat(rawStr) || 0;
      const ppmValue = rawValue * 10000;
      const unit = findCol(row, "unit", "units") ?? "ppm";
      const category =
        findCol(row, "category", "type", "group", "class_") ?? "";

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

export function buildReportDataFromRows(
  rows: ParsedReportRow[],
  customerName: string,
  kitNumber: string,
): ProxyReportData {
  const base: ProxyReportData = JSON.parse(
    JSON.stringify(sampleProxyReportData),
  ) as ProxyReportData;

  base.banner.name = customerName;
  base.banner.subtitle = `Kit Registration: ${kitNumber}`;

  if (rows.length === 0) return base;

  // Separate rows by known categories
  const heavyMetalRows = rows.filter((r) =>
    categoryIncludes(r.category, "heavy", "metal", "toxic"),
  );
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

  base.foundElements = found.slice(0, 60).map(
    (r): FoundElementItem => ({
      symbol: r.element.substring(0, 2).toUpperCase(),
      name: r.element,
      ppm: r.ppmValue.toFixed(4),
      margin: "0",
      bgClass: "bg-green-50",
      colorClass: "text-green-700",
    }),
  );

  base.notFoundElements = notFound.slice(0, 60).map(
    (r): NotFoundElementItem => ({
      symbol: r.element.substring(0, 2).toUpperCase(),
      name: r.element,
      bgClass: "bg-gray-50",
      textClass: "text-gray-400",
    }),
  );

  // --- Element Breakdown (top 8 by ppmValue)
  const sorted = [...found].sort((a, b) => b.ppmValue - a.ppmValue);
  const top8 = sorted.slice(0, 8);
  const totalPpm = top8.reduce((s, r) => s + r.ppmValue, 0);

  if (top8.length > 0) {
    base.elementBreakdown.items = top8.map(
      (r, i): BreakdownBarItem => ({
        name: r.element,
        percentage: totalPpm > 0 ? Math.round((r.ppmValue / totalPpm) * 100) : 0,
        color: BAR_COLORS[i % BAR_COLORS.length],
      }),
    );
  }

  // --- Heavy Metals
  if (heavyMetalRows.length > 0) {
    base.reportDetails.heavyMetals = heavyMetalRows
      .slice(0, 6)
      .map((r): HeavyMetalItem => ({
        name: r.element,
        value: r.ppmValue.toFixed(4),
        valueClassName: r.ppmValue > 100 ? "text-red-600" : "text-green-600",
        textClassName: "text-gray-700",
      }));
  }

  // --- Precious Metals
  if (preciousRows.length > 0) {
    base.reportDetails.preciousMetals = preciousRows
      .slice(0, 4)
      .map((r): MetalCardItem => ({
        name: r.element,
        ppm: r.ppmValue.toFixed(6),
        className: "card-precious",
      }));
  }

  // --- Rare Earth Elements
  if (earthRows.length > 0) {
    base.reportDetails.rareEarthElements = earthRows
      .slice(0, 4)
      .map((r): MetalCardItem => ({
        name: r.element,
        ppm: r.ppmValue.toFixed(4),
        className: "card-earth",
      }));
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

  return base;
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
  reportData: ProxyReportData,
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
        reportData: JSON.stringify(reportData),
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
      reportData: JSON.stringify(reportData),
      rows: {
        createMany: { data: rows.map((r) => ({ ...r })) },
      },
    },
    include: { rows: true },
  });
}
