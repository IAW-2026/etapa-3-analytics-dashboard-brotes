import { fetchDashboardData } from "@/lib/api";
import KpiCard from "@/components/KpiCard";
import ChartCard from "@/components/ChartCard";
import DataTable from "@/components/DataTable";
import ProgressBar from "@/components/ProgressBar";
import GroupedBarChart from "@/components/charts/GroupedBarChart";
import type { HiloForo } from "@/lib/types";

const PROGRESS_VARIANTS = ["default", "green", "brown", "terra"] as const;

const hilosColumns: {
  key: keyof HiloForo;
  header: string;
  render?: (row: HiloForo) => React.ReactNode;
}[] = [
  {
    key: "titulo",
    header: "Título",
    render: (r) => (
      <span className="font-medium text-[#243B27] line-clamp-1">{r.titulo}</span>
    ),
  },
  { key: "autor", header: "Autor" },
  {
    key: "respuestas",
    header: "Respuestas",
    render: (r) => (
      <span className="font-medium text-[#4C6B3D]">{r.respuestas}</span>
    ),
  },
  {
    key: "likes",
    header: "Likes",
    render: (r) => (
      <span className="flex items-center gap-1 text-[#A67C52]">
        ♥ {r.likes}
      </span>
    ),
  },
  {
    key: "creadoEn",
    header: "Fecha",
    render: (r) =>
      new Date(r.creadoEn).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
];

export default async function ComunidadPage() {
  const { buyer } = await fetchDashboardData();

  // Actividad del foro con etiquetas de semana
  const foroData = buyer.actividadForoPorSemana.map((s, i) => ({
    semana: `Sem ${i + 1}`,
    hilos: s.hilos,
    respuestas: s.respuestas,
  }));

  // Ratio respuestas/hilos por semana para ver engagement
  const engagementData = foroData.map((s) => ({
    semana: s.semana,
    ratio: s.hilos > 0 ? Math.round((s.respuestas / s.hilos) * 10) / 10 : 0,
  }));

  // Totales acumulados del foro
  const totalHilosSemana = buyer.actividadForoPorSemana.reduce(
    (s, w) => s + w.hilos,
    0
  );
  const totalRespuestasSemana = buyer.actividadForoPorSemana.reduce(
    (s, w) => s + w.respuestas,
    0
  );
  const ratioPromedio =
    totalHilosSemana > 0
      ? (totalRespuestasSemana / totalHilosSemana).toFixed(1)
      : "0";

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium text-[#243B27]">Comunidad</h1>
        <p className="text-xs text-[#4C6B3D]">
          Foro, asistente IA y notificaciones — Buyer App
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard
          label="Hilos en el foro"
          value={buyer.totalHilosForo.toLocaleString("es-AR")}
          delta={`+${totalHilosSemana} esta semana`}
          deltaType="up"
        />
        <KpiCard
          label="Respuestas totales"
          value={buyer.totalRespuestasForo.toLocaleString("es-AR")}
          delta={`+${totalRespuestasSemana} esta semana`}
          deltaType="up"
        />
        <KpiCard
          label="Consultas al asistente IA"
          value={buyer.consultasAsistenteIA.toLocaleString("es-AR")}
          delta="+340 esta semana"
          deltaType="up"
        />
        <KpiCard
          label="Ratio respuestas/hilo"
          value={`${ratioPromedio}x`}
          delta="promedio de las últimas 8 semanas"
          deltaType="neutral"
        />
      </div>

      {/* Segunda fila de KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-5">
        <KpiCard
          label="Usuarios con favoritos"
          value={buyer.usuariosConFavoritos.toLocaleString("es-AR")}
          delta="82% de los compradores activos"
          deltaType="up"
        />
        <KpiCard
          label="Hilos esta semana"
          value={String(
            buyer.actividadForoPorSemana[
              buyer.actividadForoPorSemana.length - 1
            ]?.hilos ?? 0
          )}
          delta={`${
            buyer.actividadForoPorSemana[
              buyer.actividadForoPorSemana.length - 1
            ]?.respuestas ?? 0
          } respuestas`}
          deltaType="up"
        />
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Actividad del foro semanal"
          subtitle="Buyer App — últimas 8 semanas"
        >
          <div className="flex gap-4 mb-3">
            {[
              { label: "Nuevos hilos", color: "#4C6B3D" },
              { label: "Respuestas", color: "#A67C52" },
            ].map((s) => (
              <span
                key={s.label}
                className="flex items-center gap-1.5 text-[11px] text-[#4C6B3D]"
              >
                <span
                  className="w-2 h-2 rounded-sm"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
            ))}
          </div>
          <GroupedBarChart
            data={foroData}
            labelKey="semana"
            series={[
              { key: "hilos", label: "Nuevos hilos", color: "#4C6B3D" },
              { key: "respuestas", label: "Respuestas", color: "#A67C52" },
            ]}
            height={200}
          />
        </ChartCard>

        <ChartCard
          title="Consultas al asistente IA"
          subtitle="Buyer App — por categoría de planta"
        >
          <div className="mt-2">
            {buyer.categoriasMasConsultadasIA.map((c, i) => (
              <ProgressBar
                key={c.categoria}
                label={c.categoria}
                value={c.porcentaje}
                variant={PROGRESS_VARIANTS[i % PROGRESS_VARIANTS.length]}
              />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Engagement */}
      <div className="mb-4">
        <ChartCard
          title="Engagement del foro — respuestas por hilo"
          subtitle="Buyer App — ratio semanal (mayor = más participación por debate)"
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              {
                label: "Ratio máximo",
                value: `${Math.max(...engagementData.map((d) => d.ratio))}x`,
              },
              {
                label: "Ratio promedio",
                value: `${ratioPromedio}x`,
              },
              {
                label: "Ratio mínimo",
                value: `${Math.min(...engagementData.map((d) => d.ratio))}x`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#EAF3E6] rounded-lg p-3 text-center"
              >
                <p className="text-[10px] text-[#7BA05D] uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className="text-lg font-medium text-[#243B27]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Barra visual de ratio por semana */}
          <div className="space-y-2">
            {engagementData.map((d) => (
              <div key={d.semana} className="flex items-center gap-3">
                <span className="text-[11px] text-[#7BA05D] w-12 flex-shrink-0">
                  {d.semana}
                </span>
                <div className="flex-1 bg-[#EAF3E6] rounded h-4 relative overflow-hidden">
                  <div
                    className="h-4 rounded bg-[#7BA05D] transition-all"
                    style={{
                      width: `${Math.min(
                        (d.ratio /
                          Math.max(...engagementData.map((e) => e.ratio))) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[#243B27] w-8 text-right flex-shrink-0">
                  {d.ratio}x
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Tabla hilos */}
      <ChartCard title="Hilos más activos del foro" subtitle="Buyer App — ordenados por respuestas recibidas">
        <DataTable
          columns={hilosColumns}
          data={buyer.hilosForo}
          keyField="id"
        />
      </ChartCard>
    </div>
  );
}