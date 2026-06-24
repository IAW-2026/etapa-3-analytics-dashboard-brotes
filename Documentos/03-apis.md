# 1.3 — Diseño de APIs Inter-Servicios

> **Tipo C — Marketplace**

Documentar cada endpoint que una app expone para ser consumido por otra app del sistema. Este contrato debe estar acordado por todos los integrantes antes de comenzar la Etapa 2.

---
## Autenticación inter-servicios

Todas las requests entre apps deben incluir:

Authorization: Bearer <SERVICE_API_KEY>

Cada servicio validará esta API key antes de procesar la request.
---

## Buyer App — Endpoints expuestos
<!-- Documentar los endpoints que expone esta app -->
+ `GET /api/orders/:id`
  - **Lo usa *Payments App***
  - Devuelve la información de una orden registrada (confirmada), incluyendo su estado, items.
  - Para detalle de pago
  - ```json
    response:
      {
        "id": "ord_123",
        "buyer_id": "usr_456",
        "seller_id": "usr_789",
        "status": "confirmed",
        "total": {
          "amount": 15000,
          "currency": "ARS"
        },
        "payment_id": "pay_001",
        "items": [
          {
            "product_id": "prod_1",
            "product_name": "Producto X",
            "unit_price": 5000,
            "quantity": 2,
            "subtotal": 10000
          }
        ],
        "created_at": "2026-05-03T10:00:00Z"
      }
    ```
+ `POST/api/approved-payment/:id`
  - **Lo usa *Payments App***
  - Para notificar desde Payments App a Buyer que su pago fue aprobado
  - ```json
      request:
      {
        "order_id": "ord_001",
        "buyer_id": "usr_789",
        "amount": { "value": 15000, "currency": "ARS" },
        "created_at": "2026-05-03T10:00:00Z"
      }
      response: 201 Created
      {
        "acknowledged": true, //informado
        "payment_id": "po_001",
        "buyer_id": "usr_789"
      }  
      ```
    
+ `POST/api/rejected-payment/:id`
  - **Lo usa *Payments App***
  - Para notificar desde Payments App a Buyer que su pago fue rechazado
  - ```json
        request:
        {
          "order_id": "ord_001",
          "payment_id": "pay_001",
          "buyer_id": "usr_789",
          "amount": { "value": 15000, "currency": "ARS" },
          "created_at": "2026-05-03T10:00:00Z"
        }
        response: 201 Created
        {
          "acknowledged": true, //informado
          "payment_id": "po_001",
          "buyer_id": "usr_789"
        }
       ```
    
+ `POST /api/orders/:id/status-update`
  - Sirve para informar desde Seller a Buyer el estado de us pedido: en preparación, listo entregado
  - ```json
        request:
        {
          "order_id": "ord_123",
          "payment_id": "pay_001",
          "status": "ready_for_pickup",
          "updated_at": "2026-05-03T12:00:00Z"
        }
        response: 200 OK
        {
          "acknowledged": true,
          "order_id": "ord_123",
          "status": "ready_for_pickup"
        }
        ```
---

## Seller App — Endpoints expuestos
<!-- Documentar los endpoints que expone esta app -->

+ `POST /api/stock-reservations`
  - **Lo usa *Buyer App***
  - Reserva stock temporalmente para una compra iniciada desde Buyer App antes de procesar el pago.
  - Si hay stock suficiente, Seller reduce el stock disponible y marca las unidades como reservadas.
  - ```json
    request:
    {
      "buyer_id": "usr_456",
      "buyer_order_id": "ord_557",
      "items": [
        {
          "product_id": "prod_1",
          "quantity": 2
        }
      ]
    }

    response: 201 Created
    {
      "incoming_order_id": "ord_557",
      "status": "reserved",
      "items": [
        {
          "product_id": "prod_1",
          "quantity": 2
        }
      ],
      "created_at": "2026-05-03T10:00:00Z"
    }
    ```

+ `POST /api/stock-reservations/:id/reject`
  - **Lo usa *Payments App***
  - Cancela una reserva de stock existente y libera nuevamente las unidades reservadas.
    - Utilizado cuando el pago es rechazado.
  - ```json
    request:
    {
      "buyer_order_id": "ord_001",
      "rejected_at": "2026-05-03T10:10:00Z"
    }
    
    response: 200 OK
    {
      "buyer_order_id": "res_123",
      "status": "cancelled",
      "released_at": "2026-05-03T10:08:00Z"
    }
    ```

