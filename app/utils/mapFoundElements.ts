import type { FoundElementItem } from "../lib/proxy-report-data";
import { formatElementName, getElementColors } from "./elementMeta";

type RawFoundElement = FoundElementItem | Record<string, unknown>;

const toStr = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").replace(/ppm/i, "").trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const formatPpm = (value: unknown): string => {
  const n = toNumber(value);
  if (n == null) return "0";

  const str = Math.floor(n).toString();

  return str.slice(0, 2);
};

export function mapFoundElements(rows: unknown): FoundElementItem[] {
  if (!Array.isArray(rows)) return [];

  const mapped = rows
    .map((row) => {
      const r = row as RawFoundElement;
      const raw = r as Record<string, unknown>;
      const symbol = toStr(raw.symbol).toUpperCase();
      const name = toStr(raw.name);
      if (!symbol && !name) return null;

      const key = symbol || name;

      return {
        symbol: symbol || key,
        name: formatElementName(name || key).replace(/\s*\([^)]+\)\s*$/, ""),
        ppm: formatPpm(raw.ppm)+"ppm",
        margin: toStr(raw.margin, "0"),
        bgClass: toStr(raw.bgClass, "bg-green-50"),
        colorClass: toStr(raw.colorClass, "text-green-700"),
        valueStyle: raw.valueStyle || getElementColors(key),
      } as FoundElementItem;
    })
    .filter(Boolean) as FoundElementItem[];

  mapped.sort((a, b) => a.name.localeCompare(b.name));


  return mapped;
}
