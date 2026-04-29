import type { NotFoundElementItem } from "../lib/proxy-report-data";
import { formatElementName, getElementColors } from "./elementMeta";

type RawNotFoundElement = NotFoundElementItem | Record<string, unknown>;

const toStr = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

export function mapNotFoundElements(rows: unknown): NotFoundElementItem[] {
  if (!Array.isArray(rows)) return [];

  const mapped = rows
    .map((row) => {
      const r = row as RawNotFoundElement;
      const raw = r as Record<string, unknown>;
      const symbol = toStr(raw.symbol).toUpperCase();
      const name = toStr(raw.name);
      if (!symbol && !name) return null;

      const key = symbol || name;

      return {
        symbol: symbol || key,
        name: formatElementName(name || key).replace(/\s*\([^)]+\)\s*$/, ""),
        bgClass: toStr(raw.bgClass, "bg-gray-50"),
        textClass: toStr(raw.textClass, "text-gray-400"),
        valueStyle: raw.valueStyle || getElementColors(key),
      } as NotFoundElementItem;
    })
    .filter(Boolean) as NotFoundElementItem[];

  mapped.sort((a, b) => a.name.localeCompare(b.name));



  return mapped;
}
