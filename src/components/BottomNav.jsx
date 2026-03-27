import { memo } from 'react';

const LABELS = {
  home: 'Inicio',
  menu: 'Menú',
  waiter: 'Mozo',
  bill: 'Cuenta',
};

export default memo(function BottomNav({ view, onHome, onMenu, onCart, onCallWaiter, onRequestBill, cartCount, actionLoading }) {
  const activeLabel = LABELS[view] ?? null;

  const itemClass = (key) => {
    const isActive = view === key;
    return isActive
      ? 'bottom-nav__item bottom-nav__item--pill'
      : 'bottom-nav__item';
  };

  return (
    <div className="bottom-nav-wrap">
      <nav className="bottom-nav">

        {/* Home */}
        <button className={itemClass('home')} onClick={onHome} aria-label="Inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          {view === 'home' && <span>Inicio</span>}
        </button>

        {/* Menu */}
        <button className={itemClass('menu')} onClick={onMenu} aria-label="Menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {view === 'menu' && <span>Menú</span>}
        </button>

        {/* Cart */}
        <button
          className={view === 'cart' ? 'bottom-nav__cart bottom-nav__item--pill' : 'bottom-nav__cart'}
          onClick={onCart}
          aria-label="Pedido"
        >
          <div className="bottom-nav__badge-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className="bottom-nav__badge">{cartCount}</span>}
          </div>
          {view === 'cart' && <span>Pedido</span>}
        </button>

        {/* Call waiter — service bell */}
        <button className={itemClass('waiter')} onClick={onCallWaiter} disabled={actionLoading} aria-label="Llamar mozo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
          </svg>
          {view === 'waiter' && <span>Mozo</span>}
        </button>

        {/* Bill — banknote / cash */}
        <button className={itemClass('bill')} onClick={onRequestBill} disabled={actionLoading} aria-label="Pedir cuenta">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <circle cx="12" cy="12" r="3"/>
            <path d="M6 12h.01M18 12h.01"/>
          </svg>
          {view === 'bill' && <span>Cuenta</span>}
        </button>

      </nav>
    </div>
  );
});
