const mineralResources = [
  {
    title: "Property titles and mineral rights.",
    body: "In many parts of the U.S., the rights to what's on a piece of land and the rights to what's under it can be owned separately—that's called a mineral rights split. Property titles often indicate whether mineral rights are included with the surface rights or held by someone else. It's usually the first place this information shows up.",
  },
  {
    title: "Mineral rights attorneys.",
    body: "When a title is unclear or silent on mineral rights, attorneys who specialize in this area do the research to trace ownership back through public records. It's a niche specialty—not every real estate lawyer handles it. People with questions about who actually owns the mineral rights under their land often start here.",
  },
  {
    title: "Geological surveying companies.",
    body: "Geological surveyors map what's underground—how much of a given resource might be present, how deep it sits, and how it's distributed. They use tools like core sampling, seismic imaging, and geochemical analysis. This is the step where curiosity turns into real data about a deposit's size and shape.",
  },
  {
    title: "Prospecting communities.",
    body: "Prospecting organizations are membership-based groups of hobbyists and professionals who share knowledge, host events, and sometimes provide access to claim sites. People drawn to the hands-on side of things—the curious, the weekend explorers—often find their way into these communities.",
  },
  {
    title: "Mining claim filing services.",
    body: "Claim filing services handle the paperwork to stake and register a claim with the appropriate government agency. It's a path people explore when they're interested in pursuing a find on public land, or when they're looking at land where the mineral rights aren't already held by someone else.",
  },
];

const contaminantResources = [
  {
    title: "The Environmental Protection Agency (EPA) and state environmental agencies.",
    body: "The EPA and state-level environmental agencies publish public guidance on common contaminants, typical exposure levels, and what different findings generally mean. Many states also run follow-up testing programs for residents, sometimes at no cost. People looking for free, reliable background information often find it here.",
  },
  {
    title: "Environmental consultants.",
    body: "Environmental consulting firms help interpret results and build a plan. They don't do the cleanup work themselves—they assess the situation, identify likely sources, and recommend a course of action to their clients. People who want expert eyes on a finding before taking any next steps often engage a consultant first.",
  },
  {
    title: "Environmental remediation companies.",
    body: "Remediation companies are the ones who actually do the cleanup work—removing contaminated soil, treating it on-site, or capping affected areas. Most residential situations don't call for this level of intervention, but it's one of the categories that exists in this space.",
  },
  {
    title: "Storage tank specialists.",
    body: "When petroleum contamination shows up in residential soil, a leaking underground storage tank is one of the more common sources—especially on older properties that once used oil heating. Storage tank specialists locate, inspect, and (when needed) remove or replace these tanks.",
  },
  {
    title: "Environmental insurance.",
    body: "Some insurance providers offer policies that cover unexpected environmental hazards and remediation costs. It's a category that tends to come up when people are thinking about long-term liability or protection against future exposure on a property.",
  },
];

const AdditionalResourcesSection = () => {
  return (
    <>
      <section className="heavy_metal_breakdown_section additional_resources_heading_section">
        <div className="container">
          <div className="heavy_metal_inner_wrapper additional_resources_header">
            <div className="heavy_metal_content_left additional_resources_header_left">
              <h2 className="heavy_metal_title additional_resources_title">Additional<br />Resources</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="additional_resources_section">
        <div className="container">
          <div className="additional_resources_body">
            <div className="additional_resources_intro">
              <h3>So there’s something interesting in your soil sample?</h3>
              <p>
                If your report flagged traces of precious metals or rare earth elements, or showed signs of crude oil,
                there&apos;s a whole world of people and companies that work in this space. This page is a
                plain-language tour of who they are and what they do.
              </p>
              <p>
                One thing worth keeping in mind: UNDR reports are educational. A finding in a sample is a starting point
                for curiosity, not a guarantee of a deposit and not a valuation. Everything below exists because the
                question &quot;what&apos;s actually down there, and is it worth anything?&quot; is a surprisingly
                complicated one.
              </p>
            </div>

            <div className="additional_resources_list">
              {mineralResources.map((item, index) => (
                <article className="additional_resource_item" key={item.title}>
                  <h4>{index + 1}. {item.title}</h4>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>

            <div className="additional_resources_intro contaminants">
              <h3>Elevated contaminants in your sample?</h3>
              <p>
                If your report flagged elevated levels of heavy metals or signs of petroleum contamination, the good news
                is that this is well-trodden territory. There&apos;s an entire industry built around understanding and
                addressing contamination in residential soil. This page is a plain-language tour of who they are and what
                they do.
              </p>
              <p>
                One thing worth keeping in mind: UNDR reports are educational. A finding in a sample is a starting point
                for curiosity, not a guarantee of a deposit and not a valuation. Everything below exists because the
                question &quot;what&apos;s actually down there, and is it worth anything?&quot; is a surprisingly
                complicated one.
              </p>
            </div>

            <div className="additional_resources_list">
              {contaminantResources.map((item, index) => (
                <article className="additional_resource_item" key={item.title}>
                  <h4>{index + 1}. {item.title}</h4>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>

            <div className="additional_resources_disclaimer">
              <h3>Important—About the Resources Above:</h3>
              <p>
                The resources and information provided in this section are offered solely for general educational and informational purposes. Any mention of regulatory agencies, regulatory thresholds, professional services, service providers, industries, costs, potential sources, or potential next steps is provided solely for educational and comparative purposes and should not be construed as any kind of advice, recommendation, endorsement, regulatory guidance, compliance advice, diagnostic interpretation, or a substitute for consultation with qualified professionals. Descriptions of third-party services, programs, industries, or categories are general in nature and may not reflect current offerings, availability, costs, or suitability for your specific situation. UNDR CO is not advising you to take any particular action based on your results and does not endorse any specific service provider, program, or course of action. Before making any decision relating to land use, mineral exploration, mining claims, environmental remediation, property transactions, regulatory compliance, health considerations, insurance, or financial investment, you must consult qualified licensed professionals (including licensed geologists, environmental consultants, attorneys, financial advisors, insurance professionals, and medical professionals as applicable) and appropriate federal, state, and local governmental authorities. Any decision you make regarding your results is your own, based on your independent judgment and the advice of qualified professionals you engage. See the full Master Disclaimer at <a href="https://www.undrco.com/disclaimer">www.undrco.com/disclaimer</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdditionalResourcesSection;
