// ─── Buyer App ────────────────────────────────────────────────────────────────

export type EstadoComprador = "activo" | "suspendido" | "eliminado";

export interface Comprador {
  id: string;
  nombre: string;
  email: string;
  estado: EstadoComprador;
  creadoEn: string;
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Pedido {
  id: string;
  compradorId: string;
  compradorNombre: string;
  vendedorNombre: string;
  monto: number;
  estado: EstadoPedido;
  creadoEn: string;
}

export interface HiloForo {
  id: string;
  titulo: string;
  autor: string;
  respuestas: number;
  likes: number;
  creadoEn: string;
}

export interface BuyerStats {
  totalCompradores: number;
  compradoresActivos: number;
  compradoresSuspendidos: number;
  compradoresEliminados: number;
  registrosPorSemana: number[];
  pedidosPorMes: {
    mes: string;
    completados: number;
    enProceso: number;
    cancelados: number;
  }[];
  distribucionEstadosPedidos: {
    estado: EstadoPedido;
    cantidad: number;
    porcentaje: number;
  }[];
  ultimosPedidos: Pedido[];
  hilosForo: HiloForo[];
  totalHilosForo: number;
  totalRespuestasForo: number;
  consultasAsistenteIA: number;
  usuariosConFavoritos: number;
  categoriasMasConsultadasIA: { categoria: string; porcentaje: number }[];
  actividadForoPorSemana: { hilos: number; respuestas: number }[];
}

// ─── Seller App ───────────────────────────────────────────────────────────────

export interface Vendedor {
  id: string;
  nombre: string;
  ciudad: string;
  totalProductos: number;
  ventasMes: number;
  calificacion: number;
  estado: "activo" | "nuevo" | "inactivo";
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  vendedorNombre: string;
  precio: number;
  unidadesVendidas: number;
  ingresoTotal: number;
}

export interface SellerStats {
  totalVendedores: number;
  vendedoresActivos: number;
  totalProductos: number;
  precioPromedio: number;
  productoMasVendido: string;
  unidadesProductoMasVendido: number;
  productosSinStock: number;
  ventasPorCategoria: { categoria: string; porcentaje: number }[];
  evolucionPrecios: { mes: string; precio: number }[];
  topVendedores: { nombre: string; ingresos: number }[];
  topProductos: Producto[];
  vendedores: Vendedor[];
}

// ─── Payments App ─────────────────────────────────────────────────────────────

export interface Transaccion {
  id: string;
  compradorNombre: string;
  vendedorNombre: string;
  monto: number;
  estado: EstadoPedido;
  fecha: string;
  metodoPago: string;
}

export interface PaymentsStats {
  ingresosConfirmados: number;
  ingresosUltimosMeses: { mes: string; ingresos: number; meta: number }[];
  ticketPromedio: number;
  tasaCancelacion: number;
  ingresosPendientes: number;
  metodosPago: { metodo: string; porcentaje: number }[];
  ultimasTransacciones: Transaccion[];
}

// ─── Consolidado ──────────────────────────────────────────────────────────────

export type FetchErrorReason =
  | "url_not_configured"
  | "timeout"
  | "http_error"
  | "network_error"
  | "parse_error";

export interface DashboardData {
  buyer: BuyerStats;
  seller: SellerStats;
  payments: PaymentsStats;
  meta: {
    buyerAppOnline: boolean;
    sellerAppOnline: boolean;
    paymentsAppOnline: boolean;
    actualizadoEn: string;
    // Info de error y latencia por app (opcionales, presentes cuando offline)
    buyerError?: FetchErrorReason;
    sellerError?: FetchErrorReason;
    paymentsError?: FetchErrorReason;
    buyerLatencyMs?: number;
    sellerLatencyMs?: number;
    paymentsLatencyMs?: number;
  };
}