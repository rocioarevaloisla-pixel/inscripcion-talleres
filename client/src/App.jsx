import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Inicio from './pages/Inicio';
import Talleres from './pages/Talleres';
import MisInscripciones from './pages/MisInscripciones';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import './pages/inicio.css';
import './pages/landing.css';

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  if (!token) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="inicio-nav">
      <Link to="/inicio" className="inicio-marca" style={{ textDecoration: 'none' }}>
        Wishdin
      </Link>
      <div className="inicio-nav-links">
        <Link to="/talleres" className={isActive('/talleres')}>Talleres</Link>
        {usuario.rol === 'admin' && (
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        )}
        {usuario.rol !== 'admin' && (
          <Link to="/mis-inscripciones" className={isActive('/mis-inscripciones')}>Mis Inscripciones</Link>
        )}
        <div className="inicio-usuario-badge">
          {usuario.nombre}
          <span className={`inicio-rol-badge ${usuario.rol}`}>{usuario.rol}</span>
        </div>
        <button onClick={handleLogout} className="inicio-logout">Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/registro" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/restablecer" element={<ResetPassword />} />
        <Route path="/" element={<Landing />} />
        <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        <Route path="/talleres" element={<RutaProtegida><Talleres /></RutaProtegida>} />
        <Route path="/mis-inscripciones" element={<RutaProtegida><MisInscripciones /></RutaProtegida>} />
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}
