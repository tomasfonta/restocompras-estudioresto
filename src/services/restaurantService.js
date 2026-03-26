import restaurants from '../config/restaurants.js';

// ─── Mock menu data ──────────────────────────────────────────────────────────

const MOCK_MENU = [
  {
    category: 'Entradas',
    items: [
      { id: 'e1', name: 'Tabla de fiambres', description: 'Jamón, salame, queso y aceitunas', price: 1800 },
      { id: 'e2', name: 'Empanadas (x4)', description: 'Rellenas de carne cortada a cuchillo', price: 1400 },
      { id: 'e3', name: 'Provoleta', description: 'Queso provolone a la plancha con orégano', price: 1200 },
      { id: 'e4', name: 'Bruschetta', description: 'Pan tostado con tomate, albahaca y oliva', price: 950 },
    ],
  },
  {
    category: 'Platos Principales',
    items: [
      { id: 'p1', name: 'Hamburguesa clásica', description: 'Carne 200g, lechuga, tomate, cheddar y pan brioche', price: 2200 },
      { id: 'p2', name: 'Milanesa napolitana', description: 'Con jamón, salsa de tomate y queso gratinado. Papas fritas', price: 2800 },
      { id: 'p3', name: 'Bife de chorizo', description: '300g al punto que desees. Guarnición a elección', price: 3800 },
      { id: 'p4', name: 'Pasta al pesto', description: 'Fetuccini con salsa de albahaca, ajo y queso parmesano', price: 1900 },
      { id: 'p5', name: 'Pollo grillado', description: 'Pechuga a la parrilla con ensalada verde', price: 2400 },
    ],
  },
  {
    category: 'Postres',
    items: [
      { id: 'd1', name: 'Volcán de chocolate', description: 'Bizcochuelo tibio con centro fundido y helado de vainilla', price: 1100 },
      { id: 'd2', name: 'Tiramisú', description: 'Clásico italiano con mascarpone y café', price: 980 },
      { id: 'd3', name: 'Flan casero', description: 'Con dulce de leche y crema chantilly', price: 750 },
      { id: 'd4', name: 'Helado (3 bochas)', description: 'Vainilla, chocolate o frutilla', price: 800 },
    ],
  },
  {
    category: 'Bebidas',
    items: [
      { id: 'b1', name: 'Agua mineral', description: 'Con o sin gas 500 ml', price: 400 },
      { id: 'b2', name: 'Gaseosa', description: 'Coca-Cola, Sprite o Fanta 350 ml', price: 600 },
      { id: 'b3', name: 'Jugo natural', description: 'Naranja, pomelo o manzana', price: 750 },
      { id: 'b4', name: 'Cerveza artesanal', description: 'Rubia o negra 500 ml', price: 1100 },
      { id: 'b5', name: 'Vino copa', description: 'Tinto, blanco o rosado de la casa', price: 1000 },
    ],
  },
  {
    category: 'Cafetería',
    items: [
      { id: 'c1', name: 'Espresso', description: 'Café solo en taza pequeña', price: 400 },
      { id: 'c2', name: 'Cortado', description: 'Espresso con un toque de leche', price: 450 },
      { id: 'c3', name: 'Café con leche', description: 'Con leche caliente o fría', price: 550 },
      { id: 'c4', name: 'Cappuccino', description: 'Con espuma de leche y cacao', price: 650 },
      { id: 'c5', name: 'Té / Infusión', description: 'Verde, negro, manzanilla o menta peperita', price: 450 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getConfig(restaurantId) {
  const config = restaurants[restaurantId];
  if (!config) {
    throw new Error(`Restaurant "${restaurantId}" not found in config.`);
  }
  return config;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Fetches the restaurant menu.
 * Returns a list of categories, each with its items.
 * Falls back to mock data when the endpoint is unreachable.
 *
 * @param {string} restaurantId
 * @returns {Promise<Array>}
 */
export async function getMenu(restaurantId) {
  const config = getConfig(restaurantId);
  try {
    const res = await fetch(`${config.apiUrl}/menu`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    // Return mock data so the app works without a real backend
    await delay(400);
    return MOCK_MENU;
  }
}

/**
 * Places an order.
 *
 * @param {string} restaurantId
 * @param {number|string} tableNumber
 * @param {Array<{id:string, name:string, quantity:number, comment:string, price:number}>} items
 * @returns {Promise<{success:boolean, orderId:string}>}
 */
export async function placeOrder(restaurantId, tableNumber, items) {
  const config = getConfig(restaurantId);
  const body = { tableNumber, items };
  try {
    const res = await fetch(`${config.apiUrl}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    await delay(600);
    return { success: true, orderId: `ORD-${Date.now()}` };
  }
}

/**
 * Calls the waiter to the table.
 *
 * @param {string} restaurantId
 * @param {number|string} tableNumber
 * @returns {Promise<{success:boolean}>}
 */
export async function callWaiter(restaurantId, tableNumber) {
  const config = getConfig(restaurantId);
  try {
    const res = await fetch(`${config.apiUrl}/call-waiter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableNumber }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    await delay(400);
    return { success: true };
  }
}

/**
 * Requests the bill for the table.
 *
 * @param {string} restaurantId
 * @param {number|string} tableNumber
 * @returns {Promise<{success:boolean}>}
 */
export async function requestBill(restaurantId, tableNumber) {
  const config = getConfig(restaurantId);
  try {
    const res = await fetch(`${config.apiUrl}/bill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableNumber }),
    });
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    await delay(400);
    return { success: true };
  }
}
