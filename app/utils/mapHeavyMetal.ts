// Backward-compatible single-item mapper (older code may import this).
// Prefer using `mapHeavyMetals()` for the full sort/top-3 mapping.
import { mapHeavyMetals } from "./mapHeavyMetals";

export const mapHeavyMetal = (r: unknown) => {
  return mapHeavyMetals([r])[0];
};