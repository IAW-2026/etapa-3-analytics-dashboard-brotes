"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface EstadoSlice {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

const COLORS: Record<string, string> = {
  entregado:  "#4C6B3D",
  enviado:    "#7BA05D",
  confirmado: "#A67C52",
  pendiente:  "#CDE5C1",
  cancelado:  "#E07A5F",
};

// Recharts inyecta estas props en el label render — no están en los tipos públicos
// por eso usamos un tipo local en vez de intentar derivarlo de la librería
interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  porcentaje: number;
  [key: string]: unknown; // Recharts puede pasar props extra
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, porcentaje }: LabelProps) {
  if (porcentaje < 8) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight={500}
    >
      {porcentaje}%
    </text>
  );
}

// El formatter del Tooltip también tiene tipos problemáticos en Recharts
// usamos unknown y casteamos adentro
function tooltipFormatter(value: unknown, name: unknown, data: EstadoSlice[]) {
  const pct = typeof value === "number" ? value : 0;
  const estado = typeof name === "string" ? name : "";
  const cantidad = data.find((d) => d.estado === estado)?.cantidad ?? 0;
  return [`${pct}% (${cantidad} pedidos)`, estado];
}

export default function EstadosPedidosChart({ data }: { data: EstadoSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="porcentaje"
          nameKey="estado"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={85}
          paddingAngle={2}
          labelLine={false}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label={(props: any) => <CustomLabel {...props} />}
        >
          {data.map((slice) => (
            <Cell
              key={slice.estado}
              fill={COLORS[slice.estado] ?? "#D9D9D4"}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => tooltipFormatter(value, name, data)}
          contentStyle={{
            background: "#fff",
            border: "1px solid #CDE5C1",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}