type MainBannerSectionProps = {
  name: string;
  subtitle: string;
};

const MainBannerSection = ({ name, subtitle }: MainBannerSectionProps) => {
  return (
    <section className="main_banner_section">
      <div className="container">
        <div className="banner_content">
          <h1 className="banner_title">Hi {name},</h1>
          <p className="banner_subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default MainBannerSection;
