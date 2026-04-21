const DiveArrow = () => (
  <svg width="49" height="28" viewBox="0 0 49 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.147 26.6138L0.925214 5.39201C-0.166581 4.30022 -0.309023 2.57912 0.588426 1.32269C1.18133 0.492628 2.1386 0 3.15866 0H45.3132C46.3768 0 47.3589 0.569918 47.8866 1.4934C48.5606 2.67302 48.3464 4.1599 47.3667 5.10119L24.9469 26.6418C24.1616 27.3963 22.917 27.3838 22.147 26.6138Z" fill="#99272C" />
  </svg>
);

type HeavyMetalItem = {
  name: string;
  value: string;
  valueClassName: string;
  textClassName: string;
};

type MetalCardItem = {
  name: string;
  ppm: string;
  className: string;
};

type ReportDetailsSectionProps = {
  heavyMetals: HeavyMetalItem[];
  oilIndicator: {
    crudeOil: string;
    petroleum: string;
    crudeOilClassName: string;
    petroleumClassName: string;
  };
  preciousMetals: MetalCardItem[];
  rareEarthElements: MetalCardItem[];
};

const ReportDetailsSection = ({
  heavyMetals,
  oilIndicator,
  preciousMetals,
  rareEarthElements,
}: ReportDetailsSectionProps) => {
  console.log(heavyMetals);
  return (
    <section className="report_details_section">
      <div className="container">
        <div className="report_flex_row">
          <div className="report_left_col">
            <h2 className="report_main_heading">Element Breakdown chart</h2>
            <div className="chart_wrapper">
              <canvas id="element_layered_chart"></canvas>
            </div>
            <div className="chart_legend">
              <span className="legend_item"><span className="box_below"></span> Below Range</span>
              <span className="legend_item"><span className="box_ref"></span> Reference Range</span>
              <span className="legend_item"><span className="box_above"></span> Above Range</span>
            </div>
            <div className="chart_footer_divider"></div>
            <div className="chart_footer_text">
              <p>Measured elemental levels shown relative to a reference range.</p>
              <p>This fingerprint is informational and does not assess safety, risk, or suitability for any use.</p>
            </div>
          </div>

          <div className="report_right_col">
            <div className="top_info_row">
              <div className="heavy_metals_block">
                <h2 className="report_main_heading">Heavy Metals</h2>
                {heavyMetals.map((item) => (
                  <div className="metal_list_item" key={item.name}>
                    <span className={`val_box ${item.valueClassName}`}>{item.value}</span>{" "}
                    <span className={`metal_txt ${item.textClassName}`}>{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="vertical_divider"></div>
              <div className="oil_indicator_block">
                <h2 className="report_main_heading">Oil Indicator</h2>
                <div className={`oil_btn ${oilIndicator.crudeOilClassName}`}>{oilIndicator.crudeOil}</div>
                <div className={`oil_btn ${oilIndicator.petroleumClassName}`}>{oilIndicator.petroleum}</div>
              </div>
            </div>

            <div className="info_block">
              <h2 className="report_main_heading">Precious Metals</h2>
              <div className="circles_flex">
                {preciousMetals.map((item) => (
                  <div className={`metal_circle ${item.className}`} key={item.name}>{item.name}<br /><span>{item.ppm}</span></div>
                ))}
              </div>
            </div>

            <div className="info_block no_border">
              <h2 className="report_main_heading">Rare Earth Elements</h2>
              <div className="circles_flex">
                {rareEarthElements.map((item) => (
                  <div className={`metal_circle ${item.className}`} key={item.name}>{item.name}<br /><span>{item.ppm}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dive_deeper_wrap">
          <p className="dive_text">Dive deeper below</p>
          <div className="dive_arrow"><DiveArrow /></div>
        </div>
      </div>
    </section>
  );
};

export default ReportDetailsSection;
