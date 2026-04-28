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
  appUrl?: string;
};

const Index = ({ report, appUrl = '' }: IndexProps) => {
  const reportPackage = report.reportPackage || 'premium';
  const isPremium = reportPackage === 'premium';
  const quickLookDisplayPreciousMetals =
    reportPackage === 'treasure_base' ||
    reportPackage === 'treasure_plus' ||
    reportPackage === 'premium';
  const quickLookDisplayRareEarthElements = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const quickLookDisplayOil = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const quickLookDisplayHeavyMetals =
    reportPackage === 'hs_base' ||
    reportPackage === 'hs_plus' ||
    reportPackage === 'premium';
  const canDisplayPreciousBreakdown =
    reportPackage === 'treasure_base' ||
    reportPackage === 'treasure_plus' ||
    reportPackage === 'premium';
  const canUnlockPreciousBreakdown = reportPackage === 'hs_base' || reportPackage === 'hs_plus';
  const shouldShowPreciousBreakdown = canDisplayPreciousBreakdown || canUnlockPreciousBreakdown;
  const canDisplayRareEarthBreakdown = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const canUnlockRareEarthBreakdown =
    reportPackage === 'treasure_base' ||
    reportPackage === 'hs_base' ||
    reportPackage === 'hs_plus';
  const shouldShowRareEarthBreakdown = canDisplayRareEarthBreakdown || canUnlockRareEarthBreakdown;
  const canHideOilBreakdown = reportPackage === 'treasure_base' || reportPackage === 'hs_base';
  const canDisplayOilBreakdown = reportPackage === 'treasure_plus' || reportPackage === 'premium';
  const canUnlockOilBreakdown = reportPackage === 'hs_plus';
  const shouldShowOilBreakdown = !canHideOilBreakdown && (canDisplayOilBreakdown || canUnlockOilBreakdown);
  const canHidePetroleumBreakdown = reportPackage === 'treasure_base' || reportPackage === 'hs_base';
  const canDisplayPetroleumBreakdown = reportPackage === 'hs_plus' || reportPackage === 'premium';
  const canUnlockPetroleumBreakdown = reportPackage === 'treasure_plus';
  const shouldShowPetroleumBreakdown =
    !canHidePetroleumBreakdown && (canDisplayPetroleumBreakdown || canUnlockPetroleumBreakdown);
  const foundElementsForList = report.foundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#d1d5db', color: '#4b5563' },
  }));
  const notFoundElementsForList = report.notFoundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#e5e7eb', color: '#6b7280' },
  }));

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
        lockHeavyMetals={!isPremium && !quickLookDisplayHeavyMetals}
        lockOilIndicator={!isPremium && !quickLookDisplayOil}
        lockPreciousMetals={!isPremium && !quickLookDisplayPreciousMetals}
        lockRareEarthElements={!isPremium && !quickLookDisplayRareEarthElements}
        lockedHeavyMetalsImageUrl={`${appUrl}/images/quicklook-heavy-locked-preview.png`}
        lockedOilIndicatorImageUrl={`${appUrl}/images/quicklook-oil-locked-preview.png`}
        lockedPreciousMetalsImageUrl={`${appUrl}/images/quicklook-precious-locked-preview.png`}
        lockedRareEarthElementsImageUrl={`${appUrl}/images/quicklook-rare-earth-locked-preview.png`}
      />
      {/* 3. Elemental Breakdown */}
      <ElementalBreakdownSection />
      {/* 4. Other Trace Elements */}
      <OtherTraceElementsSection />
      {/* 11. Precious Metals Breakdown */}
      {shouldShowPreciousBreakdown && <PreciousMetalsBreakdownSection />}
      {/* 12. Precious Metal Present */}
      {shouldShowPreciousBreakdown && (
        <PreciousMetalPresentSection
          items={report.preciousMetalPresent.items}
          locked={canUnlockPreciousBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/precious-metals-present-locked-preview.png`}
        />
      )}

      {/* 13. Earth Elements Breakdown */}
      {shouldShowRareEarthBreakdown && (
        <EarthElementsBreakdownSection
          locked={canUnlockRareEarthBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/rare-earth-elements-locked-preview.png`}
        />
      )}
      {shouldShowPetroleumBreakdown && (
        <>
          {/* 7. Petroleum Contaminants */}
          <PetroleumContaminantsSection />
          {/* 8. Petroleum Trace Found */}
          <TraceFoundSection
            title={report.petroleumTraceFound.title}
            subtitle={report.petroleumTraceFound.subtitle}
            max={report.petroleumTraceFound.max}
            rows={report.petroleumTraceFound.rows}
            scaleLabels={report.petroleumTraceFound.scaleLabels}
            locked={canUnlockPetroleumBreakdown}
            lockedPreviewImageUrl={`${appUrl}/images/oil-breakdown-locked-preview.png`}
          />
        </>
      )}

      {shouldShowOilBreakdown && (
        <OilContaminantsSection
          status={report.oilContaminants.status}
          value={report.oilContaminants.value}
          locked={canUnlockOilBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/oil-contaminants-locked-preview.png`}
        />
      )}

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

      {/* 16. Found Elements List */}
      <FoundElementsListSection elements={foundElementsForList} />
      {/* 17. Not Found Elements List */}
      <NotFoundElementsListSection elements={notFoundElementsForList} />

      {/* 11. Precious Metals Breakdown */}
      {/* {shouldShowPreciousBreakdown && <PreciousMetalsBreakdownSection />} */}
      {/* 12. Precious Metal Present */}
      {/* {shouldShowPreciousBreakdown && (
        <PreciousMetalPresentSection
          items={report.preciousMetalPresent.items}
          locked={canUnlockPreciousBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/precious-metals-present-locked-preview.png`}
        />
      )} */}


      {/* 14. Unique Soil */}
      {/* <UniqueSoilSection /> */}
      {/* 15. Soil Feature */}
      {/* <SoilFeatureSection items={report.soilFeatures} /> */}

      {/* 18. Precious Metals Breakdown Heading */}
      <PreciousMetalsBreakdownHeading />
      {/* 19. Precious Metals */}
      <PreciousMetalsSection />
      {/* 20. Precious Metals Breakdown Heading Alt */}
      <PreciousMetalsBreakdownHeadingAlt />
      {/* 21. Precious Metals Not Present */}
      <PreciousMetalsNotPresent />
    </div>
  );
};

export default Index;
