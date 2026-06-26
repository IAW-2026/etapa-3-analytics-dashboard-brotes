import DonutChart from "@/components/charts/DonutChart";

export interface DonutLegendItem {
  label: string;
  value: number;
  color: string;
}

interface DonutWithLegendProps {
  data: DonutLegendItem[];
  legendLayout?: "list" | "grid-2";
  capitalizeLabels?: boolean;
}

export default function DonutWithLegend({
  data,
  legendLayout = "list",
  capitalizeLabels = false,
}: DonutWithLegendProps) {
  return (
    <>
      <DonutChart data={data} />
      <div
        className={
          legendLayout === "grid-2"
            ? "mt-3 grid grid-cols-2 gap-1"
            : "mt-3 space-y-1"
        }
      >
        {data.map((d) => (
          <div
            key={d.label}
            className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]"
          >
            <span
              className="w-2 h-2 rounded-sm flex-shrink-0"
              style={{ background: d.color }}
            />
            <span className={capitalizeLabels ? "capitalize" : undefined}>
              {d.label} — {d.value}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
}