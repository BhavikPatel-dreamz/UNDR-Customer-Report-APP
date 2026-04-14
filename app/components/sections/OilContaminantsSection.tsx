type OilContaminantsSectionProps = {
  status: string;
  value: string;
};

const OilContaminantsSection = ({ status, value }: OilContaminantsSectionProps) => {
  return (
    <section className="oil_contaminants_section">
      <div className="container">
        <h2 className="oil_main_heading">Oil Contaminants</h2>
        <div className="oil_info_card">
          <div className="oil_card_content">
            <span className="oil_label">Crude oil:</span>
            <div className="oil_value_row">
              <span className="oil_found_text">{status}</span>
              <span className="oil_ppm_value">{value}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OilContaminantsSection;
