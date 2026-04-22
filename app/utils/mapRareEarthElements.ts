import type { MetalCardItem } from "../lib/proxy-report-data";
import { formatElementName, getElementClassName, getElementColors } from "./elementMeta";

type RawRareEarthRow =
  | {
      element: string;
      ppmValue: number;
    }
  | {
      name: string;
      ppm?: string | number;
      value?: string | number;
      className?: string;
    }
  | MetalCardItem
  | Record<string, unknown>;

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").replace(/ppm/i, "").trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const formatPpm = (value: number): string => {
  if (!Number.isFinite(value)) return "0ppm";
  return `${Math.round(value)}ppm`;
};

const mapOne = (row: RawRareEarthRow): { item: MetalCardItem; ppm: number } | null => {
  const elementLike =
    typeof (row as any)?.element === "string"
      ? (row as any).element.trim()
      : typeof (row as any)?.name === "string"
        ? (row as any).name.trim()
        : null;

  if (!elementLike) return null;

  const ppm =
    asNumber((row as any)?.ppmValue) ??
    asNumber((row as any)?.ppm) ??
    asNumber((row as any)?.value) ??
    0;

  const item: MetalCardItem = {
    name: formatElementName(elementLike).replace(/\s*\([^)]+\)\s*$/, ""),
    ppm: formatPpm(ppm),
    className: `bg_${getElementClassName(elementLike)}`,
    valueStyle: getElementColors(elementLike),
  };

  return { item, ppm };
};

export function mapRareEarthElements(rows: unknown): MetalCardItem[] {
  if (!Array.isArray(rows)) return [];

  const mapped = rows
    .map((r) => mapOne(r as RawRareEarthRow))
    .filter(Boolean) as Array<{ item: MetalCardItem; ppm: number }>;

  const top3 = mapped
    .sort((a, b) => b.ppm - a.ppm)
    .slice(0, 3)
    .map((m) => m.item);

  console.log("[mapRareEarthElements] mapped", {
    inputCount: rows.length,
    mappedCount: mapped.length,
    top3,
  });

  return top3;
}

