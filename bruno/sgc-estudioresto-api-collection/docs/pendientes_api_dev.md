# Pendientes para API Dev - Coleccion Bruno SGC

## Contexto

Se ejecuto la coleccion completa con Bruno CLI (`@usebruno/cli` v3.2.2) usando el environment de produccion.

Estado actual: 21 requests ejecutadas, 9 OK y 12 con error.

## Ajustes que ya hicimos en la coleccion

- Corregimos `POST /token/refresh` para usar `auth: inherit` (segun doc requiere Bearer vigente).
- Dejamos el `production.bru` sin duplicados de variables (`password` y `token`).
- Agregamos scripts para guardar IDs dinamicos en variables de entorno:
  - `table_id` desde `GET /restaurantRequest/tables`
  - `order_id` desde `GET /restaurantRequest/orders` y `POST /restaurantRequest/order`
  - `request_id` desde `POST /restaurantRequest`

Con esto mejoramos la encadenacion interna, pero todavia faltan datos/definiciones del backend para que todo pase.

## Lo que necesitamos que nos compartan

### 1) Credenciales de testing completas

- Usuario de pruebas valido para login (ya tenemos uno funcional).
- **PIN de mozo valido** para ese mismo restaurante/usuario (`POST /waiterLogin`).
- Usuario **Admin** de pruebas para validar `DELETE /restaurantRequest/{id}` (hoy responde 403).

Sin PIN valido no podemos probar flujos que requieren `waiterToken`:

- `POST /restaurantRequest/message`
- `POST /restaurantRequest/order`
- `POST /restaurantRequest/order/close`

### 2) Datos semilla (fixtures) por tenant de produccion

Necesitamos un set minimo y estable para pruebas automatizadas:

- `restaurant_id` valido para el usuario de pruebas.
- Al menos un `table_id` existente y habilitado.
- Al menos 2 `productId` existentes en menu para crear ordenes.
- Opcional: un `order_id` existente para pruebas de lectura puntual.

Hoy varios 404/400 vienen por IDs de ejemplo que no existen en ese tenant.

### 3) Contrato exacto de los endpoints que devuelven 400/500

Necesitamos confirmacion del payload real (campos obligatorios y validaciones) para:

- `PUT /restaurantRequest/tables/{restaurantId}`
- `PUT /restaurantRequest/menu/{restaurantId}`
- `PUT /restaurantRequest/waiters/{restaurantId}`
- `PUT /restaurantRequest/{id}`

Observacion: segun doc deberian aceptar los payloads armados, pero en runtime estan devolviendo 400/500.

Puntos a confirmar para esos endpoints:

- Si exigen campos adicionales no documentados.
- Si hay validaciones de negocio extras (por ejemplo IDs existentes, canales validos, formatos, longitudes).
- Si en entorno productivo hay restricciones para operaciones de reemplazo masivo.

### 4) Clarificacion de estrategia de autenticacion para refresh

La doc indica que `POST /token/refresh` requiere Bearer + RefreshToken. Confirmar si esto es obligatorio siempre (en nuestras pruebas, con ajuste de auth, ya queda alineado a documentacion).

## Resumen de fallas observadas (ultima corrida)

- `POST /waiterLogin` -> 400 (credenciales de mozo invalidas)
- `POST /token/refresh` -> depende de token + refresh vigentes
- `GET /tables/{tableId}` -> 404 (ID no encontrado)
- `GET /orders/{orderId}` -> 404 (ID no encontrado)
- `POST /restaurantRequest/order` -> 400 (falta waiterToken valido / posible validacion adicional)
- `POST /restaurantRequest/order/close` -> 500 (depende de orden/mozo/mesa validos)
- `PUT /tables|menu|waiters` -> 400 (contrato real a confirmar)
- `PUT /restaurantRequest/{id}` -> 500 (contrato real a confirmar)
- `DELETE /restaurantRequest/{id}` -> 403 (requiere Admin)

## Pedido concreto al equipo API

Para cerrar la validacion end-to-end de la coleccion Bruno, por favor enviarnos:

1. Credenciales de testing completas (usuario normal, PIN de mozo, usuario Admin).
2. Datos semilla validos del tenant (restaurant, table, products, opcional order).
3. Ejemplos reales de request/response para los 4 endpoints de PUT mencionados.
4. Confirmacion de reglas de negocio que puedan disparar 400/500 en esos casos.

Con eso dejamos la coleccion completamente operativa y reproducible en CI/CLI.
