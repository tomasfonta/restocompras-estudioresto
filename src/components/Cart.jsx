import { useState, useMemo, useCallback } from 'react';
import CartItem from './CartItem.jsx';

export default function Cart({ cartItems, onUpdateComment, onRemove, onAdd, onPlaceOrder, isSubmitting }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const total    = useMemo(() => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [cartItems]);
  const totalQty = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

  const groups = useMemo(() =>
    cartItems.reduce((acc, item) => {
      const cat = item.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {}),
  [cartItems]);

  const handleConfirm = useCallback(() => {
    setShowConfirm(false);
    onPlaceOrder();
  }, [onPlaceOrder]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <span>Tu pedido está vacío</span>
        <small>Seleccioná items del menú para agregar</small>
      </div>
    );
  }

  return (
    <div className="cart">

      {/* ── Sticky header: total + order button ── */}
      <div className="cart-total-bar">
        <div className="cart-total-bar__left">
          <span className="cart-total-bar__label">Tu pedido</span>
          <span className="cart-total-bar__count">{totalQty} {totalQty === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="cart-total-bar__right">
          <span className="cart-total-bar__sublabel">Total</span>
          <span className="cart-total-bar__value">${total.toLocaleString('es-AR')}</span>
        </div>
        <button
          className="cart-order-btn"
          onClick={() => setShowConfirm(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando…' : 'Realizar pedido'}
        </button>
      </div>

      {/* ── Scrollable list ── */}
      <div className="cart-list">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className="cart-group">
            <p className="cart-group__title">{category}</p>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateComment={onUpdateComment}
                onRemove={onRemove}
                onAdd={onAdd}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Confirm dialog ── */}
      {showConfirm && (
        <div className="cart-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="cart-confirm-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cart-confirm__icon">🛒</div>
            <h3 className="cart-confirm__title">¿Estás seguro?</h3>
            <p className="cart-confirm__msg">Se enviará tu pedido a la cocina. Esta acción no se puede deshacer.</p>
            <div className="cart-confirm__actions">
              <button className="cart-confirm__cancel" onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>
              <button className="cart-confirm__accept" onClick={handleConfirm}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
