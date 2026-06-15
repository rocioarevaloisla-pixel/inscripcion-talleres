import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './talleres.css';

export default function MisInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargar = async () => {
    setError('');
    try {
      const [inscRes, esperaRes] = await Promise.all([
        api.get('/inscripciones/mis-inscripciones'),
        api.get('/lista-espera/mis-solicitudes')
      ]);
      setInscripciones(inscRes.data);
      setSolicitudes(esperaRes.data);
    } catch {
      setError('Error al cargar datos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  useEffect(() => {
    const interval = setInterval(cargar, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelar = async (id) => {
    if (!confirm('¿Cancelar esta inscripción? Si hay lista de espera, el cupo se asignará al siguiente.')) return;
    setError('');
    setExito('');
    try {
      const res = await api.put(`/inscripciones/${id}/cancelar`);
      setExito(res.data.auto_inscrito
        ? 'Inscripción cancelada. Se asignó un cupo a alguien en lista de espera.'
        : 'Inscripción cancelada.');
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al cancelar');
    }
  };

  const handleCancelarEspera = async (id) => {
    if (!confirm('¿Cancelar tu solicitud de lista de espera?')) return;
    setError('');
    setExito('');
    try {
      await api.put(`/lista-espera/${id}/cancelar`);
      setExito('Solicitud de lista de espera cancelada');
      cargar();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al cancelar');
    }
  };

  const estadoBadge = (estado) => {
    if (estado === 'confirmada') return 'badge-activo';
    if (estado === 'pendiente') return 'badge-pendiente';
    return 'badge-inactivo';
  };

  const activas = inscripciones.filter(i => i.estado !== 'cancelada');

  return (
    <div className="talleres-container">
      <h2 className="talleres-titulo">Mis Inscripciones</h2>
      {error && <p className="talleres-error">{error}</p>}
      {exito && <p className="talleres-exito">{exito}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
          {activas.length === 0 ? (
            <div className="talleres-card">
              <p className="talleres-vacio">No tienes inscripciones activas.</p>
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
                    <th>Horario</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {activas.map(insc => {
                    const t = insc.Taller;
                    const fecha = t ? `${t.fecha_inicio?.split('-').reverse().slice(0,2).join('/')} ${(t.hora_inicio || '09:00').slice(0,5)}-${(t.hora_fin || '18:00').slice(0,5)}` : '';
                    return (
                      <tr key={insc.id}>
                        <td><strong>{t?.nombre || '—'}</strong></td>
                        <td>{fecha}</td>
                        <td>
                          <span className={estadoBadge(insc.estado)}>{insc.estado}</span>
                        </td>
                        <td>
                          <button onClick={() => handleCancelar(insc.id)} className="btn-cancelar-inscripcion">
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {solicitudes.filter(s => s.estado === 'pendiente').length > 0 && (
            <div className="talleres-card" style={{ marginTop: '1.5rem' }}>
              <h3>Lista de espera</h3>
              <table className="talleres-tabla">
                <thead>
                  <tr>
                    <th>Taller</th>
                    <th>Solicitado el</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.filter(s => s.estado === 'pendiente').map(sol => (
                    <tr key={sol.id}>
                      <td><strong>{sol.Taller?.nombre || '—'}</strong></td>
                      <td>{new Date(sol.fecha_solicitud).toLocaleDateString()}</td>
                      <td><span className="badge-pendiente">Esperando cupo</span></td>
                      <td>
                        <button onClick={() => handleCancelarEspera(sol.id)} className="btn-cancelar-inscripcion">
                          Cancelar solicitud
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
