type PetroleumContaminantsSectionProps = {
  appUrl?: string;
};

const PetroleumContaminantsSection = ({ appUrl = '' }: PetroleumContaminantsSectionProps) => {
  return (
    <section className="heavy_metal_breakdown_section petroleum_contaminants_section">
      <div className="container">
        <div className="heavy_metal_inner_wrapper">
          <div className="heavy_metal_content_left">
            <h2 className="heavy_metal_title">Petroleum<br />Contaminants</h2>
          </div>
        </div>
      </div>

  {/* appUrl defaults to '' so this resolves to '/images/pc-icon.svg' when empty */}
  <img src={`${appUrl}/images/pc-icon.svg`} className="pc_icon" alt="Icon" />

    </section>
  );
};

export default PetroleumContaminantsSection;
