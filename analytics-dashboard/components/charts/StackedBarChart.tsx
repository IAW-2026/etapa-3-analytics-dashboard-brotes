"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Series {
  key: string;
  label: string;
  color: string;
}

interface StackedBarChartProps {
  data: Record<string, string | number>[];
  labelKey: string;
  series: Series[];
  height?: number;
}

export default function StackedBarChart({
  data,
  labelKey,
  series,
  height = 220,
}: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF3E6" vertical={false} />
        <XAxis dataKey={labelKey} tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} width={32} />
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #CDE5C1", borderRadius: 8, fontSize: 12 }}
        />
        <Legend
          formatter={(value) => {
            const s = series.find((s) => s.key === value);
            return <span style={{ fontSize: 11, color: "#4C6B3D" }}>{s?.label ?? value}</span>;
          }}
        />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId="a"
            fill={s.color}
            radius={i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            name={s.key}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}