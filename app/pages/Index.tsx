import MainBannerSection from '../components/sections/MainBannerSection';
import ReportDetailsSection from '../components/sections/ReportDetailsSection';
import ElementalBreakdownSection from '../components/sections/ElementalBreakdownSection';
import OtherTraceElementsSection from '../components/sections/OtherTraceElementsSection';
import HeavyMetalBreakdownSection from '../components/sections/HeavyMetalBreakdownSection';
import MultiLevelChartSection from '../components/sections/MultiLevelChartSection';
import OilContaminantsSection from '../components/sections/OilContaminantsSection';
import PetroleumContaminantsSection from '../components/sections/PetroleumContaminantsSection';
import TraceFoundSection from '../components/sections/TraceFoundSection';
import PreciousMetalsBreakdownSection from '../components/sections/PreciousMetalsBreakdownSection';
import PreciousMetalPresentSection from '../components/sections/PreciousMetalPresentSection';
import EarthElementsBreakdownSection from '../components/sections/EarthElementsBreakdownSection';
import UniqueSoilSection from '../components/sections/UniqueSoilSection';
import SoilFeatureSection from '../components/sections/SoilFeatureSection';
import FoundElementsListSection from '../components/sections/FoundElementsListSection';
import NotFoundElementsListSection from '../components/sections/NotFoundElementsListSection';
import type { ProxyReportData } from '../lib/proxy-report-data';

type IndexProps = {
  report: ProxyReportData;
};

const Index = ({ report }: IndexProps) => {
  return (
    <div>
      {/* 1. Main Banner */}
      <MainBannerSection name={report.banner.name} subtitle={report.banner.subtitle} />
      {/* 2. Report Details */}
      <ReportDetailsSection
        heavyMetals={report.reportDetails.heavyMetals}
        oilIndicator={report.reportDetails.oilIndicator}
        preciousMetals={report.reportDetails.preciousMetals}
        rareEarthElements={report.reportDetails.rareEarthElements}
      />
      {/* 3. Elemental Breakdown */}
      <ElementalBreakdownSection />
      {/* 4. Other Trace Elements */}
      <OtherTraceElementsSection />
      {/* 5. Heavy Metal Breakdown */}
      <HeavyMetalBreakdownSection />
      {/* 6. Multi Level Chart */}
      <MultiLevelChartSection
        group1Max={report.multiLevelCharts.group1Max}
        group1Rows={report.multiLevelCharts.group1Rows}
        group1ScaleLabels={report.multiLevelCharts.group1ScaleLabels}
        group2Max={report.multiLevelCharts.group2Max}
        group2Rows={report.multiLevelCharts.group2Rows}
        group2ScaleLabels={report.multiLevelCharts.group2ScaleLabels}
      />
      {/* 7. Oil Contaminants */}
      <OilContaminantsSection status={report.oilContaminants.status} value={report.oilContaminants.value} />
      {/* 8. Petroleum Contaminants */}
      <PetroleumContaminantsSection />
      {/* 9. Trace Found */}
      <TraceFoundSection
        title={report.traceFound.title}
        subtitle={report.traceFound.subtitle}
        max={report.traceFound.max}
        rows={report.traceFound.rows}
        scaleLabels={report.traceFound.scaleLabels}
      />
      {/* 10. Precious Metals Breakdown */}
      <PreciousMetalsBreakdownSection />
      {/* 11. Precious Metal Present */}
      <PreciousMetalPresentSection />
      {/* 12. Earth Elements Breakdown */}
      <EarthElementsBreakdownSection />
      {/* 13. Unique Soil */}
      <UniqueSoilSection />
      {/* 14. Soil Feature */}
      <SoilFeatureSection items={report.soilFeatures} />
      {/* 15. Found Elements List */}
      <FoundElementsListSection elements={report.foundElements} />
      {/* 16. Not Found Elements List */}
      <NotFoundElementsListSection elements={report.notFoundElements} />
    </div>
  );
};

export default Index;
