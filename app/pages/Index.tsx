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
import PreciousMetalsBreakdownHeading from '../components/sections/PreciousMetalsBreakdownHeading';
import PreciousMetalsSection from '../components/sections/PreciousMetalsSection';
import PreciousMetalsBreakdownHeadingAlt from '../components/sections/PreciousMetalsBreakdownHeadingAlt';
import PreciousMetalsNotPresent from '../components/sections/PreciousMetalsNotPresent';
import type { ProxyReportData } from '../lib/proxy-report-data';

type IndexProps = {
  report: ProxyReportData;
};

const Index = ({ report }: IndexProps) => {
  const reportPackage = report.reportPackage || 'premium';
  const canSeePrecious = reportPackage === 'treasure_base' || reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const canSeeRareEarth = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const canSeeOil = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const canSeePetroleum = reportPackage === 'hs_plus' || reportPackage === 'premium';
  const canSeeHeavy = reportPackage === 'hs_base' || reportPackage === 'hs_plus' || reportPackage === 'premium';
  const foundElementsForList = report.foundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#d1d5db', color: '#4b5563' },
  }));
  const notFoundElementsForList = report.notFoundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#e5e7eb', color: '#6b7280' },
  }));

  const packageAwareOilIndicator = canSeeOil
    ? report.reportDetails.oilIndicator
    : {
        crudeOil: 'Crude oil: Locked',
        petroleum: 'Petroleum: Locked',
        crudeOilClassName: 'btn_gray',
        petroleumClassName: 'btn_gray',
      };

  return (
    <div>
      {/* 1. Main Banner */}
      <MainBannerSection name={report.banner.name} subtitle={report.banner.subtitle} />
      {/* 2. Report Details */}
      <ReportDetailsSection
        heavyMetals={canSeeHeavy ? report.reportDetails.heavyMetals : []}
        oilIndicator={packageAwareOilIndicator}
        preciousMetals={canSeePrecious ? report.reportDetails.preciousMetals : []}
        rareEarthElements={canSeeRareEarth ? report.reportDetails.rareEarthElements : []}
      />
      {/* 3. Elemental Breakdown */}
      <ElementalBreakdownSection />
      {/* 4. Other Trace Elements */}
      <OtherTraceElementsSection />
      {/* 5. Heavy Metal Breakdown */}
      {canSeeHeavy && <HeavyMetalBreakdownSection />}
      {/* 6. Multi Level Chart */}
      {canSeeHeavy && (
        <MultiLevelChartSection
          group1Max={report.multiLevelCharts.group1Max}
          group1Rows={report.multiLevelCharts.group1Rows}
          group1ScaleLabels={report.multiLevelCharts.group1ScaleLabels}
          group2Max={report.multiLevelCharts.group2Max}
          group2Rows={report.multiLevelCharts.group2Rows}
          group2ScaleLabels={report.multiLevelCharts.group2ScaleLabels}
        />
      )}
      {/* 7. Oil Contaminants */}
      {canSeeOil && <OilContaminantsSection status={report.oilContaminants.status} value={report.oilContaminants.value} />}
      {/* 8. Petroleum Contaminants */}
      {canSeePetroleum && <PetroleumContaminantsSection />}
      {/* 9. Trace Found */}
      {canSeePetroleum && (
        <TraceFoundSection
          title={report.traceFound.title}
          subtitle={report.traceFound.subtitle}
          max={report.traceFound.max}
          rows={report.traceFound.rows}
          scaleLabels={report.traceFound.scaleLabels}
        />
      )}
      {/* 10. Precious Metals Breakdown */}
      {canSeePrecious && <PreciousMetalsBreakdownSection />}
      {/* 11. Precious Metal Present */}
      {canSeePrecious && <PreciousMetalPresentSection />}
      {/* 12. Earth Elements Breakdown */}
      {canSeeRareEarth && <EarthElementsBreakdownSection />}
      {/* 13. Unique Soil */}
      <UniqueSoilSection />
      {/* 14. Soil Feature */}
      <SoilFeatureSection items={report.soilFeatures} />
      {/* 15. Found Elements List */}
      <FoundElementsListSection elements={foundElementsForList} />
      {/* 16. Not Found Elements List */}
      <NotFoundElementsListSection elements={notFoundElementsForList} />
      {/* 17. Precious Metals Breakdown Heading */}
      {canSeePrecious && <PreciousMetalsBreakdownHeading />}
      {/* 18. Precious Metals */}
      {canSeePrecious && <PreciousMetalsSection />}
      {/* 19. Precious Metals Breakdown Heading Alt */}
      {canSeePrecious && <PreciousMetalsBreakdownHeadingAlt />}
      {/* 20. Precious Metals Not Present */}
      {canSeePrecious && <PreciousMetalsNotPresent />}
    </div>
  );
};

export default Index;
