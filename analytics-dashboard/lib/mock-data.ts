import type {
  BuyerStats,
  SellerStats,
  PaymentsStats,
} from "./types";

export const mockBuyerStats: BuyerStats = {
  totalCompradores: 1124,
  compradoresActivos: 843,
  compradoresSuspendidos: 47,
  compradoresEliminados: 234,

  registrosPorSemana: [12, 18, 9, 22, 15, 28, 19, 31],

  pedidosPorMes: [
    { mes: "Ene", completados: 78, enProceso: 22, cancelados: 8 },
    { mes: "Feb", completados: 92, enProceso: 31, cancelados: 6 },
    { mes: "Mar", completados: 105, enProceso: 28, cancelados: 10 },
    { mes: "Abr", completados: 118, enProceso: 35, cancelados: 7 },
    { mes: "May", completados: 134, enProceso: 41, cancelados: 9 },
    { mes: "Jun", completados: 108, enProceso: 46, cancelados: 8 },
  ],

  distribucionEstadosPedidos: [
    { estado: "entregado", cantidad: 635, porcentaje: 51 },
    { estado: "enviado", cantidad: 212, porcentaje: 17 },
    { estado: "confirmado", cantidad: 199, porcentaje: 16 },
    { estado: "pendiente", cantidad: 125, porcentaje: 10 },
    { estado: "cancelado", cantidad: 76, porcentaje: 6 },
  ],

  ultimosPedidos: [
    { id: "ORD-1841", compradorId: "u1", compradorNombre: "M. Gómez", vendedorNombre: "Vivero El Ceibo", monto: 7200, estado: "entregado", creadoEn: "2026-06-13" },
    { id: "ORD-1840", compradorId: "u2", compradorNombre: "L. Fernández", vendedorNombre: "Raíces Vivas", monto: 3450, estado: "enviado", creadoEn: "2026-06-13" },
    { id: "ORD-1839", compradorId: "u3", compradorNombre: "P. Rodríguez", vendedorNombre: "Vivero El Ceibo", monto: 12800, estado: "confirmado", creadoEn: "2026-06-12" },
    { id: "ORD-1838", compradorId: "u4", compradorNombre: "C. Martínez", vendedorNombre: "Brotes del Sur", monto: 2100, estado: "pendiente", creadoEn: "2026-06-12" },
    { id: "ORD-1837", compradorId: "u5", compradorNombre: "A. López", vendedorNombre: "Verde Nativo", monto: 5600, estado: "entregado", creadoEn: "2026-06-11" },
    { id: "ORD-1836", compradorId: "u6", compradorNombre: "R. Pérez", vendedorNombre: "Raíces Vivas", monto: 890, estado: "cancelado", creadoEn: "2026-06-11" },
    { id: "ORD-1835", compradorId: "u7", compradorNombre: "V. Torres", vendedorNombre: "Vivero El Ceibo", monto: 4320, estado: "entregado", creadoEn: "2026-06-10" },
    { id: "ORD-1834", compradorId: "u8", compradorNombre: "N. Ruiz", vendedorNombre: "Verde Nativo", monto: 1750, estado: "enviado", creadoEn: "2026-06-10" },
  ],

  hilosForo: [
    { id: "h1", titulo: "¿Cuándo regar un pothos en invierno?", autor: "L. Fernández", respuestas: 34, likes: 87, creadoEn: "2026-06-08" },
    { id: "h2", titulo: "Mis cactus se ponen amarillos — ayuda", autor: "M. Gómez", respuestas: 28, likes: 64, creadoEn: "2026-06-05" },
    { id: "h3", titulo: "Recomendaciones de viveros en Bahía", autor: "V. Torres", respuestas: 21, likes: 52, creadoEn: "2026-06-02" },
    { id: "h4", titulo: "Tips para Monstera en departamento", autor: "P. Rodríguez", respuestas: 19, likes: 41, creadoEn: "2026-05-28" },
    { id: "h5", titulo: "Tierra para suculentas — ¿perlita sí o no?", autor: "C. Martínez", respuestas: 16, likes: 38, creadoEn: "2026-05-21" },
  ],

  totalHilosForo: 312,
  totalRespuestasForo: 1847,
  usuariosConFavoritos: 689,

  actividadForoPorSemana: [
    { hilos: 8, respuestas: 42 },
    { hilos: 12, respuestas: 68 },
    { hilos: 7, respuestas: 51 },
    { hilos: 15, respuestas: 89 },
    { hilos: 11, respuestas: 74 },
    { hilos: 18, respuestas: 112 },
    { hilos: 14, respuestas: 98 },
    { hilos: 24, respuestas: 183 },
  ],
};

