import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './dashboard.css';

const demoInscripcionesPorMes = [
  { mes: '2026-01', cantidad: 8 },
  { mes: '2026-02', cantidad: 12 },
  { mes: '2026-03', cantidad: 20 },
  { mes: '2026-04', cantidad: 15 },
  { mes: '2026-05', cantidad: 25 },
  { mes: '2026-06', cantidad: 18 }
];

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function iniciales(nombre) {
  if (!nombre) return '?';
  return nombre.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function formatearFecha(f) {
  if (!f) return '—';
  const d = new Date(f);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [talleres, setTalleres] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [listaEspera, setListaEspera] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resStats, resTalleres, resInsc, resLE] = await Promise.all([
          api.get('/estadisticas'),
          api.get('/talleres'),
          api.get('/inscripciones'),
          api.get('/lista-espera')
        ]);
        setData(resStats.data);
        setTalleres(resTalleres.data);
        setInscripciones(resInsc.data || []);
        setListaEspera(resLE.data || []);
      } catch {
        setError('Error al cargar datos del dashboard');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  if (cargando) return <p className="dashboard-vacio">Cargando dashboard...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;
  if (!data) return null;

  const inscripcionesPorMes = data.inscripciones_por_mes?.length > 0
    ? data.inscripciones_por_mes
    : demoInscripcionesPorMes;

  const maxCantidad = Math.max(...inscripcionesPorMes.map(i => i.cantidad), 1);

  const cards = [
    { icon: '📦', label: 'Total Talleres', value: data.total_talleres, color: 'var(--persian-blue)' },
    { icon: '✅', label: 'Talleres Activos', value: data.talleres_activos, color: 'var(--glaucous)' },
    { icon: '📋', label: 'Total Inscripciones', value: data.total_inscripciones, color: 'var(--midnight-violet)' },
    { icon: '👥', label: 'Usuarios Registrados', value: data.total_usuarios, color: 'var(--persian-blue)' }
  ];

  const inscripcionesPorTaller = {};
  for (const ins of inscripciones) {
    const tid = ins.taller_id;
    if (!inscripcionesPorTaller[tid]) {
      inscripcionesPorTaller[tid] = [];
    }
    inscripcionesPorTaller[tid].push(ins);
  }

  const esperaPorTaller = {};
  for (const le of listaEspera) {
    const tid = le.taller_id;
    if (!esperaPorTaller[tid]) {
      esperaPorTaller[tid] = [];
    }
    esperaPorTaller[tid].push(le);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-titulo">Dashboard</h2>
        <Link to="/talleres" className="dashboard-atajo">Gestionar talleres</Link>
      </div>

      <div className="dashboard-cards">
        {cards.map((card, i) => (
          <div className="dashboard-card" key={i} style={{ borderTopColor: card.color }}>
            <span className="dashboard-card-icon">{card.icon}</span>
            <span className="dashboard-card-value">{card.value}</span>
            <span className="dashboard-card-label">{card.label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grafico">
        <h3>Inscripciones por mes</h3>
        <div className="dashboard-barras">
          {inscripcionesPorMes.map((item, i) => {
            const mesNum = parseInt(item.mes.split('-')[1]) - 1;
            const nombreMes = meses[mesNum] || item.mes;
            const pct = (item.cantidad / maxCantidad) * 100;
            return (
              <div className="dashboard-barra-row" key={i}>
                <span className="dashboard-barra-label">{nombreMes}</span>
                <div className="dashboard-barra-track">
                  <div className="dashboard-barra-fill" style={{ width: `${pct}%` }}>
                    <span className="dashboard-barra-cant">{item.cantidad}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-por-taller">
        <h3>Inscripciones por Taller</h3>
        <div className="dashboard-taller-grid">
          {talleres.map(taller => {
            const insc = inscripcionesPorTaller[taller.id] || [];
            const espera = esperaPorTaller[taller.id] || [];
            const inscritos = taller.inscritos_count || insc.length;
            const capacidad = taller.capacidad_maxima;
            const pct = capacidad > 0 ? Math.round((inscritos / capacidad) * 100) : 0;
            const lleno = inscritos >= capacidad;

            return (
              <div className={`dashboard-taller-card ${lleno ? 'taller-lleno' : ''}`} key={taller.id}>
                <div className="dashboard-taller-header">
                  <div className="dashboard-taller-header-bg" />
                  <div className="dashboard-taller-header-content">
                    <h4>{taller.nombre}</h4>
                    <span className="dashboard-taller-instructor">Por {taller.instructor}</span>
                  </div>
                </div>

                <div className="dashboard-taller-cuerpo">
                  <div className="dashboard-taller-progreso">
                    <div className="dashboard-progreso-info">
                      <span className="dashboard-progreso-texto">{inscritos} / {capacidad} inscritos</span>
                      <span className="dashboard-progreso-pct">{pct}%</span>
                    </div>
                    <div className="dashboard-progreso-track">
                      <div
                        className={`dashboard-progreso-fill ${lleno ? 'fill-lleno' : ''}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {insc.length > 0 && (
                    <div className="dashboard-inscritos">
                      <h5>Inscritos ({insc.length})</h5>
                      <div className="dashboard-inscritos-lista">
                        {insc.map(ins => {
                          const usuario = ins.Usuario || {};
                          const nombre = usuario.nombre || ins.nombre_alumno || '—';
                          const email = usuario.email || ins.email_alumno || '';
                          return (
                            <div className="dashboard-inscrito-item" key={ins.id}>
                              <span className="dashboard-avatar">{iniciales(nombre)}</span>
                              <div className="dashboard-inscrito-info">
                                <span className="dashboard-inscrito-nombre">{nombre}</span>
                                {email && <span className="dashboard-inscrito-email">{email}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {espera.length > 0 && (
                    <div className="dashboard-espera">
                      <h5>🕐 Lista de espera ({espera.length})</h5>
                      <div className="dashboard-espera-lista">
                        {espera.map(le => {
                          const usuario = le.Usuario || {};
                          const nombre = usuario.nombre || '—';
                          const email = usuario.email || '';
                          return (
                            <div className="dashboard-espera-item" key={le.id}>
                              <span className="dashboard-avatar espera-avatar">{iniciales(nombre)}</span>
                              <div className="dashboard-inscrito-info">
                                <span className="dashboard-inscrito-nombre">{nombre}</span>
                                {email && <span className="dashboard-inscrito-email">{email}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {insc.length === 0 && espera.length === 0 && (
                    <p className="dashboard-sin-inscritos">Sin inscripciones aún</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
