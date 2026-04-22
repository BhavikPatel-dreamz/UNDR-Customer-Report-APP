import { ELEMENT_COLOR_MAP } from "./elementColors";

const normalize = (el: string) => el.toLowerCase().trim();

export const mapHeavyMetal = (r: any) => {
  const key = normalize(r.name);

  const colors = ELEMENT_COLOR_MAP[key] ?? ELEMENT_COLOR_MAP.default;

  return {
    name: r.name,
    value: `${r.value} ppm`,
    valueClassName: r.valueClassName,
    textClassName: r.textClassName,
    valueStyle: {
      backgroundColor: colors.bg,
      color: colors.text,
    },
  };
};