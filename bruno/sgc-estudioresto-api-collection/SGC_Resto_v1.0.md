# API REST — Sistema de Gestión Gastronómico

**Versión:** v1.0 | **Última modificación:** 30/03/2026  
**Soporte:** soporte@estudioinformatico.com

---

## 1. Introducción

Esta documentación describe los endpoints disponibles en la API REST del Sistema de Gestión Gastronómico (SGC). La API permite gestionar autenticación de usuarios y mozos, consultar y crear órdenes, administrar mesas, menú y el personal de un restaurante.

Todos los endpoints devuelven datos en formato JSON. La mayoría requiere autenticación mediante JWT Bearer Token, salvo los endpoints de login indicados explícitamente.

### 1.1 URL Base

```
https://resto.sgc.ar/api
```

### 1.2 Información General

| Campo                        | Valor                                              |
| ---------------------------- | -------------------------------------------------- |
| Versión                      | v1.0                                               |
| Última modificación          | 30/03/2026                                         |
| Formato de respuesta         | JSON                                               |
| Autenticación                | JWT Bearer Token (`Authorization: Bearer {token}`) |
| Expiración del token         | 24 horas                                           |
| Expiración del refresh token | 7 días                                             |
| Soporte                      | soporte@estudioinformatico.com                     |

---

## 2. Autenticación

La API utiliza JWT (JSON Web Tokens). El token se obtiene mediante el endpoint de login y debe enviarse en el header `Authorization` de cada solicitud protegida.

### 2.1 Header requerido (endpoints protegidos)

```
Authorization: Bearer {token}
```

> Los endpoints `POST /api/token` y `POST /api/login` son públicos y no requieren autenticación previa.

### 2.2 Claims incluidos en el token

| Campo                      | Tipo   | Descripción                                      |
| -------------------------- | ------ | ------------------------------------------------ |
| `UserId`                   | string | ID del usuario autenticado                       |
| `DisplayName`              | string | Nombre para mostrar                              |
| `UserName`                 | string | Nombre de usuario                                |
| `Email`                    | string | Correo electrónico                               |
| `UserRole`                 | string | Rol del usuario (ej: Admin)                      |
| `UserRestaurantId`         | string | ID del restaurante asociado al usuario           |
| `UserRestaurantTerminalId` | string | ID de terminal del restaurante (puede ser vacío) |
| `Service`                  | string | Identificador del servicio (valor: `middleware`) |

---

## 3. Autenticación — `/api`

### `POST /api/token` ó `/api/login` — Autenticación de usuario del sistema

> Endpoint público. No requiere Bearer Token.

**Body (JSON)**

| Parámetro  | Tipo   | Requerido | Default | Descripción                                |
| ---------- | ------ | --------- | ------- | ------------------------------------------ |
| `UserName` | string | Sí        | —       | Nombre de usuario registrado en el sistema |
| `Password` | string | Sí        | —       | Contraseña del usuario                     |

**Respuesta exitosa — 200 OK**

| Campo                      | Tipo     | Descripción                                                                                    |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `Token`                    | string   | JWT de acceso. Expira en 24 horas                                                              |
| `RefreshToken`             | string   | Token de renovación. Expira en 7 días                                                          |
| `Expiration`               | datetime | Fecha y hora de expiración del token                                                           |
| `Name`                     | string   | Nombre para mostrar del usuario                                                                |
| `UserName`                 | string   | Nombre de usuario                                                                              |
| `UserRole`                 | string   | Rol del usuario                                                                                |
| `UserRestaurantId`         | string   | ID del restaurante por defecto                                                                 |
| `UserRestaurantTerminalId` | string   | ID de terminal por defecto                                                                     |
| `UserRestaurants`          | array    | Lista de restaurantes habilitados para el usuario (`RestaurantId`, `Name`, `Address`, `Email`) |

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/token \
  -H "Content-Type: application/json" \
  -d '{"UserName": "admin", "Password": "mi_password"}'
