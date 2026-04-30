import type { PreciousMetalGraphItem } from '../../lib/proxy-report-data';

const metals = [
  { key: "gold", name: "Gold", symbol: "Au" },
  { key: "silver", name: "Silver", symbol: "Ag" },
  { key: "platinum", name: "Platinum", symbol: "Pt" },
  { key: "ruthenium", name: "Ruthenium", symbol: "Ru" },
  { key: "rhodium", name: "Rhodium", symbol: "Rh" },
  { key: "palladium", name: "Palladium", symbol: "Pd" },
  { key: "osmium", name: "Osmium", symbol: "Os" },
  { key: "iridium", name: "Iridium", symbol: "Ir" },
];

type PreciousMetalsSectionProps = {
  items: PreciousMetalGraphItem[];
};

const PreciousMetalsSection = ({ items }: PreciousMetalsSectionProps) => {
  const colorBySymbol = new Map(
    items.map((item) => [item.symbol.trim().toLowerCase(), item.color]),
  );

  return (
    <section className="precious_metals_section">
      <div className="container">
        <div className="top_shapes_wrapper">
          {metals.map((m) => {
            const color = colorBySymbol.get(m.symbol.toLowerCase());
            return (
              <div className="shape_column" key={`shape-${m.key}`}>
                <div
                  className={`shape_item shape_${m.key}`}
                  style={color ? { backgroundColor: color } : undefined}
                ></div>
              </div>
            );
          })}
        </div>

        {/* <div className="text_content">
          <h3 className="main_title">
            Precious Metals <br />NOT Present!
          </h3>
          <p className="sub_title">That's unfortunate</p>
        </div> */}

        <div className="bottom_bars_wrapper">
          {metals.map((m) => {
            const color = colorBySymbol.get(m.symbol.toLowerCase());
            return (
              <div className="bar_column" key={`bar-${m.key}`}>
                <div
                  className={`bar_item bar_${m.key}`}
                  style={color ? { backgroundColor: color } : undefined}
                ></div>
                <div className="bar_label">
                  {m.name}<span>({m.symbol})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PreciousMetalsSection;
