export default function ConfirmDialog({ title, message, actions, onClose }) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <p className="dialog__title">{title}</p>
        {message && <p className="dialog__msg">{message}</p>}
        <div className="dialog__actions">
          {actions.map((action) => (
            <button
              key={action.label}
              className={`dialog__btn${action.primary ? ' dialog__btn--primary' : ''}`}
              onClick={() => { action.onClick(); onClose(); }}
            >
              {action.label}
            </button>
          ))}
          <button className="dialog__btn dialog__btn--cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