```

---

### `POST /api/waiterLogin` — Autenticación de mozo mediante PIN

> Requiere Bearer Token del usuario autenticado. El restaurante se obtiene del token del usuario.

**Body (JSON)**

| Parámetro | Tipo   | Requerido | Default | Descripción                                        |
| --------- | ------ | --------- | ------- | -------------------------------------------------- |
| `Pin`     | string | Sí        | —       | PIN numérico del mozo registrado en el restaurante |

**Respuesta exitosa — 200 OK**

| Campo               | Tipo    | Descripción                                                                              |
| ------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `WaiterId`          | string  | ID del mozo                                                                              |
| `WaiterToken`       | string  | JWT específico del mozo. Contiene claims `WaiterId` y `RestaurantId`. Expira en 24 horas |
| `RestaurantId`      | string  | ID del restaurante                                                                       |
| `Alias`             | string  | Alias del mozo                                                                           |
| `Name`              | string  | Nombre completo del mozo                                                                 |
| `ServiceFeePercent` | decimal | Porcentaje de propina/servicio asignado al mozo                                          |

> El `WaiterToken` devuelto debe usarse en los endpoints de órdenes (`POST /order`, `POST /order/close`, `POST /message`) como campo `waiterToken` en el body.

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/waiterLogin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"Pin": "1234"}'
```

---

### `POST /api/token/refresh` — Renovación del token de acceso

> Requiere Bearer Token vigente y el refresh token obtenido en el login.

**Body (JSON)**

| Parámetro      | Tipo   | Requerido | Default | Descripción                                                     |
| -------------- | ------ | --------- | ------- | --------------------------------------------------------------- |
| `RefreshToken` | string | Sí        | —       | Refresh token obtenido en el login o en una renovación anterior |

**Respuesta exitosa — 200 OK**

| Campo              | Tipo     | Descripción                                 |
| ------------------ | -------- | ------------------------------------------- |
| `Token`            | string   | Nuevo JWT de acceso. Expira en 24 horas     |
| `RefreshToken`     | string   | Nuevo token de renovación. Expira en 7 días |
| `Expiration`       | datetime | Fecha y hora de expiración del nuevo token  |
| `Name`             | string   | Nombre del usuario                          |
| `UserName`         | string   | Nombre de usuario                           |
| `UserRole`         | string   | Rol del usuario                             |
| `UserRestaurantId` | string   | ID del restaurante                          |

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/token/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token_vigente}" \
  -d '{"RefreshToken": "{refresh_token}"}'
```

---

## 4. Restaurante — `/api/restaurantRequest`

> Todos los endpoints de esta sección requieren Bearer Token. El restaurante del usuario se obtiene automáticamente del claim `UserRestaurantId` incluido en el token; no es necesario enviarlo como parámetro salvo en los endpoints de actualización de catálogo.

---

### `GET /api/restaurantRequest/requests` — Obtener todas las solicitudes del restaurante

No recibe parámetros. Retorna todas las solicitudes registradas para el restaurante del usuario autenticado.

**Respuesta exitosa — 200 OK**

| Campo                  | Tipo     | Descripción                                              |
| ---------------------- | -------- | -------------------------------------------------------- |
| `Id`                   | uint     | ID único de la solicitud                                 |
| `RestaurantId`         | string   | ID del restaurante                                       |
| `RestaurantTerminalId` | string   | ID de terminal                                           |
| `RequestType`          | string   | Tipo de solicitud (ej: `PRINT_COMMAND`, `PRINT_MESSAGE`) |
| `RequestJSON`          | string   | Payload de la solicitud en formato JSON                  |
| `RequestOrderId`       | string   | ID de la orden asociada (si aplica)                      |
| `RequestWaiter`        | string   | Nombre del mozo asociado (si aplica)                     |
| `CreatedAt`            | datetime | Fecha y hora de creación                                 |
| `CreatedBy`            | string   | Usuario que creó la solicitud                            |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/requests \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/{id}` — Obtener una solicitud por ID

**Parámetros de ruta**

