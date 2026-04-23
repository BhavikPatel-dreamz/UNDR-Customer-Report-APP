import type { HeavyMetalItem } from "../lib/proxy-report-data";
import { formatElementName, getElementClassName, getElementColors } from "./elementMeta";

type RawHeavyMetalRow =
  | {
      element: string;
      ppmValue: number;
    }
  | {
      name: string;
      value: number | string;
    }
  | HeavyMetalItem
  | Record<string, unknown>;

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").replace(/ppm/i, "").trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const formatPpmValue = (value: number): string => {
  if (!Number.isFinite(value)) return "0ppm";
  // remove unnecessary trailing zeros: 158755.00 -> 158755, 12.50 -> 12.5
  return `${value.toFixed(2).replace(/\.?0+$/, "")}ppm`;
};

const getSymbolOrNameKey = (displayName: string): string => {
  // supports: "Iron (Fe)" -> "fe"
  const m = displayName.match(/\(([A-Za-z0-9]+)\)\s*$/);
  return (m?.[1] || displayName).trim();
};

const mapOne = (row: RawHeavyMetalRow): { item: HeavyMetalItem; ppm: number } | null => {
  const elementLike =
    typeof (row as any)?.element === "string"
      ? (row as any).element
      : typeof (row as any)?.name === "string"
        ? (row as any).name
        : null;

  if (!elementLike) return null;

  const ppm =
    asNumber((row as any)?.ppmValue) ??
    asNumber((row as any)?.value) ??
    asNumber((row as any)?.ppm) ??
    null;

  // if ppm is missing but value already contains "ppm", we still keep the item (sort will treat ppm as 0)
  const safePpm = ppm ?? 0;

  const formattedName =
    typeof (row as any)?.value === "string" && (row as any).value.toLowerCase().includes("ppm") && (row as any)?.valueClassName
      ? (row as any).name
      : formatElementName(elementLike);

  const keyForColor = getSymbolOrNameKey(formattedName);
  const colors = getElementColors(keyForColor);
  const className = getElementClassName(keyForColor);

  const value = formatPpmValue(safePpm);

  const item: HeavyMetalItem = {
    name: formattedName,
    value,
    valueClassName: (row as any)?.valueClassName || `bg_${className}`,
    textClassName: (row as any)?.textClassName || "text-gray-700",
    valueStyle: (row as any)?.valueStyle || { backgroundColor: colors.backgroundColor, color: colors.color },
  };

  return { item, ppm: safePpm };
};

export function mapHeavyMetals(rows: unknown): HeavyMetalItem[] {
  if (!Array.isArray(rows)) return [];

  const mapped = rows
    .map((r) => mapOne(r as RawHeavyMetalRow))
    .filter(Boolean) as Array<{ item: HeavyMetalItem; ppm: number }>;

  const top3 = mapped
    .sort((a, b) => b.ppm - a.ppm)
    .slice(0, 3)
    .map((m) => m.item);


  return top3;
}