export const mockSellerStats: SellerStats = {
  totalVendedores: 38,
  vendedoresActivos: 35,
  totalProductos: 461,
  precioPromedio: 2840,
  productoMasVendido: "Pothos Dorado",
  unidadesProductoMasVendido: 143,
  productosSinStock: 23,

  ventasPorCategoria: [
    { categoria: "Interior", porcentaje: 31 },
    { categoria: "Suculentas", porcentaje: 24 },
    { categoria: "Exterior", porcentaje: 18 },
    { categoria: "Macetas", porcentaje: 14 },
    { categoria: "Otros", porcentaje: 13 },
  ],

  topVendedores: [
    { nombre: "El Ceibo", ingresos: 892 },
    { nombre: "Raíces Vivas", ingresos: 734 },
    { nombre: "Verde Nativo", ingresos: 421 },
    { nombre: "Brotes Sur", ingresos: 319 },
    { nombre: "La Selva", ingresos: 287 },
    { nombre: "Cactáceas", ingresos: 199 },
  ],

  topProductos: [
    { id: "p1", nombre: "Pothos Dorado", categoria: "Interior", vendedorNombre: "Raíces Vivas", precio: 1200, unidadesVendidas: 143, ingresoTotal: 171600 },
    { id: "p2", nombre: "Cactus Columnar", categoria: "Suculentas", vendedorNombre: "Cactáceas Finas", precio: 3500, unidadesVendidas: 97, ingresoTotal: 339500 },
    { id: "p3", nombre: "Sansevieria Cylindrica", categoria: "Interior", vendedorNombre: "Verde Nativo", precio: 2800, unidadesVendidas: 84, ingresoTotal: 235200 },
    { id: "p4", nombre: "Monstera Deliciosa", categoria: "Interior", vendedorNombre: "La Selva Urbana", precio: 5200, unidadesVendidas: 76, ingresoTotal: 395200 },
    { id: "p5", nombre: "Lavanda en maceta", categoria: "Exterior", vendedorNombre: "Vivero El Ceibo", precio: 1800, unidadesVendidas: 68, ingresoTotal: 122400 },
    { id: "p6", nombre: "Kit suculentas x3", categoria: "Suculentas", vendedorNombre: "Brotes del Sur", precio: 2400, unidadesVendidas: 61, ingresoTotal: 146400 },
  ],

  vendedores: [
    { id: "v1", nombre: "Vivero El Ceibo", ciudad: "Bahía Blanca", totalProductos: 87, ventasMes: 892400, estado: "activo" },
    { id: "v2", nombre: "Raíces Vivas", ciudad: "Buenos Aires", totalProductos: 124, ventasMes: 734200, estado: "inactivo" },
    { id: "v3", nombre: "Verde Nativo", ciudad: "Rosario", totalProductos: 56, ventasMes: 421000, estado: "activo" },
    { id: "v4", nombre: "Brotes del Sur", ciudad: "Mar del Plata", totalProductos: 43, ventasMes: 318900, estado: "activo" },
    { id: "v5", nombre: "La Selva Urbana", ciudad: "Córdoba", totalProductos: 92, ventasMes: 287300, estado: "activo" },
    { id: "v6", nombre: "Cactáceas Finas", ciudad: "Mendoza", totalProductos: 31, ventasMes: 198700, estado: "activo" },
    { id: "v7", nombre: "El Jardín Norteño", ciudad: "Salta", totalProductos: 28, ventasMes: 112400,  estado: "inactivo" },
  ],
};

export const mockPaymentsStats: PaymentsStats = {
  ingresosConfirmados: 3840000,

  ingresosUltimosMeses: [
    { mes: "Nov", ingresos: 2100000, meta: 2500000 },
    { mes: "Dic", ingresos: 2800000, meta: 2500000 },
    { mes: "Ene", ingresos: 1900000, meta: 2500000 },
    { mes: "Feb", ingresos: 2400000, meta: 3000000 },
    { mes: "Mar", ingresos: 3100000, meta: 3000000 },
    { mes: "Abr", ingresos: 3400000, meta: 3200000 },
    { mes: "May", ingresos: 3600000, meta: 3500000 },
    { mes: "Jun", ingresos: 3840000, meta: 3700000 },
  ],

  ticketPromedio: 3079,
  tasaCancelacion: 6.1,
  ingresosPendientes: 124000,

  metodosPago: [
    { metodo: "Transferencia bancaria", porcentaje: 58 },
    { metodo: "Tarjeta de débito", porcentaje: 24 },
    { metodo: "Tarjeta de crédito", porcentaje: 12 },
    { metodo: "Efectivo / otro", porcentaje: 6 },
  ],

  ultimasTransacciones: [
    { id: "ORD-1841", compradorNombre: "M. Gómez", vendedorNombre: "Vivero El Ceibo", monto: 7200, estado: "entregado", fecha: "2026-06-13", metodoPago: "Transferencia" },
    { id: "ORD-1840", compradorNombre: "L. Fernández", vendedorNombre: "Raíces Vivas", monto: 3450, estado: "enviado", fecha: "2026-06-13", metodoPago: "Débito" },
    { id: "ORD-1839", compradorNombre: "P. Rodríguez", vendedorNombre: "Vivero El Ceibo", monto: 12800, estado: "confirmado", fecha: "2026-06-12", metodoPago: "Transferencia" },
    { id: "ORD-1838", compradorNombre: "C. Martínez", vendedorNombre: "Brotes del Sur", monto: 2100, estado: "pendiente", fecha: "2026-06-12", metodoPago: "Crédito" },
    { id: "ORD-1837", compradorNombre: "A. López", vendedorNombre: "Verde Nativo", monto: 5600, estado: "entregado", fecha: "2026-06-11", metodoPago: "Transferencia" },
    { id: "ORD-1836", compradorNombre: "R. Pérez", vendedorNombre: "Raíces Vivas", monto: 890, estado: "cancelado", fecha: "2026-06-11", metodoPago: "Débito" },
    { id: "ORD-1835", compradorNombre: "V. Torres", vendedorNombre: "Vivero El Ceibo", monto: 4320, estado: "entregado", fecha: "2026-06-10", metodoPago: "Transferencia" },
    { id: "ORD-1834", compradorNombre: "N. Ruiz", vendedorNombre: "Verde Nativo", monto: 1750, estado: "enviado", fecha: "2026-06-10", metodoPago: "Débito" },
  ],
};