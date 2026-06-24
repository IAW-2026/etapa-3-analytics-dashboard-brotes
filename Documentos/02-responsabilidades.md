# 1.2 — Asignación de Responsabilidades

> **Tipo C — Marketplace**

## Distribución de webapps

| App          | Responsable                 | Repositorio                    |
| ------------ | --------------------------- | ------------------------------ |
| Buyer App    | Lucas Valentin Villarreal   | `proyecto-c-buyer-brotes`      |
| Seller App   | Catalina Dumrauf            | `proyecto-c-seller-brotes`     |
| Payments App | Sebastián Santiago Sandoval | `proyecto-c-payments-brotes`   |

---

## Datos propios de cada app
- Cada app gestiona su **propia base de datos** de forma completamente independiente. Esto significa que no hay una base de datos compartida: si la Buyer App necesita información de un producto que vive en la Seller App, debe pedirla mediante un **request HTTP** a la **API REST** de la Seller App, no accediendo directamente a su base de datos.
- Cuando un dato de otra app se necesita de forma persistente (por ejemplo, el precio del producto al momento de una compra), se guarda localmente como un snapshot — una copia inmutable del dato en ese instante — para evitar inconsistencias futuras.

### Buyer App
- Perfil del comprador
- Carritos activos y sus ítems (con snapshot de precio y nombre del producto)
- Pedidos confirmados y sus líneas (snapshot completo del producto al momento de la compra)
  - Notificar reserva de stock para compra
- Historial de compras
- Estado del pedido

### Seller App
- Perfil del vendedor (nombre del vivero, descripción, datos de contacto)
- Categorías de productos del catálogo
- Productos publicados (nombre, descripción, precio, stock disponible, imágenes, estado)
  - Notificar si hay stock disponible
- Pedidos entrantes recibidos desde la Buyer App (representación local con snapshot)
- Estado de preparación/venta de pedidos
  - Notificar estado del pedido

### Payments App
- Transacciones de pago
  - Notificar cuando un pago se aprobó -> Buyer & Seller
- Estado de pagos
  - Notificar pago rechazado ->  Buyer & Seller
- Acreditaciones a vendedores
  - Notificar cuando una acreditación se efectuó
- Historial de movimientos
- Registros de pagos rechazados


---

## Datos o acciones que requieren comunicación entre apps

| App origen         | Acción / dato necesario                                      | App destino                                   | API involucrada            |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------- | -------------------------- |
| ***Buyer App***    | Listado y detalle de productos                               | Seller App                                    | API de Productos           |
|                    | Verificación de stock antes de confirmar el pedido           | Seller App                                    | API de Productos           |
|                    | Notificar la creación de un pedido                           | Seller App                                    | API de Pedidos             |
|                    | Registrar pago de una compra                                 | Payments App                                  | API de Pagos               |
|                    | Consultar el estado del pago                                 | Payments App                                  | API de Pagos               |
| ***Seller App***   | Recibir notificaciones de nuevos pedidos                     | (pasivo: la Buyer App hace POST a esta app)   | API de Pedidos             |
|                    | Consultar acreditaciones recibidas                           | Payments App                                  | API de Pagos               |
| ***Payments App*** | Recibir solicitud de cobro                                   | (pasivo: la Buyer App hace POST)              | API de Pagos               |
|                    | Consultar información de una orden asociada a un pago        | Buyer App                                     | API de Pedidos             |
