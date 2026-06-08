import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './registro.css';

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post('/auth/registro', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <h2 className="registro-titulo">Crear cuenta</h2>
        {error && <p className="registro-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="registro-campo">
            <label>Nombre</label>
            <input name="nombre" type="text" value={form.nombre}
              onChange={handleChange} placeholder="Tu nombre completo" required />
          </div>
          <div className="registro-campo">
            <label>Email</label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="correo@ejemplo.com" required />
          </div>
          <div className="registro-campo">
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
          </div>
          <button type="submit" className="registro-boton" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="registro-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}