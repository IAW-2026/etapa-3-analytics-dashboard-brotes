"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  mes: string;
  ingresos: number;
  meta: number;
}

function formatARS(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

export default function IngresosChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAF3E6" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatARS} tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          formatter={(v) => formatARS(Number(v))}
          contentStyle={{ background: "#fff", border: "1px solid #CDE5C1", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#243B27", fontWeight: 500 }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: 11, color: "#4C6B3D" }}>
              {value === "ingresos" ? "Ingresos" : "Meta"}
            </span>
          )}
        />
        <Bar dataKey="ingresos" fill="#4C6B3D" radius={[4, 4, 0, 0]} name="ingresos" />
        <Line dataKey="meta" stroke="#7BA05D" strokeWidth={1.5} strokeDasharray="4 3" dot={{ fill: "#7BA05D", r: 3 }} name="meta" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}