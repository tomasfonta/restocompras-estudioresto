import { memo } from 'react';

export default memo(function Header({ restaurantName, tableNumber }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <p className="header-restaurant">{restaurantName}</p>
        {tableNumber && <span className="header-table">Mesa {tableNumber}</span>}
      </div>
    </header>
  );
});
