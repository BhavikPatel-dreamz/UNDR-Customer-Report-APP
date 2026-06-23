export const ELEMENT_NAME_MAP: Record<string, string> = {
  fe: "Iron",
  cr: "Chromium",
  co2: "Carbon Dioxide",
  ni: "Nickel",
  mn: "Manganese",
  si: "Silicon",
  cu: "Copper",
  mo: "Molybdenum",
  co: "Cobalt",
  tb: "Terbium",
  na: "Sodium",
  v: "Vanadium",
  s: "Sulfur",
  yb: "Ytterbium",
  dy: "Dysprosium",
  p: "Phosphorus",
  al: "Aluminum",
  i: "Iodine",
  re: "Rhenium",
  ca: "Calcium",
  cl: "Chlorine",
  k: "Potassium",
  nb: "Niobium",
  ba: "Barium",
  sn: "Tin",
  ga: "Gallium",
  sm: "Samarium",
  ge: "Germanium",
  ta: "Tantalum",
  in: "Indium",
  la: "Lanthanum",
  pa: "Protactinium",
  ra: "Radium",
  ac: "Actinium",
  ag: "Silver",
  y: "Yttrium",
  te: "Tellurium",
  sr: "Strontium",
  cs: "Cesium",
  ce: "Cerium",
  pr: "Praseodymium",
  nd: "Neodymium",
  o: "Oxygen",
  eu: "Europium",
  gd: "Gadolinium",
  zn: "Zinc",
  ti: "Titanium",
  ho: "Holmium",
  er: "Erbium",
  tm: "Thulium",
  sc: "Scandium",
  lu: "Lutetium",
  hf: "Hafnium",
  w: "Tungsten",
  mg: "Magnesium",
  os: "Osmium",
  ir: "Iridium",
  pt: "Platinum",
  au: "Gold",
  hg: "Mercury",
  tl: "Thallium",
  pb: "Lead",
  bi: "Bismuth",
  po: "Polonium",
  at: "Astatine",
  fr: "Francium",
  th: "Thorium",
  u: "Uranium",
  f: "Fluorine",
  zr: "Zirconium",
  rb: "Rubidium",
  br: "Bromine",
  ru: "Ruthenium",
  rh: "Rhodium",
  pd: "Palladium",
  cd: "Cadmium",
  se: "Selenium",
  sb: "Antimony",
  as: "Arsenic",
};

