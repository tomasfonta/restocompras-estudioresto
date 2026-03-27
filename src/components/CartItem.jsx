import { useState, useCallback, memo } from 'react';

export default memo(function CartItem({ item, onUpdateComment, onRemove, onAdd }) {
  const [editingComment, setEditingComment] = useState(false);
  const [commentValue, setCommentValue] = useState(item.comment || '');

  const handleCommentBlur = useCallback(() => {
    setEditingComment(false);
    onUpdateComment(item.id, commentValue);
  }, [item.id, commentValue, onUpdateComment]);

  return (
    <div className="cart-card">
      {/* Middle: name + qty stepper + comment */}
      <div className="cart-card__body">
        <p className="cart-card__name">{item.name}</p>

        {/* Qty stepper */}
        <div className="qty-stepper">
          <button className="qty-btn qty-btn--minus" onClick={() => onRemove(item)}>−</button>
          <span className="qty-count">{item.quantity}</span>
          <button className="qty-btn qty-btn--plus" onClick={() => onAdd(item)}>+</button>
        </div>

        {/* Comment */}
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
          <button className="comment-btn" onClick={() => setEditingComment(true)}>
            {item.comment ? `📝 ${item.comment}` : '+ Comentario'}
          </button>
        )}
      </div>

      {/* Right: price pill */}
      <div className="cart-card__price-wrap">
        <span className="cart-card__price">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </span>
      </div>
    </div>
  );
});
