export default function TableActions({ onCallWaiter, onRequestBill, loading }) {
  return (
    <div className="table-actions">
      <button
        className="action-btn action-btn--waiter"
        onClick={onCallWaiter}
        disabled={loading}
      >
        🛎 Llamar al mozo
      </button>
      <button
        className="action-btn action-btn--bill"
        onClick={onRequestBill}
        disabled={loading}
      >
        🧾 Pedir la cuenta
      </button>
    </div>
  );
}