// export const ELEMENT_COLOR_MAP: Record<string, { bg: string; text: string }> = {
//   fe: { bg: "#AF6666", text: "#AF6666" },
//   cr: { bg: "#F2CF91", text: "#F2CF91" },
//   co2: { bg: "#9CA3AF", text: "#9CA3AF" },
//   ni: { bg: "#F2CF91", text: "#F2CF91" },
//   mn: { bg: "#86BAB9", text: "#86BAB9" },
//   si: { bg: "#AB4543", text: "#AB4543" },
//   cu: { bg: "#FDB923", text: "#FDB923" },
//   mo: { bg: "#808083", text: "#808083" },
//   co: { bg: "#FED095", text: "#FED095" },
//   tb: { bg: "#86BAB9", text: "#86BAB9" },
//   na: { bg: "#3F443A", text: "#3F443A" },
//   v: { bg: "#D6A091", text: "#D6A091" },
//   s: { bg: "#95AA8C", text: "#95AA8C" },
//   yb: { bg: "#AF6666", text: "#AF6666" },
//   dy: { bg: "#AF6666", text: "#AF6666" },
//   p: { bg: "#3F443A", text: "#3F443A" },
//   al: { bg: "#BFA6A6", text: "#BFA6A6" },
//   i: { bg: "#D6A091", text: "#D6A091" },
//   re: { bg: "#808083", text: "#808083" },
//   ca: { bg: "#B4C2D6", text: "#B4C2D6" },
//   cl: { bg: "#DE7F66", text: "#DE7F66" },
//   k: { bg: "#9BAD7F", text: "#9BAD7F" },
//   nb: { bg: "#FED095", text: "#FED095" },
//   ba: { bg: "#95AA8C", text: "#95AA8C" },
//   sn: { bg: "#DE7F66", text: "#DE7F66" },
//   ga: { bg: "#869B9B", text: "#869B9B" },
//   sm: { bg: "#FED095", text: "#FED095" },
//   ge: { bg: "#B4C2D6", text: "#B4C2D6" },
//   ta: { bg: "#9BAD7F", text: "#9BAD7F" },
//   in: { bg: "#FDB923", text: "#FDB923" },
//   la: { bg: "#707768", text: "#707768" },
//   pa: { bg: "#86BAB9", text: "#86BAB9" },
//   ra: { bg: "#B4C2D6", text: "#B4C2D6" },
//   ac: { bg: "#70ABFA", text: "#70ABFA" },
//   ag: { bg: "#AF6666", text: "#AF6666" },
//   y: { bg: "#3F443A", text: "#3F443A" },
//   te: { bg: "#EFBD75", text: "#EFBD75" },
//   sr: { bg: "#707768", text: "#707768" },
//   cs: { bg: "#981B1E", text: "#981B1E" },
//   ce: { bg: "#808083", text: "#808083" },
//   pr: { bg: "#869B9B", text: "#869B9B" },
//   nd: { bg: "#DE7F66", text: "#DE7F66" },
//   o: { bg: "#AB4543", text: "#AB4543" },
//   eu: { bg: "#707768", text: "#707768" },
//   gd: { bg: "#EFBD75", text: "#EFBD75" },
//   zn: { bg: "#707768", text: "#707768" },
//   ti: { bg: "#F2CF91", text: "#F2CF91" },
//   ho: { bg: "#FED095", text: "#FED095" },
//   er: { bg: "#3F443A", text: "#3F443A" },
//   tm: { bg: "#981B1E", text: "#981B1E" },
//   sc: { bg: "#FDB923", text: "#FDB923" },
//   lu: { bg: "#869B9B", text: "#869B9B" },
//   hf: { bg: "#981B1E", text: "#981B1E" },
//   w: { bg: "#FED095", text: "#FED095" },
//   mg: { bg: "#EFBD75", text: "#EFBD75" },
//   os: { bg: "#D6A091", text: "#D6A091" },
//   ir: { bg: "#AB4543", text: "#AB4543" },
//   pt: { bg: "#707768", text: "#707768" },
//   au: { bg: "#808083", text: "#808083" },
//   hg: { bg: "#B4C2D6", text: "#B4C2D6" },
//   tl: { bg: "#B4C2D6", text: "#B4C2D6" },
//   pb: { bg: "#95AA8C", text: "#95AA8C" },
//   bi: { bg: "#869B9B", text: "#869B9B" },
//   po: { bg: "#95AA8C", text: "#95AA8C" },
//   at: { bg: "#707768", text: "#707768" },
//   fr: { bg: "#9BAD7F", text: "#9BAD7F" },
//   th: { bg: "#808083", text: "#808083" },
//   u: { bg: "#FDB923", text: "#FDB923" },
//   f: { bg: "#95AA8C", text: "#95AA8C" },
//   zr: { bg: "#95AA8C", text: "#95AA8C" },
//   rb: { bg: "#DE7F66", text: "#DE7F66" },
//   br: { bg: "#EFBD75", text: "#EFBD75" },
//   ru: { bg: "#F2CF91", text: "#F2CF91" },
//   rh: { bg: "#981B1E", text: "#981B1E" },
//   pd: { bg: "#AF6666", text: "#AF6666" },
//   cd: { bg: "#86BAB9", text: "#86BAB9" },
//   se: { bg: "#D6A091", text: "#D6A091" },
//   sb: { bg: "#d98670", text: "#d98670" },
//   as: { bg: "#3F443A", text: "#3F443A" },
//   tc: { bg: "#869B9B", text: "#869B9B" },
//   pm: { bg: "#EFBD75", text: "#EFBD75" },
//   default: { bg: "#9CA3AF", text: "#9CA3AF" },
// };




