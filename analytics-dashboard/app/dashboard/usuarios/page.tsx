import { fetchBuyerStats, fetchDashboardData, fetchSellerStats } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import EstadoBadge from "@/components/EstadoBadge";
import SimpleLineChart from "@/components/charts/LineChart";
import OfflineBanner from "@/components/OfflineBanner";
import type { Vendedor } from "@/lib/types";
import DonutWithLegend from "@/components/DonutWithLegend";

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
    key: "estado",
    header: "Estado",
    render: (r) => <EstadoBadge estado={r.estado} />,
  },
];

export default async function UsuariosPage() {
  const [{ data: buyer, status: bs }, { data: seller, status: ss }] = await Promise.all([
  fetchBuyerStats(),
  fetchSellerStats(),
]);
const meta = { buyerAppOnline: bs.online, sellerAppOnline: ss.online };

  const totalCompradores = buyer.totalCompradores || 1;
  const nuevosEsteMes = buyer.registrosPorSemana.slice(-4).reduce((s, v) => s + v, 0);
  const donutCompradoresData = [
    {
      label: "Activos",
      value: Math.round((buyer.compradoresActivos / totalCompradores) * 100),
      color: "#4C6B3D",
    },
    {
      label: "Suspendidos",
      value: Math.round((buyer.compradoresSuspendidos / totalCompradores) * 100),
      color: "#A67C52",
    },
    {
      label: "Eliminados",
      value: Math.round((buyer.compradoresEliminados / totalCompradores) * 100),
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

  const vendedoresActivos = seller.vendedores.filter((v) => v.estado === "activo").length;
  const vendedoresInactivos = seller.vendedores.filter((v) => v.estado === "inactivo").length;
  const totalVendedoresConteo = vendedoresActivos + vendedoresInactivos;

  const donutVendedoresData = [
    {
      label: "Activos",
      value: totalVendedoresConteo === 0 ? 0 : Math.round((vendedoresActivos / totalVendedoresConteo) * 100),
      color: "#4C6B3D",
    },
    {
      label: "Inactivos",
      value: totalVendedoresConteo === 0 ? 0 : Math.round((vendedoresInactivos / totalVendedoresConteo) * 100),
      color: "#D9D9D4",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Usuarios</h1>
        <p className="text-xs text-[#4C6B3D]">
          Compradores y vendedores — Buyer App + Seller App
        </p>
      </div>

      {!meta.buyerAppOnline && <OfflineBanner appName="Buyer App" />}
      {!meta.sellerAppOnline && <OfflineBanner appName="Seller App" />}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Total compradores"
          value={buyer.totalCompradores.toLocaleString("es-AR")}
          delta={`+${nuevosEsteMes} nuevos este mes`}
          deltaType="up"
        />
        <KpiCard
          label="Compradores activos"
          value={buyer.compradoresActivos.toLocaleString("es-AR")}
          delta={`${Math.round(
            (buyer.compradoresActivos / totalCompradores) * 100
          )}% del total`}
          deltaType="neutral"
        />
        <KpiCard
          label="Suspendidos"
          value={String(buyer.compradoresSuspendidos)}
          delta={`${(
            (buyer.compradoresSuspendidos / totalCompradores) *
            100
          ).toFixed(1)}% del total`}
          deltaType="down"
        />
        <KpiCard
          label="Eliminados"
          value={String(buyer.compradoresEliminados)}
          delta={`${Math.round(
            (buyer.compradoresEliminados / totalCompradores) * 100
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
          <DonutWithLegend data={donutCompradoresData} />
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

      {/* Vendedores: tabla + estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Vendedores registrados"
          subtitle="Seller App — actividad y métricas"
          className="lg:col-span-2"
        >
          <DataTable
            columns={vendedoresColumns}
            data={seller.vendedores}
            keyField="id"
          />
        </ChartCard>

        <ChartCard title="Estado de vendedores" subtitle="Seller App — distribución de cuentas">
          <DonutWithLegend data={donutVendedoresData} />
        </ChartCard>
      </div>
    </div>
  );
}