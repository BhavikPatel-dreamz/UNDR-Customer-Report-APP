
export function generateKitNumber(orderNumber: string, seed?: string): string {
  // Produce a 10-digit kit number with a 4-digit prefix and a 6-digit date (YYMMDD).
  // If a `seed` is provided (e.g. a line item id) the 4-digit prefix is derived
  // deterministically from that seed to ensure uniqueness per-item within an order.
  function seedHashToNumber(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  // New format: 4 digits from orderNumber (or fallback) + 4 digits derived from seed (item id) + 2 random digits
  // Prefer the last numeric group from orderNumber (e.g. '#1024' -> '1024').
  const numericGroups = orderNumber.match(/\d+/g) || [];
  const lastNumeric = numericGroups.length ? numericGroups[numericGroups.length - 1] : '';
  const firstPart = lastNumeric
    ? String(lastNumeric.slice(-4)).padStart(4, '0')
    : seed
    ? String(seedHashToNumber(seed) % 10000).padStart(4, '0')
    : String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  const secondPart = seed ? String(seedHashToNumber(seed) % 10000).padStart(4, '0') : String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  const lastPart = String(Math.floor(Math.random() * 100)).padStart(2, '0');

  return `${firstPart}${secondPart}${lastPart}`;
}