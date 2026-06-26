interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  tooltip?: string;
}

export default function KpiCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  tooltip,
}: KpiCardProps) {
  const deltaColor =
    deltaType === "up"
      ? "text-[#4C6B3D]"
      : deltaType === "down"
        ? "text-[#E07A5F]"
        : "text-[#7BA05D]";

  return (
    <div className="bg-white border border-[#CDE5C1] rounded-xl p-4" title={tooltip}>
      <p className="text-[10px] font-medium tracking-widest uppercase text-[#7BA05D] mb-1.5">
        {label}
      </p>
      <p className="text-[22px] font-medium text-[#243B27] leading-none mb-1">
        {value}
      </p>
      {delta && <p className={`text-[11px] ${deltaColor}`}>{delta}</p>}
    </div>
  );
}
