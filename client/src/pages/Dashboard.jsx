import { useState, useEffect } from 'react';
import api from '../api';
import './dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/estadisticas');
        setData(res.data);
      } catch {
        setError('Error al cargar estadísticas');
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  if (cargando) return <p className="dashboard-vacio">Cargando estadísticas...</p>;
  if (error) return <p className="dashboard-error">{error}</p>;
  if (!data) return null;

  const maxCantidad = data.inscripciones_por_mes.length > 0
    ? Math.max(...data.inscripciones_por_mes.map(i => i.cantidad))
    : 1;

  const cards = [
    { icon: '📦', label: 'Total Talleres', value: data.total_talleres, color: 'var(--persian-blue)' },
    { icon: '✅', label: 'Talleres Activos', value: data.talleres_activos, color: 'var(--glaucous)' },
    { icon: '📋', label: 'Total Inscripciones', value: data.total_inscripciones, color: 'var(--midnight-violet)' },
    { icon: '👥', label: 'Usuarios Registrados', value: data.total_usuarios, color: 'var(--persian-blue)' }
  ];

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-titulo">Dashboard</h2>

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
          {data.inscripciones_por_mes.length === 0 ? (
            <p className="dashboard-vacio">No hay inscripciones registradas</p>
          ) : (
            data.inscripciones_por_mes.map((item, i) => {
              const mesNum = parseInt(item.mes.split('-')[1]) - 1;
              const nombreMes = meses[mesNum] || item.mes;
              const pct = (item.cantidad / maxCantidad) * 100;
              return (
                <div className="dashboard-barra-row" key={i}>
                  <span className="dashboard-barra-label">{nombreMes}</span>
                  <div className="dashboard-barra-track">
                    <div
                      className="dashboard-barra-fill"
                      style={{ width: `${pct}%` }}
                    >
                      <span className="dashboard-barra-cant">{item.cantidad}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
