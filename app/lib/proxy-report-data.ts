export type BreakdownBarItem = {
  name: string;
  percentage: number;
  color: string;
};

export type MetalCardItem = {
  name: string;
  ppm: string;
  className: string;
  valueStyle?: {
    backgroundColor: string;
    color: string;
  };
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

export type ReportPackage =
  | "treasure_base"
  | "treasure_plus"
  | "hs_base"
  | "hs_plus"
  | "premium";

export type ProxyReportData = {
  reportPackage?: ReportPackage;
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
  petroleumTraceFound: {
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
  petroleum_contaminant?: {
    type: string;
    ppm: number;
    rawValue?: number;
    level?: "Green" | "Yellow" | "Red";
  };
  petroleum_contaminants?: Array<{
    type: string;
    ppm: number;
    rawValue?: number;
  }>;
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
