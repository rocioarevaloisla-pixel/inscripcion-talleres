import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './auth.css';

export default function Auth() {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginCargando, setLoginCargando] = useState(false);

  const [regForm, setRegForm] = useState({ nombre: '', email: '', password: '' });
  const [regError, setRegError] = useState('');
  const [regCargando, setRegCargando] = useState(false);
  const [regExito, setRegExito] = useState('');

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleRegChange = (e) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
    setRegError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginCargando(true);
    try {
      const res = await api.post('/auth/login', loginForm);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      navigate('/inicio');
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoginCargando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setRegCargando(true);
    setRegExito('');
    try {
      await api.post('/auth/registro', regForm);
      setRegExito('Cuenta creada exitosamente');
      setTimeout(() => setShowSignup(false), 1200);
    } catch (err) {
      setRegError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setRegCargando(false);
    }
  };

  const toggleSignup = () => setShowSignup(true);
  const toggleLogin = () => setShowSignup(false);

  return (
    <div className="auth-container">
      <Link to="/" className="auth-back">← Volver al inicio</Link>
      <div className={`auth-card ${showSignup ? 'show-signup' : ''}`}>
        <div className="auth-signup">
          <label onClick={toggleLogin} className="auth-label">Registrarse</label>
          <form onSubmit={handleRegistro} className="auth-form">
            {regExito && <p className="auth-exito">{regExito}</p>}
            {regError && <p className="auth-error">{regError}</p>}
            <input name="nombre" type="text" placeholder="Nombre completo"
              value={regForm.nombre} onChange={handleRegChange} required />
            <input name="email" type="email" placeholder="Correo electrónico"
              value={regForm.email} onChange={handleRegChange} required />
            <input name="password" type="password" placeholder="Contraseña (mín. 6)"
              value={regForm.password} onChange={handleRegChange} required />
            <button type="submit" disabled={regCargando}>
              {regCargando ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        </div>

        <div className="auth-login">
          <label onClick={toggleSignup} className="auth-label">Iniciar sesión</label>
          <form onSubmit={handleLogin} className="auth-form">
            {loginError && <p className="auth-error">{loginError}</p>}
            <input name="email" type="email" placeholder="Correo electrónico"
              value={loginForm.email} onChange={handleLoginChange} required />
            <input name="password" type="password" placeholder="Contraseña"
              value={loginForm.password} onChange={handleLoginChange} required />
            <button type="submit" disabled={loginCargando}>
              {loginCargando ? 'Ingresando...' : 'Ingresar'}
            </button>
            <Link to="/forgot-password" className="auth-olvide">¿Olvidaste tu contraseña?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