| Parámetro | Tipo | Requerido | Default | Descripción                             |
| --------- | ---- | --------- | ------- | --------------------------------------- |
| `id`      | uint | Sí        | —       | ID numérico de la solicitud a consultar |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/42 \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/tables` — Obtener el estado de todas las mesas del restaurante

**Respuesta exitosa — 200 OK**

| Campo           | Tipo   | Descripción                                                         |
| --------------- | ------ | ------------------------------------------------------------------- |
| `RestaurantId`  | string | ID del restaurante                                                  |
| `TableId`       | string | ID de la mesa                                                       |
| `TableLocation` | string | Ubicación de la mesa (ej: Salón, Terraza)                           |
| `TableType`     | string | Tipo de mesa                                                        |
| `Status`        | string | Estado actual: `Libre` \| `Abierta` \| `Por Cobrar` \| `Por Cerrar` |
| `Active`        | bool   | Indica si la mesa está activa                                       |
| `WaiterId`      | string | ID del mozo asignado a la mesa                                      |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/tables \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/tables/{tableId}` — Obtener el estado de una mesa específica

**Parámetros de ruta**

| Parámetro | Tipo   | Requerido | Default | Descripción               |
| --------- | ------ | --------- | ------- | ------------------------- |
| `tableId` | string | Sí        | —       | ID de la mesa a consultar |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/tables/MESA01 \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/orders` — Obtener todas las órdenes activas del restaurante

**Respuesta exitosa — 200 OK — Array de `RestaurantOrderDTO`**

| Campo           | Tipo     | Descripción                                        |
| --------------- | -------- | -------------------------------------------------- |
| `RestaurantId`  | string   | ID del restaurante                                 |
| `OrderId`       | string   | ID único de la orden                               |
| `OrderDate`     | datetime | Fecha y hora de la orden                           |
| `TableId`       | string   | ID de la mesa                                      |
| `TableLocation` | string   | Ubicación de la mesa                               |
| `TableType`     | string   | Tipo de mesa                                       |
| `Status`        | string   | Estado de la orden                                 |
| `WaiterId`      | string   | ID del mozo                                        |
| `WaiterName`    | string   | Nombre del mozo                                    |
| `Products`      | array    | Lista de productos de la orden (ver detalle abajo) |

**Estructura de `Products`**

| Campo                    | Tipo    | Descripción                                           |
| ------------------------ | ------- | ----------------------------------------------------- |
| `ProductId`              | string  | ID del producto                                       |
| `ProductName`            | string  | Nombre del producto                                   |
| `Quantity`               | int     | Cantidad pedida                                       |
| `CommandQuantity`        | int     | Cantidad comandada/impresa                            |
| `Price`                  | decimal | Precio unitario                                       |
| `ProductComment`         | string  | Comentario del producto                               |
| `PrintChannel`           | string  | Canal de impresión                                    |
| `ProductReferenceId`     | string  | ID del producto padre (para opciones/modificadores)   |
| `ProductOptionGroupName` | string  | Nombre del grupo de opciones al que pertenece         |
| `RelatedProducts`        | array   | Productos hijo (opciones/modificadores seleccionados) |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/orders \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/orders/{orderId}` — Obtener una orden específica por ID

**Parámetros de ruta**

| Parámetro | Tipo   | Requerido | Default | Descripción                |
| --------- | ------ | --------- | ------- | -------------------------- |
| `orderId` | string | Sí        | —       | ID de la orden a consultar |

**Ejemplo con curl**

```bash
curl -X GET "https://resto.sgc.ar/api/restaurantRequest/orders/ORD-2024-001" \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/waiters` — Obtener el listado de mozos del restaurante

**Respuesta exitosa — 200 OK**

| Campo               | Tipo    | Descripción                    |
| ------------------- | ------- | ------------------------------ |
| `WaiterId`          | string  | ID del mozo                    |
| `RestaurantId`      | string  | ID del restaurante             |
| `Name`              | string  | Nombre completo                |
| `Alias`             | string  | Alias del mozo                 |
| `Pin`               | string  | PIN de acceso                  |
| `Active`            | bool    | Estado activo/inactivo         |
| `ServiceFeePercent` | decimal | Porcentaje de propina asignado |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/waiters \
  -H "Authorization: Bearer {token}"
