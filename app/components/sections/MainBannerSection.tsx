type MainBannerSectionProps = {
  name: string;
  subtitle: string;
};

const MainBannerSection = ({ name, subtitle }: MainBannerSectionProps) => {
  // Keep the full name in the DOM but show only the first name by default.
  // This splits on spaces: firstName is displayed, rest (last name) is wrapped
  // in a span we can hide via CSS so the client can re-enable later if needed.
  const parts = (name || '').split(' ').filter(Boolean);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ');

  return (
    <section className="main_banner_section">
      <div className="container">
        <div className="banner_content">
          <h1 className="banner_title">Hi {firstName}
            {lastName ? <span className="last-name"> {lastName}</span> : null},
          </h1>
          <p className="banner_subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};

export default MainBannerSection;
