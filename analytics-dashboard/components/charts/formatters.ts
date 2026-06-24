
export type FormatStyle = "currency-k" | "currency-ars" | "plain";

export const TICK_FORMATTERS: Record<FormatStyle, (v: number) => string> = {
  "currency-k": (v) => `$${(v / 1000).toFixed(1)}K`,
  "currency-ars": (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v.toLocaleString("es-AR")}`;
  },
  plain: (v) => String(v),
};