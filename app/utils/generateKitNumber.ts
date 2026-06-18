
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

  const now = new Date();
  const datePart =
    String(now.getFullYear()).slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');

  let prefixNum: number;
  if (seed) {
    // Deterministic 0-9999 derived from seed (line item id) to avoid collisions.
    prefixNum = seedHashToNumber(seed) % 10000;
  } else {
    // Fallback: try to use digits from orderNumber, otherwise random.
    const digits = (orderNumber.match(/\d/g) || []).join('');
    if (digits) {
      prefixNum = Number(digits.slice(0, 4).padStart(4, '0')) % 10000;
    } else {
      prefixNum = Math.floor(Math.random() * 10000);
    }
  }

  const orderPart = String(prefixNum).padStart(4, '0');

  return (orderPart + datePart).slice(0, 10);
}