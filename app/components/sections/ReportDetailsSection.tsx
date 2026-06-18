const DiveArrow = () => (
  <svg width="49" height="28" viewBox="0 0 49 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.147 26.6138L0.925214 5.39201C-0.166581 4.30022 -0.309023 2.57912 0.588426 1.32269C1.18133 0.492628 2.1386 0 3.15866 0H45.3132C46.3768 0 47.3589 0.569918 47.8866 1.4934C48.5606 2.67302 48.3464 4.1599 47.3667 5.10119L24.9469 26.6418C24.1616 27.3963 22.917 27.3838 22.147 26.6138Z" fill="#99272C" />
  </svg>
);

type HeavyMetalItem = {
  name: string;
  value: string;
  valueClassName: string;
   valueStyle?: React.CSSProperties; // ✅ add this
  textStyle?: React.CSSProperties;  // optional
  textClassName: string;

};

type MetalCardItem = {
  name: string;
  ppm: string;
  className: string;
  valueStyle?: React.CSSProperties;
};

type ReportDetailsSectionProps = {
  quickViewPackage?: string;
  heavyMetals: HeavyMetalItem[];
  oilIndicator: {
    crudeOil: string;
    petroleum: string;
    crudeOilClassName: string;
    petroleumClassName: string;
  };
  preciousMetals: MetalCardItem[];
  rareEarthElements: MetalCardItem[];
  appUrl?: string;
};

