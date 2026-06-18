import './ConfirmModal.css';

export default function ConfirmModal({ mensaje, nombreTaller, onConfirm, onCancel, cargando, error, confirmText, tipo }) {
  const esAlerta = tipo === 'alert';
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">
          {esAlerta ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f39c12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>
        <h3 className="confirm-title">{esAlerta ? 'Error' : 'Confirmar'}</h3>
        <p className="confirm-mensaje">
          {mensaje}
          {nombreTaller && <strong> &ldquo;{nombreTaller}&rdquo;</strong>}
        </p>
        {error && <p className="confirm-error">{error}</p>}
        <div className="confirm-actions">
          {esAlerta ? (
            <button className="confirm-btn-cancelar" onClick={onCancel}>
              Cerrar
            </button>
          ) : (
            <>
              <button className="confirm-btn-cancelar" onClick={onCancel} disabled={cargando}>
                No, volver
              </button>
              <button className="confirm-btn-confirmar" onClick={onConfirm} disabled={cargando}>
                {cargando ? 'Procesando...' : confirmText || 'Sí, cancelar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
