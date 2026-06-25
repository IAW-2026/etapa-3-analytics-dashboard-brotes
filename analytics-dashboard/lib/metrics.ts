import type { DashboardData } from "./types";

// ─── Formato de moneda ─────────────────────────────────────────────────────────

export function formatARS(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-AR")}`;
}

// ─── Usuarios activos ─────────────────────────────────────────────────────────
// "Activo" = comprador con al menos un pedido no cancelado en los últimos 30 días

export interface UsuariosActivosMetrica {
  compradoresActivos: number;           // del campo directo de BuyerStats
  porcentajeActivos: number;            // sobre el total
  compradoresConPedidosRecientes: number; // pedidos en últimos 30 días
  tasaRetencion: number;                // activos / total * 100
  tendenciaSemanal: {
    semana: string;
    nuevos: number;
    acumulado: number;
  }[];
}

export function calcularUsuariosActivos(
  data: DashboardData
): UsuariosActivosMetrica {
  const { buyer } = data;

  const hoy = new Date();
  const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Pedidos recientes (últimos 30 días, excluyendo cancelados)
  const pedidosRecientes = buyer.ultimosPedidos.filter((p) => {
    const fecha = new Date(p.creadoEn);
    return fecha >= hace30Dias && p.estado !== "caducada";
  });

  // IDs únicos de compradores con pedidos recientes
  const compradoresConPedidosRecientes = new Set(
    pedidosRecientes.map((p) => p.compradorId)
  ).size;

  const porcentajeActivos =
    buyer.totalCompradores === 0
      ? 0
      : Math.round((buyer.compradoresActivos / buyer.totalCompradores) * 100);

  const tasaRetencion = porcentajeActivos;

  // Tendencia semanal con acumulado
  const base =
    buyer.totalCompradores -
    buyer.registrosPorSemana.reduce((s, v) => s + v, 0);

  const tendenciaSemanal = buyer.registrosPorSemana.map((nuevos, i) => {
    const anterior = buyer.registrosPorSemana
      .slice(0, i)
      .reduce((s, v) => s + v, 0);
    return {
      semana: `Sem ${i + 1}`,
      nuevos,
      acumulado: base + anterior + nuevos,
    };
  });

  return {
    compradoresActivos: buyer.compradoresActivos,
    porcentajeActivos,
    compradoresConPedidosRecientes,
    tasaRetencion,
    tendenciaSemanal,
  };
}

// ─── Resumen ejecutivo (combina ambas métricas) ───────────────────────────────

export interface ResumenMetricas {
  usuariosActivos: UsuariosActivosMetrica;
  ingresosConfirmados: number;
  ticketPromedio: number;
  tasaCancelacion: number;
  totalPedidos: number;
  pedidosEntregados: number;
  tasaEntrega: number;
}

export function calcularResumenMetricas(data: DashboardData): ResumenMetricas {
  const usuariosActivos = calcularUsuariosActivos(data);

  const totalPedidos = data.buyer.distribucionEstadosPedidos.reduce(
    (s, d) => s + d.cantidad,
    0
  );
  const pedidosEntregados =
    data.buyer.distribucionEstadosPedidos.find((d) => d.estado === "entregada")
      ?.cantidad ?? 0;

  const tasaEntrega =
    totalPedidos === 0
      ? 0
      : Math.round((pedidosEntregados / totalPedidos) * 100);

  return {
    usuariosActivos,
    ingresosConfirmados: data.payments.ingresosConfirmados,
    ticketPromedio: data.payments.ticketPromedio,
    tasaCancelacion: data.payments.tasaCancelacion,
    totalPedidos,
    pedidosEntregados,
    tasaEntrega,
  };
}