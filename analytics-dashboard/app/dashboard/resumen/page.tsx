import { fetchDashboardData } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import IngresosChart from "@/components/charts/IngresosChart";
import DonutChart from "@/components/charts/DonutChart";
import SimpleBarChart from "@/components/charts/BarChart";

function formatARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const ESTADO_COLORS: Record<string, string> = {
  entregado:  "#4C6B3D",
  enviado:    "#7BA05D",
  confirmado: "#A67C52",
  pendiente:  "#CDE5C1",
  cancelado:  "#E07A5F",
};

const CAT_COLORS = ["#4C6B3D", "#7BA05D", "#A67C52", "#D9D9D4", "#E07A5F"];

export default async function ResumenPage() {
  const { buyer, seller, payments } = await fetchDashboardData();

  const donutData = buyer.distribucionEstadosPedidos.map((d) => ({
    label: d.estado,
    value: d.porcentaje,
    color: ESTADO_COLORS[d.estado] ?? "#D9D9D4",
  }));

  const registrosData = buyer.registrosPorSemana.map((v, i) => ({
    semana: `Sem ${i + 1}`,
    compradores: v,
  }));

  const catData = seller.ventasPorCategoria.map((c, i) => ({
    categoria: c.categoria,
    porcentaje: c.porcentaje,
    color: CAT_COLORS[i] ?? "#D9D9D4",
  }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Resumen general</h1>
        <p className="text-xs text-[#4C6B3D]">
          Vista consolidada de las tres aplicaciones del sistema — Buyer · Seller · Payments
        </p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { label: "Buyer App", cls: "bg-[#CDE5C1] text-[#243B27]" },
          { label: "Seller App", cls: "bg-[#D9D9D4] text-[#243B27]" },
          { label: "Payments App", cls: "bg-[#E8E2D6] text-[#243B27]" },
        ].map((b) => (
          <span key={b.label} className={`text-[11px] font-medium px-3 py-1 rounded-full ${b.cls}`}>
            {b.label}
          </span>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <KpiCard
          label="Ingresos confirmados"
          value={formatARS(payments.ingresosConfirmados)}
          delta="+18% vs mes anterior"
          deltaType="up"
        />
        <KpiCard
          label="Pedidos totales"
          value={buyer.distribucionEstadosPedidos.reduce((s, d) => s + d.cantidad, 0).toLocaleString("es-AR")}
          delta="+12% vs mes anterior"
          deltaType="up"
        />
        <KpiCard
          label="Compradores activos"
          value={buyer.compradoresActivos.toLocaleString("es-AR")}
          delta={`+7% vs mes anterior`}
          deltaType="up"
        />
        <KpiCard
          label="Vendedores activos"
          value={String(seller.vendedoresActivos)}
          delta={`de ${seller.totalVendedores} registrados`}
          deltaType="neutral"
        />
        <KpiCard
          label="Tasa de entrega"
          value={`${buyer.distribucionEstadosPedidos.find((d) => d.estado === "entregado")?.porcentaje ?? 0}%`}
          delta="-2% vs mes anterior"
          deltaType="down"
        />
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <ChartCard
            title="Ingresos mensuales (últimos 8 meses)"
            subtitle="Payments App — transacciones confirmadas en ARS"
          >
            <div className="flex gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]">
                <span className="w-2 h-2 rounded-sm bg-[#4C6B3D]" /> Ingresos
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]">
                <span className="w-2 h-2 rounded-sm bg-[#7BA05D]" /> Meta
              </span>
            </div>
            <IngresosChart data={payments.ingresosUltimosMeses} />
          </ChartCard>
        </div>

        <ChartCard title="Estado de pedidos" subtitle="Buyer App — distribución actual">
          <DonutChart data={donutData} />
          <div className="mt-3 space-y-1">
            {donutData.map((d) => (
              <div key={d.label} className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]">
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                <span className="capitalize">{d.label} — {d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Gráficos fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Nuevos registros de compradores"
          subtitle="Buyer App — últimas 8 semanas"
        >
          <SimpleBarChart
            data={registrosData}
            dataKey="compradores"
            labelKey="semana"
            color="#7BA05D"
            height={180}
          />
        </ChartCard>

        <ChartCard
          title="Distribución por categoría"
          subtitle="Seller App — ventas por tipo de producto"
        >
          <SimpleBarChart
            data={catData.map((c) => ({ categoria: c.categoria, porcentaje: c.porcentaje }))}
            dataKey="porcentaje"
            labelKey="categoria"
            color="#4C6B3D"
            height={180}
            horizontal
            formatStyle="currency-k"
          />
        </ChartCard>
      </div>
    </div>
  );
}