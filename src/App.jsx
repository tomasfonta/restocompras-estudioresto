import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import CategoryTabs from './components/CategoryTabs.jsx';
import MenuItem from './components/MenuItem.jsx';
import ItemDetail from './components/ItemDetail.jsx';
import Cart from './components/Cart.jsx';
import BottomNav from './components/BottomNav.jsx';
import Toast from './components/Toast.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';
import { useMenu } from './hooks/useMenu.js';
import { useCart } from './hooks/useCart.js';
import { useActions } from './hooks/useActions.js';
import restaurants from './config/restaurants.js';

// ─── URL params (fallback to dev values) ─────────────────────────────────────
const params        = new URLSearchParams(window.location.search);
const RESTAURANT_ID = params.get('restaurantId') || 'estudioresto';
const TABLE_NUMBER  = params.get('table') || '1';

const VIEW_HOME = 'home';
const VIEW_MENU = 'menu';
const VIEW_CART = 'cart';

const INVALID_QR = !RESTAURANT_ID || !restaurants[RESTAURANT_ID];

export default function App() {
  const restaurantName = !INVALID_QR ? restaurants[RESTAURANT_ID].name : '';

  const [view, setView]                 = useState(VIEW_HOME);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    categoryNames,
    activeCategory,
    setActiveCategory,
    activeItems,
    itemCategoryMap,
    loading: loadingMenu,
    error: menuError,
  } = useMenu(INVALID_QR ? null : RESTAURANT_ID);

  const {
    cartItems,
    addItem,
    removeItem,
    updateComment,
    clearCart,
    getQuantity,
    totalItems,
  } = useCart(itemCategoryMap);

  const goToMenu = useCallback(() => setView(VIEW_MENU), []);

  const {
    submitting,
    actionLoading,
    toast,
    dialog,
    closeDialog,
    handlePlaceOrder,
    handleCallWaiter,
    handleRequestBill,
  } = useActions(RESTAURANT_ID, TABLE_NUMBER, clearCart, goToMenu);

  const onPlaceOrder = useCallback(
    () => handlePlaceOrder(cartItems),
    [handlePlaceOrder, cartItems]
  );

  const closeItem = useCallback(() => setSelectedItem(null), []);

  // ─── Invalid QR ──────────────────────────────────────────────────────────────
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

  // ─── Splash ───────────────────────────────────────────────────────────────────
  if (view === VIEW_HOME) {
    return (
      <div className="app">
        <div className="splash">
          <div className="splash__overlay" />
          <div className="splash__hero">
            <h1 className="splash__name">{restaurantName}</h1>
            <p className="splash__tagline">Mesa {TABLE_NUMBER} · Bienvenido</p>
          </div>
          <div className="splash__actions">
            <button className="splash__cta" onClick={goToMenu}>
              ¡Ver el menú!
            </button>
          </div>
        </div>
        <Toast message={toast.message} type={toast.type} />
      </div>
    );
  }

  // ─── Main app ────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <Header restaurantName={restaurantName} tableNumber={TABLE_NUMBER} />

      <Toast message={toast.message} type={toast.type} />

      <main className="main-content">
        {view === VIEW_MENU && (
          <>
            {loadingMenu && <div className="loading">Cargando menú…</div>}
            {menuError   && <div className="error-msg">{menuError}</div>}
            {!loadingMenu && !menuError && (
              <>
                <CategoryTabs
                  categories={categoryNames}
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
                      onSelect={setSelectedItem}
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
            onPlaceOrder={onPlaceOrder}
            isSubmitting={submitting}
          />
        )}
      </main>

      <BottomNav
        view={view}
        onHome={() => setView(VIEW_HOME)}
        onMenu={() => setView(VIEW_MENU)}
        onCart={() => setView(VIEW_CART)}
        onCallWaiter={handleCallWaiter}
        onRequestBill={handleRequestBill}
        cartCount={totalItems}
        actionLoading={actionLoading}
      />

      {selectedItem && (
        <ItemDetail
          item={selectedItem}
          quantity={getQuantity(selectedItem.id)}
          onAdd={addItem}
          onRemove={removeItem}
          onClose={closeItem}
        />
      )}

      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          actions={dialog.actions}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}
