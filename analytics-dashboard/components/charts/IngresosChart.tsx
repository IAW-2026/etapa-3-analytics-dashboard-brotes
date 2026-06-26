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
import type { Anomalia } from "@/lib/metrics";

interface DataPoint {
  mes: string;
  ingresos: number;
  meta?: number;
  esProyeccion?: boolean;
}

interface IngresosChartProps {
  data: DataPoint[];
  anomalias?: Anomalia[];
  proyeccion?: DataPoint | null;
}

function formatARS(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#CDE5C1] rounded-lg px-3 py-2 text-[11px] shadow-sm">
      <p className="font-medium text-[#243B27] mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name === "ingresos" ? "Ingresos" : entry.name === "meta" ? "Meta" : entry.name === "lineaProyectada" ? "Proyección" : entry.name}: {formatARS(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function IngresosChart({ data, anomalias = [], proyeccion }: IngresosChartProps) {
  const chartData = proyeccion ? [...data, { ...proyeccion, esProyeccion: true }] : data;

  return (
    <div>
      {anomalias.length > 0 && (
        <div className="mb-2 flex items-center gap-2 text-[11px] text-[#E07A5F] bg-[#FFF5F2] rounded-lg px-3 py-1.5">
          <span>⚠️</span>
          <span>
            Meses atípicos:{" "}
            {anomalias.map((a) => (
              <span key={a.index} className="font-medium">
                {a.mes} ({formatARS(a.valor)}){/* */}
              </span>
            )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep-${i}`}> · </span>, el], [] as React.ReactNode[])}
            {" "}— por fuera de la tendencia normal
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAF3E6" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatARS} tick={{ fontSize: 10, fill: "#7BA05D" }} axisLine={false} tickLine={false} width={48} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 11, color: "#4C6B3D" }}>
                {value === "ingresos" ? "Ingresos" : value === "meta" ? "Meta" : value === "lineaProyectada" ? "Proyección" : value}
              </span>
            )}
          />
          <Bar dataKey="ingresos" fill="#4C6B3D" radius={[4, 4, 0, 0]} name="ingresos" />
          <Line dataKey="meta" stroke="#7BA05D" strokeWidth={1.5} strokeDasharray="4 3" dot={{ fill: "#7BA05D", r: 3 }} name="meta" />
          {proyeccion && (
            <Line
              dataKey="proyeccion"
              stroke="#A67C52"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={{ fill: "#A67C52", r: 3 }}
              name="lineaProyectada"
              connectNulls
              data={chartData.map((p) => ({ ...p, proyeccion: p.esProyeccion ? p.ingresos : null }))}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}