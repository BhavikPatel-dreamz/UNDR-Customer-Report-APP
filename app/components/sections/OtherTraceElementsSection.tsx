const OtherTraceElementsSection = () => {
  return (
    <section className="elemental_breakdown_section other_trace_elements_section">
      <div className="container">
        <div className="element_breakdown_wrapper">
          <div className="report_left_content">
            <div>
              <h1 className="report_title">Other Trace Elements</h1>
              <h2 className="report_subtitle">Elements in <br />
  smaller quantities</h2>
            </div>
             <div className="report_footer_info">
              <p className="footer_text">Full List of elements at the end of this report</p>
              <h3 className="detailed_summary_btn">Detailed summary</h3>
              <div className="arrow_down_icon">
                <svg width="51" height="18" viewBox="0 0 51 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.33398 1.3335L25.3337 16.6669L48.834 1.3335" stroke="#808285" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="report_right_chart" id="trace-chart"></div>
        </div>
      </div>
    </section>
  );
};

export default OtherTraceElementsSection;
