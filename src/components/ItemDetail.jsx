export default function ItemDetail({ item, quantity, onAdd, onRemove, onClose }) {
  const currentQty = quantity > 0 ? quantity : 1;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="detail-handle" />

        {/* Back button */}
        <button className="detail-back" onClick={onClose} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span>Detalle del plato</span>
        </button>

        {/* Item image — only shown when a real image URL exists */}
        {item.image && (
          <div className="detail-img-wrap">
            <img src={item.image} alt={item.name} className="detail-img" />
          </div>
        )}

        {/* Info */}
        <div className="detail-body">
          <div className="detail-title-row">
            <h2 className="detail-name">{item.name}</h2>
            <span className="detail-price">${item.price.toLocaleString('es-AR')}</span>
          </div>
          {item.description && (
            <p className="detail-desc">{item.description}</p>
          )}

          {/* Quantity */}
          <p className="detail-label">¿Cuántas unidades?</p>
          <div className="detail-qty">
            <button
              className="detail-qty__btn"
              onClick={() => onRemove(item)}
              disabled={quantity === 0}
            >−</button>
            <span className="detail-qty__count">{currentQty}</span>
            <button className="detail-qty__btn detail-qty__btn--plus" onClick={() => onAdd(item)}>+</button>
          </div>

          {/* Actions */}
          <button className="detail-cart-btn" onClick={() => { onAdd(item); onClose(); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Agregar al pedido
          </button>
        </div>
      </div>
    </div>
  );
}
