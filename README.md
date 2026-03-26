# Menú Digital — Estudio Resto

Web app mobile para realizar pedidos en restaurantes mediante código QR.

## Características

- 📱 Diseño mobile-first, liviano y sin frameworks pesados
- 🍽️ Menú con categorías: Entradas, Platos Principales, Postres, Bebidas, Cafetería
- 🛒 Carrito de pedidos con control de cantidades y comentarios por ítem
- 🛎 Botón para llamar al mozo
- 🧾 Botón para pedir la cuenta
- ✅ Soporte offline-first con datos mockeados (fallback automático)

## Uso vía código QR

El QR debe apuntar a la URL de la app con los parámetros:

```
https://<tu-dominio>/?restaurantId=<id>&table=<numero-de-mesa>
```

**Ejemplo:**
```
https://app.estudioresto.com/?restaurantId=estudioresto&table=5
```

## Configurar restaurantes

Editá el archivo `src/config/restaurants.js` para agregar o modificar restaurantes:

```js
const restaurants = {
  mirestaurante: {
    name: 'Mi Restaurante',
    apiUrl: 'https://api.mirestaurante.com',
  },
};
```

La `apiUrl` se usa como base para los endpoints:
- `GET  /menu`         → obtiene el menú
- `POST /order`        → envía el pedido (body: `{ tableNumber, items }`)
- `POST /call-waiter`  → llama al mozo (body: `{ tableNumber }`)
- `POST /bill`         → pide la cuenta (body: `{ tableNumber }`)

Si algún endpoint no está disponible, la app usa datos mockeados automáticamente.

## Desarrollo

```bash
npm install
npm run dev
```

Accedé en `http://localhost:5173/?restaurantId=demo&table=1`

## Producción

```bash
npm run build
```

Los archivos estáticos quedan en `/dist` y pueden servirse desde cualquier CDN o servidor web.
