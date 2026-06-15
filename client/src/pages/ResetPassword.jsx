import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './auth.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setExito('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', { token, password });
      setExito(res.data.mensaje);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al restablecer la contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <Link to="/" className="auth-back">← Volver al inicio</Link>
      <div className="forgot-card">
        <h2>Nueva contraseña</h2>
        {!token ? (
          <>
            <p className="forgot-desc">Enlace inválido. Solicita un nuevo restablecimiento.</p>
            <div className="forgot-links">
              <Link to="/forgot-password">Solicitar restablecimiento</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <p className="auth-error">{error}</p>}
            {exito && <p className="auth-exito">{exito}</p>}
            <input
              name="password"
              type="password"
              placeholder="Nueva contraseña (mín. 6)"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
              required
            />
            <button type="submit" disabled={cargando}>
              {cargando ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
