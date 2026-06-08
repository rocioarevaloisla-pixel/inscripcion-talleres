import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Inicio from './pages/Inicio';
import Talleres from './pages/Talleres';
import MisInscripciones from './pages/MisInscripciones';
import './pages/inicio.css';

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="inicio-nav">
      <Link to="/" className="inicio-marca" style={{ textDecoration: 'none' }}>
        Inscripción a Talleres
      </Link>
      <div className="inicio-nav-links">
        <Link to="/talleres">Talleres</Link>
        <Link to="/mis-inscripciones">Mis Inscripciones</Link>
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
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
        <Route path="/talleres" element={<RutaProtegida><Talleres /></RutaProtegida>} />
        <Route path="/mis-inscripciones" element={<RutaProtegida><MisInscripciones /></RutaProtegida>} />
      </Routes>
    </BrowserRouter>
  );
}