```

---

### `GET /api/restaurantRequest/menu` — Obtener el menú completo del restaurante

**Respuesta exitosa — 200 OK — Array de `RestaurantMenuDTO`**

| Campo                 | Tipo    | Descripción                                        |
| --------------------- | ------- | -------------------------------------------------- |
| `ProductId`           | string  | ID del producto                                    |
| `Name`                | string  | Nombre del producto                                |
| `Description`         | string  | Descripción                                        |
| `Price`               | decimal | Precio                                             |
| `Barcode`             | string  | Código de barras                                   |
| `Category`            | string  | Categoría del producto                             |
| `Active`              | bool    | Indica si el producto está activo en el menú       |
| `CommandPrintChannel` | string  | Canal de impresión de comanda                      |
| `MenuOptionGroups`    | array   | Grupos de opciones disponibles (ver detalle abajo) |

**Estructura de `MenuOptionGroups`**

| Campo                  | Tipo   | Descripción                                                                               |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------- |
| `Name`                 | string | Nombre del grupo (ej: Cocción, Tamaño)                                                    |
| `IsRequired`           | bool   | Indica si la selección es obligatoria                                                     |
| `DefaultQuantity`      | int    | Cantidad por defecto                                                                      |
| `MaxQuantityPerOption` | int    | Cantidad máxima por opción                                                                |
| `MenuOptions`          | array  | Opciones disponibles dentro del grupo (`Name`, `Price`, `MaxQuantity`, `OptionProductId`) |

**Ejemplo con curl**

```bash
curl -X GET https://resto.sgc.ar/api/restaurantRequest/menu \
  -H "Authorization: Bearer {token}"
```

---

### `POST /api/restaurantRequest` — Crear una solicitud genérica

> Al crear la solicitud se envía una notificación en tiempo real al restaurante vía SignalR.

**Body (JSON) — `RestaurantRequestDTO`**

| Parámetro              | Tipo   | Requerido | Default | Descripción                                              |
| ---------------------- | ------ | --------- | ------- | -------------------------------------------------------- |
| `RestaurantId`         | string | Sí        | —       | ID del restaurante destino de la solicitud               |
| `RestaurantTerminalId` | string | No        | —       | ID de terminal (opcional)                                |
| `RequestType`          | string | Sí        | —       | Tipo de solicitud (ej: `PRINT_COMMAND`, `PRINT_MESSAGE`) |
| `RequestJSON`          | string | Sí        | —       | Payload de la solicitud en formato JSON serializado      |
| `RequestOrderId`       | string | No        | —       | ID de la orden asociada (opcional)                       |
| `RequestWaiter`        | string | No        | —       | Nombre del mozo asociado (opcional)                      |

**Respuesta exitosa — 201 Created**

Retorna el objeto `RestaurantRequest` creado incluyendo el `Id` generado.

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/restaurantRequest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"RestaurantId":"R01","RequestType":"PRINT_COMMAND","RequestJSON":"{}"}'
```

---

### `POST /api/restaurantRequest/message` — Enviar un mensaje a una terminal de impresión

> Requiere el `WaiterToken` obtenido mediante `POST /api/waiterLogin`. El restaurante se valida contra el claim del token del usuario.

**Body (JSON) — `RestaurantMessageDTO`**

| Parámetro     | Tipo   | Requerido | Default | Descripción                                                                                    |
| ------------- | ------ | --------- | ------- | ---------------------------------------------------------------------------------------------- |
| `WaiterToken` | string | Sí        | —       | JWT del mozo obtenido en `/api/waiterLogin`. Se validan los claims `WaiterId` y `RestaurantId` |
| `Waiter`      | string | No        | —       | Nombre del mozo (referencia informativa)                                                       |

**Respuesta exitosa — 201 Created**

