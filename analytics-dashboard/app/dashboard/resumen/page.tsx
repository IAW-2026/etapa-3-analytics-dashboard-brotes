import {
  fetchBuyerStats,
  fetchPaymentsStats,
  fetchSellerStats,
} from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import IngresosChart from "@/components/charts/IngresosChart";
import SimpleBarChart from "@/components/charts/BarChart";
import DonutWithLegend from "@/components/DonutWithLegend";
import OfflineBanner from "@/components/OfflineBanner";
import { formatCategory } from "@/components/charts/formatters";
import {
  formatARS,
  detectarAnomalias,
  proyectarSiguienteMes,
  calcularRunRateAnual,
} from "@/lib/metrics";

const ESTADO_COLORS: Record<string, string> = {
  entregada: "#4C6B3D",
  listo: "#7BA05D",
  confirmada: "#A67C52",
  pendiente: "#CDE5C1",
  en_preparacion: "#7BA05D",
  caducada: "#E07A5F",
};

const CAT_COLORS = ["#4C6B3D", "#7BA05D", "#A67C52", "#D9D9D4", "#E07A5F"];

export default async function ResumenPage() {
  const [
    { data: buyer, status: bs },
    { data: seller, status: ss },
    { data: payments, status: ps },
  ] = await Promise.all([
    fetchBuyerStats(),
    fetchSellerStats(),
    fetchPaymentsStats(),
  ]);
  const meta = {
    buyerAppOnline: bs.online,
    sellerAppOnline: ss.online,
    paymentsAppOnline: ps.online,
  };

  // Deltas dinámicos
  const ingresosMeses = payments.ingresosUltimosMeses;
  const ultimoIngreso = ingresosMeses[ingresosMeses.length - 1];
  const prevIngreso = ingresosMeses[ingresosMeses.length - 2];
  const deltaIngresos =
    ultimoIngreso && prevIngreso && prevIngreso.ingresos > 0
      ? `${(((ultimoIngreso.ingresos - prevIngreso.ingresos) / prevIngreso.ingresos) * 100).toFixed(0)}% vs mes anterior`
      : undefined;

  const sumPedidos = (m: (typeof buyer.pedidosPorMes)[number]) =>
    Number(m.entregada ?? 0) +
    Number(m.confirmada ?? 0) +
    Number(m.en_preparacion ?? 0) +
    Number(m.listo ?? 0) +
    Number(m.pendiente ?? 0) +
    Number(m.caducada ?? 0);
  const ultimoPedido = buyer.pedidosPorMes[buyer.pedidosPorMes.length - 1];
  const prevPedido = buyer.pedidosPorMes[buyer.pedidosPorMes.length - 2];
  const deltaPedidos =
    ultimoPedido && prevPedido && sumPedidos(prevPedido) > 0
      ? `${(((sumPedidos(ultimoPedido) - sumPedidos(prevPedido)) / sumPedidos(prevPedido)) * 100).toFixed(0)}% vs mes anterior`
      : undefined;

  const regs = buyer.registrosPorSemana;
  const last4 = regs.slice(-4).reduce((s, v) => s + v, 0);
  const prev4 =
    regs.length >= 8 ? regs.slice(-8, -4).reduce((s, v) => s + v, 0) : 0;
  const deltaCompradores =
    prev4 > 0
      ? `${(((last4 - prev4) / prev4) * 100).toFixed(0)}% vs mes anterior`
      : undefined;

  const calcEntrega = (m: (typeof buyer.pedidosPorMes)[number]) => {
    const total = sumPedidos(m);
    const entregados = Number(m.entregada ?? 0) + Number(m.confirmada ?? 0);
    return total > 0 ? (entregados / total) * 100 : 0;
  };
  const deltaEntrega =
    ultimoPedido && prevPedido
      ? `${(calcEntrega(ultimoPedido) - calcEntrega(prevPedido)).toFixed(1)}% vs mes anterior`
      : undefined;

  // Fase 3: Anomalías y proyección
  const anomalias = detectarAnomalias(ingresosMeses);
  const proyeccion = proyectarSiguienteMes(ingresosMeses);

  // Fase 2: Run rate anual
  const runRateAnual = calcularRunRateAnual(ingresosMeses);

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
          Vista consolidada de las tres aplicaciones del sistema — Buyer ·
          Seller · Payments
        </p>
      </div>

      {!meta.buyerAppOnline && <OfflineBanner appName="Buyer App" />}
      {!meta.sellerAppOnline && <OfflineBanner appName="Seller App" />}
      {!meta.paymentsAppOnline && <OfflineBanner appName="Payments App" />}

      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { label: "Buyer App", cls: "bg-[#CDE5C1] text-[#243B27]" },
          { label: "Seller App", cls: "bg-[#D9D9D4] text-[#243B27]" },
          { label: "Payments App", cls: "bg-[#E8E2D6] text-[#243B27]" },
        ].map((b) => (
          <span
            key={b.label}
            className={`text-[11px] font-medium px-3 py-1 rounded-full ${b.cls}`}
          >
            {b.label}
          </span>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <KpiCard
          label="Ingresos confirmados"
          value={formatARS(payments.ingresosConfirmados)}
          delta={deltaIngresos}
          deltaType={
            deltaIngresos?.startsWith("-")
              ? "down"
              : deltaIngresos === "0%"
                ? "neutral"
                : "up"
          }
          tooltip={`Run rate anual: ${formatARS(runRateAnual)}`}
        />
        <KpiCard
          label="Pedidos totales"
          value={buyer.distribucionEstadosPedidos
            .reduce((s, d) => s + d.cantidad, 0)
            .toLocaleString("es-AR")}
          delta={deltaPedidos}
          deltaType={
            deltaPedidos?.startsWith("-")
              ? "down"
              : deltaPedidos === "0%"
                ? "neutral"
                : "up"
          }
        />
        <KpiCard
          label="Compradores activos"
          value={buyer.compradoresActivos.toLocaleString("es-AR")}
          delta={deltaCompradores}
          deltaType={
            deltaCompradores?.startsWith("-")
              ? "down"
              : deltaCompradores === "0%"
                ? "neutral"
                : "up"
          }
        />
        <KpiCard
          label="Vendedores activos"
          value={String(seller.vendedoresActivos)}
          delta={`de ${seller.totalVendedores} registrados`}
          deltaType="neutral"
        />
        <KpiCard
          label="Tasa de entrega"
          value={`${buyer.distribucionEstadosPedidos.find((d) => d.estado === "entregada")?.porcentaje ?? 0}%`}
          delta={deltaEntrega}
          deltaType={
            deltaEntrega?.startsWith("-")
              ? "down"
              : deltaEntrega === "0%"
                ? "neutral"
                : "up"
          }
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
              {proyeccion && (
                <span className="flex items-center gap-1.5 text-[11px] text-[#A67C52]">
                  <span className="w-2 h-2 rounded-sm bg-[#A67C52]" />{" "}
                  Proyección
                </span>
              )}
            </div>
            <IngresosChart
              data={payments.ingresosUltimosMeses}
              anomalias={anomalias}
              proyeccion={proyeccion}
            />
          </ChartCard>
        </div>

        <ChartCard
          title="Estado de pedidos"
          subtitle="Buyer App — distribución actual"
        >
          <DonutWithLegend data={donutData} capitalizeLabels />
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
            data={catData.map((c) => ({
              categoria: c.categoria,
              porcentaje: c.porcentaje,
            }))}
            dataKey="porcentaje"
            labelKey="categoria"
            color="#4C6B3D"
            height={180}
            horizontal
            formatStyle="percent"
          />
        </ChartCard>
      </div>
    </div>
  );
}
