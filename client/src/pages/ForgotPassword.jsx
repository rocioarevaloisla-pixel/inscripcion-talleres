import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setMensaje('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMensaje(res.data.mensaje);
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar restablecimiento');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-back">← Volver al inicio</Link>
      <div className="forgot-card">
        <h2>Restablecer contraseña</h2>
        {!enviado ? (
          <>
            <p className="forgot-desc">Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
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
          </>
        ) : (
          <div className="forgot-exito-contenido">
            <p className="auth-exito" style={{ width: 'auto', margin: '0 auto 1rem' }}>{mensaje}</p>
            <div className="forgot-dev-box">
              <strong>🔧 Modo desarrollo</strong>
              <p>El email se envió a <strong>{email}</strong> vía Ethereal.</p>
              <p>Revisa la <strong>terminal del servidor</strong> para ver la URL de vista previa del email.</p>
            </div>
          </div>
        )}
        <div className="forgot-links">
          <Link to="/login">{enviado ? 'Volver a iniciar sesión' : 'Volver a iniciar sesión'}</Link>
        </div>
      </div>
    </div>
  );
}
