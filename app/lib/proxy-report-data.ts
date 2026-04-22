export type BreakdownBarItem = {
  name: string;
  percentage: number;
  color: string;
};

export type MetalCardItem = {
  name: string;
  ppm: string;
  className: string;
};

export type HeavyMetalItem = {
  name: string;
  value: string;
  valueClassName: string;
  textClassName: string;

  // ✅ add this
  valueStyle?: {
    backgroundColor: string;
    color: string;
  };
};

export type PreciousMetalGraphItem = {
  name: string;
  symbol: string;
  ppm: number;
  color: string;
};

export type EarthElementItem = {
  name: string;
  ppm: number;
  color: string;
};

export type RangeChartRow = {
  label: string;
  userVal: number;
  safeVal: number;
  marginalVal: number;
  displayVal: string;
};

export type FoundElementItem = {
  symbol: string;
  name: string;
  ppm: string;
  margin: string;
  bgClass: string;
  colorClass: string;
  valueStyle?: {
    backgroundColor: string;
    color: string;
  };
};



export type NotFoundElementItem = {
  symbol: string;
  name: string;
  bgClass: string;
  textClass: string;
   valueStyle?: {
    backgroundColor: string;
    color: string;
  };
};

export type SoilFeatureItem = {
  title: string;
  description: string;
  cardClassName: string;
};

export type ProxyReportData = {
  banner: {
    name: string;
    subtitle: string;
    
  };
  reportDetails: {
    heavyMetals: HeavyMetalItem[];
    oilIndicator: {
      crudeOil: string;
      petroleum: string;
      crudeOilClassName: string;
      petroleumClassName: string;
    };
    preciousMetals: MetalCardItem[];
    rareEarthElements: MetalCardItem[];
    reportChart: {
      elementNames: string[];
      belowData: number[];
      refData: number[];
      aboveData: number[];
    };
  };
  elementBreakdown: {
    items: BreakdownBarItem[];
  };
  otherTraceElements: {
    items: BreakdownBarItem[];
  };
  traceFound: {
    title: string;
    subtitle: string;
    max: number;
    rows: RangeChartRow[];
    scaleLabels: string[];
  };
  multiLevelCharts: {
    group1Max: number;
    group1Rows: RangeChartRow[];
    group1ScaleLabels: string[];
    group2Max: number;
    group2Rows: RangeChartRow[];
    group2ScaleLabels: string[];
  };
  oilContaminants: {
    status: string;
    value: string;
  };
  preciousMetalPresent: {
    items: PreciousMetalGraphItem[];
  };
  earthElementsBreakdown: {
    items: EarthElementItem[];
  };
  soilFeatures: SoilFeatureItem[];
  foundElements: FoundElementItem[];
  notFoundElements: NotFoundElementItem[];
};

