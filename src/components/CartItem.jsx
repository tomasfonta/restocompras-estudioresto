import { useState } from 'react';

export default function CartItem({ item, onUpdateComment, onRemove, onAdd }) {
  const [editingComment, setEditingComment] = useState(false);
  const [commentValue, setCommentValue] = useState(item.comment || '');

  function handleCommentBlur() {
    setEditingComment(false);
    onUpdateComment(item.id, commentValue);
  }

  return (
    <div className="cart-item">
      <div className="cart-item__top">
        <div className="cart-item__name-qty">
          <button className="qty-btn qty-btn--minus" onClick={() => onRemove(item)}>−</button>
          <span className="qty-count">{item.quantity}</span>
          <button className="qty-btn qty-btn--plus" onClick={() => onAdd(item)}>+</button>
          <span className="cart-item__name">{item.name}</span>
        </div>
        <span className="cart-item__subtotal">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </span>
      </div>

      {editingComment ? (
        <input
          className="comment-input"
          autoFocus
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          onBlur={handleCommentBlur}
          placeholder="Ej: sin tomate, sin cebolla…"
          maxLength={120}
        />
      ) : (
        <button
          className="comment-btn"
          onClick={() => setEditingComment(true)}
        >
          {item.comment ? `📝 ${item.comment}` : '+ Agregar comentario'}
        </button>
      )}
    </div>
  );
}
