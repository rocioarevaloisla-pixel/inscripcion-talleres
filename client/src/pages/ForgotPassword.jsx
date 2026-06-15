import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { mensajeError } from '../errores';
import './auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      const token = new URL(res.data.resetUrl).searchParams.get('token');
      navigate('/restablecer', { state: { token } });
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-back">← Volver al inicio</Link>
      <div className="forgot-card">
        <h2>Restablecer contraseña</h2>
        <p className="forgot-desc">Ingresa tu email para restablecer tu contraseña.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="auth-error">{error}</p>}
          <input
            name="email"
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        <div className="forgot-links">
          <Link to="/login">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
