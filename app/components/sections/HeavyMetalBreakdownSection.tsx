type HeavyMetalBreakdownSectionProps = {
  appUrl?: string;
};

const HeavyMetalBreakdownSection = ({ appUrl = '' }: HeavyMetalBreakdownSectionProps) => {
  return (
    <section className="heavy_metal_breakdown_section half">
      <div className="container">
        <div className="heavy_metal_inner_wrapper">
          <div className="heavy_metal_content_left">
            <h2 className="heavy_metal_title">Heavy Metals<br />Breakdown</h2>
          </div>
          <div className="heavy_metal_content_right">
            <p className="heavy_metal_description">
              Among the heavy metals analyzed, chromium, thorium, uranium, arsenic, and lead are the most
              commonly found in land samples.
            </p>
          </div>
        </div>
      </div>

  {/* appUrl defaults to '' so this resolves to '/images/quick-look-icon.svg' when empty */}
  <img src={`${appUrl}/images/hmbh-icon.svg`} className="hmbh_icon" alt="Icon" />

    </section>
  );
};

export default HeavyMetalBreakdownSection;
