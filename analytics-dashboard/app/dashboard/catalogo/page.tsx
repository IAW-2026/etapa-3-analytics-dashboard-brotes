import { fetchDashboardData } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import SimpleLineChart from "@/components/charts/LineChart";
import SimpleBarChart from "@/components/charts/BarChart";
import type { Producto } from "@/lib/types";
import DonutWithLegend from "@/components/DonutWithLegend";

function formatARS(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-AR")}`;
}

const CAT_COLORS = ["#4C6B3D", "#7BA05D", "#A67C52", "#CDE5C1", "#E07A5F"];

const productosColumns: {
  key: keyof Producto;
  header: string;
  render?: (row: Producto) => React.ReactNode;
}[] = [
  {
    key: "nombre",
    header: "Producto",
    render: (r) => <strong>{r.nombre}</strong>,
  },
  { key: "categoria", header: "Categoría" },
  { key: "vendedorNombre", header: "Vendedor" },
  {
    key: "precio",
    header: "Precio",
    render: (r) => formatARS(r.precio),
  },
  {
    key: "unidadesVendidas",
    header: "Unidades",
    render: (r) => (
      <span className="font-medium text-[#243B27]">{r.unidadesVendidas}</span>
    ),
  },
  {
    key: "ingresoTotal",
    header: "Ingreso total",
    render: (r) => (
      <span className="font-medium text-[#4C6B3D]">
        {formatARS(r.ingresoTotal)}
      </span>
    ),
  },
];

export default async function CatalogoPage() {
  const { seller } = await fetchDashboardData();

  const donutData = seller.ventasPorCategoria.map((c, i) => ({
    label: c.categoria,
    value: c.porcentaje,
    color: CAT_COLORS[i] ?? "#D9D9D4",
  }));

  const preciosData = seller.evolucionPrecios.map((p) => ({
    mes: p.mes,
    precio: p.precio,
  }));

  // Ingreso total por categoría derivado de topProductos
  const ingresosPorCat = seller.topProductos.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.categoria] = (acc[p.categoria] ?? 0) + p.ingresoTotal;
      return acc;
    },
    {}
  );
  const ingresosCatData = Object.entries(ingresosPorCat)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, total]) => ({ categoria, total }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Catálogo</h1>
        <p className="text-xs text-[#4C6B3D]">Productos y stock — Seller App</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Productos activos"
          value={seller.totalProductos.toLocaleString("es-AR")}
          delta="+34 este mes"
          deltaType="up"
        />
        <KpiCard
          label="Precio promedio"
          value={formatARS(seller.precioPromedio)}
          delta="-$90 vs mes anterior"
          deltaType="down"
        />
        <KpiCard
          label="Producto más vendido"
          value={seller.productoMasVendido}
          delta={`${seller.unidadesProductoMasVendido} unidades este mes`}
          deltaType="up"
        />
        <KpiCard
          label="Sin stock"
          value={String(seller.productosSinStock)}
          delta={`${(
            (seller.productosSinStock / seller.totalProductos) *
            100
          ).toFixed(1)}% del catálogo`}
          deltaType="down"
        />
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Ventas por categoría"
          subtitle="Seller App — últimos 30 días"
        >
          <DonutWithLegend data={donutData} legendLayout="grid-2" />
        </ChartCard>

        <ChartCard
          title="Evolución del precio promedio"
          subtitle="Seller App — últimos 6 meses"
        >
          <SimpleLineChart
            data={preciosData}
            dataKey="precio"
            labelKey="mes"
            color="#A67C52"
            height={200}
            filled
            formatStyle="currency-k"
          />
        </ChartCard>
      </div>

      {/* Gráfico fila 2 */}
      <div className="mb-4">
        <ChartCard
          title="Ingresos totales por categoría"
          subtitle="Seller App — acumulado del mes desde top productos"
        >
          <SimpleBarChart
            data={ingresosCatData}
            dataKey="total"
            labelKey="categoria"
            color="#4C6B3D"
            height={180}
            formatStyle="currency-ars"
          />
        </ChartCard>
      </div>

      {/* Tabla productos */}
      <div className="bg-white border border-[#CDE5C1] rounded-xl p-4">
        <p className="text-sm font-medium text-[#243B27] mb-0.5">
          Productos más vendidos
        </p>
        <p className="text-[11px] text-[#7BA05D] mb-3">
          Seller App — este mes, ordenados por unidades vendidas
        </p>
        <DataTable
          columns={productosColumns}
          data={seller.topProductos}
          keyField="id"
        />
      </div>
    </div>
  );
}