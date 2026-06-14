"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SimpleBarChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  labelKey: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
  tickFormatter?: (v: number) => string;
}

export default function SimpleBarChart({
  data,
  dataKey,
  labelKey,
  color = "#4C6B3D",
  height = 200,
  horizontal = false,
  tickFormatter,
}: SimpleBarChartProps) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF3E6" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "#7BA05D" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={tickFormatter}
          />
          <YAxis
            dataKey={labelKey}
            type="category"
            tick={{ fontSize: 10, fill: "#7BA05D" }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip
            formatter={tickFormatter ? (v) => tickFormatter(Number(v)) : undefined}
            contentStyle={{ background: "#fff", border: "1px solid #CDE5C1", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF3E6" vertical={false} />
        <XAxis
          dataKey={labelKey}
          tick={{ fontSize: 10, fill: "#7BA05D" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#7BA05D" }}
          axisLine={false}
          tickLine={false}
          width={32}
          tickFormatter={tickFormatter}
        />
        <Tooltip
          formatter={tickFormatter ? (v) => tickFormatter(Number(v)) : undefined}
          contentStyle={{ background: "#fff", border: "1px solid #CDE5C1", borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}