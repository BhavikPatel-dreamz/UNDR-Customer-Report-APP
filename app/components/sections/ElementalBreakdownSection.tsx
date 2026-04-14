const ElementalBreakdownSection = () => {
  return (
    <section className="elemental_breakdown_section">
      <div className="container">
        <div className="element_breakdown_wrapper">
          <div className="report_left_content">
            <h1 className="report_title">Total Elemental Breakdown</h1>
            <h2 className="report_subtitle">Elements we found in your land</h2>
            <p className="report_description">
              Big numbers don't always tell the full story. Some elements appear in higher amounts, while
              others—though smaller—may have greater significance.
            </p>
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
          <div className="report_right_chart" id="main-chart"></div>
        </div>
      </div>
    </section>
  );
};

export default ElementalBreakdownSection;
