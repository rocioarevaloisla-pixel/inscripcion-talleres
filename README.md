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
git clone https://github.com/rocioarevaloisla-pixel/inscripcion-talleres.git
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

## Guía de uso

1. **Registrarse** en `/registro` con nombre, email y contraseña
2. **Iniciar sesión** en `/login` con tus credenciales
3. **Inicio** (`/`) — panel principal con bienvenida y menú de navegación
4. **Talleres** (`/talleres`) — gestionar la oferta de talleres:
   - Crear nuevos talleres (nombre, instructor, capacidad, fecha)
   - Editar o eliminar talleres existentes
   - Ver el listado completo con estados (activo/cerrado/cancelado)
5. **Cerrar sesión** con el botón en la barra de navegación

## Avance

**Hito 2 cumplido: 10/23 requisitos (43%)**

| Hito | Requisitos |
|------|-----------|
| Hito 1 | GEN-01, GEN-02, GEN-03, rq-01, rq-02 |
| Hito 2 (adicionales) | GEN-04, GEN-05, GEN-06, rq-03, rq-08 |

## Autenticación

- **Rutas públicas:** `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/health`
- **Rutas protegidas (requieren JWT):** `/api/talleres`, `/api/inscripciones`
- El frontend almacena el token en `localStorage` y lo envía vía header `Authorization: Bearer <token>`

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el backend con nodemon |
| `npm start` | Inicia el backend en producción |
| `npm run db:migrate` | Ejecuta migraciones pendientes |
| `npm run db:migrate:undo` | Revierte todas las migraciones |
| `cd client && npm run dev` | Inicia el frontend de desarrollo |

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

### Usuario — autenticación (GEN-04/GEN-05)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre | STRING(100) | Nombre del usuario |
| email | STRING(150) | Email único |
| password | STRING(255) | Hash bcrypt |
| rol | ENUM | admin / usuario |

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
