import type { EarthElementItem } from "../lib/proxy-report-data";
import { formatElementName, getElementColors } from "./elementMeta";

type RawEarthElementItem = EarthElementItem | Record<string, unknown>;

// Keep only this exact rare-earth list (plus Sc, Y) in this order.
const ALLOWED_SYMBOLS_IN_ORDER = [
  "sc",
  "y",
  "la",
  "ce",
  "pr",
  "nd",
  "pm",
  "sm",
  "eu",
  "gd",
  "tb",
  "dy",
  "ho",
  "er",
  "tm",
  "yb",
  "lu",
];

const ORDER_INDEX = new Map(ALLOWED_SYMBOLS_IN_ORDER.map((s, i) => [s, i]));

const toText = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.replace(/,/g, "").replace(/ppm/i, "").trim());
    if (Number.isFinite(n)) return n;
  }
  return fallback;
};

const extractSymbolKey = (value: string): string => {
  const text = value.trim().toLowerCase();
  const m = text.match(/\(([a-z0-9]{1,3})\)\s*$/i);
  if (m?.[1]) return m[1].toLowerCase();

  // Fallback: if already a symbol-like short token
  if (/^[a-z]{1,3}$/i.test(text)) return text.toLowerCase();
  return "";
};

export function mapEarthElementsBreakdown(items: unknown): EarthElementItem[] {
  if (!Array.isArray(items)) return [];

  const mapped = items
    .map((raw) => {
      const row = raw as RawEarthElementItem;
      const rawName = toText((row as any).name);
      const symbol = extractSymbolKey(rawName);
      if (!symbol || !ORDER_INDEX.has(symbol)) return null;

      const ppm = toNumber((row as any).ppm, 0);
      const color = toText((row as any).color) || getElementColors(symbol).backgroundColor;

      return {
        symbol,
        item: {
          name: formatElementName(symbol),
          ppm,
          color,
        } as EarthElementItem,
      };
    })
    .filter(Boolean) as Array<{ symbol: string; item: EarthElementItem }>;

  mapped.sort((a, b) => (ORDER_INDEX.get(a.symbol) ?? 999) - (ORDER_INDEX.get(b.symbol) ?? 999));

  return mapped.map((x) => x.item);
}

