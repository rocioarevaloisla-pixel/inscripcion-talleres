import { useState, useEffect } from 'react';
import api from '../api';
import './talleres.css';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [form, setForm] = useState({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '' });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(null);
  const [formInscripcion, setFormInscripcion] = useState({ nombre_alumno: '', email_alumno: '' });
  const [exito, setExito] = useState('');

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esAdmin = usuario.rol === 'admin';

  const cargarTalleres = async () => {
    setError('');
    setCargando(true);
    try {
      const res = await api.get('/talleres');
      setTalleres(res.data);
    } catch {
      setError('Error al cargar talleres');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/talleres');
        setTalleres(res.data);
      } catch {
        setError('Error al cargar talleres');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeInscripcion = (e) => {
    setFormInscripcion({ ...formInscripcion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      setError(err.response?.data?.message || 'Error al guardar');
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
    setError('');
    try {
      await api.delete(`/talleres/${id}`);
      cargarTalleres();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '' });
  };

  const abrirInscripcion = (taller) => {
    setInscribiendo(taller);
    setFormInscripcion({ nombre_alumno: usuario.nombre || '', email_alumno: usuario.email || '' });
    setError('');
    setExito('');
  };

  const cerrarInscripcion = () => {
    setInscribiendo(null);
    setFormInscripcion({ nombre_alumno: '', email_alumno: '' });
  };

  const handleInscribir = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    try {
      await api.post('/inscripciones', {
        taller_id: inscribiendo.id,
        nombre_alumno: formInscripcion.nombre_alumno,
        email_alumno: formInscripcion.email_alumno
      });
      setExito('Inscripción realizada exitosamente');
      cerrarInscripcion();
      cargarTalleres();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al inscribirse');
    }
  };

  const tieneCupo = (taller) => {
    const inscritos = taller.inscritos_count || 0;
    return inscritos < taller.capacidad_maxima;
  };

  return (
    <div className="talleres-container">
      <h2 className="talleres-titulo">Gestión de Talleres</h2>

      {error && <p className="talleres-error">{error}</p>}
      {exito && <p className="talleres-exito">{exito}</p>}

      {esAdmin && (
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
      )}

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
                {esAdmin && <th>Inscritos</th>}
                <th>Fecha inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {talleres.map(t => {
                const tieneEspacio = tieneCupo(t);
                return (
                  <tr key={t.id}>
                    <td>{t.nombre}</td>
                    <td>{t.instructor}</td>
                    <td>{t.capacidad_maxima}</td>
                    {esAdmin && <td>{t.inscritos_count || 0}</td>}
                    <td>{t.fecha_inicio}</td>
                    <td>
                      <span className={t.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}>
                        {t.estado}
                      </span>
                      {!esAdmin && (
                        <span className={tieneEspacio ? 'badge-cupo-si' : 'badge-cupo-no'}>
                          {tieneEspacio ? 'Disponible' : 'Lleno'}
                        </span>
                      )}
                    </td>
                    <td>
                      {esAdmin ? (
                        <>
                          <button onClick={() => handleEditar(t)} className="btn-editar">Editar</button>
                          <button onClick={() => handleEliminar(t.id)} className="btn-eliminar">Eliminar</button>
                        </>
                      ) : (
                        <button
                          onClick={() => abrirInscripcion(t)}
                          className="btn-inscribir"
                          disabled={!tieneEspacio || t.estado !== 'activo'}
                        >
                          Inscribirme
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {inscribiendo && (
        <div className="modal-overlay" onClick={cerrarInscripcion}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Inscribirse a: {inscribiendo.nombre}</h3>
            <form onSubmit={handleInscribir} className="talleres-form">
              <input name="nombre_alumno" placeholder="Tu nombre completo"
                value={formInscripcion.nombre_alumno} onChange={handleChangeInscripcion} required />
              <input name="email_alumno" type="email" placeholder="Tu correo electrónico"
                value={formInscripcion.email_alumno} onChange={handleChangeInscripcion} required />
              <div className="talleres-botones">
                <button type="submit" className="btn-guardar">Confirmar inscripción</button>
                <button type="button" onClick={cerrarInscripcion} className="btn-cancelar">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
