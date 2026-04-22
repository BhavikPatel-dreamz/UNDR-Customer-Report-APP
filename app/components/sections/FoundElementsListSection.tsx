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
  return (
    <section className="found_elements_list_section">
      <div className="container">
        <h2 className="section_main_title">Complete List of<br /> Elements in your Sample</h2>
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
                <span className="dropdown_icon"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundElementsListSection;
