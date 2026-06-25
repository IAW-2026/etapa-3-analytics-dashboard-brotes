import { fetchDashboardData, fetchSellerStats } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import SimpleBarChart from "@/components/charts/BarChart";
import OfflineBanner from "@/components/OfflineBanner";
import type { Producto } from "@/lib/types";
import DonutWithLegend from "@/components/DonutWithLegend";
import { formatARS } from "@/lib/metrics";

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
  const { data: seller, status } = await fetchSellerStats();
  const meta = { sellerAppOnline: status.online };

  const donutData = seller.ventasPorCategoria.map((c, i) => ({
    label: c.categoria,
    value: c.porcentaje,
    color: CAT_COLORS[i] ?? "#D9D9D4",
  }));

  // Ranking de vendedores por cantidad de productos publicados
  const topVendedoresPorCatalogo = [...seller.vendedores]
    .sort((a, b) => b.totalProductos - a.totalProductos)
    .slice(0, 5);

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

      {!meta.sellerAppOnline && <OfflineBanner appName="Seller App" />}

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
            (seller.productosSinStock / (seller.totalProductos || 1)) *
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
          title="Vendedores con mayor catálogo"
          subtitle="Seller App — por cantidad de productos publicados"
        >
          <div className="space-y-2">
            {topVendedoresPorCatalogo.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[#243B27]">
                  <span className="text-[#7BA05D] mr-2">{i + 1}.</span>
                  {v.nombre}
                </span>
                <span className="font-medium text-[#4C6B3D]">
                  {v.totalProductos} productos
                </span>
              </div>
            ))}
          </div>
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
      <ChartCard title="Productos más vendidos" subtitle="Seller App — este mes, ordenados por unidades vendidas">
        <DataTable
          columns={productosColumns}
          data={seller.topProductos}
          keyField="id"
        />
      </ChartCard>
    </div>
  );
}