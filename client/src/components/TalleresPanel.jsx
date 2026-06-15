import { useState } from 'react';
import './TalleresPanel.css';

export default function TalleresPanel({ settings, onChange, dirty, onGuardar }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {abierto && <div className="panel-overlay" onClick={() => setAbierto(false)} />}
      <button className="panel-flotante" onClick={() => setAbierto(!abierto)} title="Personalizar vista">
        ⚙️
      </button>
      <aside className={`panel-drawer ${abierto ? 'panel-abierto' : ''}`}>
        <div className="panel-header">
          <h3>Personalizar</h3>
          <button className="panel-cerrar" onClick={() => setAbierto(false)}>✕</button>
        </div>
        <div className="panel-cuerpo">
          <div className="panel-seccion">
            <h4>Vista</h4>
            <div className="panel-opciones">
              <button
                className={`panel-btn ${settings.vista === 'grid' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, vista: 'grid' })}
              >Grid</button>
              <button
                className={`panel-btn ${settings.vista === 'lista' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, vista: 'lista' })}
              >Lista</button>
            </div>
          </div>
          <div className="panel-seccion">
            <h4>Tamaño cards</h4>
            <div className="panel-opciones">
              <button
                className={`panel-btn ${settings.tamano === 'peq' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, tamano: 'peq' })}
              >Peq</button>
              <button
                className={`panel-btn ${settings.tamano === 'med' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, tamano: 'med' })}
              >Med</button>
              <button
                className={`panel-btn ${settings.tamano === 'gde' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, tamano: 'gde' })}
              >Gde</button>
            </div>
          </div>
          <div className="panel-seccion">
            <h4>Filtros</h4>
            <label className="panel-check">
              <input type="checkbox" checked={settings.soloActivos}
                onChange={e => onChange({ ...settings, soloActivos: e.target.checked })} />
              Solo activos
            </label>
            <label className="panel-check">
              <input type="checkbox" checked={settings.soloConCupo}
                onChange={e => onChange({ ...settings, soloConCupo: e.target.checked })} />
              Solo con cupo
            </label>
            <label className="panel-check">
              <input type="checkbox" checked={settings.soloGratis}
                onChange={e => onChange({ ...settings, soloGratis: e.target.checked })} />
              Solo gratis
            </label>
          </div>
          <div className="panel-seccion">
            <h4>Ordenar por</h4>
            <div className="panel-opciones">
              <button
                className={`panel-btn ${settings.orden === 'default' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, orden: 'default' })}
              >Defecto</button>
              <button
                className={`panel-btn ${settings.orden === 'nombre-asc' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, orden: 'nombre-asc' })}
              >A-Z</button>
              <button
                className={`panel-btn ${settings.orden === 'nombre-desc' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, orden: 'nombre-desc' })}
              >Z-A</button>
              <button
                className={`panel-btn ${settings.orden === 'reciente' ? 'panel-activo' : ''}`}
                onClick={() => onChange({ ...settings, orden: 'reciente' })}
              >Más nuevo</button>
            </div>
          </div>
          {dirty && (
            <div className="panel-guardar-container">
              <button className="panel-btn-guardar" onClick={onGuardar}>
                💾 Guardar cambios
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
