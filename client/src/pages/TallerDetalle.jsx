import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './TallerDetalle.css';

export default function TallerDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true);
      setError('');
      try {
        const res = await api.get(`/talleres/${id}`);
        setTaller(res.data);

        const todosRes = await api.get('/talleres');
        const otros = todosRes.data.filter(t => t.id !== Number(id));
        setRelacionados(otros.slice(0, 3));
      } catch {
        setError('Taller no encontrado');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [id]);

  const formatearRango = (t) => {
    const [y1, m1, d1] = (t.fecha_inicio || '').split('-');
    const [y2, m2, d2] = (t.fecha_fin || t.fecha_inicio || '').split('-');
    const fecha = t.fecha_inicio === t.fecha_fin || !t.fecha_fin
      ? `${d1}/${m1}`
      : `${d1}/${m1} — ${d2}/${m2}`;
    const h = `${(t.hora_inicio || '09:00').slice(0, 5)}-${(t.hora_fin || '18:00').slice(0, 5)}`;
    return { fecha, hora: h };
  };

  const pctCapacidad = taller
    ? Math.round(((taller.inscritos_count || 0) / taller.capacidad_maxima) * 100)
    : 0;

  if (cargando) {
    return (
      <div className="detalle-container">
        <p className="detalle-cargando">Cargando taller...</p>
      </div>
    );
  }

  if (error || !taller) {
    return (
      <div className="detalle-container">
        <p className="detalle-error">{error || 'Taller no encontrado'}</p>
        <Link to="/" className="detalle-volver">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      <button onClick={() => navigate(-1)} className="detalle-btn-back">Volver</button>

      <div className="detalle-hero">
        {taller.imagen_url && (
          <img src={taller.imagen_url} alt={taller.nombre} className="detalle-hero-img" />
        )}
        <div className="detalle-hero-overlay">
          <span className={taller.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}>
            {taller.estado}
          </span>
          <h1>{taller.nombre}</h1>
          <p className="detalle-instructor">Por {taller.instructor}</p>
        </div>
      </div>

      <div className="detalle-content">
        <div className="detalle-main">
          <div className="detalle-info-grid">
            <div className="detalle-info-item">
              <span className="detalle-info-label">Fecha</span>
              <span className="detalle-info-value">{formatearRango(taller).fecha}</span>
            </div>
            <div className="detalle-info-item">
              <span className="detalle-info-label">Horario</span>
              <span className="detalle-info-value">{formatearRango(taller).hora}</span>
            </div>
            {taller.precio != null && (
              <div className="detalle-info-item">
                <span className="detalle-info-label">Precio</span>
                <span className="detalle-info-value detalle-precio">
                  ${Number(taller.precio).toLocaleString('es-CL')}
                </span>
              </div>
            )}
            <div className="detalle-info-item">
              <span className="detalle-info-label">Cupos</span>
              <span className="detalle-info-value">{taller.inscritos_count || 0}/{taller.capacidad_maxima}</span>
            </div>
          </div>

          <div className="detalle-capacidad">
            <div className="detalle-capacidad-bar">
              <div
                className={`detalle-capacidad-fill ${pctCapacidad >= 100 ? 'lleno' : pctCapacidad >= 75 ? 'alto' : ''}`}
                style={{ width: `${Math.min(pctCapacidad, 100)}%` }}
              ></div>
            </div>
            <span className="detalle-capacidad-text">
              {pctCapacidad >= 100 ? 'Completo' : `${pctCapacidad}% ocupado`}
            </span>
          </div>

          {taller.descripcion && (
            <div className="detalle-descripcion">
              <h3>Descripcion</h3>
              <p>{taller.descripcion}</p>
            </div>
          )}

          {token && usuario.rol !== 'admin' && (
            <div className="detalle-accion">
              {taller.ya_inscrito ? (
                <button className="btn-inscribir btn-inscrito" disabled>Ya inscrito</button>
              ) : taller.estado !== 'activo' ? (
                <button className="btn-inscribir" disabled>No disponible</button>
              ) : (
                <Link to="/talleres" className="btn-inscribir detalle-inscribir-link">
                  Inscribirme desde Talleres
                </Link>
              )}
            </div>
          )}

          {!token && (
            <div className="detalle-accion">
              <Link to="/login" className="btn-inscribir detalle-inscribir-link">
                Inicia sesion para inscribirte
              </Link>
            </div>
          )}
        </div>

        {relacionados.length > 0 && (
          <div className="detalle-relacionados">
            <h3>Talleres relacionados</h3>
            <div className="detalle-relacionados-grid">
              {relacionados.map(r => (
                <Link to={`/taller/${r.id}`} className="detalle-relacionado-card" key={r.id}>
                  {r.imagen_url && (
                    <img src={r.imagen_url} alt={r.nombre} className="detalle-relacionado-img" />
                  )}
                  <div className="detalle-relacionado-body">
                    <h4>{r.nombre}</h4>
                    <p className="taller-card-instructor">Por {r.instructor}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
