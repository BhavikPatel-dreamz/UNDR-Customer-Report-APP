import DiveArrow from './DiveArrow';

const PreciousMetalPresentSection = () => {
  return (
    <section className="precious_metal_present_section">
      <div className="container">
        <div className="header_content">
          <h2 className="main_title">Precious Metals<br /> Present!</h2>
          <p className="sub_text">Detected in your sample<br /> at trace levels</p>
        </div>
        <div className="graph_container" id="graph_wrapper">
          <div className="graph_bar_wrapper" id="master_bar_layout" style={{ display: 'none' }}>
            <div className="bar_body">
              <span className="ppm_value"></span>
            </div>
            <div className="label_container">
              <span className="metal_full_name"></span>
              <span className="metal_short_symbol"></span>
            </div>
          </div>
        </div>
        <div className="report_details_section">
          <div className="dive_deeper_wrap">
            <p className="dive_text">More below</p>
            <div className="dive_arrow"><DiveArrow /></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreciousMetalPresentSection;
