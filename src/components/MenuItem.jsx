export default function MenuItem({ item, quantity, onAdd, onRemove }) {
  return (
    <div className="menu-item">
      <div className="menu-item__info">
        <span className="menu-item__name">{item.name}</span>
        <span className="menu-item__desc">{item.description}</span>
        <span className="menu-item__price">${item.price.toLocaleString('es-AR')}</span>
      </div>
      <div className="menu-item__controls">
        {quantity > 0 ? (
          <>
            <button className="qty-btn qty-btn--minus" onClick={() => onRemove(item)}>−</button>
            <span className="qty-count">{quantity}</span>
            <button className="qty-btn qty-btn--plus" onClick={() => onAdd(item)}>+</button>
          </>
        ) : (
          <button className="add-btn" onClick={() => onAdd(item)}>Agregar</button>
        )}
      </div>
    </div>
  );
}
