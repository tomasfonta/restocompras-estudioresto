import { memo } from 'react';

export default memo(function MenuItem({ item, quantity, onAdd, onRemove, onSelect }) {
  return (
    <div className="menu-card" onClick={() => onSelect(item)}>
      {item.image && (
        <div className="menu-card__img-wrap">
          <img src={item.image} alt={item.name} className="menu-card__img" />
        </div>
      )}
      <div className="menu-card__body">
        <div className="menu-card__text">
          <p className="menu-card__name">{item.name}</p>
          {item.description && <p className="menu-card__desc">{item.description}</p>}
        </div>
        <div className="menu-card__footer">
          <span className="menu-card__price">
            <sup className="menu-card__price-sup">$</sup>
            {item.price.toLocaleString('es-AR')}
          </span>
          {quantity > 0 ? (
            <div className="menu-qty-stepper" onClick={(e) => e.stopPropagation()}>
              <button className="menu-qty-btn" onClick={() => onRemove(item)}>−</button>
              <span className="menu-qty-count">{quantity}</span>
              <button className="menu-qty-btn" onClick={() => onAdd(item)}>+</button>
            </div>
          ) : (
            <button
              className="menu-card__add"
              onClick={(e) => { e.stopPropagation(); onAdd(item); }}
              aria-label="Agregar"
            >+</button>
          )}
        </div>
      </div>
    </div>
  );
});
