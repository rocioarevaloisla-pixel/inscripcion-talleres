import { useState, useEffect } from 'react';
import api from '../api';
import './talleres.css';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [form, setForm] = useState({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/talleres')
      .then(res => setTalleres(res.data))
      .catch(() => setError('Error al cargar talleres'))
      .finally(() => setCargando(false));
  }, []);

  const cargarTalleres = async () => {
    try {
      const res = await api.get('/talleres');
      setTalleres(res.data);
    } catch {
      setError('Error al cargar talleres');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/talleres/${editando}`, form);
      } else {
        await api.post('/talleres', form);
      }
      setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '' });
      setEditando(null);
      cargarTalleres();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEditar = (taller) => {
    setEditando(taller.id);
    setForm({
      nombre: taller.nombre,
      instructor: taller.instructor,
      capacidad_maxima: taller.capacidad_maxima,
      fecha_inicio: taller.fecha_inicio,
      descripcion: taller.descripcion || ''
    });
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este taller?')) return;
    try {
      await api.delete(`/talleres/${id}`);
      cargarTalleres();
    } catch {
      setError('Error al eliminar');
    }
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '' });
  };

  return (
    <div className="talleres-container">
      <h2 className="talleres-titulo">Gestión de Talleres</h2>

      {error && <p className="talleres-error">{error}</p>}

      <div className="talleres-card">
        <h3>{editando ? 'Editar Taller' : 'Nuevo Taller'}</h3>
        <form onSubmit={handleSubmit} className="talleres-form">
          <input name="nombre" placeholder="Nombre del taller"
            value={form.nombre} onChange={handleChange} required />
          <input name="instructor" placeholder="Instructor"
            value={form.instructor} onChange={handleChange} required />
          <input name="capacidad_maxima" type="number" placeholder="Capacidad máxima"
            value={form.capacidad_maxima} onChange={handleChange} required />
          <input name="fecha_inicio" type="date"
            value={form.fecha_inicio} onChange={handleChange} required />
          <textarea name="descripcion" placeholder="Descripción (opcional)"
            value={form.descripcion} onChange={handleChange} />
          <div className="talleres-botones">
            <button type="submit" className="btn-guardar">
              {editando ? 'Actualizar' : 'Crear Taller'}
            </button>
            {editando && (
              <button type="button" onClick={handleCancelar} className="btn-cancelar">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="talleres-card">
        <h3>Oferta de Talleres</h3>
        {cargando ? (
          <p>Cargando...</p>
        ) : talleres.length === 0 ? (
          <p className="talleres-vacio">No hay talleres registrados aún.</p>
        ) : (
          <table className="talleres-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Instructor</th>
                <th>Capacidad</th>
                <th>Fecha inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {talleres.map(t => (
                <tr key={t.id}>
                  <td>{t.nombre}</td>
                  <td>{t.instructor}</td>
                  <td>{t.capacidad_maxima}</td>
                  <td>{t.fecha_inicio}</td>
                  <td>
                    <span className={t.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}>
                      {t.estado}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEditar(t)} className="btn-editar">Editar</button>
                    <button onClick={() => handleEliminar(t.id)} className="btn-eliminar">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}