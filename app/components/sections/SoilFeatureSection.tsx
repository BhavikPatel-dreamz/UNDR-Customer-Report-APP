type SoilFeatureItem = {
  title: string;
  description: string;
  cardClassName: string;
};

type SoilFeatureSectionProps = {
  items: SoilFeatureItem[];
};

const SoilFeatureSection = ({ items }: SoilFeatureSectionProps) => {
  return (
    <section className="soil_feature_section">
      <div className="container">
        <div className="soil_wrapper">
          {items.map((item) => (
            <div className={`soil_card ${item.cardClassName}`} key={item.title}>
              <h3 className="soil_title">{item.title}</h3>
              <p className="soil_desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoilFeatureSection;
