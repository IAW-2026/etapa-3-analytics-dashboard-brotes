
export type FormatStyle = "currency-k" | "currency-ars" | "plain" | "percent";

export const TICK_FORMATTERS: Record<FormatStyle, (v: number) => string> = {
  "currency-k": (v) => `$${(v / 1000).toFixed(1)}K`,
  "currency-ars": (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v.toLocaleString("es-AR")}`;
  },
  plain: (v) => String(v),
  percent: (v) => `${v}%`,
};

export const CATEGORY_LABELS: Record<string, string> = {
  suculentas: 'Suculentas',
  plantas_de_interior: 'Plantas de Interior',
  aromaticas: 'Aromáticas',
  frutales: 'Frutales',
  cactus: 'Cactus',
  colecciones_raras: 'Colecciones Raras',
  macetas_y_kits: 'Macetas y Kits',
};

export function formatCategory(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}