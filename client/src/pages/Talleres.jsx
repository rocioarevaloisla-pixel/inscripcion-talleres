import { useState, useEffect } from 'react';
import api from '../api';
import './talleres.css';

export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [form, setForm] = useState({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '', estado: 'activo' });
  const [editando, setEditando] = useState(null);
  const [adminTab, setAdminTab] = useState('ver');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [inscribiendo, setInscribiendo] = useState(null);
  const [formInscripcion, setFormInscripcion] = useState({ nombre_alumno: '', email_alumno: '' });
  const [exito, setExito] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

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
      setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '', estado: 'activo' });
      setEditando(null);
      setAdminTab('ver');
      cargarTalleres();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleNuevo = () => {
    setEditando(null);
    setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '', estado: 'activo' });
    setAdminTab('nuevo');
  };

  const handleEditar = (taller) => {
    setAdminTab('nuevo');
    setEditando(taller.id);
    setForm({
      nombre: taller.nombre,
      instructor: taller.instructor,
      capacidad_maxima: taller.capacidad_maxima,
      fecha_inicio: taller.fecha_inicio,
      descripcion: taller.descripcion || '',
      estado: taller.estado
    });
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este taller?')) return;
    setError('');
    try {
      await api.delete(`/talleres/${id}`);
      cargarTalleres();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al eliminar');
    }
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ nombre: '', instructor: '', capacidad_maxima: '', fecha_inicio: '', descripcion: '', estado: 'activo' });
    setAdminTab('ver');
  };

  const abrirInscripcion = (taller) => {
    setInscribiendo(taller);
    setFormInscripcion({ nombre_alumno: usuario.nombre || '', email_alumno: usuario.email || '' });
    setError('');
    setExito('');
  };

  const cerrarInscripcion = () => {
    setInscribiendo(null);
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
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al inscribirse');
    }
  };

  const tieneCupo = (taller) => {
    const inscritos = taller.inscritos_count || 0;
    return inscritos < taller.capacidad_maxima;
  };

  const talleresFiltrados = talleres.filter(t => {
    const coincideBusqueda = !busqueda ||
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.instructor.toLowerCase().includes(busqueda.toLowerCase());
    if (!coincideBusqueda) return false;
    if (soloDisponibles && !tieneCupo(t)) return false;
    return true;
  });

  return (
    <div className="talleres-container">
      <div className="talleres-header">
        <div className="talleres-header-left">
          <h2 className="talleres-titulo">Talleres</h2>
          {esAdmin && (
            <div className="admin-tabs">
              <button
                className={`admin-tab ${adminTab === 'ver' ? 'active' : ''}`}
                onClick={() => setAdminTab('ver')}
              >
                Ver talleres
              </button>
              <button
                className={`admin-tab ${adminTab === 'nuevo' ? 'active' : ''}`}
                onClick={handleNuevo}
              >
                Nuevo taller
              </button>
            </div>
          )}
        </div>
        <div className="talleres-actions">
          <input
            type="text"
            className="talleres-search"
            placeholder="Buscar por nombre o instructor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {!esAdmin && (
            <button
              className={`talleres-filter-btn ${soloDisponibles ? 'active' : ''}`}
              onClick={() => setSoloDisponibles(!soloDisponibles)}
            >
              {soloDisponibles ? 'Mostrar todos' : 'Solo con cupos'}
            </button>
          )}
        </div>
      </div>

      {error && <p className="talleres-error">{error}</p>}
      {exito && <p className="talleres-exito">{exito}</p>}

      {esAdmin && adminTab === 'nuevo' && (
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
            {editando && (
              <select name="estado" value={form.estado} onChange={handleChange} className="talleres-select">
                <option value="activo">Activo</option>
                <option value="cerrado">Cerrado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            )}
            <div className="talleres-botones">
              <button type="submit" className="btn-guardar">
                {editando ? 'Actualizar' : 'Crear Taller'}
              </button>
              <button type="button" onClick={handleCancelar} className="btn-cancelar">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {cargando ? (
        <p className="talleres-vacio">Cargando talleres...</p>
      ) : talleresFiltrados.length === 0 ? (
        <div className="talleres-card">
          <p className="talleres-vacio">
            {busqueda || soloDisponibles
              ? 'No se encontraron talleres con los filtros actuales.'
              : 'No hay talleres registrados aún.'}
          </p>
        </div>
      ) : esAdmin && adminTab === 'ver' ? (
        /* Vista admin: tabla */
        <div className="talleres-card">
          <table className="talleres-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Instructor</th>
                <th>Capacidad</th>
                <th>Inscritos</th>
                <th>Inicio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {talleresFiltrados.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.nombre}</strong></td>
                  <td>{t.instructor}</td>
                  <td>{t.capacidad_maxima}</td>
                  <td>{t.inscritos_count || 0}</td>
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
        </div>
      ) : (
        /* Vista usuario: grid de cards */
        <div className="talleres-grid">
          {talleresFiltrados.map(t => {
            const disponible = tieneCupo(t) && !t.ya_inscrito;
            return (
              <div className="taller-card" key={t.id}>
                <div className="taller-card-header">
                  {t.ya_inscrito ? (
                    <span className="badge-ya-inscrito">Ya inscrito</span>
                  ) : (
                    <span className={disponible ? 'badge-cupo-si' : 'badge-cupo-no'}>
                      {tieneCupo(t) ? 'Disponible' : 'Lleno'}
                    </span>
                  )}
                </div>
                <div className="taller-card-body">
                  <h4>{t.nombre}</h4>
                  <p className="taller-card-instructor">Por {t.instructor}</p>
                  {t.descripcion && (
                    <p className="taller-card-desc">{t.descripcion}</p>
                  )}
                  <div className="taller-card-meta">
                    <span>📅 {t.fecha_inicio}</span>
                    <span>👥 {t.inscritos_count || 0}/{t.capacidad_maxima}</span>
                  </div>
                </div>
                <div className="taller-card-footer">
                  <span className={t.estado === 'activo' ? 'badge-activo' : 'badge-inactivo'}>
                    {t.estado}
                  </span>
                  <button
                    onClick={() => abrirInscripcion(t)}
                    className={`btn-inscribir ${t.ya_inscrito ? 'btn-inscrito' : ''}`}
                    disabled={!disponible || t.estado !== 'activo'}
                  >
                    {t.ya_inscrito ? 'Ya inscrito' : 'Inscribirme'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {inscribiendo && (
        <div className="modal-overlay" onClick={cerrarInscripcion}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Inscribirse a: {inscribiendo.nombre}</h3>
            <p className="taller-card-instructor">Por {inscribiendo.instructor}</p>
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
