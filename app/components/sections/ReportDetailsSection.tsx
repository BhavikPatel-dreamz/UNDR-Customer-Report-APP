import * as React from 'react';

const DiveArrow = () => (
  <svg width="49" height="28" viewBox="0 0 49 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.147 26.6138L0.925214 5.39201C-0.166581 4.30022 -0.309023 2.57912 0.588426 1.32269C1.18133 0.492628 2.1386 0 3.15866 0H45.3132C46.3768 0 47.3589 0.569918 47.8866 1.4934C48.5606 2.67302 48.3464 4.1599 47.3667 5.10119L24.9469 26.6418C24.1616 27.3963 22.917 27.3838 22.147 26.6138Z" fill="#99272C" />
  </svg>
);

const ShareBar = () => {
  const [copied, setCopied] = React.useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }).catch(() => { });
    }
  };

  const encoded = encodeURIComponent(url);
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 20px",
    margin: "0 auto",
    width: "fit-content",
    flexWrap: "wrap",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#888",
    marginRight: 4,
    whiteSpace: "nowrap",
  };

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.15)",
    background: "#fff",
    color: "#333",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    lineHeight: 1,
  };

  const copyBtnStyle: React.CSSProperties = {
    ...btnStyle,
    fontSize: 16,
    padding: 0,
  };

  const copiedStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#2a7a2a",
    marginLeft: 8,
  };

  return (
    <div className="report_share_bar" style={containerStyle}>
      <span className="share_label" style={labelStyle}>Share this report</span>
      <a
        className="share_btn"
        style={btnStyle}
        href={`https://twitter.com/intent/tweet?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        𝕏
      </a>
      <a
        className="share_btn"
        style={btnStyle}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        f
      </a>
      <a
        className="share_btn"
        style={btnStyle}
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        in
      </a>
      <a
        className="share_btn"
        style={btnStyle}
        href={`https://wa.me/?text=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        W
      </a>
      <a
        className="share_btn"
        style={btnStyle}
        href={`mailto:?subject=Check%20out%20this%20report&body=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share by email"
      >
        ✉
      </a>
      <button type="button" className="share_btn share_btn_copy" style={copyBtnStyle} onClick={copy} aria-label="Copy link">
        🔗
      </button>
      {copied && <span className="share_copied" style={copiedStyle}>Link copied!</span>}
    </div>
  );
};

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
    // If the value indicates "less than" the detection limit (e.g. "<0.1"),
    // treat as not detected and do not display a numeric value.
    if (cleaned.includes('<')) return <span className="not detected">Not detected</span>;
    // Preserve explicit 'None Detected' text (including compacted forms like 'NoneDetected')
    if (/^nonedetected$/i.test(cleaned)) return <span className="not detected">None Detected</span>;
    const m = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (!m) return cleaned.replace('ppm', ' ppm');
    const num = Number(m[0]);
    if (Number.isNaN(num)) return cleaned.replace('ppm', ' ppm');
    if (num === 0) return <span className="not detected">Not detected</span>;
    if (Number.isInteger(num)) return `${num} ppm`;
    return `${parseFloat(num.toFixed(2)).toString()} ppm`;
  };

  // Plain-text formatter for use in inline labels/buttons (no JSX span)
  const formatHeavyMetalValueText = (val: string) => {
    if (!val) return '';
    const cleaned = val.replace(/\s+/g, '');
    // Respect detection-limit markers ("<...") by reporting as not detected.
    if (cleaned.includes('<')) return 'not detected';
    if (/^nonedetected$/i.test(cleaned)) return 'None Detected';
    const m = cleaned.match(/-?\d+(?:\.\d+)?/);
    if (!m) return cleaned.replace('ppm', ' ppm');
    const num = Number(m[0]);
    if (Number.isNaN(num)) return cleaned.replace('ppm', ' ppm');
    if (num === 0) return 'not detected';
    if (Number.isInteger(num)) return `${num} ppm`;
    return `${parseFloat(num.toFixed(2)).toString()} ppm`;
  };

  const stripLeadingPpm = (text: string) => text.replace(/^\s*ppm\b/i, '');

  const formatOilText = (txt: string): React.ReactNode => {
    if (!txt) return '';
    // Normalize compacted 'NoneDetected' everywhere
    txt = txt.replace(/none\s*detected/i, 'None Detected');
    // If label:value format, keep label and format the value separately
    const parts = txt.match(/^([^:]+):\s*(.+)$/);
    if (parts) {
      // For oil buttons we prefer plain text for reliability inside button containers
      const val = parts[2].replace(/none\s*detected/i, 'None Detected');
      return (
        <>
          <span className="oil_btn_label">{parts[1]} :</span>
          <span className="oil_btn_value">{formatHeavyMetalValueText(val)}</span>
        </>
      );
    }

    // Otherwise try to find a numeric value inside the string and replace it
    const m = txt.match(/-?\d+(?:\.\d+)?/);
    if (!m) return txt;
    const idx = txt.indexOf(m[0]);
    const before = txt.slice(0, idx);
    const after = stripLeadingPpm(txt.slice(idx + m[0].length));
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
        {
          // Only show heavy metals that have a numeric ppm > 0. If none detected,
          // fall back to showing Arsenic, Lead, and Uranium.
          (() => {
            const nonZero = heavyMetals.filter((item) => {
              const m = (item.value || '').replace(/\s+/g, '').match(/-?\d+(?:\.\d+)?/);
              return !!m && Number(m[0]) > 0;
            });
            let metalsToShow = [];
            if (nonZero.length > 0) {
              metalsToShow = nonZero;
            } else {
              // Ensure the default three appear: Arsenic, Lead, Uranium.
              const defaults = ['Arsenic', 'Lead', 'Uranium'];
              metalsToShow = defaults.map((name) => {
                const found = heavyMetals.find((h) => h.name === name);
                if (found) return found;
                // placeholder for missing default: will render as "Not detected"
                return {
                  name,
                  value: '0.000 ppm',
                  valueClassName: '',
                  valueStyle: {},
                  textClassName: '',
                } as any;
              });
            }

            return metalsToShow.map((item) => (
              <div className="metal_list_item" key={item.name}>
                <span className={`val_box ${item.valueClassName}`} style={{ backgroundColor: item.valueStyle?.backgroundColor }}>
                  {formatHeavyMetalValue(item.value)}
                </span>{" "}
                <span className={`metal_txt ${item.textClassName}`} style={{ color: item.valueStyle?.color }}>
                  {item.name}
                </span>
              </div>
            ));
          })()
        }
      </div>
    </div>
  );

  const renderSplitOilButton = (text: string, className: string) => {
    const formatOilText = (txt: string) => {
      // Normalize compacted 'NoneDetected'
      txt = txt.replace(/none\s*detected/i, 'None Detected');
      // If label:value format, keep label and format the value separately
      const parts = txt.match(/^([^:]+):\s*(.+)$/);
      if (parts) {
        const val = parts[2].replace(/none\s*detected/i, 'None Detected');
        return (
          <>
            <span className="oil_btn_label">{parts[1]} :</span>
            <span className="oil_btn_value">{formatHeavyMetalValue(val)}</span>
          </>
        );
      }

      // Otherwise try to find a numeric value inside the string and replace it
      const m = txt.match(/-?\d+(?:\.\d+)?/);
      if (!m) return txt;
      const idx = txt.indexOf(m[0]);
      const before = txt.slice(0, idx);
      const after = stripLeadingPpm(txt.slice(idx + m[0].length));
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
    const raw = oilIndicator.petroleum || "";
    let value = raw.replace(/^petroleum(?:\s+contaminants?)?\s*:\s*/i, "").trim();
    // Normalize all variants: NoneDetected, nonedetected, None Detected, none
    value = value.replace(/none\s*detected/i, "None Detected");
    const compact = value.replace(/\s+/g, "").toLowerCase();
    if (compact === "none" || compact === "nonedetected") return "None Detected";
    return value || raw;
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
            <div className="chart_legend" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px 20px',
              marginTop: '14px',
              alignItems: 'center',
              fontSize: '13px',
              fontFamily: 'inherit',
              fontWeight: '400',
              color: 'inherit',
            }}>
              {[
                { bg: '#ffffff', border: '1px solid #ccc', label: 'Below −2 SD' },
                { bg: '#e8e8e8', border: 'none', label: '−2 to −1 SD' },
                { bg: '#c7c5c5', border: 'none', label: '−1 to +1 SD (Average)' },
                { bg: '#8b8b8b', border: 'none', label: '+1 to +2 SD' },
                { bg: '#5b5a5a', border: 'none', label: 'Above +2 SD' },
              ].map(({ bg, border, label }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    fontWeight: '400',
                    color: 'inherit',
                    whiteSpace: 'nowrap',
                    letterSpacing: 'normal',
                    lineHeight: '1.4',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '13px',
                      height: '13px',
                      borderRadius: '3px',
                      background: bg,
                      border: border,
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
            <div className="chart_footer_divider"></div>
            <div className="chart_footer_text">
              <p>Every sample has a fingerprint. This is yours—each element is plotted against an average reference range, so you can see at a glance what's below, within, or above what's commonly found in soil.</p>
            </div>
          </div>

          <div className="report_right_col">
            {hasTopRow && (
              <div
                className={`top_info_row ${showHeavyMetals && showOilIndicator && quickViewPackage === "premium" ? "" : "single_info_row"} ${topInfoRowHasBorder ? "" : "no_border"
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
                      {item?.name?.length > 7 ? item.name.slice(0, 7) + ".." : item.name}
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
                      {item?.name?.length > 7 ? item.name.slice(0, 7) + ".." : item.name}
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



      {/* ── social share ── */}
      <ShareBar />

    </section>
  );
};

export default ReportDetailsSection;
