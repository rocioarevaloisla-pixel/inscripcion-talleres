import './inicio.css';

export default function Inicio() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  return (
    <main className="inicio-main">
      <h1>Bienvenido/a, {usuario.nombre}</h1>
      <p>Usa el menú superior para navegar por la plataforma.</p>
    </main>
  );
}