export const sampleProxyReportData: ProxyReportData = {
  banner: {
    name: "Carson",
    subtitle: "let's see what is in your dirt!",
  },
  reportDetails: {
    heavyMetals: [
      { name: "Antimony (Sb)", value: "17ppm", valueClassName: "bg_peach", textClassName: "txt_red" },
      { name: "Cadmium (Cd)", value: "90ppm", valueClassName: "bg_teal", textClassName: "txt_teal" },
      { name: "Thorium (Th)", value: "3ppm", valueClassName: "bg_yellow", textClassName: "txt_yellow" },
    ],
    oilIndicator: {
      crudeOil: "Crude oil: Found",
      petroleum: "Petroleum: None",
      crudeOilClassName: "btn_gray",
      petroleumClassName: "btn_red_curved",
    },
    preciousMetals: [
      { name: "Gold", ppm: "2 ppm", className: "gold_bg" },
      { name: "Silver", ppm: "2 ppm", className: "silver_bg" },
      { name: "Iridium", ppm: "2 ppm", className: "iridium_bg" },
    ],
    rareEarthElements: [
      { name: "Cerium", ppm: "22 ppm", className: "cerium_bg" },
      { name: "Scandium", ppm: "15 ppm", className: "scandium_bg" },
      { name: "Yttreium", ppm: "2 ppm", className: "yttreium_bg" },
    ],
    reportChart: {
      elementNames: ["Be", "C", "N", "Si", "P", "S", "Ps", "S", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "As", "Sr", "Mo", "Ag", "Cd", "Sn", "Sb", "Al", "Mg", "Mi"],
      belowData: [100, 98, 100, 95, 100, 92, 100, 96, 90, 100, 94, 98, 100, 92, 90, 100, 97, 95, 100, 91, 100, 94, 99, 100, 93, 96, 100, 98, 92, 100],
      refData: [80, 75, 85, 70, 82, 78, 88, 72, 65, 85, 74, 80, 85, 72, 68, 82, 85, 78, 80, 70, 82, 76, 85, 78, 80, 72, 88, 80, 70, 84],
      aboveData: [50, 45, 60, 40, 55, 50, 65, 42, 40, 58, 48, 52, 55, 48, 40, 55, 60, 50, 55, 45, 55, 48, 62, 52, 55, 45, 65, 52, 45, 58],
    },
  },
  elementBreakdown: {
    items: [
      { name: "Aluminium (Al)", percentage: 35, color: "#78866B" },
      { name: "Iron (Fe)", percentage: 25, color: "#8DA399" },
      { name: "Calcium (Ca)", percentage: 15, color: "#A52A2A" },
      { name: "Potassium (K)", percentage: 10, color: "#E29578" },
      { name: "Magnesium (Mg)", percentage: 8, color: "#D9AD98" },
      { name: "Gold (Au)", percentage: 3, color: "#F2D091" },
      { name: "Sodium (Na)", percentage: 2, color: "#78866B" },
      { name: "Silver (Ag)", percentage: 1, color: "#8DA399" },
      { name: "Lead (Pb)", percentage: 0.5, color: "#A52A2A" },
      { name: "Oxygen (O)", percentage: 0.3, color: "#E29578" },
      { name: "Yttreium (Yt)", percentage: 0.1, color: "#D9AD98" },
      { name: "Cadium (Cd)", percentage: 0.05, color: "#F2D091" },
      { name: "Copper (Cu)", percentage: 0.05, color: "#78866B" },
      { name: "Other Trace elements", percentage: 0.1, color: "#8DA399" },
    ],
  },
  otherTraceElements: {
    items: [
      { name: "Manganese (Mn)", percentage: 0.5, color: "#78866B" },
      { name: "Zinc (Zn)", percentage: 0.45, color: "#8DA399" },
      { name: "Boron (B)", percentage: 0.4, color: "#A52A2A" },
      { name: "Chlorine (Cl)", percentage: 0.35, color: "#E29578" },
      { name: "Molybdenum (Mo)", percentage: 0.3, color: "#D9AD98" },
      { name: "Nickel (Ni)", percentage: 0.25, color: "#F2D091" },
      { name: "Osmium (Os)", percentage: 0.2, color: "#78866B" },
      { name: "Rhodium (Rh)", percentage: 0.18, color: "#8DA399" },
      { name: "Iridium (Ir)", percentage: 0.15, color: "#A52A2A" },
      { name: "Selenium (Se)", percentage: 0.12, color: "#E29578" },
      { name: "Thallium (Ti)", percentage: 0.1, color: "#D9AD98" },
      { name: "Antimony (Sb)", percentage: 0.08, color: "#F2D091" },
      { name: "Bismuth (Bi)", percentage: 0.05, color: "#78866B" },
      { name: "Palladium (Pd)", percentage: 0.02, color: "#8DA399" },
    ],
  },
  traceFound: {
    title: "Traces found in your land sample",
    subtitle: "Find more about the potential treasures in your soil below",
    max: 1100,
    rows: [{ label: "Petroleum", userVal: 540, safeVal: 100, marginalVal: 1000, displayVal: "540ppm" }],
    scaleLabels: ["0", "100", "200", "300", "400", "500", "600", "700", "800", "900", "1000", "1100"],
  },
  multiLevelCharts: {
    group1Max: 35,
    group1Rows: [
      { label: "Arsenic", userVal: 20, safeVal: 10, marginalVal: 19, displayVal: "10ppm" },
      { label: "Cadmium", userVal: 14, safeVal: 2.5, marginalVal: 7.5, displayVal: "14ppm" },
      { label: "Antimony", userVal: 20, safeVal: 5, marginalVal: 20, displayVal: "20ppm" },
      { label: "Tellurium", userVal: 4, safeVal: 5, marginalVal: 30.5, displayVal: "4ppm" },
      { label: "Mercury", userVal: 1, safeVal: 3, marginalVal: 22.5, displayVal: "1ppm" },
      { label: "Thallium", userVal: 14, safeVal: 16.5, marginalVal: 25, displayVal: "14ppm" },
      { label: "Thorium", userVal: 3, safeVal: 10, marginalVal: 30, displayVal: "3ppm" },
      { label: "Uranium", userVal: 10, safeVal: 3.5, marginalVal: 16.5, displayVal: "10ppm" },
    ],
    group1ScaleLabels: ["0", "5", "10", "15", "20", "25", "30", "35"],
    group2Max: 450,
    group2Rows: [
      { label: "Chromium", userVal: 250, safeVal: 238, marginalVal: 293, displayVal: "250ppm" },
      { label: "Lead", userVal: 220, safeVal: 291, marginalVal: 360, displayVal: "220ppm" },
    ],
    group2ScaleLabels: ["0", "50", "100", "150", "200", "250", "300", "350", "400", "450"],
  },
  oilContaminants: {
    status: "Found",
    value: "~2ppm",
  },
  preciousMetalPresent: {
    items: [
      { name: "Gold", symbol: "Au", ppm: 17, color: "#FFB300" },
      { name: "Silver", symbol: "Ag", ppm: 9, color: "#7A7A7A" },
      { name: "Platinum", symbol: "Pt", ppm: 3, color: "#A53D3D" },
      { name: "Ruthenium", symbol: "Ru", ppm: 3, color: "#B8C9DB" },
      { name: "Rhodium", symbol: "Rh", ppm: 2, color: "#EBC190" },
      { name: "Palladium", symbol: "Pd", ppm: 2, color: "#617161" },
      { name: "Osmium", symbol: "Os", ppm: 2, color: "#D19A8C" },
      { name: "Iridium", symbol: "Ir", ppm: 2, color: "#A36363" },
    ],
  },
  earthElementsBreakdown: {
    items: [
      { name: "Cerium (Ce)", ppm: 31, color: "#7e9191" },
      { name: "Terbium (Tb)", ppm: 19, color: "#91261d" },
      { name: "Euro... (Eu)", ppm: 15, color: "#d68e6e" },
      { name: "Yttrieum (Y)", ppm: 13, color: "#bccce0" },
      { name: "Holmium (Ho)", ppm: 13, color: "#e6b091" },
      { name: "Scandium", ppm: 12, color: "#d68e6e" },
      { name: "Erbium (Er)", ppm: 12, color: "#d68e6e" },
      { name: "Dysp...(Dy)", ppm: 12, color: "#747d75" },
      { name: "Neod...(Nd)", ppm: 10, color: "#747d75" },
      { name: "Sama...(Sm)", ppm: 9, color: "#747d75" },
      { name: "Thul...(Tm)", ppm: 9, color: "#747d75" },
      { name: "Lant... (La)", ppm: 7, color: "#e6c391" },
      { name: "Prom...(Pm)", ppm: 6, color: "#f2c691" },
      { name: "Lute...(Lu)", ppm: 5, color: "#91a8a8" },
      { name: "Yttb...(Yb)", ppm: 5, color: "#a87e7e" },
      { name: "Gado..(Gd)", ppm: 3, color: "#a87e7e" },
      { name: "Pra...(Pr)", ppm: 2, color: "#8a6d6d" },
    ],
  },
  soilFeatures: [
    { title: "Iron is 50% higher", description: "than commonly found in soil samples", cardClassName: "iron_card" },
    { title: "Potas. is 24% higher", description: "than commonly found in soil samples", cardClassName: "potas_card" },
    { title: "Sodium is 9% lower", description: "than commonly found in soil samples", cardClassName: "sodium_card" },
  ],
  foundElements: [
    { symbol: "Al", name: "Aluminium", ppm: "17ppm", margin: "+/- 39.5ppm", bgClass: "bg_grey_blue", colorClass: "color_grey_blue" },
    { symbol: "Ar", name: "Arsenic", ppm: "3ppm", margin: "+/- 39.5ppm", bgClass: "bg_charcoal", colorClass: "color_charcoal" },
    { symbol: "Cd", name: "Cadmium", ppm: "2ppm", margin: "+/- 39.5ppm", bgClass: "bg_skin_tone", colorClass: "color_skin_tone" },
    { symbol: "Ca", name: "Calcium", ppm: "3ppm", margin: "+/- 39.5ppm", bgClass: "bg_dark_green", colorClass: "color_dark_green" },
    { symbol: "Ag", name: "Cerium", ppm: "17ppm", margin: "+/- 39.5ppm", bgClass: "bg_grey_blue", colorClass: "color_grey_blue" },
    { symbol: "Au", name: "Cerium", ppm: "3ppm", margin: "+/- 39.5ppm", bgClass: "bg_light_blue", colorClass: "color_light_blue" },
    { symbol: "Fe", name: "Iron", ppm: "930ppm", margin: "+/- 39.5ppm", bgClass: "bg_yellow", colorClass: "color_yellow" },
    { symbol: "Pb", name: "Lead", ppm: "9ppm", margin: "+/- 39.5ppm", bgClass: "bg_bright_yellow", colorClass: "color_bright_yellow" },
    { symbol: "Mg", name: "Magnesium", ppm: "204ppm", margin: "+/- 39.5ppm", bgClass: "bg_deep_red", colorClass: "color_deep_red" },
    { symbol: "Mr", name: "Mercury", ppm: "3ppm", margin: "+/- 39.5ppm", bgClass: "bg_blood_red", colorClass: "color_blood_red" },
    { symbol: "Ot", name: "Other", ppm: "2ppm", margin: "+/- 39.5ppm", bgClass: "bg_medium_grey", colorClass: "color_medium_grey" },
    { symbol: "K", name: "Potassium", ppm: "303ppm", margin: "+/- 39.5ppm", bgClass: "bg_orange", colorClass: "color_orange" },
    { symbol: "Pl", name: "Scandium", ppm: "90ppm", margin: "+/- 139.5ppm", bgClass: "bg_dark_grey", colorClass: "color_grey_blue" },
    { symbol: "Ot", name: "Scandium", ppm: "2ppm", margin: "+/- 150.5ppm", bgClass: "bg_peach", colorClass: "color_peach" },
    { symbol: "Ur", name: "Uranium", ppm: "2ppm", margin: "+/- 39.5ppm", bgClass: "bg_soft_blue", colorClass: "color_soft_blue" },
    { symbol: "Cu", name: "Yttreium", ppm: "3ppm", margin: "+/- 39.5ppm", bgClass: "bg_maroon", colorClass: "color_red" },
  ],
  notFoundElements: [
    { symbol: "Ag", name: "Gold", bgClass: "gold_bg", textClass: "gold_text" },
    { symbol: "Pl", name: "Platinum", bgClass: "platinum_bg", textClass: "platinum_text" },
    { symbol: "Cu", name: "Copper", bgClass: "copper_bg", textClass: "copper_text" },
    { symbol: "Au", name: "Silver", bgClass: "silver_bg", textClass: "silver_text" },
    { symbol: "Ot", name: "Other", bgClass: "other_bg", textClass: "other_text" },
  ],
};