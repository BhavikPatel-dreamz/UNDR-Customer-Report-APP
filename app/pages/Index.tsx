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
import AdditionalResourcesSection from '../components/sections/AdditionalResourcesSection';
import type { ProxyReportData } from '../lib/proxy-report-data';
import { formatUnlockPrice, hasReportUnlock, type UnlockModule } from '../lib/report-packages';

type IndexProps = {
  report: ProxyReportData;
  appUrl?: string;
};

const Index = ({ report, appUrl = '' }: IndexProps) => {
  const reportPackage = report.reportPackage || 'premium';
  const quickViewPackage = report.quickViewPackage || reportPackage;
  const unlockedModules = report.unlockedModules || [];
  const kitRegistrationNumber = report.kitRegistrationNumber || report.banner.subtitle.replace(/^Kit Registration:\s*/i, '');
  const unlockHref = (module: UnlockModule) =>
    `/apps/undr/unlock/start?kit=${encodeURIComponent(kitRegistrationNumber)}&module=${encodeURIComponent(module)}&package=${encodeURIComponent(reportPackage)}`;
  const unlockLabel = (module: UnlockModule, title: string) => `Unlock ${title} for ${formatUnlockPrice(module)}`;
  const premiumUnlockHref =
    reportPackage === 'treasure_base' || reportPackage === 'hs_base' || hasReportUnlock(unlockedModules, 'premium')
      ? undefined
      : unlockHref('premium');
  const hasPreciousUnlock = hasReportUnlock(unlockedModules, 'precious_metals');
  const hasRareEarthUnlock = hasReportUnlock(unlockedModules, 'rare_earth');
  const hasCrudeOilUnlock = hasReportUnlock(unlockedModules, 'crude_oil');
  const hasPetroleumUnlock = hasReportUnlock(unlockedModules, 'petroleum');
  const hasHeavyMetalsUnlock = hasReportUnlock(unlockedModules, 'heavy_metals');
  const isPremium = reportPackage === 'premium';
  const canUnlockHeavyMetalsBreakdown = !hasHeavyMetalsUnlock && (reportPackage === 'treasure_base' || reportPackage === 'treasure_plus');
  const canDisplayPreciousBreakdown =
    reportPackage === 'treasure_base' ||
    reportPackage === 'treasure_plus' ||
    reportPackage === 'premium' ||
    hasPreciousUnlock;
  const canUnlockPreciousBreakdown = !hasPreciousUnlock && (reportPackage === 'hs_base' || reportPackage === 'hs_plus');
  const shouldShowPreciousBreakdown = canDisplayPreciousBreakdown || canUnlockPreciousBreakdown;
  const canDisplayRareEarthBreakdown = reportPackage === 'treasure_plus' || reportPackage === 'premium' || hasRareEarthUnlock;
  const canUnlockRareEarthBreakdown =
    !hasRareEarthUnlock &&
    (reportPackage === 'treasure_base' ||
      reportPackage === 'hs_base' ||
      reportPackage === 'hs_plus');
  const shouldShowRareEarthBreakdown = canDisplayRareEarthBreakdown || canUnlockRareEarthBreakdown;
  const canDisplayOilBreakdown =
    reportPackage === 'treasure_plus' ||
    reportPackage === 'premium' ||
    hasCrudeOilUnlock;
  const canUnlockOilBreakdown = !hasCrudeOilUnlock && (reportPackage === 'hs_base' || reportPackage === 'hs_plus' || reportPackage === 'treasure_base');
  const shouldShowOilBreakdown = canDisplayOilBreakdown || canUnlockOilBreakdown;
  const canDisplayPetroleumBreakdown = reportPackage === 'hs_plus' || reportPackage === 'premium' || hasPetroleumUnlock;
  const canUnlockPetroleumBreakdown = !hasPetroleumUnlock && (reportPackage === 'treasure_plus' || reportPackage === 'treasure_base' || reportPackage === 'hs_base');
  const shouldShowPetroleumBreakdown = canDisplayPetroleumBreakdown || canUnlockPetroleumBreakdown;
  const foundElementsForList = report.foundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#d1d5db', color: '#4b5563' },
  }));
  const notFoundElementsForList = report.notFoundElements.map((item) => ({
    ...item,
    valueStyle: item.valueStyle || { backgroundColor: '#e5e7eb', color: '#6b7280' },
  }));
  const canShowPreciousMetalsChart =
    report.preciousMetalPresent.items.length > 0 &&
    report.preciousMetalPresent.items.some((item) => Number(item.ppm) > 0);

  return (
    <div>
      {/* 1. Main Banner */}
      <MainBannerSection name={report.banner.name} subtitle={report.banner.subtitle} />
      {/* 2. Report Details */}
      <ReportDetailsSection
        quickViewPackage={quickViewPackage}
        heavyMetals={report.reportDetails.heavyMetals}
        oilIndicator={report.reportDetails.oilIndicator}
        preciousMetals={report.reportDetails.preciousMetals}
        rareEarthElements={report.reportDetails.rareEarthElements}
        appUrl={appUrl}
      />
      {/* 3. Elemental Breakdown */}
      <ElementalBreakdownSection />
      {/* 4. Other Trace Elements */}
      <OtherTraceElementsSection appUrl={appUrl} />
      {/* 11. Precious Metals Breakdown */}
  {shouldShowPreciousBreakdown && <PreciousMetalsBreakdownSection appUrl={appUrl} />}
      {/* 12. Precious Metal Present */}
      {shouldShowPreciousBreakdown && (
        <PreciousMetalPresentSection
          items={report.preciousMetalPresent.items}
          locked={canUnlockPreciousBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/precious-metals-present-locked-preview.png`}
          unlockHref={unlockHref('precious_metals')}
          unlockLabel={unlockLabel('precious_metals', 'Precious Metals')}
          premiumUnlockHref={premiumUnlockHref}
          appUrl={appUrl}
        />
      )}

      {/* 13. Earth Elements Breakdown */}
      {shouldShowRareEarthBreakdown && (
        <EarthElementsBreakdownSection
          items={report.earthElementsBreakdown.items}
          locked={canUnlockRareEarthBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/rare-earth-elements-locked-preview.png`}
          unlockHref={unlockHref('rare_earth')}
          unlockLabel={unlockLabel('rare_earth', 'REEs')}
          premiumUnlockHref={premiumUnlockHref}
          appUrl={appUrl}
        />
      )}
       {shouldShowOilBreakdown && (
        <OilContaminantsSection
          status={report.oilContaminants.status}
          value={report.oilContaminants.value}
          locked={canUnlockOilBreakdown}
          lockedPreviewImageUrl={`${appUrl}/images/oil-contaminants-locked-preview.png`}
          unlockHref={unlockHref('crude_oil')}
          unlockLabel={unlockLabel('crude_oil', 'Crude Oil')}
          premiumUnlockHref={premiumUnlockHref}
          appUrl={appUrl}
        />
      )}
      
      {shouldShowPetroleumBreakdown && (
        <>
          {/* 7. Petroleum Contaminants */}
          <PetroleumContaminantsSection appUrl={appUrl} />
          {/* 8. Petroleum Trace Found */}
          <TraceFoundSection
            title={report.petroleumTraceFound.title}
            subtitle={report.petroleumTraceFound.subtitle}
            max={report.petroleumTraceFound.max}
            rows={report.petroleumTraceFound.rows}
            scaleLabels={report.petroleumTraceFound.scaleLabels}
            locked={canUnlockPetroleumBreakdown}
            lockedPreviewImageUrl={`${appUrl}/images/oil-breakdown-locked-preview.png`}
            unlockHref={unlockHref('petroleum')}
            unlockLabel={unlockLabel('petroleum', 'Petroleum Contaminants')}
            premiumUnlockHref={premiumUnlockHref}
          />
        </>
      )}

     

      {((reportPackage !== 'treasure_base' && reportPackage !== 'treasure_plus') || hasHeavyMetalsUnlock || canUnlockHeavyMetalsBreakdown) && (
        <>
          {/* 5. Heavy Metal Breakdown */}
          <HeavyMetalBreakdownSection appUrl={appUrl} />
          {/* 6. Multi Level Chart */}
          <MultiLevelChartSection
            group1Max={report.multiLevelCharts.group1Max}
            group1Rows={report.multiLevelCharts.group1Rows}
            group1ScaleLabels={report.multiLevelCharts.group1ScaleLabels}
            group2Max={report.multiLevelCharts.group2Max}
            group2Rows={report.multiLevelCharts.group2Rows}
            group2ScaleLabels={report.multiLevelCharts.group2ScaleLabels}
            locked={canUnlockHeavyMetalsBreakdown}
            lockedPreviewImageUrl={`${appUrl}/images/heavy-metals-breakdown-locked-preview.svg`}
            unlockHref={unlockHref('heavy_metals')}
            unlockLabel={unlockLabel('heavy_metals', 'Heavy Metals')}
            premiumUnlockHref={premiumUnlockHref}
          />
        </>
      )}

      {/* 14. Unique Soil */}
      <UniqueSoilSection />
      {/* 15. Soil Feature */}
      <SoilFeatureSection items={report.soilFeatures} />

      {/* 16. Found Elements List */}
  <FoundElementsListSection elements={foundElementsForList} appUrl={appUrl} />
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


     
      {/* 18. Precious Metals Breakdown Heading */}
      {/* {canShowPreciousMetalsChart && <PreciousMetalsBreakdownHeading />} */}
      {/* 19. Precious Metals */}
      {/* {canShowPreciousMetalsChart && <PreciousMetalsSection items={report.preciousMetalPresent.items} />} */}
      {/* 20. Precious Metals Breakdown Heading Alt */}
      {/* <PreciousMetalsBreakdownHeadingAlt /> */}
      {/* 21. Precious Metals Not Present */}
      {/* <PreciousMetalsNotPresent /> */}
      <AdditionalResourcesSection />
      <div className="pdf_download_footer" aria-label="Report actions">
        <button className="pdf_download_button" type="button" data-pdf-download aria-label="Download report PDF" title="Download PDF">
          <svg className="pdf_download_icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="M9 15l3 3 3-3" />
          </svg>
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Index;
