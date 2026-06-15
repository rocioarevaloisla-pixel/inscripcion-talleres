import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './landing.css';
import './talleres.css';

export default function Landing() {
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/talleres')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.talleres || [];
        const ordenados = [...data].sort((a, b) => (b.inscritos_count || 0) - (a.inscritos_count || 0));
        setTalleres(ordenados.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const formatearRango = (t) => {
    const [y1, m1, d1] = (t.fecha_inicio || '').split('-');
    const [y2, m2, d2] = (t.fecha_fin || t.fecha_inicio || '').split('-');
    const fecha = t.fecha_inicio === t.fecha_fin || !t.fecha_fin
      ? `${d1}/${m1}`
      : `${d1}/${m1} — ${d2}/${m2}`;
    const h = `${(t.hora_inicio || '09:00').slice(0,5)}-${(t.hora_fin || '18:00').slice(0,5)}`;
    return `${fecha} · ${h}`;
  };

  const tieneCupo = (t) => (t.inscritos_count || 0) < t.capacidad_maxima;

  const topCursos = [...talleres].sort((a, b) => (b.inscritos_count || 0) - (a.inscritos_count || 0)).slice(0, 3);

  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">Wishdin</Link>
        <div className="landing-nav-links">
          <Link to="/login" className="landing-nav-btn">Iniciar sesion</Link>
          <Link to="/registro" className="landing-nav-btn landing-nav-btn-primary">Registrarse</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>Descubre talleres unicos</h1>
        <p>Aprendé algo nuevo hoy con los mejores instructores.</p>
        <div className="landing-hero-actions">
          <a href="#talleres" className="landing-hero-btn">Ver talleres</a>
          <Link to="/registro" className="landing-hero-btn landing-hero-btn-secondary">Crear cuenta</Link>
        </div>
      </section>

      {!cargando && topCursos.length > 0 && (
        <section className="landing-top-cursos">
          <h2>Top cursos populares</h2>
          <div className="top-cursos-grid">
            {topCursos.map((t, i) => (
              <Link to={`/taller/${t.id}`} className="top-curso-card" key={t.id}>
                {t.imagen_url && <img src={t.imagen_url} alt={t.nombre} className="top-curso-img" />}
                <div className="top-curso-body">
                  <span className="top-curso-rank">#{i + 1}</span>
                  <h3>{t.nombre}</h3>
                  <p className="top-curso-instructor">Por {t.instructor}</p>
                  <span className="top-curso-inscritos">{t.inscritos_count || 0} inscritos</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="landing-como-funciona">
        <h2>Como funciona</h2>
        <div className="como-funciona-grid">
          <div className="como-funciona-card">
            <div className="como-funciona-numero">1</div>
            <h3>Explora</h3>
            <p>Navega por nuestra oferta de talleres y encontra el que mas te guste.</p>
          </div>
          <div className="como-funciona-card">
            <div className="como-funciona-numero">2</div>
            <h3>Inscribite</h3>
            <p>Elegí el taller, completa tus datos y asegura tu cupo.</p>
          </div>
          <div className="como-funciona-card">
            <div className="como-funciona-numero">3</div>
            <h3>Disfruta</h3>
            <p>Aprendé con instructores expertos y conectá con otros alumnos.</p>
          </div>
        </div>
      </section>

      <section id="talleres" className="landing-talleres">
        <h2>Talleres destacados</h2>
        {cargando ? (
          <p className="landing-vacio">Cargando talleres...</p>
        ) : talleres.length === 0 ? (
          <p className="landing-vacio">No hay talleres disponibles aun.</p>
        ) : (
          <div className="talleres-grid">
            {talleres.map(t => {
              const disponible = tieneCupo(t);
              return (
                <div className="taller-card" key={t.id}>
                  <div className="taller-card-header">
                    {t.imagen_url && <img src={t.imagen_url} alt={t.nombre} className="taller-card-img" />}
                    <span className={disponible ? 'badge-cupo-si' : 'badge-cupo-no'}>
                      {disponible ? 'Disponible' : 'Lleno'}
                    </span>
                  </div>
                  <div className="taller-card-body">
                    <h4>{t.nombre}</h4>
                    <p className="taller-card-instructor">Por {t.instructor}</p>
                    {t.descripcion && (
                      <p className="taller-card-desc">{t.descripcion}</p>
                    )}
                    <Link to={`/taller/${t.id}`} className="taller-card-ver-detalle">Ver detalle</Link>
                    <div className="taller-card-meta">
                      <span className="meta-fecha">{formatearRango(t)}</span>
                      <span className="meta-cupos">{t.inscritos_count || 0}/{t.capacidad_maxima}</span>
                      {t.precio != null && <span className="taller-card-precio">${Number(t.precio).toLocaleString('es-CL')}</span>}
                    </div>
                  </div>
                  <div className="taller-card-footer">
                    <span className={t.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}>
                      {t.estado}
                    </span>
                    <Link to="/login" className="btn-inscribir">Inicia sesion</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="landing-footer">
        <p>Wishdin — Plataforma de inscripcion a talleres</p>
      </footer>
    </div>
  );
}
