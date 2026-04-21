const metals = [
  { key: "gold", name: "Gold", symbol: "Ag" },
  { key: "platinum", name: "Platinum", symbol: "Pt" },
  { key: "rhodium", name: "Rhodium", symbol: "Rh" },
  { key: "silver", name: "Silver", symbol: "Au" },
  { key: "palladium", name: "Palladium", symbol: "Pd" },
  { key: "osmium", name: "Osmium", symbol: "Os" },
  { key: "ruthenium", name: "Ruthenium", symbol: "Ru" },
  { key: "iridium", name: "Iridium", symbol: "Ir" },
];

const PreciousMetalsSection = () => {
  return (
    <section className="precious_metals_section">
      <div className="container">
        <div className="top_shapes_wrapper">
          {metals.map((m) => (
            <div className="shape_column" key={`shape-${m.key}`}>
              <div className={`shape_item shape_${m.key}`}></div>
            </div>
          ))}
        </div>

        <div className="text_content">
          <h3 className="main_title">
            Precious Metals <br />NOT Present!
          </h3>
          <p className="sub_title">That's unfortunate</p>
        </div>

        <div className="bottom_bars_wrapper">
          {metals.map((m) => (
            <div className="bar_column" key={`bar-${m.key}`}>
              <div className={`bar_item bar_${m.key}`}></div>
              <div className="bar_label">
                {m.name}<span>({m.symbol})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreciousMetalsSection;
