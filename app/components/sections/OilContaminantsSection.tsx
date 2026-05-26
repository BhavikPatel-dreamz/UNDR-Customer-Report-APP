import UnlockReportCta from './UnlockReportCta';

type OilContaminantsSectionProps = {
  status: string;
  value: string;
  locked?: boolean;
  lockedPreviewImageUrl?: string;
  unlockHref?: string;
  unlockLabel?: string;
  premiumUnlockHref?: string;
};

const OilContaminantsSection = ({
  status,
  value,
  locked = false,
  unlockHref,
  unlockLabel = "Unlock report section",
  premiumUnlockHref,
}: OilContaminantsSectionProps) => {
  const numericValue = Number((value || "").match(/-?\d+(?:\.\d+)?/)?.[0] || 0);
  const displayStatus = Number.isFinite(numericValue) && numericValue > 0 ? "Found" : status || "Not Found";
  const formattedValue = Number.isFinite(numericValue)
    ? (Number.isInteger(numericValue) ? String(numericValue) : numericValue.toFixed(2).replace(/\.?0+$/, ""))
    : "0";
  const displayValue = Number.isFinite(numericValue) && numericValue > 0
    ? `~${formattedValue} ppm`
    : `${formattedValue} ppm`;

  return (
    <section className="oil_contaminants_section">
      <div className="crude_oil_header_band">
        <div className="container">
          <div className="crude_oil_header_inner">
            <h2 className="crude_oil_title">Crude Oil</h2>
          </div>
        </div>
      </div>
      <div className="container">
        {locked ? (
          <div className="report_unlock_preview crude_oil_unlock_preview">
            <div className="crude_oil_result_card crude_oil_result_card_locked" aria-hidden="true">
              <span className="crude_oil_result_status">Found</span>
              <span className="crude_oil_result_value">~2 ppm</span>
            </div>
            <UnlockReportCta href={unlockHref} label={unlockLabel} premiumHref={premiumUnlockHref} />
          </div>
        ) : (
          <div className="crude_oil_result_card">
            <span className="crude_oil_result_status">{displayStatus}</span>
            <span className="crude_oil_result_value">{displayValue}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default OilContaminantsSection;