Retorna el objeto `RestaurantRequest` registrado. Se envía notificación en tiempo real al restaurante.

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/restaurantRequest/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"WaiterToken":"{waiter_token}","Waiter":"Juan"}'
```

---

### `POST /api/restaurantRequest/order` — Registrar productos en una orden

> Requiere `WaiterToken`. Si la orden no existe se crea; si existe se agregan productos. La mesa debe estar disponible (no en estado `Por Cobrar`). El mozo del token debe coincidir con el asignado a la mesa.

**Body (JSON) — `RestaurantOrderRequest`**

| Parámetro     | Tipo   | Requerido | Default | Descripción                                        |
| ------------- | ------ | --------- | ------- | -------------------------------------------------- |
| `WaiterToken` | string | Sí        | —       | JWT del mozo obtenido en `/api/waiterLogin`        |
| `OrderId`     | string | Sí        | —       | ID de la orden. Si no existe se crea una nueva     |
| `TableId`     | string | Sí        | —       | ID de la mesa asociada a la orden                  |
| `Status`      | string | No        | —       | Estado de la orden                                 |
| `Products`    | array  | Sí        | —       | Lista de productos a registrar (ver detalle abajo) |

**Estructura de `Products`**

| Parámetro         | Tipo   | Requerido | Default | Descripción                                                                                                                         |
| ----------------- | ------ | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `ProductId`       | string | Sí        | —       | ID del producto del menú                                                                                                            |
| `ProductQuantity` | int    | Sí        | —       | Cantidad. Los productos con cantidad 0 se ignoran                                                                                   |
| `ProductName`     | string | No        | —       | Nombre descriptivo (referencia)                                                                                                     |
| `ProductComment`  | string | No        | —       | Comentario o aclaración sobre el producto                                                                                           |
| `ProductOptions`  | array  | No        | —       | Opciones/modificadores seleccionados (`OptionProductId`, `OptionQuantity`, `OptionProductName`, `OptionComment`, `OptionGroupName`) |

**Respuesta exitosa — 200 OK**

Retorna el `RestaurantOrderDTO` completo con todos los productos de la orden actualizada. Se envía notificación en tiempo real al restaurante.

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/restaurantRequest/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "WaiterToken": "{waiter_token}",
    "OrderId": "ORD-2024-001",
    "TableId": "MESA01",
    "Products": [
      {"ProductId": "P001", "ProductQuantity": 2, "ProductName": "Milanesa"},
      {"ProductId": "P002", "ProductQuantity": 1, "ProductName": "Coca Cola"}
    ]
  }'
```

---

### `POST /api/restaurantRequest/order/close` — Cerrar una orden

> Requiere `WaiterToken`. El mozo del token debe ser el asignado a la mesa. El `TableId` debe coincidir con el de la orden.

**Body (JSON) — `RestaurantOrderCloseRequest`**

| Parámetro     | Tipo   | Requerido | Default | Descripción                                           |
| ------------- | ------ | --------- | ------- | ----------------------------------------------------- |
| `WaiterToken` | string | Sí        | —       | JWT del mozo obtenido en `/api/waiterLogin`           |
| `OrderId`     | string | Sí        | —       | ID de la orden a cerrar                               |
| `TableId`     | string | Sí        | —       | ID de la mesa. Debe coincidir con la mesa de la orden |

**Respuesta exitosa — 200 OK**

Retorna el mensaje: `"Order {orderId} closed."`

**Ejemplo con curl**

```bash
curl -X POST https://resto.sgc.ar/api/restaurantRequest/order/close \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"WaiterToken":"{waiter_token}","OrderId":"ORD-2024-001","TableId":"MESA01"}'
```

---

### `PUT /api/restaurantRequest/{id}` — Actualizar una solicitud existente

**Parámetros de ruta**

| Parámetro | Tipo | Requerido | Default | Descripción                     |
| --------- | ---- | --------- | ------- | ------------------------------- |
| `id`      | uint | Sí        | —       | ID de la solicitud a actualizar |

El body debe contener el objeto `RestaurantRequest` completo con el mismo `Id` indicado en la ruta.

**Respuesta exitosa — 204 No Content**

---

### `PUT /api/restaurantRequest/waiters/{restaurantId}` — Reemplazar el listado completo de mozos del restaurante

> Esta operación elimina todos los mozos existentes del restaurante y los reemplaza con los enviados en el body. Se ejecuta dentro de una transacción.

**Parámetros de ruta**

