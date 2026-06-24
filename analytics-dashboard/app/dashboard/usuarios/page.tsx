import { fetchDashboardData } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import EstadoBadge from "@/components/EstadoBadge";
import DonutChart from "@/components/charts/DonutChart";
import SimpleLineChart from "@/components/charts/LineChart";
import type { Vendedor } from "@/lib/types";

function formatARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-AR")}`;
}

const vendedoresColumns: {
  key: keyof Vendedor;
  header: string;
  render?: (row: Vendedor) => React.ReactNode;
}[] = [
  {
    key: "nombre",
    header: "Vivero",
    render: (r) => <strong>{r.nombre}</strong>,
  },
  { key: "ciudad", header: "Ciudad" },
  { key: "totalProductos", header: "Productos" },
  {
    key: "ventasMes",
    header: "Ventas (mes)",
    render: (r) => formatARS(r.ventasMes),
  },
  {
    key: "estado",
    header: "Estado",
    render: (r) => <EstadoBadge estado={r.estado} />,
  },
];

export default async function UsuariosPage() {
  const { buyer, seller } = await fetchDashboardData();

  const donutData = [
    {
      label: "Activos",
      value: Math.round((buyer.compradoresActivos / buyer.totalCompradores) * 100),
      color: "#4C6B3D",
    },
    {
      label: "Suspendidos",
      value: Math.round((buyer.compradoresSuspendidos / buyer.totalCompradores) * 100),
      color: "#A67C52",
    },
    {
      label: "Eliminados",
      value: Math.round((buyer.compradoresEliminados / buyer.totalCompradores) * 100),
      color: "#D9D9D4",
    },
  ];

  // Acumulado semanal partiendo del total actual hacia atrás
  const base =
    buyer.totalCompradores -
    buyer.registrosPorSemana.reduce((s, v) => s + v, 0);
  const growthData = buyer.registrosPorSemana.reduce<
    { semana: string; total: number }[]
  >((acc, v, i) => {
    const prev = acc[i - 1]?.total ?? base;
    acc.push({ semana: `Sem ${i + 1}`, total: prev + v });
    return acc;
  }, []);

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Usuarios</h1>
        <p className="text-xs text-[#4C6B3D]">
          Compradores y vendedores — Buyer App + Seller App
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Total compradores"
          value={buyer.totalCompradores.toLocaleString("es-AR")}
          delta="+89 este mes"
          deltaType="up"
        />
        <KpiCard
          label="Compradores activos"
          value={buyer.compradoresActivos.toLocaleString("es-AR")}
          delta={`${Math.round(
            (buyer.compradoresActivos / buyer.totalCompradores) * 100
          )}% del total`}
          deltaType="neutral"
        />
        <KpiCard
          label="Suspendidos"
          value={String(buyer.compradoresSuspendidos)}
          delta={`${(
            (buyer.compradoresSuspendidos / buyer.totalCompradores) *
            100
          ).toFixed(1)}% del total`}
          deltaType="down"
        />
        <KpiCard
          label="Eliminados"
          value={String(buyer.compradoresEliminados)}
          delta={`${Math.round(
            (buyer.compradoresEliminados / buyer.totalCompradores) * 100
          )}% del total`}
          deltaType="neutral"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Estado de compradores"
          subtitle="Buyer App — distribución de cuentas"
        >
          <DonutChart data={donutData} />
          <div className="mt-3 space-y-1">
            {donutData.map((d) => (
              <div
                key={d.label}
                className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]"
              >
                <span
                  className="w-2 h-2 rounded-sm flex-shrink-0"
                  style={{ background: d.color }}
                />
                {d.label} — {d.value}%
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Crecimiento semanal de usuarios"
          subtitle="Buyer App — últimas 8 semanas"
        >
          <SimpleLineChart
            data={growthData}
            dataKey="total"
            labelKey="semana"
            color="#4C6B3D"
            height={200}
            filled
          />
        </ChartCard>
      </div>

      {/* Tabla vendedores */}
      <div className="bg-white border border-[#CDE5C1] rounded-xl p-4">
        <p className="text-sm font-medium text-[#243B27] mb-0.5">
          Vendedores registrados
        </p>
        <p className="text-[11px] text-[#7BA05D] mb-3">
          Seller App — actividad y métricas
        </p>
        <DataTable
          columns={vendedoresColumns}
          data={seller.vendedores}
          keyField="id"
        />
      </div>
    </div>
  );
}