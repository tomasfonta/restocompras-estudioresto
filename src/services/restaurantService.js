import restaurants from '../config/restaurants.js';

// ─── Mock menu data ──────────────────────────────────────────────────────────

const MOCK_MENU = [
  {
    category: 'Entradas',
    items: [
      { id: 'e1',  name: 'Tabla de fiambres',       description: 'Jamón, salame, queso y aceitunas', price: 1800 },
      { id: 'e2',  name: 'Empanadas (x4)',           description: 'Rellenas de carne cortada a cuchillo', price: 1400 },
      { id: 'e3',  name: 'Provoleta',                description: 'Queso provolone a la plancha con orégano', price: 1200 },
      { id: 'e4',  name: 'Bruschetta',               description: 'Pan tostado con tomate, albahaca y oliva', price: 950 },
      { id: 'e5',  name: 'Croquetas de jamón',       description: 'Rebozadas y fritas, con salsa de mostaza y miel', price: 1100 },
      { id: 'e6',  name: 'Carpaccio de res',         description: 'Láminas finas con rúcula, parmesano y limón', price: 1650 },
      { id: 'e7',  name: 'Hummus artesanal',         description: 'Con pita tostada, aceite de oliva y pimentón', price: 1050 },
      { id: 'e8',  name: 'Tostones con guacamole',   description: 'Plátano verde frito con guacamole casero', price: 900 },
      { id: 'e9',  name: 'Rebozados de queso',       description: 'Queso brie empanado con mermelada de frambuesa', price: 1300 },
      { id: 'e10', name: 'Tartar de atún',           description: 'Atún fresco, aguacate, sésamo y salsa ponzu', price: 1950 },
      { id: 'e11', name: 'Patatas bravas',           description: 'Con salsa brava picante y alioli casero', price: 850 },
      { id: 'e12', name: 'Nachos con cheddar',       description: 'Con salsa cheddar, jalapeños y crema agria', price: 1150 },
      { id: 'e13', name: 'Gyozas de cerdo (x6)',     description: 'Rellenas de cerdo y verduras, salsa de soja', price: 1400 },
      { id: 'e14', name: 'Pulpo a la gallega',       description: 'Con papas, aceite de oliva y pimentón ahumado', price: 2200 },
      { id: 'e15', name: 'Ceviche clásico',          description: 'Pescado blanco, limón, cebolla morada y cilantro', price: 1750 },
      { id: 'e16', name: 'Canastitas de pollo',      description: 'Mini tartaletas rellenas de pollo gratinado', price: 1200 },
    ],
  },
  {
    category: 'Platos Principales',
    items: [
      { id: 'p1',  name: 'Hamburguesa clásica',      description: 'Carne 200g, lechuga, tomate, cheddar y pan brioche', price: 2200 },
      { id: 'p2',  name: 'Milanesa napolitana',      description: 'Con jamón, salsa de tomate y queso gratinado. Papas fritas', price: 2800 },
      { id: 'p3',  name: 'Bife de chorizo',          description: '300g al punto que desees. Guarnición a elección', price: 3800 },
      { id: 'p4',  name: 'Pasta al pesto',           description: 'Fetuccini con salsa de albahaca, ajo y queso parmesano', price: 1900 },
      { id: 'p5',  name: 'Pollo grillado',           description: 'Pechuga a la parrilla con ensalada verde', price: 2400 },
      { id: 'p6',  name: 'Salmón al limón',          description: 'Con vegetales salteados y puré de coliflor', price: 3200 },
      { id: 'p7',  name: 'Risotto de hongos',        description: 'Arroz cremoso con champiñones, tomillo y parmesano', price: 2100 },
      { id: 'p8',  name: 'Tacos de cerdo (x3)',      description: 'Carne de cerdo, cebolla morada, cilantro y salsa verde', price: 1800 },
      { id: 'p9',  name: 'Veggie burger',            description: 'Medallón de garbanzos, espinaca, tomate y salsa tahini', price: 2000 },
      { id: 'p10', name: 'Lasaña bolognesa',         description: 'Masa artesanal con ragú de carne y bechamel', price: 2600 },
      { id: 'p11', name: 'Costillas BBQ',            description: 'Costillas de cerdo ahumadas con salsa barbacoa casera', price: 3500 },
      { id: 'p12', name: 'Bowl de quinoa',           description: 'Quinoa, garbanzos, aguacate, tomate cherry y tahini', price: 1900 },
      { id: 'p13', name: 'Trucha a la manteca',      description: 'Con almendras tostadas, limón y espárragos', price: 2900 },
      { id: 'p14', name: 'Entraña a la parrilla',    description: '250g con chimichurri y papas rústicas', price: 3400 },
      { id: 'p15', name: 'Pollo al curry',           description: 'En salsa de coco y curry rojo, con arroz basmati', price: 2300 },
      { id: 'p16', name: 'Ravioles de ricotta',      description: 'Con salsa de tomates frescos y albahaca', price: 2000 },
      { id: 'p17', name: 'Wok de vegetales',         description: 'Brócoli, zanahoria, morrón y tofu salteados', price: 1800 },
      { id: 'p18', name: 'Pesca del día',            description: 'Al horno con hierbas frescas y guarnición', price: 3100 },
      { id: 'p19', name: 'Costillar de cordero',     description: 'Con romero, ajo y papas al tomillo', price: 4200 },
      { id: 'p20', name: 'Calzone de jamón y queso', description: 'Masa al horno rellena, con salsa de tomate', price: 2200 },
    ],
  },
  {
    category: 'Postres',
    items: [
      { id: 'd1',  name: 'Volcán de chocolate',      description: 'Bizcochuelo tibio con centro fundido y helado de vainilla', price: 1100 },
      { id: 'd2',  name: 'Tiramisú',                 description: 'Clásico italiano con mascarpone y café', price: 980 },
      { id: 'd3',  name: 'Flan casero',              description: 'Con dulce de leche y crema chantilly', price: 750 },
      { id: 'd4',  name: 'Helado (3 bochas)',         description: 'Vainilla, chocolate o frutilla', price: 800 },
      { id: 'd5',  name: 'Cheesecake de frutos rojos', description: 'Base de galletita, crema de queso y coulis de berries', price: 1050 },
      { id: 'd6',  name: 'Panqueques con dulce de leche', description: 'Dos panqueques rellenos, con nueces y helado', price: 900 },
      { id: 'd7',  name: 'Brownie con helado',       description: 'Brownie de chocolate amargo tibio con helado de crema', price: 950 },
      { id: 'd8',  name: 'Panna cotta',              description: 'Con coulis de maracuyá y frutos rojos', price: 870 },
      { id: 'd9',  name: 'Profiteroles',             description: 'Choux rellenos de crema y bañados en chocolate', price: 1000 },
      { id: 'd10', name: 'Arroz con leche',          description: 'Cremoso, con canela y ralladura de limón', price: 650 },
      { id: 'd11', name: 'Tarta de limón',           description: 'Con merengue italiano tostado', price: 920 },
      { id: 'd12', name: 'Crème brûlée',             description: 'Clásica francesa con costra de azúcar caramelizada', price: 1080 },
      { id: 'd13', name: 'Soufflé de vainilla',      description: 'Esponjoso y ligero, servido al momento', price: 1150 },
      { id: 'd14', name: 'Medialunas con dulce de leche', description: 'Tres medialunas de manteca con relleno artesanal', price: 600 },
    ],
  },
  {
    category: 'Bebidas',
    items: [
      { id: 'b1',  name: 'Agua mineral',             description: 'Con o sin gas 500 ml', price: 400 },
      { id: 'b2',  name: 'Gaseosa',                  description: 'Coca-Cola, Sprite o Fanta 350 ml', price: 600 },
      { id: 'b3',  name: 'Jugo natural',             description: 'Naranja, pomelo o manzana', price: 750 },
      { id: 'b4',  name: 'Cerveza artesanal',        description: 'Rubia o negra 500 ml', price: 1100 },
      { id: 'b5',  name: 'Vino copa',                description: 'Tinto, blanco o rosado de la casa', price: 1000 },
      { id: 'b6',  name: 'Limonada natural',         description: 'Exprimida al momento con o sin jengibre', price: 700 },
      { id: 'b7',  name: 'Smoothie de frutas',       description: 'Frutilla, banana y naranja con leche de almendras', price: 850 },
      { id: 'b8',  name: 'Aperol Spritz',            description: 'Aperol, prosecco y rodaja de naranja', price: 1400 },
      { id: 'b9',  name: 'Agua tónica',              description: 'Schweppes original 250 ml', price: 500 },
      { id: 'b10', name: 'Kombucha',                 description: 'Fermentada artesanal, sabor jengibre-limón', price: 900 },
      { id: 'b11', name: 'Cerveza sin alcohol',      description: 'Heineken 0.0 lata 330 ml', price: 800 },
      { id: 'b12', name: 'Vino botella',             description: 'Malbec, Torrontés o Cabernet de bodega local', price: 3500 },
      { id: 'b13', name: 'Fernet con cola',          description: 'Fernet Branca con Coca-Cola 300 ml', price: 1200 },
      { id: 'b14', name: 'Gin tónica',               description: 'Gin premium con agua tónica y pepino', price: 1600 },
      { id: 'b15', name: 'Jugo verde detox',         description: 'Espinaca, pepino, manzana y jengibre', price: 950 },
      { id: 'b16', name: 'Mate cocido',              description: 'Servido en jarra con azúcar o edulcorante', price: 350 },
      { id: 'b17', name: 'Agua de coco',             description: 'Natural, fría 300 ml', price: 600 },
      { id: 'b18', name: 'Clericó blanco',           description: 'Vino blanco con frutas de estación', price: 1300 },
    ],
  },
  {
    category: 'Cafetería',
    items: [
      { id: 'c1',  name: 'Espresso',                 description: 'Café solo en taza pequeña', price: 400 },
      { id: 'c2',  name: 'Cortado',                  description: 'Espresso con un toque de leche', price: 450 },
      { id: 'c3',  name: 'Café con leche',           description: 'Con leche caliente o fría', price: 550 },
      { id: 'c4',  name: 'Cappuccino',               description: 'Con espuma de leche y cacao', price: 650 },
      { id: 'c5',  name: 'Té / Infusión',            description: 'Verde, negro, manzanilla o menta peperita', price: 450 },
      { id: 'c6',  name: 'Latte',                    description: 'Doble espresso con leche vaporizada y arte latte', price: 700 },
      { id: 'c7',  name: 'Mocha',                    description: 'Espresso, chocolate y leche cremosa', price: 750 },
      { id: 'c8',  name: 'Cold brew',                description: 'Café en frío infusionado 12 hs, con o sin leche', price: 800 },
      { id: 'c9',  name: 'Flat white',               description: 'Doble ristretto con microespuma de leche', price: 720 },
      { id: 'c10', name: 'Affogato',                 description: 'Bola de helado de vainilla con espresso caliente', price: 850 },
      { id: 'c11', name: 'Matecocido con leche',     description: 'Mate cocido en taza grande con leche entera', price: 500 },
      { id: 'c12', name: 'Chocolate caliente',       description: 'Con crema batida y virutas de chocolate', price: 700 },
      { id: 'c13', name: 'Café filtrado',            description: 'V60 de origen único, molido al momento', price: 780 },
      { id: 'c14', name: 'Chai latte',               description: 'Infusión de especias con leche vaporizada', price: 750 },
      { id: 'c15', name: 'Espresso doble',           description: 'Doble dosis de café en taza pequeña', price: 550 },
      { id: 'c16', name: 'Freddo de café',           description: 'Cold brew con leche y hielo', price: 850 },
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