| Parámetro      | Tipo   | Requerido | Default | Descripción                                        |
| -------------- | ------ | --------- | ------- | -------------------------------------------------- |
| `restaurantId` | string | Sí        | —       | ID del restaurante cuyos mozos se van a reemplazar |

**Body (JSON) — Array de `RestaurantWaiter`**

| Parámetro           | Tipo    | Requerido | Default | Descripción            |
| ------------------- | ------- | --------- | ------- | ---------------------- |
| `WaiterId`          | string  | Sí        | —       | ID del mozo            |
| `Name`              | string  | Sí        | —       | Nombre completo        |
| `Alias`             | string  | No        | —       | Alias del mozo         |
| `Pin`               | string  | Sí        | —       | PIN de acceso          |
| `Active`            | bool    | Sí        | —       | Estado activo/inactivo |
| `ServiceFeePercent` | decimal | No        | 0       | Porcentaje de propina  |

**Respuesta exitosa — 204 No Content**

**Ejemplo con curl**

```bash
curl -X PUT https://resto.sgc.ar/api/restaurantRequest/waiters/R01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '[{"WaiterId":"W01","Name":"Juan Pérez","Pin":"1234","Active":true}]'
```

---

### `PUT /api/restaurantRequest/tables/{restaurantId}` — Reemplazar el listado completo de mesas del restaurante

> Esta operación elimina todas las mesas existentes del restaurante y las reemplaza con las enviadas en el body. Se ejecuta dentro de una transacción.

**Parámetros de ruta**

| Parámetro      | Tipo   | Requerido | Default | Descripción                                        |
| -------------- | ------ | --------- | ------- | -------------------------------------------------- |
| `restaurantId` | string | Sí        | —       | ID del restaurante cuyas mesas se van a reemplazar |

**Body (JSON) — Array de `RestaurantTable`**

| Parámetro       | Tipo   | Requerido | Default | Descripción                    |
| --------------- | ------ | --------- | ------- | ------------------------------ |
| `TableId`       | string | Sí        | —       | ID de la mesa                  |
| `TableLocation` | string | Sí        | —       | Ubicación (ej: Salón, Terraza) |
| `TableType`     | string | Sí        | —       | Tipo de mesa                   |
| `Active`        | bool   | Sí        | —       | Estado activo/inactivo         |

**Respuesta exitosa — 204 No Content**

**Ejemplo con curl**

```bash
curl -X PUT https://resto.sgc.ar/api/restaurantRequest/tables/R01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '[{"TableId":"MESA01","TableLocation":"Salón","TableType":"Standard","Active":true}]'
```

---

### `PUT /api/restaurantRequest/menu/{restaurantId}` — Reemplazar el menú completo del restaurante

> Esta operación elimina todo el menú existente del restaurante y lo reemplaza con el enviado en el body. Se ejecuta dentro de una transacción.

**Parámetros de ruta**

| Parámetro      | Tipo   | Requerido | Default | Descripción                                     |
| -------------- | ------ | --------- | ------- | ----------------------------------------------- |
| `restaurantId` | string | Sí        | —       | ID del restaurante cuyo menú se va a reemplazar |

**Body (JSON) — Array de `RestaurantMenuDTO`**

| Parámetro             | Tipo    | Requerido | Default | Descripción                     |
| --------------------- | ------- | --------- | ------- | ------------------------------- |
| `ProductId`           | string  | Sí        | —       | ID del producto                 |
| `Name`                | string  | Sí        | —       | Nombre del producto             |
| `Description`         | string  | No        | —       | Descripción                     |
| `Price`               | decimal | Sí        | —       | Precio                          |
| `Barcode`             | string  | No        | —       | Código de barras                |
| `Category`            | string  | No        | —       | Categoría                       |
| `Active`              | bool    | Sí        | `true`  | Estado activo en el menú        |
| `CommandPrintChannel` | string  | No        | —       | Canal de impresión de comanda   |
| `MenuOptionGroups`    | array   | No        | `[]`    | Grupos de opciones del producto |

**Respuesta exitosa — 204 No Content**

---

