import { z } from "zod";

const estadoPedidoSchema = z.enum(["pendiente", "confirmado", "enviado", "entregado", "cancelado"]);

const pedidoSchema = z.object({
  id: z.string(),
  compradorId: z.string(),
  compradorNombre: z.string(),
  vendedorNombre: z.string(),
  monto: z.number(),
  estado: estadoPedidoSchema,
  creadoEn: z.string(),
});

const distribucionEstadosSchema = z.object({
  estado: estadoPedidoSchema,
  cantidad: z.number(),
  porcentaje: z.number(),
});

const pedidosPorMesSchema = z.object({
  mes: z.string(),
  completados: z.number(),
  enProceso: z.number(),
  cancelados: z.number(),
});

const actividadForoSchema = z.object({
  hilos: z.number(),
  respuestas: z.number(),
});

export const buyerStatsSchema = z.object({
  totalCompradores: z.number(),
  compradoresActivos: z.number(),
  compradoresSuspendidos: z.number(),
  compradoresEliminados: z.number(),
  registrosPorSemana: z.array(z.number()),
  pedidosPorMes: z.array(pedidosPorMesSchema),
  distribucionEstadosPedidos: z.array(distribucionEstadosSchema),
  ultimosPedidos: z.array(pedidoSchema),
  hilosForo: z.array(z.object({
    id: z.string(),
    titulo: z.string(),
    autor: z.string(),
    respuestas: z.number(),
    likes: z.number(),
    creadoEn: z.string(),
  })),
  totalHilosForo: z.number(),
  totalRespuestasForo: z.number(),
  usuariosConFavoritos: z.number(),
  actividadForoPorSemana: z.array(actividadForoSchema),
});

const ventasPorCategoriaSchema = z.object({
  categoria: z.string(),
  porcentaje: z.number(),
});

const vendedorSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  ciudad: z.string(),
  totalProductos: z.number(),
  ventasMes: z.number(),
  estado: z.enum(["activo", "inactivo"]),
});

const productoResumidoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  categoria: z.string(),
  vendedorNombre: z.string(),
  precio: z.number(),
  unidadesVendidas: z.number(),
  ingresoTotal: z.number(),
});

const topVendedorSchema = z.object({
  nombre: z.string(),
  ingresos: z.number(),
});

export const sellerStatsSchema = z.object({
  totalVendedores: z.number(),
  vendedoresActivos: z.number(),
  totalProductos: z.number(),
  precioPromedio: z.number(),
  productoMasVendido: z.string(),
  unidadesProductoMasVendido: z.number(),
  productosSinStock: z.number(),
  ventasPorCategoria: z.array(ventasPorCategoriaSchema),
  evolucionPrecios: z.array(z.object({ mes: z.string(), precio: z.number() })),
  topVendedores: z.array(topVendedorSchema),
  topProductos: z.array(productoResumidoSchema),
  vendedores: z.array(vendedorSchema),
});

const ingresosMensualesSchema = z.object({
  mes: z.string(),
  ingresos: z.number(),
  meta: z.number(),
});

const metodoPagoSchema = z.object({
  metodo: z.string(),
  porcentaje: z.number(),
});

const transaccionSchema = z.object({
  id: z.string(),
  compradorNombre: z.string(),
  vendedorNombre: z.string(),
  monto: z.number(),
  estado: estadoPedidoSchema,
  fecha: z.string(),
  metodoPago: z.string(),
});

export const paymentsStatsSchema = z.object({
  ingresosConfirmados: z.number(),
  ingresosUltimosMeses: z.array(ingresosMensualesSchema),
  ticketPromedio: z.number(),
  tasaCancelacion: z.number(),
  ingresosPendientes: z.number(),
  metodosPago: z.array(metodoPagoSchema),
  ultimasTransacciones: z.array(transaccionSchema),
});
