# 1.4 — Modelo de Datos por Aplicación

> **Tipo C — Marketplace**
---
## Decisión de diseño — alcance del marketplace

Para este proyecto, una ORDER pertenece a un único SELLER.

Implicancias:
- ORDER incluye un campo seller_id
- Todos los ORDER_ITEM pertenecen a ese mismo seller
- Buyer App envía una única orden a Seller App
- No se contempla el escenario multi-vendedor
---
 
 + `ORDER.payment_id` debe ser `null` en un principio ya que la orden se crea en estado `pending` hasta que se registre el pago procesado en *Payments App*
 + *Buyer* → reserva → → *Seller* crea `INCOMING_ORDER` como `pending` 
 + Si `PAYMENT.status` cambia a `approved`, *Buyer App* actualiza `ORDER.status`=`confirmed` 
 +  Si `PAYMENT.status` cambia a `approved`, *Seller App* cambia estado de `INCOMING_ORDER` a `confirmed`
---

## Buyer App

### Entidades principales
```mermaid
erDiagram
 
    BUYER {
        int id PK
        string clerk_user_id
        string nombre
        string email
        string direccion
        string estado
        datetime created_at
        datetime deleted_at
        string delete_reason
    }
 
    CART {
        int id PK
        int buyer_id FK
        int seller_id
        string estado
        datetime created_at
        datetime updated_at
    }
 
    CART_ITEM {
        int id PK
        int cart_id FK
        int product_id
        int cantidad
        decimal precio_unitario
        datetime created_at
    }
 
    ORDER {
        int id PK
        int seller_id
        int buyer_id FK
        decimal total
        string estado
        int payment_id
        datetime created_at
    }
 
    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id
        string product_name_snapshot
        decimal unit_price_snapshot
        int cantidad
        datetime created_at
    }
 
    FAVORITE {
        int id PK
        int buyer_id FK
        int product_id
        int seller_id
        datetime created_at
    }
 
    FORUM_THREAD {
        int id PK
        int buyer_id FK
        string titulo
        string contenido
        string planta_tag
        datetime created_at
        datetime updated_at
    }
 
    FORUM_REPLY {
        int id PK
        int thread_id FK
        int buyer_id FK
        string contenido
        datetime created_at
    }
 
    FORUM_REPLY_LIKE {
        int id PK
        int reply_id FK
        int buyer_id FK
        datetime created_at
    }
 
    ACCOUNT_NOTIFICATION {
        int id PK
        int buyer_id FK
        string tipo
        string titulo
        string mensaje
        boolean leida
        datetime created_at
    }
 
    BUYER ||--|| CART : posee
    BUYER ||--o{ FAVORITE : tiene
    BUYER ||--o{ ORDER : realiza
    BUYER ||--o{ FORUM_THREAD : publica
    BUYER ||--o{ FORUM_REPLY : responde
    BUYER ||--o{ FORUM_REPLY_LIKE : da
    BUYER ||--o{ ACCOUNT_NOTIFICATION : recibe
    CART ||--|{ CART_ITEM : contiene
    ORDER ||--|{ ORDER_ITEM : incluye
    FORUM_THREAD ||--o{ FORUM_REPLY : tiene
    FORUM_REPLY ||--o{ FORUM_REPLY_LIKE : acumula
```
- `ORDER.seller_id` es FK a Seller App (refleja un solo vendedor por compra)
- `CART.buyer_id` es FK a `BUYER.id`
- `ORDER.buyer_id` es FK a `BUYER.id`
- `CART_ITEM.cart_id` es FK a `CART.id`
- `CART_ITEM.product_id`: referencia externa a Seller App
- `ORDER_ITEM.order_id` es FK a `ORDER.id`
  
---

## Seller App

