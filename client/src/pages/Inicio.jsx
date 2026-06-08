import { Link } from 'react-router-dom';
import './inicio.css';

export default function Inicio() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  return (
    <section className="inicio-hero">
      <div className="inicio-hero-content">
        <h1>Bienvenido/a, <span>{usuario.nombre}</span></h1>
        <p>Explora los talleres disponibles y gestiona tus inscripciones desde un solo lugar.</p>
      </div>

      <div className="inicio-dashboard">
        <div className="inicio-card">
          <div className="inicio-card-icon">📚</div>
          <h3>Talleres</h3>
          <p>Explora la oferta e inscríbete.</p>
          <Link to="/talleres">Ir a Talleres</Link>
        </div>

        {usuario.rol !== 'admin' && (
          <div className="inicio-card">
            <div className="inicio-card-icon">📋</div>
            <h3>Mis Inscripciones</h3>
            <p>Revisa tus inscripciones activas.</p>
            <Link to="/mis-inscripciones">Ver inscripciones</Link>
          </div>
        )}

        {usuario.rol === 'admin' && (
          <div className="inicio-card admin-card">
            <div className="inicio-card-icon">⚙️</div>
            <h3>Administración</h3>
            <p>Crea, edita y gestiona talleres.</p>
            <Link to="/talleres">Gestionar</Link>
          </div>
        )}
      </div>
    </section>
  );
}
