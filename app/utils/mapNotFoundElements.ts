import type { NotFoundElementItem } from "../lib/proxy-report-data";
import { getElementColors } from "./elementMeta";

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
      const symbol = toStr((r as any).symbol).toUpperCase();
      const name = toStr((r as any).name);
      if (!symbol && !name) return null;

      const key = symbol || name;

      return {
        symbol: symbol || key,
        name: name || key,
        bgClass: toStr((r as any).bgClass, "bg-gray-50"),
        textClass: toStr((r as any).textClass, "text-gray-400"),
        valueStyle: (r as any).valueStyle || getElementColors(key),
      } as NotFoundElementItem;
    })
    .filter(Boolean) as NotFoundElementItem[];

  mapped.sort((a, b) => a.name.localeCompare(b.name));

  console.log("[mapNotFoundElements] mapped", {
    inputCount: rows.length,
    mappedCount: mapped.length,
    first: mapped[0] ?? null,
  });

  return mapped;
}

