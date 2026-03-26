import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import MenuItem from './components/MenuItem.jsx';
import Cart from './components/Cart.jsx';
import TableActions from './components/TableActions.jsx';
import Toast from './components/Toast.jsx';
import { getMenu, placeOrder, callWaiter, requestBill } from './services/restaurantService.js';
import restaurants from './config/restaurants.js';

// ─── Read URL params ──────────────────────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const RESTAURANT_ID = params.get('restaurantId') || '';
const TABLE_NUMBER = params.get('table') || '1';

// ─── Views ────────────────────────────────────────────────────────────────────
const VIEW_MENU = 'menu';
const VIEW_CART = 'cart';

const INVALID_QR = !RESTAURANT_ID || !restaurants[RESTAURANT_ID];

export default function App() {
  const restaurantName = !INVALID_QR ? restaurants[RESTAURANT_ID].name : '';

  // Menu state
  const [menuCategories, setMenuCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingMenu, setLoadingMenu] = useState(!INVALID_QR);
  const [menuError, setMenuError] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [view, setView] = useState(VIEW_MENU);

  // Actions state
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // ─── Load menu ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (INVALID_QR) return;
    setLoadingMenu(true);
    getMenu(RESTAURANT_ID)
      .then((data) => {
        setMenuCategories(data);
        if (data.length > 0) setActiveCategory(data[0].category);
        setLoadingMenu(false);
      })
      .catch(() => {
        setMenuError('No se pudo cargar el menú. Intentá de nuevo.');
        setLoadingMenu(false);
      });
  }, []);

  // ─── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000);
  }, []);

  // ─── Cart helpers ────────────────────────────────────────────────────────────
  function addItem(item) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1, comment: '' }];
    });
  }

  function removeItem(item) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.id !== item.id);
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  function updateComment(itemId, comment) {
    setCartItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, comment } : i))
    );
  }

  function getQuantity(itemId) {
    return cartItems.find((i) => i.id === itemId)?.quantity || 0;
  }

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // ─── Actions ─────────────────────────────────────────────────────────────────
  async function handlePlaceOrder() {
    if (cartItems.length === 0) return;
    setSubmitting(true);
    try {
      const result = await placeOrder(RESTAURANT_ID, TABLE_NUMBER, cartItems);
      if (result.success) {
        setCartItems([]);
        setView(VIEW_MENU);
        showToast(`✅ Pedido enviado (${result.orderId})`, 'success');
      } else {
        showToast('❌ Error al enviar el pedido. Intentá de nuevo.', 'error');
      }
    } catch {
      showToast('❌ Error al enviar el pedido. Intentá de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCallWaiter() {
    setActionLoading(true);
    try {
      await callWaiter(RESTAURANT_ID, TABLE_NUMBER);
      showToast('🛎 El mozo está en camino', 'success');
    } catch {
      showToast('❌ No se pudo llamar al mozo', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRequestBill() {
    setActionLoading(true);
    try {
      await requestBill(RESTAURANT_ID, TABLE_NUMBER);
      showToast('🧾 La cuenta está en camino', 'success');
    } catch {
      showToast('❌ No se pudo pedir la cuenta', 'error');
    } finally {
      setActionLoading(false);
    }
  }

  // ─── Invalid QR screen ───────────────────────────────────────────────────────
  if (INVALID_QR) {
    return (
      <div className="app app--error">
        <div className="qr-error">
          <span className="qr-error__icon">⚠️</span>
          <h2>Código QR inválido</h2>
          <p>No se encontró el restaurante. Por favor, escaneá el código QR que se encuentra en tu mesa.</p>
        </div>
      </div>
    );
  }

  // ─── Active category items ───────────────────────────────────────────────────
  const activeItems =
    menuCategories.find((c) => c.category === activeCategory)?.items || [];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header restaurantName={restaurantName} tableNumber={TABLE_NUMBER} />

      <Toast message={toast.message} type={toast.type} />

      {/* View tabs */}
      <div className="view-tabs">
        <button
          className={`view-tab${view === VIEW_MENU ? ' view-tab--active' : ''}`}
          onClick={() => setView(VIEW_MENU)}
        >
          Menú
        </button>
        <button
          className={`view-tab${view === VIEW_CART ? ' view-tab--active' : ''}`}
          onClick={() => setView(VIEW_CART)}
        >
          Mi pedido{totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      <main className="main-content">
        {view === VIEW_MENU && (
          <>
            {loadingMenu && <div className="loading">Cargando menú…</div>}
            {menuError && <div className="error-msg">{menuError}</div>}
            {!loadingMenu && !menuError && (
              <>
                <CategoryTabs
                  categories={menuCategories.map((c) => c.category)}
                  active={activeCategory}
                  onSelect={setActiveCategory}
                />
                <div className="items-list">
                  {activeItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      quantity={getQuantity(item.id)}
                      onAdd={addItem}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {view === VIEW_CART && (
          <Cart
            cartItems={cartItems}
            onUpdateComment={updateComment}
            onRemove={removeItem}
            onAdd={addItem}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={submitting}
          />
        )}
      </main>

      <TableActions
        onCallWaiter={handleCallWaiter}
        onRequestBill={handleRequestBill}
        loading={actionLoading}
      />
    </div>
  );
}
