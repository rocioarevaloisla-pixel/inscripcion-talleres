import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Inicio from './pages/Inicio';
import Talleres from './pages/Talleres';
import TallerDetalle from './pages/TallerDetalle';
import MisInscripciones from './pages/MisInscripciones';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NavBar from './components/NavBar';
import './pages/inicio.css';
import './pages/landing.css';
import './components/NavBar.css';

const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();

  return (
    <>
      <NavBar />
      <div className="page" key={location.pathname}>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/registro" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/restablecer" element={<ResetPassword />} />
          <Route path="/" element={<Landing />} />
          <Route path="/taller/:id" element={<TallerDetalle />} />
          <Route path="/inicio" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/talleres" element={<RutaProtegida><Talleres /></RutaProtegida>} />
          <Route path="/mis-inscripciones" element={<RutaProtegida><MisInscripciones /></RutaProtegida>} />
          <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
