interface ElementRow {
  valueStyle: any;
  symbol: string;
  name: string;
  bgClass: string;
  textClass: string;
}

const ElementColumn = ({ data }: { data: ElementRow[] }) => (
  <div className="element_column">
    {data.map((el, i) => (
      <div className="element_row" key={i}>
        <span className={`element_badge ${el.bgClass}`} style={{ backgroundColor: el.valueStyle?.backgroundColor }}>{el.symbol}</span>
        <span className={`element_label ${el.textClass}`} style={{ color: el.valueStyle?.color }}>{el.name}</span>
      </div>
    ))}
  </div>
);



type NotFoundElementsListSectionProps = {
  elements: ElementRow[];
};
const splitIntoColumns = (data: ElementRow[], colCount: number) => {
  const columns: ElementRow[][] = Array.from({ length: colCount }, () => []);

  data.forEach((item, index) => {
    columns[index % colCount].push(item);
  });

  return columns;
};

const NotFoundElementsListSection = ({ elements }: NotFoundElementsListSectionProps) => {
  const columns = splitIntoColumns(elements, 4);

  return (
    <section className="not_found_elements_list_section">
      <div className="container">
        <h2 className="section_title">Elements Not Found</h2>

        <div className="elements_grid">
          {columns.map((col, i) => (
            <ElementColumn key={i} data={col} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NotFoundElementsListSection;
