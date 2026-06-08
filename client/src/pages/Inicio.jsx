import { useNavigate, Link } from 'react-router-dom';
import './inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div>
      <nav className="inicio-nav">
        <span className="inicio-marca">🎓 Inscripción a Talleres</span>
        <div className="inicio-nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/talleres">Talleres</Link>
          <span className="inicio-usuario">Hola, {usuario.nombre}</span>
          <button onClick={handleLogout} className="inicio-logout">
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="inicio-main">
        <h1>Bienvenido/a, {usuario.nombre} 👋</h1>
        <p>Usa el menú para navegar por la plataforma.</p>
      </main>
    </div>
  );
}