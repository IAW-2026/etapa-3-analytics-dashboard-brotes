type ProgressBarVariant = "default" | "green" | "brown" | "terra";

const FILL_COLOR: Record<ProgressBarVariant, string> = {
  default: "bg-[#4C6B3D]",
  green:   "bg-[#7BA05D]",
  brown:   "bg-[#A67C52]",
  terra:   "bg-[#E07A5F]",
};

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  variant?: ProgressBarVariant;
}

export default function ProgressBar({ label, value, variant = "default" }: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#4C6B3D]">{label}</span>
        <span className="text-xs font-medium text-[#243B27]">{Math.round(value)}%</span>
      </div>
      <div className="bg-[#EAF3E6] rounded h-1.5 w-full">
        <div
          className={`h-1.5 rounded ${FILL_COLOR[variant]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}