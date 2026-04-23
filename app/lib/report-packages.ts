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
