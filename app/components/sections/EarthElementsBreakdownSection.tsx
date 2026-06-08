import UnlockReportCta from './UnlockReportCta';
import type { EarthElementItem } from '../../lib/proxy-report-data';

type EarthElementsBreakdownSectionProps = {
  items: EarthElementItem[];
  locked?: boolean;
  lockedPreviewImageUrl: string;
  unlockHref?: string;
  unlockLabel?: string;
  premiumUnlockHref?: string;
  appUrl?: string;
};

const EarthElementsBreakdownSection = ({
  items,
  locked = false,
  lockedPreviewImageUrl,
  unlockHref,
  unlockLabel = "Unlock report section",
  premiumUnlockHref,
  appUrl = '',
}: EarthElementsBreakdownSectionProps) => {
  const hasDetectedRareEarthElements = items.some((item) => Number(item.ppm) > 0);

  return (
    <section className={`earth_element_breakdown_section${locked ? ' locked' : ''}${!locked && !hasDetectedRareEarthElements ? ' zero_state' : ''}`}>
      <div className="earth_element_header_band">
        <div className="container">
          <div className="earth_element_header_inner">
            <h2 className="main_title">Rare Earth<br />Elements Breakdown</h2>
          </div>
        </div>

  {/* appUrl defaults to '' so this safely resolves to '/images/REEB-icon.svg' when empty */}
  <img src={`${appUrl}/images/REEB-icon.svg`} className="rare_earth_breakdown_icon" alt="Icon" />

      </div>
      <div className="rare_earth_breakdown_section">
      <div className="container">
        {!locked && hasDetectedRareEarthElements ? (
          <div className="text_center_header">
            <p className="sub_title">Traces found in your land sample</p>
          </div>
        ) : null}
        {locked ? (
          <div className="report_unlock_preview earth_element_unlock_preview">
            <div className="earth_element_locked_chart" aria-hidden="true">
              <img
                src={lockedPreviewImageUrl}
                alt=""
                className="earth_element_locked_preview"
              />
              <div className="earth_element_unlock_overlay">
                <div className="earth_element_lock_icon">
                  <span className="earth_element_lock_shackle" />
                  <span className="earth_element_lock_body">
                    <span className="earth_element_lock_gem" />
                  </span>
                </div>
                <p className="earth_element_unlock_text">Unlock Chart</p>
              </div>
            </div>
            <UnlockReportCta href={unlockHref} label={unlockLabel} premiumHref={premiumUnlockHref} />
          </div>
        ) : !hasDetectedRareEarthElements ? (
          <div className="rare_earth_zero_state_content">
            <div className="rare_earth_zero_top">
              <span className="rare_earth_zero_value">0</span>
              <span className="rare_earth_zero_unit">ppm</span>
            </div>
            <h3>Rare Earth elements not detected</h3>
            <div className="rare_earth_zero_rule" />
            <div className="rare_earth_zero_bottom">
              <div className="rare_earth_zero_bars" aria-hidden="true">
                {Array.from({ length: 24 }).map((_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="rare_earth_zero_copy">
                <p>The good news? The rest of your report still has plenty to dig into.</p>
                <p>And don't trade in your shovel just yet--the next scoop could tell a different story.</p>
              </div>
            </div>
            
          </div>
        ) : (
          <div id="chart_wrapper" className="chart_wrapper"></div>
        )}
      </div>

      <img src={`${appUrl}/images/rare_earth_star_icon.svg`} className="rare_earth_star_icon" alt="Icon" />
      
      </div>
      
    </section>
  );
};

export default EarthElementsBreakdownSection;
