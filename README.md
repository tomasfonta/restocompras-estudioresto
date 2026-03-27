# RestoCompras — Menú Digital para Restaurantes

**Versión:** 1.0.0  
**Plataforma:** Web (mobile-first)  
**URL de producción:** `https://tomasfonta.github.io/restocompras-estudioresto/`  
**Repositorio:** `https://github.com/tomasfonta/restocompras-estudioresto`

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Casos de uso cubiertos](#2-casos-de-uso-cubiertos)
3. [Funcionalidades incluidas](#3-funcionalidades-incluidas)
4. [Funcionalidades NO incluidas](#4-funcionalidades-no-incluidas)
5. [Arquitectura técnica](#5-arquitectura-técnica)
6. [Integración con el backend](#6-integración-con-el-backend)
7. [Estructura del proyecto](#7-estructura-del-proyecto)
8. [Instalación y ejecución local](#8-instalación-y-ejecución-local)
9. [Deploy en GitHub Pages](#9-deploy-en-github-pages)
10. [Configuración de restaurantes](#10-configuración-de-restaurantes)
11. [Generación de códigos QR](#11-generación-de-códigos-qr)
12. [Alcance contractual](#12-alcance-contractual)

---

## 1. Descripción general

RestoCompras es una **aplicación web de menú digital** que funciona a partir de la lectura de un código QR ubicado en la mesa del cliente. Permite al comensal consultar el menú, armar su pedido, enviarlo a cocina, llamar al mozo y solicitar la cuenta, todo desde su teléfono sin necesidad de descargar ninguna app.

La aplicación corre íntegramente en el navegador del cliente (frontend) y se comunica con un backend provisto por el restaurante mediante una API REST estándar.

---

## 2. Casos de uso cubiertos

| # | Actor | Acción | Resultado |
|---|-------|--------|-----------|
| UC-01 | Cliente | Escanea el QR de su mesa | La app carga automáticamente con el menú del restaurante y el número de mesa correctos |
| UC-02 | Cliente | Navega por categorías del menú | Visualiza los ítems filtrados por categoría con nombre, descripción, precio e imagen |
| UC-03 | Cliente | Agrega ítems al pedido | El ítem se suma al carrito con contador visible en la barra de navegación |
| UC-04 | Cliente | Modifica la cantidad de un ítem | Puede incrementar o decrementar la cantidad desde la tarjeta del menú o desde el carrito |
| UC-05 | Cliente | Abre el detalle de un ítem | Ve una vista expandida con imagen, nombre, descripción y controles de cantidad |
| UC-06 | Cliente | Agrega un comentario a un ítem | Puede escribir aclaraciones por ítem (ej: "sin tomate", "sin TACC") desde el carrito |
| UC-07 | Cliente | Revisa su pedido | Ve el resumen agrupado por categoría, cantidades, comentarios y total en pesos |
| UC-08 | Cliente | Envía el pedido a cocina | El pedido se transmite al backend con todos los ítems, cantidades, comentarios, mesa y restaurante |
| UC-09 | Cliente | Llama al mozo | Se envía una notificación al backend identificando la mesa que requiere atención |
| UC-10 | Cliente | Pide la cuenta | Selecciona el método de pago (efectivo o medios electrónicos) y la solicitud se envía al backend |
| UC-11 | Cliente | Recibe confirmación de cada acción | Toast de éxito o error con duración de 3 segundos visible en pantalla |
| UC-12 | Sistema | QR inválido o restaurante no encontrado | Se muestra pantalla de error descriptiva; la aplicación no se rompe |

---

## 3. Funcionalidades incluidas

### Interfaz de usuario
- ✅ Splash screen de bienvenida con nombre del restaurante y número de mesa
- ✅ Navegación inferior (bottom nav) con iconos para: Inicio, Menú, Carrito, Llamar mozo, Pedir cuenta
- ✅ Tabs de categorías con scroll horizontal
- ✅ Tarjetas de menú con imagen opcional, nombre, descripción, precio y stepper de cantidad
- ✅ Modal de detalle de ítem con imagen ampliada
- ✅ Vista de carrito agrupada por categoría
- ✅ Campo de comentario libre por ítem en el carrito
- ✅ Barra de totales (cantidad total y precio total) en el carrito
- ✅ Diálogo de confirmación antes de enviar el pedido
- ✅ Diálogo de confirmación para llamar al mozo
- ✅ Selector de método de pago al pedir la cuenta (efectivo / medios electrónicos)
- ✅ Toasts de feedback (éxito / error) para todas las acciones
- ✅ Indicadores de carga en el menú y en botones de acción
- ✅ Pantalla de error para QR inválido

### Técnico
- ✅ Diseño mobile-first, responsive
- ✅ Identificación automática del restaurante y mesa desde la URL (parámetros QR)
- ✅ Fallback a datos de demo cuando el backend no está disponible
- ✅ Deploy automático en GitHub Pages via GitHub Actions
- ✅ Soporte multi-restaurante (un mismo código base sirve a múltiples clientes)

---

## 4. Funcionalidades NO incluidas

Las siguientes funcionalidades están **fuera del alcance** de esta entrega. Su implementación requiere un acuerdo y presupuesto adicional.

| Ítem | Descripción |
|------|-------------|
| 🚫 Panel de administración | No existe interfaz para que el restaurante gestione el menú, mesas ni pedidos |
| 🚫 Gestión de pedidos en tiempo real | No hay dashboard de cocina ni sala; los pedidos se reciben por el backend del cliente |
| 🚫 Notificaciones push al staff | No se envían notificaciones al personal desde la app |
| 🚫 Autenticación / login | No existe sistema de usuarios, cuentas ni sesiones |
| 🚫 Historial de pedidos | La app no almacena pedidos previos del cliente |
| 🚫 Pagos en línea | No se procesan pagos; solo se informa el método de pago preferido |
| 🚫 Gestión de stock / disponibilidad | No hay control de ítems agotados ni cantidades disponibles |
| 🚫 Traducciones / multilenguaje | La interfaz es únicamente en español |
| 🚫 Modo offline completo | Se requiere conexión a internet para enviar pedidos al backend |
| �� Imágenes de ítems | Las imágenes son opcionales y deben ser provistas por el restaurante vía su API |
| 🚫 Backend / API | Este repositorio es exclusivamente el frontend; el backend es responsabilidad del cliente |
| 🚫 CMS o editor de menú | El menú debe cargarse y mantenerse desde el backend del cliente |
| 🚫 Analytics / reportes | No se registran métricas de uso ni ventas |
| 🚫 Integración con sistemas de caja (POS) | No se conecta con ningún sistema de punto de venta existente |

---

## 5. Arquitectura técnica

```
┌──────────────────────────────────────┐
│         CLIENTE (navegador)          │
│                                      │
│  React 19 + Vite 8                   │
│  CSS custom (mobile-first)           │
│                                      │
│  src/                                │
│  ├─ hooks/                           │
│  │  ├─ useMenu.js      ← carga menú  │
│  │  ├─ useCart.js      ← carrito     │
│  │  └─ useActions.js   ← acciones    │
│  ├─ components/        ← UI pura     │
│  ├─ services/          ← HTTP calls  │
│  └─ config/            ← restaurantes│
└──────────────────────────────────────┘
           │  fetch (REST / JSON)
           ▼
┌──────────────────────────────────────┐
│     BACKEND del restaurante          │
│     (responsabilidad del cliente)    │
└──────────────────────────────────────┘
```

**Stack:**
- **Framework:** React 19
- **Bundler:** Vite 8
- **Estilo:** CSS vanilla, mobile-first, sin frameworks de UI externos
- **Sin dependencias de terceros en runtime** (solo React)
- **Deploy:** GitHub Pages (hosting estático, sin costo de servidor)

---

## 6. Integración con el backend

La aplicación consume **4 endpoints REST**. Todos usan JSON. La `baseUrl` se configura por restaurante en `src/config/restaurants.js`.

### 6.1 Configuración

```js
// src/config/restaurants.js
const restaurants = {
  estudioresto: {
    name: 'Estudio Resto',
    apiUrl: 'https://api.tu-dominio.com', // ← URL real del backend
  },
};
```

El `restaurantId` llega por el QR: `?restaurantId=estudioresto&table=3`

---

### 6.2 `GET /menu` — Obtener el menú

**Request:**
```
GET {apiUrl}/menu
```

**Response esperada (`200 OK`):**
```json
[
  {
    "category": "Entradas",
    "items": [
      {
        "id": "e1",
        "name": "Tabla de fiambres",
        "description": "Jamón, salame, queso y aceitunas",
        "price": 1800,
        "image": "https://cdn.ejemplo.com/tabla.jpg"
      }
    ]
  }
]
```

**Notas:**
- `image` es **opcional**. Si no se envía, la tarjeta se muestra sin imagen.
- `price` debe ser un **número** (sin símbolo de moneda).
- El orden de categorías e ítems en el array determina el orden de visualización.
- Si el endpoint falla, la app carga un **menú de demo** local (no se interrumpe el servicio).

---

### 6.3 `POST /order` — Enviar pedido a cocina

**Request:**
```
POST {apiUrl}/order
Content-Type: application/json

{
  "tableNumber": "3",
  "items": [
    {
      "id": "p1",
      "name": "Hamburguesa clásica",
      "quantity": 2,
      "comment": "sin cebolla",
      "price": 2200
    },
    {
      "id": "b2",
      "name": "Gaseosa",
      "quantity": 1,
      "comment": "",
      "price": 600
    }
  ]
}
```

**Response esperada (`200 OK`):**
```json
{
  "success": true,
  "orderId": "ORD-1711500000000"
}
```

**Response de error:**
```json
{
  "success": false
}
```

**Notas:**
- `comment` puede ser string vacío `""`.
- `orderId` puede ser cualquier string identificador; se muestra en el toast de confirmación al cliente.
- Si el endpoint falla, se muestra un toast de error y **el carrito no se limpia** (el cliente puede reintentar).

---

### 6.4 `POST /call-waiter` — Llamar al mozo

**Request:**
```
POST {apiUrl}/call-waiter
Content-Type: application/json

{
  "tableNumber": "3"
}
```

**Response esperada (`200 OK`):**
```json
{ "success": true }
```

**Notas:**
- El backend es responsable de notificar al staff (WebSocket, SMS, pantalla de sala, etc.).
- La app solo envía la señal y muestra el toast de feedback al cliente.

---

### 6.5 `POST /bill` — Pedir la cuenta

**Request:**
```
POST {apiUrl}/bill
Content-Type: application/json

{
  "tableNumber": "3",
  "paymentMethod": "efectivo"
}
```

`paymentMethod` puede ser `"efectivo"` o `"electronico"`.

**Response esperada (`200 OK`):**
```json
{ "success": true }
```

---

### 6.6 CORS — Configuración requerida en el backend

El backend **debe habilitar CORS** para el origen de GitHub Pages:

```
Access-Control-Allow-Origin: https://tomasfonta.github.io
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

Para desarrollo local también debe permitir `http://localhost:5173`.

---

### 6.7 Comportamiento ante fallos de red

| Endpoint | Comportamiento si falla |
|----------|------------------------|
| `GET /menu` | Carga menú de demo (datos locales). La app sigue funcionando. |
| `POST /order` | Toast de error. El carrito **no se limpia**. El cliente puede reintentar. |
| `POST /call-waiter` | Toast de error. |
| `POST /bill` | Toast de error. |

---

## 7. Estructura del proyecto

```
restocompras-estudioresto/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml          # CI/CD automático a GitHub Pages
├─ public/                   # Assets estáticos
├─ src/
│  ├─ App.jsx                # Componente raíz, enruta las 3 vistas
│  ├─ main.jsx               # Entry point
│  ├─ index.css              # Todos los estilos
│  ├─ config/
│  │  └─ restaurants.js      # ← EDITAR para agregar/configurar restaurantes
│  ├─ hooks/
│  │  ├─ useCart.js          # Lógica del carrito (estado, add/remove/comment)
│  │  ├─ useMenu.js          # Carga del menú y estado de categorías
│  │  └─ useActions.js       # Pedido, mozo, cuenta, toasts, diálogos
│  ├─ services/
│  │  └─ restaurantService.js # Llamadas HTTP al backend (con fallback mock)
│  └─ components/
│     ├─ Header.jsx           # Nombre del restaurante + número de mesa
│     ├─ CategoryTabs.jsx     # Tabs de categorías con scroll
│     ├─ MenuItem.jsx         # Tarjeta individual de ítem del menú
│     ├─ ItemDetail.jsx       # Modal de detalle de ítem
│     ├─ Cart.jsx             # Vista del carrito con totales
│     ├─ CartItem.jsx         # Fila de ítem en el carrito
│     ├─ BottomNav.jsx        # Barra de navegación inferior
│     ├─ Toast.jsx            # Notificación de feedback
│     ├─ ConfirmDialog.jsx    # Diálogo de confirmación genérico
│     └─ SwipeConfirm.jsx     # Confirmación con swipe
├─ index.html
├─ vite.config.js            # base: '/restocompras-estudioresto/'
└─ package.json
```

---

## 8. Instalación y ejecución local

**Requisitos:** Node.js ≥ 18, npm ≥ 9

```bash
# Clonar el repositorio
git clone https://github.com/tomasfonta/restocompras-estudioresto.git
cd restocompras-estudioresto

# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev
# → http://localhost:5173/?restaurantId=estudioresto&table=1

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 9. Deploy en GitHub Pages

El deploy es **automático**: cada push a `main` dispara el workflow `.github/workflows/deploy.yml`, que:

1. Instala dependencias (`npm ci`)
2. Construye el proyecto (`npm run build`)
3. Publica la carpeta `dist/` en GitHub Pages

**URL de producción:**
```
https://tomasfonta.github.io/restocompras-estudioresto/
```

**Activación (solo la primera vez):**  
Repositorio en GitHub → **Settings → Pages → Source → GitHub Actions** → Save.

---

## 10. Configuración de restaurantes

Editar `src/config/restaurants.js` para agregar o modificar restaurantes:

```js
const restaurants = {
  estudioresto: {
    name: 'Estudio Resto',
    apiUrl: 'https://api.estudioresto.com',
  },
  // Agregar más restaurantes:
  mirestaurante: {
    name: 'Mi Restaurante',
    apiUrl: 'https://api.mirestaurante.com',
  },
};
```

Cada cambio requiere un `git push` para que el deploy automático actualice producción.

---

## 11. Generación de códigos QR

Cada mesa requiere un QR con la siguiente URL:

```
https://tomasfonta.github.io/restocompras-estudioresto/?restaurantId=estudioresto&table=1
```

- `restaurantId` debe coincidir exactamente con la clave en `restaurants.js`
- `table` puede ser cualquier número o string identificador de mesa (ej: `1`, `12`, `VIP`)

**Herramientas sugeridas:**
- [qr-code-generator.com](https://www.qr-code-generator.com/)
- [goqr.me](https://goqr.me/)

Los QR se imprimen y ubican físicamente en cada mesa. No requieren ningún sistema de gestión adicional.

---

## 12. Alcance contractual

### Lo que incluye esta entrega

| Ítem | Detalle |
|------|---------|
| ✅ Aplicación web frontend completa | Menú digital, carrito, envío de pedidos, llamada a mozo, solicitud de cuenta con método de pago |
| ✅ Código fuente | Repositorio GitHub con historial completo de cambios |
| ✅ Hosting en GitHub Pages | Sin costo de servidor, disponible 24/7 |
| ✅ CI/CD automático | Cada push a `main` actualiza producción automáticamente |
| ✅ Soporte multi-restaurante | El mismo deployment sirve a múltiples restaurantes via `restaurantId` |
| ✅ Modo demo | La app funciona visualmente sin backend (útil para presentaciones y pruebas) |
| ✅ Documentación técnica | Especificación completa de los 4 endpoints y formato de datos |

### Lo que NO incluye esta entrega

| Ítem | Responsabilidad |
|------|-----------------|
| 🚫 Backend / API REST | El cliente debe desarrollar o contratar los 4 endpoints descritos en la sección 6 |
| 🚫 Base de datos | El almacenamiento de pedidos y menú es responsabilidad del backend del cliente |
| 🚫 Panel de administración | Sin interfaz para gestión de menú, mesas ni pedidos |
| 🚫 Notificaciones al staff | La app emite la señal; cómo notificar al personal es responsabilidad del backend |
| 🚫 Dominio personalizado | GitHub Pages usa el dominio `tomasfonta.github.io`; un dominio propio requiere configuración adicional |
| 🚫 Diseño personalizado adicional | El diseño actual puede modificarse bajo un acuerdo de mantenimiento separado |
| 🚫 Soporte post-entrega | Correcciones de bugs y nuevas funcionalidades se presupuestan por separado |

### Condiciones de funcionamiento en producción

Para que la aplicación opere con datos reales, el cliente debe proveer:

1. **Backend propio** con los 4 endpoints descritos en la [sección 6](#6-integración-con-el-backend)
2. **CORS habilitado** en el backend para `https://tomasfonta.github.io`
3. **URL de API** para configurar en `src/config/restaurants.js`
4. **Datos del menú** expuestos por `GET /menu` en el formato especificado
5. **Códigos QR impresos** para cada mesa con el formato de URL de la [sección 11](#11-generación-de-códigos-qr)

> Sin estos requisitos, la aplicación operará con datos de demo locales y **no transmitirá pedidos reales**.

---

*Documento actualizado: 27 de marzo de 2026.*
