export const REPORT_PACKAGES = [
  "treasure_base",
  "treasure_plus",
  "hs_base",
  "hs_plus",
  "premium",
] as const;

export type ReportPackage = (typeof REPORT_PACKAGES)[number];

export function isReportPackage(value: string): value is ReportPackage {
  return REPORT_PACKAGES.includes(value as ReportPackage);
}

export const UNLOCK_MODULES = [
  "precious_metals",
  "rare_earth",
  "crude_oil",
  "petroleum",
  "heavy_metals",
  "premium",
] as const;

export type UnlockModule = (typeof UNLOCK_MODULES)[number];

export type UnlockOffer = {
  module: UnlockModule;
  label: string;
  priceCents: number;
  variantId: string;
  sku: string;
};

export const UNLOCK_OFFERS: Record<UnlockModule, UnlockOffer> = {
  precious_metals: {
    module: "precious_metals",
    label: "Precious Metals Breakdown",
    priceCents: 7900,
    variantId: "43077788794928",
    sku: "UNDR-UNLOCK-PRECIOUS-METALS",
  },
  rare_earth: {
    module: "rare_earth",
    label: "REEs Breakdown",
    priceCents: 4900,
    variantId: "43077788827696",
    sku: "UNDR-UNLOCK-REES",
  },
  crude_oil: {
    module: "crude_oil",
    label: "Crude Oil Breakdown",
    priceCents: 4900,
    variantId: "43077788860464",
    sku: "UNDR-UNLOCK-CRUDE-OIL",
  },
  petroleum: {
    module: "petroleum",
    label: "Petroleum Contaminants Breakdown",
    priceCents: 9900,
    variantId: "43077788893232",
    sku: "UNDR-UNLOCK-PETROLEUM",
  },
  heavy_metals: {
    module: "heavy_metals",
    label: "Heavy Metals Breakdown",
    priceCents: 9900,
    variantId: "43077788926000",
    sku: "UNDR-UNLOCK-HEAVY-METALS",
  },
  premium: {
    module: "premium",
    label: "Upgrade to Premium",
    priceCents: 14900,
    variantId: "43077788958768",
    sku: "UNDR-UNLOCK-PREMIUM",
  },
};

const FINDASH_15_SHOP = "findash-shipping-2.myshopify.com";

const FINDASH_15_VARIANT_IDS: Record<UnlockModule, string> = {
  precious_metals: "47653663375523",
  rare_earth: "47378854019211",
  crude_oil: "47653663441059",
  petroleum: "47653663473827",
  heavy_metals: "47653663506595",
  premium: "47653663539363",
};

function normalizeShopDomain(shop?: string | null) {
  return String(shop || "").trim().toLowerCase();
}

export function getUnlockOffer(module: UnlockModule, shop?: string | null) {
  const offer = UNLOCK_OFFERS[module];

  if (normalizeShopDomain(shop) !== FINDASH_15_SHOP) {
    return offer;
  }

  return {
    ...offer,
    variantId: FINDASH_15_VARIANT_IDS[module],
  };
}

export function getUnlockOffersForShop(shop?: string | null) {
  return UNLOCK_MODULES.map((module) => getUnlockOffer(module, shop));
}

export function isUnlockModule(value: string): value is UnlockModule {
  return UNLOCK_MODULES.includes(value as UnlockModule);
}

export function hasReportUnlock(unlockedModules: readonly string[] | undefined, module: UnlockModule) {
  return Boolean(unlockedModules?.includes("premium") || unlockedModules?.includes(module));
}

export function formatUnlockPrice(module: UnlockModule) {
  return `$${(UNLOCK_OFFERS[module].priceCents / 100).toFixed(0)}`;
}