const ReportDetailsSection = ({
  quickViewPackage = "premium",
  heavyMetals,
  oilIndicator,
  preciousMetals,
  rareEarthElements,
  appUrl = '',
}: ReportDetailsSectionProps) => {
  
  const showHeavyMetals = quickViewPackage === "premium" || quickViewPackage === "hs_base" || quickViewPackage === "hs_plus";
  const showOilIndicator = quickViewPackage === "premium" || quickViewPackage === "treasure_plus" || quickViewPackage === "hs_plus";
  const showPreciousMetals =
    quickViewPackage === "premium" || quickViewPackage === "treasure_base" || quickViewPackage === "treasure_plus";
  const showRareEarthElements = (quickViewPackage === "premium" || quickViewPackage === "treasure_plus") && rareEarthElements.length > 0;
  const hasTopRow = showHeavyMetals || (showOilIndicator && quickViewPackage !== "hs_plus");
  const showOilAsInfoBlock = showOilIndicator && quickViewPackage === "hs_plus";
  const topInfoRowHasBorder = showOilAsInfoBlock || showPreciousMetals || showRareEarthElements;

  const formatHeavyMetalValue = (val: string) => {
    if (!val) return '';
    const cleaned = val.replace(/\s+/g, '');
    const m = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (!m) return cleaned.replace('ppm', ' ppm');
    const num = Number(m[0]);
    if (Number.isNaN(num)) return cleaned.replace('ppm', ' ppm');
    if (num === 0) return <span className="not-detected">Not detected</span>;
    if (Number.isInteger(num)) return `${num} ppm`;
    return `${parseFloat(num.toFixed(2)).toString()} ppm`;
  };

  // Plain-text formatter for use in inline labels/buttons (no JSX span)
  const formatHeavyMetalValueText = (val: string) => {
    if (!val) return '';
    const cleaned = val.replace(/\s+/g, '');
    const m = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (!m) return cleaned.replace('ppm', ' ppm');
    const num = Number(m[0]);
    if (Number.isNaN(num)) return cleaned.replace('ppm', ' ppm');
    if (num === 0) return 'not detected';
    if (Number.isInteger(num)) return `${num} ppm`;
    return `${parseFloat(num.toFixed(2)).toString()} ppm`;
  };

  const formatOilText = (txt: string): React.ReactNode => {
    if (!txt) return '';
    // If label:value format, keep label and format the value separately
    const parts = txt.match(/^([^:]+):\s*(.+)$/);
    if (parts) {
      // For oil buttons we prefer plain text for reliability inside button containers
      return (
        <>
          <span className="oil_btn_label">{parts[1]} :</span>
          <span className="oil_btn_value">{formatHeavyMetalValueText(parts[2])}</span>
        </>
      );
    }

    // Otherwise try to find a numeric value inside the string and replace it
    const m = txt.match(/-?\d+(?:\.\d+)?/);
    if (!m) return txt;
    const idx = txt.indexOf(m[0]);
    const before = txt.slice(0, idx);
    const after = txt.slice(idx + m[0].length);
    return (
      <>
        {before}
        {formatHeavyMetalValueText(m[0])}
        {after}
      </>
    );
  };

  const renderHeavyMetals = () => (
    <div className="heavy_metals_block">
      <h2 className="report_main_heading">Heavy Metals</h2>
      <div className="metal_list_item_wrapper">
        {heavyMetals.map((item) => (
          <div className="metal_list_item" key={item.name}>
            <span className={`val_box ${item.valueClassName}`} style={{ backgroundColor: item.valueStyle?.backgroundColor }}>
              {formatHeavyMetalValue(item.value)}
            </span>{" "}
            <span className={`metal_txt ${item.textClassName}`} style={{ color: item.valueStyle?.color }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSplitOilButton = (text: string, className: string) => {
    const formatOilText = (txt: string) => {
      // If label:value format, keep label and format the value separately
      const parts = txt.match(/^([^:]+):\s*(.+)$/);
      if (parts) {
        return (
          <>
            <span className="oil_btn_label">{parts[1]} :</span>
            <span className="oil_btn_value">{formatHeavyMetalValue(parts[2])}</span>
          </>
        );
      }

      // Otherwise try to find a numeric value inside the string and replace it
      const m = txt.match(/-?\d+(?:\.\d+)?/);
      if (!m) return txt;
      const idx = txt.indexOf(m[0]);
      const before = txt.slice(0, idx);
      const after = txt.slice(idx + m[0].length);
      return (
        <>
          {before}
          {formatHeavyMetalValue(m[0])}
          {after}
        </>
      );
    };

    // Use the same container for both simple and split displays so styling remains consistent
    return <div className={`oil_btn ${className}`}>{formatOilText(text)}</div>;
  };

  const renderOilIndicator = () => (
    <div className="oil_indicator_block">
      <h2 className="report_main_heading">Oil Indicator</h2>
        <div className="oil_indicator_buttons">
        <div className={`oil_btn ${oilIndicator.crudeOilClassName}`}>{formatOilText(oilIndicator.crudeOil)}</div>
        {renderSplitOilButton(oilIndicator.petroleum, oilIndicator.petroleumClassName)}
      </div>
    </div>
  );

  const renderCrudeOilIndicator = () => (
    <div className="oil_indicator_block oil_indicator_block_crude_only">
      <h2 className="report_main_heading">Oil Indicator</h2>
        <div className="oil_indicator_buttons">
        <div className={`oil_btn ${oilIndicator.crudeOilClassName}`}>{formatOilText(oilIndicator.crudeOil)}</div>
      </div>
    </div>
  );

  const petroleumValue = (() => {
    const value = oilIndicator.petroleum.replace(/^petroleum(?:\s+contaminants?)?:\s*/i, "").trim();
    return value.toLowerCase() === "none" ? "None Detected" : value || oilIndicator.petroleum;
  })();

  const renderPetroleumIndicator = () => (
    <div className="oil_indicator_block oil_indicator_block_compact">
      <h2 className="report_main_heading">Oil Indicator</h2>
      <div className="petroleum_indicator_card">
        <span>Petroleum<br />Contaminants:</span>
        <strong>{petroleumValue}</strong>
      </div>
    </div>
  );
  
  return (
    <section className={`report_details_section quick_look_section ${((quickViewPackage || "").toLowerCase().replace(/\s+/g, "_"))}`}>
      <div className="container">
        <div className="report_flex_row">
          <div className="report_left_col">
            <h1 className="quick_look_title">Quick Look</h1>
            {/* name and package label removed per request */}
            <h2 className="report_main_heading">Element Breakdown Fingerprint</h2>
            <div className="chart_wrapper">
              <canvas id="element_layered_chart"></canvas>
            </div>
            <div className="chart_legend">
              <span className="legend_item"><span className="box_below"></span>Below Average</span>
              <span className="legend_item"><span className="box_ref"></span>Average</span>
              <span className="legend_item"><span className="box_above"></span>Above Average</span>
            </div>
            <div className="chart_footer_divider"></div>
            <div className="chart_footer_text">
              <p>Every sample has a fingerprint. This is yours—each element is plotted against an average reference range, so you can see at a glance what's below, within, or above what's commonly found in soil.</p>
            </div>
          </div>

          <div className="report_right_col">
            {hasTopRow && (
              <div
                className={`top_info_row ${showHeavyMetals && showOilIndicator && quickViewPackage === "premium" ? "" : "single_info_row"} ${
                  topInfoRowHasBorder ? "" : "no_border"
                }`}
              >
                {showHeavyMetals && renderHeavyMetals()}
                {showHeavyMetals && showOilIndicator && quickViewPackage === "premium" && <div className="vertical_divider"></div>}
                {showOilIndicator && quickViewPackage === "premium" && renderOilIndicator()}
                {showOilIndicator && quickViewPackage === "treasure_plus" && renderCrudeOilIndicator()}
                <img src={`${appUrl ? appUrl : ''}/images/treasure-icon.svg`} className="treasure_icon" alt="Icon" />
              </div>
            )}

            {showOilAsInfoBlock && (
              <div className={`info_block ${!showPreciousMetals && !showRareEarthElements ? "no_border" : ""}`}>
                {renderPetroleumIndicator()}
              </div>
            )}

            {showPreciousMetals && (
              <div className={`info_block ${!showRareEarthElements ? "no_border" : ""}`}>
                <h2 className="report_main_heading">Precious Metals</h2>
                <div className="circles_flex">
                  {preciousMetals.map((item) => (
                    <div
                      className={`metal_circle ${item.className}`}
                      style={{ backgroundColor: item.valueStyle?.backgroundColor }}
                      key={item.name}
                    >
                      {item.name}
                      <br />
                      <span>{formatHeavyMetalValue(item.ppm)}</span>
                    </div>
                  ))}
                </div>
                <img src={`${appUrl ? appUrl : ''}/images/treasure-icon.svg`} className="treasure_icon" alt="Icon" />
              </div>
            )}

            {showRareEarthElements && (
              <div className="info_block no_border">
                <h2 className="report_main_heading">Rare Earth Elements</h2>
                <div className="circles_flex">
                  {rareEarthElements.map((item) => (
                    <div
                      className={`metal_circle ${item.className}`}
                      style={{ backgroundColor: item.valueStyle?.backgroundColor }}
                      key={item.name}
                    >
                      {item.name}
                      <br />
                      <span>{formatHeavyMetalValue(item.ppm)}</span>
                    </div>
                  ))}
                </div>
                <img src={`${appUrl ? appUrl : ''}/images/treasure-icon.svg`} className="treasure_icon" alt="Icon" />
              </div>

              

            )}
          </div>
        </div>

        <div className="dive_deeper_wrap">
          <p className="dive_text">Dive deeper below</p>
          <div className="dive_arrow">
            <a href="#total_element_breakdown_section" className="dive_arrow_link">
              <DiveArrow />
            </a>
          </div>
        </div>
      </div>
  
      <img src={`${appUrl ? appUrl : ''}/images/quick-look-icon.svg`} className="quick_look_icon" alt="Quick look icon" />

      

    </section>
  );
};

export default ReportDetailsSection;
