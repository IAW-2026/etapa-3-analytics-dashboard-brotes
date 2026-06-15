import type { DashboardData } from "./types";

// ─── Calificación promedio del sistema ────────────────────────────────────────
// Ponderada por volumen de ventas: los vendedores con más ventas pesan más

export interface CalificacionPromedio {
  promedioPonderado: number;     // calificación ponderada por ventas
  promedioSimple: number;        // promedio aritmético simple
  totalVendedoresConCalif: number;
  distribucion: {
    rango: string;               // "5 ★", "4 ★", etc.
    cantidad: number;
    porcentaje: number;
  }[];
}

export function calcularCalificacionPromedio(
  data: DashboardData
): CalificacionPromedio {
  const vendedores = data.seller.vendedores.filter((v) => v.calificacion > 0);

  if (vendedores.length === 0) {
    return {
      promedioPonderado: 0,
      promedioSimple: 0,
      totalVendedoresConCalif: 0,
      distribucion: [],
    };
  }

  // Promedio simple
  const promedioSimple =
    vendedores.reduce((sum, v) => sum + v.calificacion, 0) / vendedores.length;

  // Promedio ponderado por ventas del mes
  const totalVentas = vendedores.reduce((sum, v) => sum + v.ventasMes, 0);
  const promedioPonderado =
    totalVentas === 0
      ? promedioSimple
      : vendedores.reduce(
          (sum, v) => sum + v.calificacion * (v.ventasMes / totalVentas),
          0
        );

  // Distribución por rangos (5★, 4★, 3★, <3★)
  const rangos = [
    { label: "5 ★",  min: 4.8, max: 5.0 },
    { label: "4-5 ★", min: 4.0, max: 4.8 },
    { label: "3-4 ★", min: 3.0, max: 4.0 },
    { label: "< 3 ★", min: 0,   max: 3.0 },
  ];

  const distribucion = rangos.map(({ label, min, max }) => {
    const cantidad = vendedores.filter(
      (v) => v.calificacion >= min && v.calificacion < max
    ).length;
    return {
      rango: label,
      cantidad,
      porcentaje: Math.round((cantidad / vendedores.length) * 100),
    };
  });

  return {
    promedioPonderado: Math.round(promedioPonderado * 10) / 10,
    promedioSimple: Math.round(promedioSimple * 10) / 10,
    totalVendedoresConCalif: vendedores.length,
    distribucion,
  };
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
    return fecha >= hace30Dias && p.estado !== "cancelado";
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
  calificacion: CalificacionPromedio;
  usuariosActivos: UsuariosActivosMetrica;
  ingresosConfirmados: number;
  ticketPromedio: number;
  tasaCancelacion: number;
  totalPedidos: number;
  pedidosEntregados: number;
  tasaEntrega: number;
}

export function calcularResumenMetricas(data: DashboardData): ResumenMetricas {
  const calificacion = calcularCalificacionPromedio(data);
  const usuariosActivos = calcularUsuariosActivos(data);

  const totalPedidos = data.buyer.distribucionEstadosPedidos.reduce(
    (s, d) => s + d.cantidad,
    0
  );
  const pedidosEntregados =
    data.buyer.distribucionEstadosPedidos.find((d) => d.estado === "entregado")
      ?.cantidad ?? 0;

  const tasaEntrega =
    totalPedidos === 0
      ? 0
      : Math.round((pedidosEntregados / totalPedidos) * 100);

  return {
    calificacion,
    usuariosActivos,
    ingresosConfirmados: data.payments.ingresosConfirmados,
    ticketPromedio: data.payments.ticketPromedio,
    tasaCancelacion: data.payments.tasaCancelacion,
    totalPedidos,
    pedidosEntregados,
    tasaEntrega,
  };
}