export const ELEMENT_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  fe: { bg: "#D8816C", text: "#D8816C" },
  cr: { bg: "#86BAB9", text: "#86BAB9" },
  co2: { bg: "#9CA3AF", text: "#9CA3AF" },
  ni: { bg: "#86BAB9", text: "#86BAB9" },
  mn: { bg: "#AF6666", text: "#AF6666" },
  si: { bg: "#FFB624", text: "#FFB624" },
  cu: { bg: "#EFBD75", text: "#EFBD75" },
  mo: { bg: "#FDB923", text: "#FDB923" },
  co: { bg: "#B4C2D6", text: "#B4C2D6" },
  tb: { bg: "#AF6666", text: "#AF6666" },
  na: { bg: "#D6A091", text: "#D6A091" },
  v: { bg: "#808083", text: "#808083" },
  s: { bg: "#707768", text: "#707768" },
  yb: { bg: "#D8816C", text: "#D8816C" },
  dy: { bg: "#D8816C", text: "#D8816C" },
  p: { bg: "#D6A091", text: "#D6A091" },
  al: { bg: "#BFA6A6", text: "#BFA6A6" },
  i: { bg: "#808083", text: "#808083" },
  re: { bg: "#FDB923", text: "#FDB923" },
  ca: { bg: "#FED095", text: "#FED095" },
  cl: { bg: "#95AA8C", text: "#95AA8C" },
  k: { bg: "#9BAD7F", text: "#9BAD7F" },
  nb: { bg: "#B4C2D6", text: "#B4C2D6" },
  ba: { bg: "#707768", text: "#707768" },
  sn: { bg: "#95AA8C", text: "#95AA8C" },
  ga: { bg: "#869B9B", text: "#869B9B" },
  sm: { bg: "#B4C2D6", text: "#B4C2D6" },
  ge: { bg: "#FED095", text: "#FED095" },
  ta: { bg: "#9BAD7F", text: "#9BAD7F" },
  in: { bg: "#EFBD75", text: "#EFBD75" },
  la: { bg: "#F2CF91", text: "#F2CF91" },
  pa: { bg: "#AF6666", text: "#AF6666" },
  ra: { bg: "#FED095", text: "#FED095" },
  ac: { bg: "#B4C2D6", text: "#B4C2D6" },
  ag: { bg: "#808083", text: "#808083" },
  y: { bg: "#D6A091", text: "#D6A091" },
  te: { bg: "#AB4543", text: "#AB4543" },
  sr: { bg: "#F2CF91", text: "#F2CF91" },
  cs: { bg: "#3F443A", text: "#3F443A" },
  ce: { bg: "#FDB923", text: "#FDB923" },
  pr: { bg: "#869B9B", text: "#869B9B" },
  nd: { bg: "#808083", text: "#808083" },
  o: { bg: "#942320", text: "#942320" },
  eu: { bg: "#F2CF91", text: "#F2CF91" },
  gd: { bg: "#AB4543", text: "#AB4543" },
  zn: { bg: "#F2CF91", text: "#F2CF91" },
  ti: { bg: "#86BAB9", text: "#86BAB9" },
  ho: { bg: "#B4C2D6", text: "#B4C2D6" },
  er: { bg: "#D6A091", text: "#D6A091" },
  tm: { bg: "#3F443A", text: "#3F443A" },
  sc: { bg: "#EFBD75", text: "#EFBD75" },
  lu: { bg: "#869B9B", text: "#869B9B" },
  hf: { bg: "#3F443A", text: "#3F443A" },
  w: { bg: "#B4C2D6", text: "#B4C2D6" },
  mg: { bg: "#AB4543", text: "#AB4543" },
  os: { bg: "#95AA8C", text: "#95AA8C" },
  ir: { bg: "#942320", text: "#942320" },
  pt: { bg: "#F2CF91", text: "#F2CF91" },
  au: { bg: "#FDB923", text: "#FDB923" },
  hg: { bg: "#FED095", text: "#FED095" },
  tl: { bg: "#FED095", text: "#FED095" },
  pb: { bg: "#707768", text: "#707768" },
  bi: { bg: "#869B9B", text: "#869B9B" },
  po: { bg: "#707768", text: "#707768" },
  at: { bg: "#F2CF91", text: "#F2CF91" },
  fr: { bg: "#9BAD7F", text: "#9BAD7F" },
  th: { bg: "#FDB923", text: "#FDB923" },
  u: { bg: "#EFBD75", text: "#EFBD75" },
  f: { bg: "#707768", text: "#707768" },
  zr: { bg: "#707768", text: "#707768" },
  rb: { bg: "#95AA8C", text: "#95AA8C" },
  br: { bg: "#AB4543", text: "#AB4543" },
  ru: { bg: "#86BAB9", text: "#86BAB9" },
  rh: { bg: "#3F443A", text: "#3F443A" },
  pd: { bg: "#D8816C", text: "#D8816C" },
  cd: { bg: "#AF6666", text: "#AF6666" },
  se: { bg: "#D8816C", text: "#D8816C" },
  sb: { bg: "#d98670", text: "#d98670" },
  as: { bg: "#D6A091", text: "#D6A091" },
  tc: { bg: "#869B9B", text: "#869B9B" },
  pm: { bg: "#AB4543", text: "#AB4543" },
  default: { bg: "#9CA3AF", text: "#9CA3AF" },
};

const normalizeKey = (input: string) => input.trim().toLowerCase();

// reverse map: "iron" -> "fe"
const ELEMENT_SYMBOL_FROM_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(ELEMENT_NAME_MAP).map(([symbol, name]) => [name.toLowerCase(), symbol]),
);

export function getElementColors(input: string): { backgroundColor: string; color: string } {
  const key = normalizeKey(input);
  const colors = ELEMENT_COLOR_MAP[key] || ELEMENT_COLOR_MAP.default;
  return { backgroundColor: colors.bg, color: colors.text };
}

export function formatElementSymbol(input: string): string {
  const key = normalizeKey(input);
  const symbol = ELEMENT_NAME_MAP[key] ? key : ELEMENT_SYMBOL_FROM_NAME[key] || key;

  return symbol.length <= 2
    ? symbol.charAt(0).toUpperCase() + symbol.slice(1)
    : input;
}

export function getElementClassName(input: string): string {
  const key = normalizeKey(input);

  // symbol → name
  if (ELEMENT_NAME_MAP[key]) {
    return ELEMENT_NAME_MAP[key].toLowerCase();
  }

  // name → symbol → name
  if (ELEMENT_SYMBOL_FROM_NAME[key]) {
    const symbol = ELEMENT_SYMBOL_FROM_NAME[key];
    return ELEMENT_NAME_MAP[symbol].toLowerCase();
  }

  return key;
}

export function formatElementName(input: string): string {
  const key = normalizeKey(input);
  if (ELEMENT_NAME_MAP[key]) {
    return `${ELEMENT_NAME_MAP[key]} (${formatElementSymbol(key)})`;
  }
  if (ELEMENT_SYMBOL_FROM_NAME[key]) {
    const symbol = ELEMENT_SYMBOL_FROM_NAME[key];
    return `${ELEMENT_NAME_MAP[symbol]} (${formatElementSymbol(symbol)})`;
  }
  return input;
}