### Entidades principales
```mermaid
erDiagram
    SELLER {
        int id PK
        string clerk_user_id
        string nombre
        string email
        string city
        string dirección
        string icon
        SellerStatus estado
    }

    PRODUCT {
        int id PK
        int seller_id FK
        ProductCategory category
        string nombre
        string descripcion
        decimal precio
        int stock_available
        int stock_reserved
        string imagen
        ProductStatus estado
        datetime created_at
    }

    INCOMING_ORDER {
        int id PK
        int seller_id FK
        string buyer_order_id
        string buyer_id
        decimal total
        IncomingOrderStatus estado
        datetime created_at
    }
    INCOMING_ORDER_ITEM {
        int id PK
        int incoming_order_id FK
        int product_id FK
        string product_name_snapshot
        decimal unit_price_snapshot
        int cantidad
    }
    PAYOUT_NOTIFICATION {
        int id PK
        int seller_id FK
        string payment_id
        float amount
        string currency
        boolean read
        datetime created_at
    }


    SELLER ||--o{ PRODUCT : publica
    SELLER ||--o{ INCOMING_ORDER : recibe
    SELLER ||--o{ PAYOUT_NOTIFICATION : recibe
    INCOMING_ORDER ||--o{ INCOMING_ORDER_ITEM : tiene
    PRODUCT ||--O{ INCOMING_ORDER_ITEM : aparece
```
- `PRODUCT.seller_id` es FK a `SELLER.id`
- `INCOMING_ORDER.seller_id` es FK a `SELLER.id`
- `INCOMING_ORDER.buyer_order_id`: referencia externa a Buyer App
- `INCOMING_ORDER_ITEM.incoming_order_id` es FK a `INCOMING_ORDER.id`
- `INCOMING_ORDER_ITEM.product_id` es FK a `PRODUCT.id`
- `PAYOUT_NOTIFICATION.seller_id` es FK a `SELLER.id`
  
---

## Payments App

### Entidades principales
```mermaid
erDiagram
    PAYMENT {
        int id PK
        string description
        int seller_id
        int order_id
        int buyer_id
        decimal amount
        string currency
        payment_status status
        datetime created_at
        datetime updated_at
        string buyer_email
    }
    %%datos repetidos amount currency description
    PAYOUT {
        int id PK
        int seller_id
        float amount
        
        string seller_email
        int payment_id FK
        decimal amount
        payout_string status
        datetime created_at
        datetime upadated_at
    }

    PAYMENT ||--|| PAYOUT : genera
```
- `PAYOUT.payment_id` es FK a `PAYMENT.id`
- `PAYMENT.order_id`: referencia externa a Buyer App
- `PAYMENT.seller_id` y `PAYMENT.seller_id` : referencia externa a Seller App
---

### Enum: ProductCategory
Valores posibles para `PRODUCT.category`:
- suculentas
- plantas_de_interior
- aromaticas
- frutales
- cactus
- colecciones_raras
- macetas_y_kits

## Definición de estados

### `INCOMING_ORDER.status`
`{ pendiente, recibida, en_preparacion, listo, entregada}`
> `Seller` marca orden como entregada → `POST`→ `Buyer App`
### `ORDER.status`
`{pendiente, caducada, confirmada, en_preparacion, listo, entregada}`
> una vez que `Payments App` apruebe el pago se cambia a confirmada: `POST`

### `CART.status`
`{active, checked_out, abandoned}`

### `PRODUCT.status`
`{active, inactive}`

### `PAYMENT.status`
`{pending, approved, rejected}`

### `PAYOUT.status`
`{pending, paid}`

---

## Datos duplicados y estrategia de consistencia

| Dato duplicado | Apps que lo tienen | Fuente de verdad | Estrategia |
|----------------|--------------------|-----------------|------------|
| Usuario (clerk_user_id) | Todas | Clerk | Cada app sincroniza al primer login vía webhook o lazy load |
| Producto (product_id, nombre, precio) |Seller App, Buyer App |Seller App |Buyer App consulta el producto vía API y guarda un snapshot del nombre y precio al confirmar la compra para preservar historial |
|Orden (order_id, estado)|Todas|Buyer App|Buyer App genera la orden y notifica a Seller App y Payments App vía API. Cada app mantiene una copia local del estado asociado|
|Estado de pago (payment_id, estado)|Buyer App, Payments App|Payments App|Payments App expone el estado vía API y Buyer App consulta o sincroniza actualizaciones para mostrar el estado al comprador|
|Datos del vendedor (seller_id)|Seller App, Payments App|Seller App|Payments App recibe el seller_id al registrar el pago y lo usa para generar acreditaciones, sin replicar más información del vendedor|
