"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TICK_FORMATTERS, type FormatStyle } from "./formatters";

interface LineChartProps {
  data: Record<string, string | number>[];
  dataKey: string;
  labelKey: string;
  color?: string;
  height?: number;
  filled?: boolean;
  formatStyle?: FormatStyle;   // ← reemplaza a tickFormatter
}

export default function SimpleLineChart({
  data,
  dataKey,
  labelKey,
  color = "#4C6B3D",
  height = 200,
  filled = false,
  formatStyle,
}: LineChartProps) {
  const tickFormatter = formatStyle ? TICK_FORMATTERS[formatStyle] : undefined;

  const common = {
    data,
    margin: { top: 4, right: 4, left: 0, bottom: 0 },
  };

  const axes = (
    <>
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
        width={48}
        tickFormatter={formatter}
      />
      <Tooltip
        formatter={formatter ? (v) => formatter(Number(v)) : undefined}             
        contentStyle={{ background: "#fff", border: "1px solid #CDE5C1", borderRadius: 8, fontSize: 12 }}
      />
    </>
  );

  if (filled) {
    const fillColor = color + "15"; // 15 = ~8% opacity hex
    return (
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart {...common}>
          {axes}
          <defs>
            <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#fill-${dataKey})`}
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart {...common}>
        {axes}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.8}
          dot={{ fill: color, r: 3 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}