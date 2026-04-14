interface ElementRow {
  symbol: string;
  name: string;
  bgClass: string;
  textClass: string;
}

const ElementColumn = ({ data }: { data: ElementRow[] }) => (
  <div className="element_column">
    {data.map((el, i) => (
      <div className="element_row" key={i}>
        <span className={`element_badge ${el.bgClass}`}>{el.symbol}</span>
        <span className={`element_label ${el.textClass}`}>{el.name}</span>
      </div>
    ))}
  </div>
);

type NotFoundElementsListSectionProps = {
  elements: ElementRow[];
};

const NotFoundElementsListSection = ({ elements }: NotFoundElementsListSectionProps) => {
  return (
    <section className="not_found_elements_list_section">
      <div className="container">
        <h2 className="section_title">Elements Not Found</h2>
        <div className="elements_grid">
          <ElementColumn data={elements} />
          <ElementColumn data={elements} />
          <ElementColumn data={elements} />
          <ElementColumn data={elements} />
        </div>
      </div>
    </section>
  );
};

export default NotFoundElementsListSection;
