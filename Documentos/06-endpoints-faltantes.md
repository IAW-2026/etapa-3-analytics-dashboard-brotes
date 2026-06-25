# 1.6 — Endpoints necesarios para Analytics Dashboard

> **Tipo C — Marketplace**

Mapeo de endpoints existentes vs. datos que necesita el dashboard, y propuesta de nuevos endpoints por app.

---

## Buyer App — Endpoints existentes

| Endpoint actual | Sirve para analytics |
|---|---|
| `GET /api/orders/:id` | ❌ Solo 1 orden, no agrega |
| `POST /api/approved-payment/:id` | ❌ Webhook operacional |
| `POST /api/rejected-payment/:id` | ❌ Webhook operacional |
| `POST /api/orders/:id/status-update` | ❌ Webhook operacional |

### Datos que necesita el dashboard y no tienen endpoint

| Dato faltante | Uso en dashboard |
|---|---|
| `totalCompradores`, `compradoresActivos`, `suspendidos`, `eliminados` | Resumen KPIs, Usuarios |
| `registrosPorSemana` (últimas 8 semanas) | Resumen, Usuarios (crecimiento) |
| `pedidosPorMes` (últimos 6 meses, c/ estado) | Ventas, Resumen |
| `distribucionEstadosPedidos` (global) | Resumen |
| `ultimosPedidos` (lista c/ datos completos) | Ventas (tabla) |
| `hilosForo` (top hilos) + `totalHilosForo` + `totalRespuestasForo` | Comunidad |
| `actividadForoPorSemana` (últimas 8 semanas) | Comunidad |
| `usuariosConFavoritos` | Comunidad |

### Endpoints nuevos necesarios en Buyer App

```
GET /api/analytics/buyers
  → totalCompradores, compradoresActivos, suspendidos, eliminados, registrosPorSemana

GET /api/analytics/orders
  → pedidosPorMes, distribucionEstadosPedidos, ultimosPedidos

GET /api/analytics/forum
  → hilosForo, totalHilosForo, totalRespuestasForo, actividadForoPorSemana, usuariosConFavoritos
```

---

## Seller App — Endpoints existentes

| Endpoint actual | Sirve para analytics |
|---|---|
| `GET /api/sellers` | ✅ Parcial — da lista de vendedores con `name`, `city`, `products_count`. **Falta:** `estado`, `ventasMes` |
| `GET /api/products` | ✅ Parcial — da lista paginada de productos. **Falta:** no hay datos de ventas (unidades vendidas, ingresos) |
| `GET /api/sellers/:seller_id/products/:id` | ❌ Solo 1 producto |
| `POST /api/stock-reservations` | ❌ Operacional |
| `POST /api/stock-reservations/:id/confirm` | ❌ Operacional |
| `POST /api/stock-reservations/:id/reject` | ❌ Operacional |
| `POST /api/incoming-payouts` | ❌ Webhook |

### Datos que necesita el dashboard y no tienen endpoint

| Dato faltante | Uso en dashboard |
|---|---|
| `vendedores` con `estado` + `ventasMes` | Usuarios (tabla + estado) |
| `productosSinStock` | Catálogo |
| `precioPromedio` | Catálogo |
| `productoMasVendido` + `unidadesProductoMasVendido` | Catálogo |
| `ventasPorCategoria` | Resumen, Catálogo |
| `evolucionPrecios` (6 meses) | Catálogo |
| `topVendedores` por ingresos | Ventas |
| `topProductos` con `unidadesVendidas` + `ingresoTotal` | Catálogo |

### Endpoints nuevos necesarios en Seller App

```
GET /api/analytics/sellers
  → totalVendedores, vendedoresActivos, lista de vendedores con estado + ventasMes

GET /api/analytics/products
  → totalProductos, precioPromedio, productosSinStock, productoMasVendido,
     unidadesProductoMasVendido, ventasPorCategoria, evolucionPrecios, topProductos

GET /api/analytics/revenue
  → topVendedores por ingresos
```

Además, hay que ampliar `GET /api/sellers` actual para que incluya `estado` (activo/inactivo) y `ventasMes`, que el dashboard necesita en la tabla de vendedores.

---

## Payments App — Endpoints existentes

| Endpoint actual | Sirve para analytics |
|---|---|
| `POST /api/payments` | ❌ Operacional |
| `GET /api/payments/:id` | ❌ 1 pago, no agrega |
| `GET /api/payouts/:sellerId` | ❌ Por seller, no agrega |

### Datos que necesita el dashboard y no tienen endpoint

| Dato faltante | Uso en dashboard |
|---|---|
| `ingresosConfirmados` | Resumen, Ventas |
| `ingresosUltimosMeses` (8 meses c/ meta) | Resumen |
| `ticketPromedio` | Ventas |
| `tasaCancelacion` | Ventas |
| `ingresosPendientes` | Ventas |
| `metodosPago` (distribución) | Ventas |
| `ultimasTransacciones` (lista) | Ventas |

### Endpoints nuevos necesarios en Payments App

```
GET /api/analytics/revenue
  → ingresosConfirmados, ingresosUltimosMeses, ticketPromedio,
     tasaCancelacion, ingresosPendientes

GET /api/analytics/transactions
  → ultimasTransacciones, metodosPago
```

---

## Resumen consolidado: 9 endpoints nuevos

| App | Endpoint nuevo | Datos que resuelve |
|-----|---------------|-------------------|
| **Buyer** | `GET /api/analytics/buyers` | Total/activos/suspendidos/eliminados, registros semanales |
| **Buyer** | `GET /api/analytics/orders` | Pedidos por mes, distribución estados, últimos pedidos |
| **Buyer** | `GET /api/analytics/forum` | Hilos, respuestas, actividad semanal, favoritos |
| **Seller** | `GET /api/analytics/sellers` | Vendedores c/ estado + ventas, totales |
| **Seller** | `GET /api/analytics/products` | Productos, precios, categorías, top productos |
| **Seller** | `GET /api/analytics/revenue` | Top vendedores por ingresos |
| **Payments** | `GET /api/analytics/revenue` | Ingresos, ticket promedio, cancelación, pendientes |
| **Payments** | `GET /api/analytics/transactions` | Últimas transacciones, métodos de pago |

---

## Alternativa más simple: 3 endpoints (uno por app)

Si prefieren minimizar la cantidad de endpoints nuevos, pueden usar el diseño que ya está implementado del lado del dashboard en `lib/api.ts`:

| App | Endpoint |
|-----|----------|
| **Buyer** | `GET /api/analytics` → `BuyerStats` completo |
| **Seller** | `GET /api/analytics` → `SellerStats` completo |
| **Payments** | `GET /api/analytics` → `PaymentsStats` completo |

Cada endpoint único consolida todos los datos de esa app en una sola respuesta. Es más fácil de implementar y mantener (1 ruta por app en vez de 3-4), y el dashboard ya está diseñado para consumir exactamente esos objetos.
