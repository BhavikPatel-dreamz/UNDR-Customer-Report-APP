import { ELEMENT_BLURBS_BY_SYMBOL } from '../../lib/element-blurbs';

interface ElementItem {
  valueStyle: any;
  symbol: string;
  name: string;
  ppm: string;
  margin: string;
  bgClass: string;
  colorClass: string;
}

type FoundElementsListSectionProps = {
  elements: ElementItem[];
};

const FoundElementsListSection = ({ elements }: FoundElementsListSectionProps) => {
  const elementBlurbsJson = JSON.stringify(ELEMENT_BLURBS_BY_SYMBOL).replaceAll("<", "\\u003c");

  return (
    <section className="found_elements_list_section">
      <div className="container">
        <h2 className="section_main_title">Complete List of<br /> Elements in your Sample</h2>
        <p className="element_click_hint">Click on each element for more information</p>
        <h3 className="section_sub_title">Elements Found</h3>

        <div className="elements_table_wrapper">
          {elements.map((el, i) => (
            <div className="element_item_row" key={i}>
              <div className="element_col_info">
                <span className={`element_symbol_box ${el.bgClass}`}  style={{ backgroundColor: el.valueStyle?.backgroundColor }}
>{el.symbol}</span>
                <h4 className={`element_name_text ${el.colorClass}`}  style={{ color: el.valueStyle?.color }}>{el.name}</h4>
              </div>
              <div className="element_col_data">
                <p className="ppm_value">{el.ppm}</p>
                <p className="margin_value">{el.margin}</p>
              </div>
              <div className="element_col_arrow">
                <button
                  className="element_blurb_button"
                  type="button"
                  data-element-blurb-trigger
                  data-element-symbol={el.symbol}
                  aria-label={`Read more about ${el.name}`}
                >
                  <span className="element_view_icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <script
        id="element-blurbs-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: elementBlurbsJson }}
      />
      <div className="element_blurb_modal" data-element-blurb-modal aria-hidden="true">
        <div className="element_blurb_backdrop" data-element-blurb-close></div>
        <div className="element_blurb_dialog" role="dialog" aria-modal="true" aria-labelledby="element-blurb-title">
          <button className="element_blurb_close" type="button" data-element-blurb-close aria-label="Close element information">×</button>
          <p className="element_blurb_eyebrow" data-element-blurb-symbol></p>
          <h3 className="element_blurb_title" id="element-blurb-title" data-element-blurb-title></h3>
          <div className="element_blurb_content" data-element-blurb-content></div>
        </div>
      </div>
    </section>
  );
};

export default FoundElementsListSection;