### `DELETE /api/restaurantRequest/{id}` — Eliminar una solicitud _(solo Administradores)_

> Requiere rol `Admin`. El restaurante no puede eliminar solicitudes con un usuario estándar.

**Parámetros de ruta**

| Parámetro | Tipo | Requerido | Default | Descripción                   |
| --------- | ---- | --------- | ------- | ----------------------------- |
| `id`      | uint | Sí        | —       | ID de la solicitud a eliminar |

**Respuesta exitosa — 204 No Content**

**Ejemplo con curl**

```bash
curl -X DELETE https://resto.sgc.ar/api/restaurantRequest/42 \
  -H "Authorization: Bearer {token_admin}"
```

---

## 5. Códigos de respuesta

| Código                      | Situación                     | Descripción                                                                      |
| --------------------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| `200 OK`                    | Éxito                         | La solicitud se procesó correctamente.                                           |
| `201 Created`               | Recurso creado                | El recurso fue creado. Retorna el objeto creado.                                 |
| `204 No Content`            | Operación exitosa sin retorno | La operación se completó. No se retorna contenido.                               |
| `400 Bad Request`           | Datos inválidos o faltantes   | Falta un parámetro requerido o los datos son incorrectos.                        |
| `401 Unauthorized`          | No autenticado                | No se envió el token o el token es inválido.                                     |
| `404 Not Found`             | Recurso no encontrado         | El recurso solicitado no existe para el restaurante.                             |
| `500 Internal Server Error` | Error interno del servidor    | Error inesperado al procesar la solicitud. Se retorna `{ "detail": "mensaje" }`. |

---

## 6. Resumen de endpoints

| Método   | Endpoint                                        | Auth requerida       | Notas                 |
| -------- | ----------------------------------------------- | -------------------- | --------------------- |
| `POST`   | `/api/token`                                    | No                   | Login usuario         |
| `POST`   | `/api/login`                                    | No                   | Login usuario (alias) |
| `POST`   | `/api/waiterLogin`                              | Bearer Token         | Login mozo con PIN    |
| `POST`   | `/api/token/refresh`                            | Bearer Token         | Renovar token         |
| `GET`    | `/api/restaurantRequest/requests`               | Bearer Token         | Todas las solicitudes |
| `GET`    | `/api/restaurantRequest/{id}`                   | Bearer Token         | Solicitud por ID      |
| `GET`    | `/api/restaurantRequest/tables`                 | Bearer Token         | Estado de mesas       |
| `GET`    | `/api/restaurantRequest/tables/{tableId}`       | Bearer Token         | Estado de mesa        |
| `GET`    | `/api/restaurantRequest/orders`                 | Bearer Token         | Todas las órdenes     |
| `GET`    | `/api/restaurantRequest/orders/{orderId}`       | Bearer Token         | Orden por ID          |
| `GET`    | `/api/restaurantRequest/waiters`                | Bearer Token         | Listado de mozos      |
| `GET`    | `/api/restaurantRequest/menu`                   | Bearer Token         | Menú del restaurante  |
| `POST`   | `/api/restaurantRequest`                        | Bearer Token         | Crear solicitud       |
| `POST`   | `/api/restaurantRequest/message`                | Bearer + WaiterToken | Enviar mensaje        |
| `POST`   | `/api/restaurantRequest/order`                  | Bearer + WaiterToken | Registrar orden       |
| `POST`   | `/api/restaurantRequest/order/close`            | Bearer + WaiterToken | Cerrar orden          |
| `PUT`    | `/api/restaurantRequest/{id}`                   | Bearer Token         | Actualizar solicitud  |
| `PUT`    | `/api/restaurantRequest/waiters/{restaurantId}` | Bearer Token         | Reemplazar mozos      |
| `PUT`    | `/api/restaurantRequest/tables/{restaurantId}`  | Bearer Token         | Reemplazar mesas      |
| `PUT`    | `/api/restaurantRequest/menu/{restaurantId}`    | Bearer Token         | Reemplazar menú       |
| `DELETE` | `/api/restaurantRequest/{id}`                   | Bearer + Admin       | Eliminar solicitud    |
