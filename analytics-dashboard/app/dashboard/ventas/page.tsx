import { fetchDashboardData } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import EstadoBadge from "@/components/EstadoBadge";
import ProgressBar from "@/components/ProgressBar";
import StackedBarChart from "@/components/charts/StackedBarChart";
import SimpleBarChart from "@/components/charts/BarChart";
import type { Transaccion } from "@/lib/types";
import { formatARS } from "@/lib/metrics";

const PROGRESS_VARIANTS = ["default", "green", "brown", "terra"] as const;

const txColumns: {
  key: keyof Transaccion;
  header: string;
  render?: (row: Transaccion) => React.ReactNode;
}[] = [
  { key: "id", header: "ID pedido" },
  { key: "compradorNombre", header: "Comprador" },
  { key: "vendedorNombre", header: "Vendedor" },
  {
    key: "monto",
    header: "Monto",
    render: (row) => <span className="font-medium">{formatARS(row.monto)}</span>,
  },
  {
    key: "estado",
    header: "Estado",
    render: (row) => <EstadoBadge estado={row.estado} />,
  },
  {
    key: "fecha",
    header: "Fecha",
    render: (row) =>
      new Date(row.fecha).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
];

export default async function VentasPage() {
  const { buyer, seller, payments } = await fetchDashboardData();

  const completados = buyer.distribucionEstadosPedidos.find(
    (d) => d.estado === "entregado"
  );

  const pedidosData = buyer.pedidosPorMes.map((m) => ({
    mes: m.mes,
    completados: m.completados,
    "en proceso": m.enProceso,
    cancelados: m.cancelados,
  }));

  const topVendedoresData = seller.topVendedores.map((v) => ({
    nombre: v.nombre,
    ingresos: v.ingresos,
  }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Ventas y pedidos</h1>
        <p className="text-xs text-[#4C6B3D]">
          Análisis de transacciones desde Payments App y Buyer App
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Ticket promedio"
          value={formatARS(payments.ticketPromedio)}
          delta="+$240 vs mes anterior"
          deltaType="up"
        />
        <KpiCard
          label="Pedidos completados"
          value={String(completados?.cantidad ?? 0)}
          delta={`${completados?.porcentaje ?? 0}% del total`}
          deltaType="neutral"
        />
        <KpiCard
          label="Tasa de cancelación"
          value={`${payments.tasaCancelacion.toFixed(1)}%`}
          delta="+0.4% vs mes anterior"
          deltaType="down"
        />
        <KpiCard
          label="Ingresos pendientes"
          value={formatARS(payments.ingresosPendientes)}
          delta="pedidos en tránsito"
          deltaType="neutral"
        />
      </div>

      {/* Pedidos apilados */}
      <div className="mb-4">
        <ChartCard
          title="Volumen de pedidos — últimos 6 meses"
          subtitle="Buyer App · desglosado por estado"
        >
          <div className="flex gap-4 mb-3">
            {[
              { label: "Completados", color: "#4C6B3D" },
              { label: "En proceso", color: "#7BA05D" },
              { label: "Cancelados", color: "#E07A5F" },
            ].map((s) => (
              <span
                key={s.label}
                className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]"
              >
                <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
                {s.label}
              </span>
            ))}
          </div>
          <StackedBarChart
            data={pedidosData}
            labelKey="mes"
            series={[
              { key: "completados", label: "Completados", color: "#4C6B3D" },
              { key: "en proceso", label: "En proceso", color: "#7BA05D" },
              { key: "cancelados", label: "Cancelados", color: "#E07A5F" },
            ]}
            height={220}
          />
        </ChartCard>
      </div>

      {/* Fila de dos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Pagos por método" subtitle="Payments App">
          <div className="mt-2">
            {payments.metodosPago.map((m, i) => (
              <ProgressBar
                key={m.metodo}
                label={m.metodo}
                value={m.porcentaje}
                variant={PROGRESS_VARIANTS[i % PROGRESS_VARIANTS.length]}
              />
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top vendedores por ingresos" subtitle="Seller App — este mes">
          <SimpleBarChart
            data={topVendedoresData}
            dataKey="ingresos"
            labelKey="nombre"
            color="#4C6B3D"
            height={180}
            horizontal
            formatStyle="currency-k"
          />
        </ChartCard>
      </div>

      {/* Tabla transacciones */}
      <ChartCard title="Últimas transacciones" subtitle="Payments App · consolidado con Buyer App">
        <DataTable
          columns={txColumns}
          data={payments.ultimasTransacciones}
          keyField="id"
        />
      </ChartCard>
    </div>
  );
}