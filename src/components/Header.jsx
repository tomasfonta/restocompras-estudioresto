export default function Header({ restaurantName, tableNumber }) {
  return (
    <header className="app-header">
      <div className="header-title">{restaurantName || 'Restaurante'}</div>
      {tableNumber && (
        <div className="header-table">Mesa {tableNumber}</div>
      )}
    </header>
  );
}