+ `POST /api/stock-reservations/:id/confirm`
  - **Lo usa *Payments App***
  - Confirma una reserva de stock luego de que Payments App aprueba el pago.
  - El stock reservado pasa a considerarse definitivamente vendido.
  - ```json
    request:
    {
      "buyer_order_id": "ord_001",
      "confirmed_at": "2026-05-03T10:10:00Z"
    }

    response: 200 OK
    {
      "buyer_order_id": "res_123",
      "status": "confirmed",
      "payment_id": "pay_001",
      "confirmed_at": "2026-05-03T10:10:00Z"
    }
    ```
    
+ `POST /api/incoming-payouts`
  - **Lo usa *Payments App***
  - Para notificar la acreditación de un pago desde Payments app a Seller
  - ```json
        request:
      {
        "payout_id": "po_001",
        "payment_id": "pay_001",
        "seller_id": "usr_789",
        "amount": { "value": 15000, "currency": "ARS" },
        "created_at": "2026-05-03T10:00:00Z"
      }
      response: 201 Created
      {
        "acknowledged": true, //informado
        "payout_id": "po_001",
        "seller_id": "usr_789"
      }
    ``` 
+ `GET /api/products`
  - **Lo usa *Buyer App***
  - Lista de productos disponibles.
  - Query params:
    - `page` (number)
    - `limit` (number)
  - ```json
    response:
    {
      "data": [
        {
          "id": "prod_1",
          "seller_id": "usr_789",
          "name": "Producto X",
          "category": "electronica",
          "price": { "amount": 5000, "currency": "ARS" },
          "stock": { "available": 10, "status": "in_stock" },
          "image_url": "https://..."
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 245,
        "total_pages": 13
      }
    }
    ```
+ GET /api/sellers/:seller_id/products/:id
  - **Lo usa *Buyer App***
  - Obtiene el detalle de un producto específico, incluyendo precio y stock disponible.
  - ```json
    response:
    {
      "id": "prod_1",
      "seller_id": "usr_789",
      "name": "Producto X",
      "description": "Descripción del producto",
      "category": "electronica",
      "price": { "amount": 5000, "currency": "ARS" },
      "stock": { "available": 10, "reserved": 2, "status": "in_stock" },
      "image_url": "https://...",
      "estado": "active",
      "created_at": "2026-01-15T10:00:00Z"
    }
    ```

+ `GET /api/sellers`
  - **Lo usa *Buyer App***
  - Devuelve un listado de todos los sellers, con parametros de busqueda se puede filtrar...
  - ```json
      response:
      "sellers":[
      {
        "id": "usr_789",
        "name": "Tienda XYZ",
        "email": "tienda@xyz.com",
        "city": "Buenos Aires",
        "address": "Av. Corrientes 1234",
        "icon_url": "https://...",
        "products_count": 42
      },
      ...
      ]
    ```

  
---

## Payments App — Endpoints expuestos
<!-- Documentar los endpoints que expone esta app -->
+ Estados posibles de payment: `{ pending , approved , rejected }`
+ `POST /api/payments`
  - **Lo usa *Buyer App***
  - Procesa el pago de una compra iniciada desde la Buyer App.
  - ```json
    request:
     {
      "order_id": "ord_123",
      "buyer_id": "usr_456",
      "seller_id": "usr_789",
      "amount": 15000,
      "currency": "ARS",
      "payment_method": {
        "type": "card",
        "card_token": "tok_abc123"
          }
      }
    response: 201 Created
      {
        "payment_id": "pay_001",
        "order_id": "ord_123",
        "status": "approved",
        "amount": { "value": 15000, "currency": "ARS" },
        "created_at": "2026-05-03T10:00:00Z"
      }
      ```
   
+ `GET /api/payments/:id` \*revisar
  - **Lo usa *Buyer App***
  - Consulta un pago registrado. →  buyer
  - ```json
    response:
    {
      "payment_id": "pay_001",
      "order_id": "ord_123",
      "buyer_id": "usr_456",
      "seller_id": "usr_789",
      "status": "approved",
      "amount": { "value": 15000, "currency": "ARS" },
      "created_at": "2026-05-03T10:00:00Z"
    }
    ```
  - Se crea el payout → se notifica a seller

  
+ `GET /api/payouts/:sellerId` \*revisar
  - **Lo usa *Seller App***
  - Devuelve las acreditaciones asociadas a un vendedor (pendientes o aprobadas).
  - ```json
    response:
    {
      "seller_id": "usr_789",
      "payouts": [
        {
          "payout_id": "po_001",
          "payment_id": "pay_001",
          "amount": { "value": 10000, "currency": "ARS" },
          "status": "paid",
          "created_at": "2026-05-03T10:00:00Z"
        }
      ],
      "total_paid": { "value": 10000, "currency": "ARS" }
    }
    ``` 
---

<!-- Agregar secciones por cada integración adicional identificada -->
