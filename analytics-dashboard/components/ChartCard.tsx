interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-white border border-[#CDE5C1] rounded-xl p-4 ${className}`}>
      <p className="text-sm font-medium text-[#243B27] mb-0.5">{title}</p>
      {subtitle && (
        <p className="text-[11px] text-[#7BA05D] mb-3">{subtitle}</p>
      )}
      {children}
    </div>
  );
}