# 🎓 Plataforma de Inscripción a Talleres

Aplicación web fullstack que permite a usuarios inscribirse en talleres y cursos disponibles.

## Stack tecnológico
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **ORM:** Sequelize
- **Autenticación:** JWT

## Requisitos
- Node.js v18+
- MySQL v8+

## Instalación

```bash
# 1. Clonar el repositorio
git https://github.com/rocioarevaloisla-pixel/inscripcion-talleres.git
cd inscripcion-talleres

# 2. Instalar dependencias del backend
npm install

# 3. Instalar dependencias del frontend
cd client && npm install && cd ..

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de MySQL

# 5. Crear la base de datos en MySQL
# Ejecutar en MySQL Workbench: CREATE DATABASE inscripcion_talleres;

# 6. Ejecutar migraciones
npm run db:migrate

# 7. Levantar el backend
npm run dev

# 8. Levantar el frontend (otra terminal)
cd client && npm run dev
```
## Estructura de carpetas
inscripcion-talleres/
├── client/               ← Frontend React
├── src/
│   ├── routes/           ← Rutas Express
│   ├── controllers/      ← Lógica de cada ruta
│   ├── services/         ← Lógica de negocio
│   ├── models/           ← Modelos Sequelize
│   ├── middlewares/      ← Middlewares
│   ├── config/           ← Configuración BD
│   └── app.js            ← Entrada del servidor
├── migrations/           ← Migraciones Sequelize
├── seeders/
├── postman/
├── .env.example
├── .gitignore
└── README.md

## Base de datos
- Motor: **MySQL**
- ORM: Sequelize
- Comando para migrar: `npm run db:migrate`
- Comando para revertir: `npm run db:migrate:undo`

## Modelo de datos

### Taller — entidad principal (rq-01)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre | STRING(150) | Nombre del taller |
| descripcion | TEXT | Descripción detallada |
| instructor | STRING(100) | Nombre del instructor |
| capacidad_maxima | INTEGER | Cupos disponibles |
| fecha_inicio | DATEONLY | Fecha de inicio |
| fecha_fin | DATEONLY | Fecha de término |
| estado | ENUM | activo / cerrado / cancelado |

### Inscripcion — entidad secundaria (rq-02)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre_alumno | STRING(100) | Nombre del alumno |
| email_alumno | STRING(150) | Email de contacto |
| taller_id | INTEGER | FK → talleres.id |
| fecha_inscripcion | DATE | Fecha de inscripción |
| estado | ENUM | pendiente / confirmada / cancelada |

Relación: Una Inscripcion pertenece a un Taller **(N:1)**
