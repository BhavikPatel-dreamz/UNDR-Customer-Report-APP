import DiveArrow from './DiveArrow';

interface ChartRowData {
  label: string;
  userVal: number;
  safeVal: number;
  marginalVal: number;
  displayVal: string;
}

interface ChartGroupProps {
  maxVal: number;
  rows: ChartRowData[];
  scaleLabels: string[];
}

type MultiLevelChartSectionProps = {
  group1Max: number;
  group1Rows: ChartRowData[];
  group1ScaleLabels: string[];
  group2Max: number;
  group2Rows: ChartRowData[];
  group2ScaleLabels: string[];
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

const ChartGroup = ({ maxVal, rows, scaleLabels }: ChartGroupProps) => (
  <div className="chart_group" data-max={maxVal}>
    {rows.map((row, i) => (
      <ChartRow key={i} row={row} maxVal={maxVal} />
    ))}
    <div className="scale_container">
      <div className="scale_placeholder_left"></div>
      <div className="scale_main">
        <div className="scale_tick_box"></div>
        <div className="scale_labels">
          {scaleLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      </div>
      <div className="scale_placeholder_right"></div>
    </div>
  </div>
);

const MultiLevelChartSection = ({
  group1Max,
  group1Rows,
  group1ScaleLabels,
  group2Max,
  group2Rows,
  group2ScaleLabels,
}: MultiLevelChartSectionProps) => {
  return (
    <section className="multi_level_chart_section">
      <div className="container">
        <ChartGroup maxVal={group1Max} rows={group1Rows} scaleLabels={group1ScaleLabels} />
        <div className="spacer_div"></div>
        <ChartGroup maxVal={group2Max} rows={group2Rows} scaleLabels={group2ScaleLabels} />

        <div className="legend_box">
          <div className="legend_item"><span className="color_box safe_level"></span> Safe Levels</div>
          <div className="legend_item"><span className="color_box marginal_level"></span> Marginally Unsafe Levels</div>
          <div className="legend_item"><span className="color_box unsafe_level"></span> Unsafe Levels</div>
          <div className="legend_item"><span className="color_box user_level"></span> Your Levels</div>
        </div>

        <div className="report_details_section">
          <div className="dive_deeper_wrap">
            <p className="dive_text">Dive deeper below</p>
            <div className="dive_arrow"><DiveArrow /></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiLevelChartSection;
