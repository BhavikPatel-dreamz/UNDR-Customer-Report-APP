import UnlockReportCta from './UnlockReportCta';

interface ChartRowData {
  label: string;
  userVal: number;
  safeVal: number;
  marginalVal: number;
  displayVal: string;
}

type TraceFoundSectionProps = {
  title: string;
  subtitle: string;
  max: number;
  rows: ChartRowData[];
  scaleLabels: string[];
  locked?: boolean;
  lockedPreviewImageUrl?: string;
  unlockHref?: string;
  unlockLabel?: string;
  premiumUnlockHref?: string;
};

const ChartRow = ({ row, maxVal }: { row: ChartRowData; maxVal: number }) => {
  const safeW = (row.safeVal / maxVal) * 100;
  const margW = ((row.marginalVal - row.safeVal) / maxVal) * 100;
  const unsafeW = 100 - (safeW + margW);
  let userPos = (row.userVal / maxVal) * 100;
  if (userPos > 100) userPos = 100;
  if (userPos < 0) userPos = 0;

  
  return (
    <div className="chart_row">
      <div className="label_col">{row.label}</div>
      <div className="bar_col">
        <div className="bar_wrapper">
          <div className="segment safe_level" style={{ width: safeW + '%' }}></div>
          <div className="segment marginal_level" style={{ width: margW + '%' }}></div>
          <div className="segment unsafe_level" style={{ width: unsafeW + '%' }}></div>
          <div className="user_marker" style={{ left: `calc(${userPos}% - 4px)` }}></div>
        </div>
      </div>
      <div className="value_col">{row.displayVal}</div>
    </div>
  );
};

const TraceFoundSection = ({
  title,
  subtitle,
  max,
  rows,
  scaleLabels,
  locked = false,
  lockedPreviewImageUrl,
  unlockHref,
  unlockLabel = "Unlock report section",
  premiumUnlockHref,
}: TraceFoundSectionProps) => {


  return (
    <section className="multi_level_chart_section">
      <div className="container">
        {locked && lockedPreviewImageUrl ? (
          <div className="report_unlock_preview">
            <img
              src={lockedPreviewImageUrl}
              alt=""
              className="oil_breakdown_locked_preview"
              aria-hidden="true"
            />
            <UnlockReportCta href={unlockHref} label={unlockLabel} premiumHref={premiumUnlockHref} />
          </div>
        ) : (
          <>
            <div className="traces_wrapper">
              {/* <h2 className="traces_main_title">{title}</h2> */}
              {/* <p className="traces_sub_text">{subtitle}</p> */}
            </div>

            <div className="chart_group" data-max={max}>
              {rows.map((row, i) => (
                <ChartRow key={i} row={row} maxVal={max} />
              ))}
              <div className="scale_container">
                <div className="scale_placeholder_left"></div>
                <div className="scale_main">
                  <div className="scale_tick_box"></div>
                  <div className="scale_labels">
                    {scaleLabels.map((l, i) => (
                      <span key={i}>{l}</span>
                    ))}
                  </div>
                </div>
                <div className="scale_placeholder_right"></div>
              </div>
              <div className="chart_axis_label_row petroleum_axis_label_row">
                <div className="scale_placeholder_left"></div>
                <p className="chart_axis_label petroleum_axis_label">Total petroleum hydrocarbons (ppm)</p>
                <div className="scale_placeholder_right"></div>
              </div>
            </div>

            <div className="legend_box">
              <div className="legend_item"><span className="color_box safe_level"></span> Common
Range</div>
              <div className="legend_item"><span className="color_box marginal_level"></span> Elevated</div>
              <div className="legend_item"><span className="color_box unsafe_level"></span> Above Common
Thresholds</div>
              <div className="legend_item"><span className="color_box user_level"></span> Your Levels</div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TraceFoundSection;
