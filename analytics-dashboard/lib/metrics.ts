import type { DashboardData, PaymentsStats } from "./types";

// ─── Formato de moneda ─────────────────────────────────────────────────────────

export function formatARS(n: number): string {
  // console.log("preformato:", n);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString("es-AR")}`;
}

// ─── Normalización de métodos de pago ─── Fase 1: Data Quality ───────────────

const PAYMENT_METHOD_MAP: Record<string, string> = {
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  transfer: "Transferencia bancaria",
  cash: "Efectivo / otro",
  "No definido": "Otro",
  undefined: "Otro",
  Débito: "Tarjeta de débito",
  Crédito: "Tarjeta de crédito",
  Transferencia: "Transferencia bancaria",
  Efectivo: "Efectivo / otro",
};

export function normalizarMetodoPago(metodo: string): string {
  if (!metodo || metodo.trim() === "") return "Otro";
  return PAYMENT_METHOD_MAP[metodo] ?? metodo;
}

// Aplica normalización a todas las transacciones y métodos de pago en los stats
export function normalizarPaymentsStats(stats: PaymentsStats): PaymentsStats {
  return {
    ...stats,
    metodosPago: stats.metodosPago.map((m) => ({
      ...m,
      metodo: normalizarMetodoPago(m.metodo),
    })),
    ultimasTransacciones: stats.ultimasTransacciones.map((t) => ({
      ...t,
      metodoPago: normalizarMetodoPago(t.metodoPago),
    })),
  };
}

// Cross-validation: Loguea en consola si ingresosConfirmados ≠ Σ transacciones confirmadas
export function validarIngresosConfirmados(stats: PaymentsStats): void {
  const sumaConfirmada = stats.ultimasTransacciones
    .filter((t) => t.estado === "confirmada")
    .reduce((s, t) => s + t.monto, 0);

  const diff = Math.abs(stats.ingresosConfirmados - sumaConfirmada);
  if (diff > 0.01) {
    console.warn("[analytics] ingresosConfirmados mismatch:", {
      ingresosConfirmados: stats.ingresosConfirmados,
      sumaTransacciones: sumaConfirmada,
      diferencia: diff,
    });
  }
}

// ─── Usuarios activos ─────────────────────────────────────────────────────────
// "Activo" = comprador con al menos un pedido no cancelado en los últimos 30 días

export interface UsuariosActivosMetrica {
  compradoresActivos: number; // del campo directo de BuyerStats
  porcentajeActivos: number; // sobre el total
  compradoresConPedidosRecientes: number; // pedidos en últimos 30 días
  tasaRetencion: number; // activos / total * 100
  tendenciaSemanal: {
    semana: string;
    nuevos: number;
    acumulado: number;
  }[];
}

export function calcularUsuariosActivos(
  data: DashboardData,
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
    pedidosRecientes.map((p) => p.compradorId),
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
    0,
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

// ─── Métricas derivadas ─── Fase 2: Métricas derivadas ───────────────────────

/** Calcula Run Rate anual basado en el promedio de los últimos N meses */
export function calcularRunRateAnual(
  ingresosUltimosMeses: { ingresos: number }[],
  meses: number = 6,
): number {
  const ultimos = ingresosUltimosMeses.slice(-meses);
  if (ultimos.length === 0) return 0;
  const promedio = ultimos.reduce((s, m) => s + m.ingresos, 0) / ultimos.length;
  return promedio * 12;
}

/** Calcula proyección lineal del próximo mes basado en los últimos N puntos */
export function proyectarSiguienteMes(
  ingresosUltimosMeses: { mes: string; ingresos: number }[],
): { mes: string; ingresos: number } | null {
  const n = ingresosUltimosMeses.length;
  if (n < 2) return null;

  // Regresión lineal simple: y = mx + b
  // x: índice, y: ingresos
  const puntos = ingresosUltimosMeses.map((m, i) => ({ x: i, y: m.ingresos }));
  const nVal = puntos.length;
  const sumX = puntos.reduce((s, p) => s + p.x, 0);
  const sumY = puntos.reduce((s, p) => s + p.y, 0);
  const sumXY = puntos.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = puntos.reduce((s, p) => s + p.x * p.x, 0);

  const pendiente = (nVal * sumXY - sumX * sumY) / (nVal * sumX2 - sumX * sumX);
  const intercepto = (sumY - pendiente * sumX) / nVal;

  const siguienteIndice = nVal;
  const proyeccion = pendiente * siguienteIndice + intercepto;

  // Generar nombre del mes siguiente basado en la convención existente
  const ultimoMes = ingresosUltimosMeses[ingresosUltimosMeses.length - 1].mes;
  const nextMonth = getNextMonthLabel(ultimoMes);

  return {
    mes: nextMonth,
    ingresos: Math.max(0, proyeccion),
  };
}

/** Mapea meses en español o formato ISO al siguiente mes */
function getNextMonthLabel(currentMes: string): string {
  const months = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  const idx = months.indexOf(currentMes);
  if (idx !== -1 && idx < months.length - 1) return months[idx + 1];
  if (idx === months.length - 1) return months[0]; // Dic → Ene

  // Fallback para formato YYYY-MM
  const date = new Date(`${currentMes}-01`);
  if (!isNaN(date.getTime())) {
    date.setMonth(date.getMonth() + 1);
    const idx = date.getMonth();
    return months[idx];
  }
  return "Proy.";
}

// ─── Detección de anomalías ─── Fase 3.1 ─────────────────────────────────────

export interface Anomalia {
  index: number;
  mes: string;
  valor: number;
  desviacion: number; // En múltiplos de σ
}

/** Detecta meses donde el ingreso se desvía >2σ de la media */
export function detectarAnomalias(
  ingresosUltimosMeses: { mes: string; ingresos: number }[],
): Anomalia[] {
  const valores = ingresosUltimosMeses.map((m) => m.ingresos);
  if (valores.length < 3) return [];

  const media = valores.reduce((s, v) => s + v, 0) / valores.length;
  const varianza =
    valores.reduce((s, v) => s + Math.pow(v - media, 2), 0) / valores.length;
  const std = Math.sqrt(varianza);

  if (std === 0) return [];

  return ingresosUltimosMeses
    .map((m, i) => {
      const desv = Math.abs(m.ingresos - media) / std;
      return { index: i, mes: m.mes, valor: m.ingresos, desviacion: desv };
    })
    .filter((a) => a.desviacion > 2);
}