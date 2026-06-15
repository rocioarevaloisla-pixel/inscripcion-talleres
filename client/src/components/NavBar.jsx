import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  if (!token) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="inicio-nav">
      <Link to="/talleres" className="inicio-marca" style={{ textDecoration: 'none' }}>
        Wishdin
      </Link>
      <button
        className={`hamburger ${menuAbierto ? 'abierto' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menu de navegacion"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`inicio-nav-links ${menuAbierto ? 'abierto' : ''}`}>
        <Link to="/talleres" className={isActive('/talleres')} onClick={cerrarMenu}>Talleres</Link>
        {usuario.rol === 'admin' && (
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={cerrarMenu}>Dashboard</Link>
        )}
        {usuario.rol !== 'admin' && (
          <Link to="/mis-inscripciones" className={isActive('/mis-inscripciones')} onClick={cerrarMenu}>Mis Inscripciones</Link>
        )}
        <div className="inicio-usuario-badge">
          {usuario.nombre}
          <span className={`inicio-rol-badge ${usuario.rol}`}>{usuario.rol}</span>
        </div>
        <button onClick={handleLogout} className="inicio-logout">Cerrar sesion</button>
      </div>
      {menuAbierto && <div className="nav-overlay" onClick={cerrarMenu}></div>}
    </nav>
  );
}
