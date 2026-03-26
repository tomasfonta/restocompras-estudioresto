import CartItem from './CartItem.jsx';

export default function Cart({ cartItems, onUpdateComment, onRemove, onAdd, onPlaceOrder, isSubmitting }) {
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
      <div className="cart-list">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateComment={onUpdateComment}
            onRemove={onRemove}
            onAdd={onAdd}
          />
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span>${total.toLocaleString('es-AR')}</span>
        </div>
        <button
          className="order-btn"
          onClick={onPlaceOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando pedido…' : 'Confirmar pedido'}
        </button>
      </div>
    </div>
  );
}
