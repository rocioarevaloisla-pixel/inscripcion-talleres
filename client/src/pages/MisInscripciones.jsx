import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './talleres.css';

export default function MisInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/inscripciones/mis-inscripciones')
      .then(res => setInscripciones(res.data))
      .catch(() => setError('Error al cargar tus inscripciones'))
      .finally(() => setCargando(false));
  }, []);

  const estadoBadge = (estado) => {
    if (estado === 'confirmada') return 'badge-activo';
    if (estado === 'pendiente') return 'badge-pendiente';
    return 'badge-inactivo';
  };

  return (
    <div className="talleres-container">
      <h2 className="talleres-titulo">Mis Inscripciones</h2>
      {error && <p className="talleres-error">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : inscripciones.length === 0 ? (
        <div className="talleres-card">
          <p className="talleres-vacio">No te has inscrito a ningún taller aún.</p>
          <p style={{ marginTop: '12px' }}>
            <Link to="/talleres" className="btn-guardar" style={{ textDecoration: 'none', padding: '8px 16px', display: 'inline-block' }}>
              Ver talleres disponibles
            </Link>
          </p>
        </div>
      ) : (
        <div className="talleres-card">
          <table className="talleres-tabla">
            <thead>
              <tr>
                <th>Taller</th>
                <th>Instructor</th>
                <th>Fecha inicio</th>
                <th>Estado inscripción</th>
                <th>Fecha inscripción</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map(insc => (
                <tr key={insc.id}>
                  <td>{insc.Taller?.nombre || '—'}</td>
                  <td>{insc.Taller?.instructor || '—'}</td>
                  <td>{insc.Taller?.fecha_inicio || '—'}</td>
                  <td>
                    <span className={estadoBadge(insc.estado)}>
                      {insc.estado}
                    </span>
                  </td>
                  <td>{new Date(insc.fecha_inscripcion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
