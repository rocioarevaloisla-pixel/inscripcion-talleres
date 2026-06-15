# Plataforma de Inscripción a Talleres

**Deploy:** https://inscripcion-talleres.up.railway.app

Aplicación web fullstack que permite a usuarios inscribirse en talleres y cursos disponibles, con roles diferenciados (admin/usuario).

## Stack tecnológico
- **Frontend:** React + Vite
- **Backend:** Node.js + Express 4
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

## Roles

| Rol | Permisos |
|-----|----------|
| **admin** | Crear, editar, eliminar talleres. Ver cantidad de inscritos por taller. Ver lista completa de inscripciones. Acceder a detalle de inscritos por taller. |
| **usuario** | Ver oferta de talleres con estado (disponible/lleno). Inscribirse a talleres con cupo. Ver sus propias inscripciones. |

Para crear un usuario admin, cambiar manualmente el rol en la BD o usar un seeder.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string MySQL |
| `JWT_SECRET` | Clave secreta para firmar JWT |
| `PORT` | Puerto del servidor (default 3000) |
| `NODE_ENV` | `development` / `production` |
| `CORS_ORIGIN` | URL del frontend permitida |
| `VITE_API_URL` | URL de la API para el frontend |

## Rutas de la API

### Públicas
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/registro` | Registro de usuario |
| POST | `/api/auth/login` | Login, devuelve JWT |
| POST | `/api/auth/forgot-password` | Solicitar restablecimiento de contraseña (GEN-07) |
| POST | `/api/auth/reset-password` | Restablecer contraseña con token (GEN-07) |
| GET | `/api/auth/perfil` | Perfil del usuario (requiere token) |

### Protegidas (requieren JWT)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/api/talleres` | cualquiera | Listar talleres con conteo de inscritos |
| GET | `/api/talleres/:id` | cualquiera | Detalle de un taller |
| POST | `/api/talleres` | admin | Crear taller |
| PUT | `/api/talleres/:id` | admin | Actualizar taller |
| PUT | `/api/talleres/reordenar` | admin | Reordenar posición de talleres (drag & drop) |
| DELETE | `/api/talleres/:id` | admin | Eliminar taller (sin inscripciones activas) |
| GET | `/api/inscripciones` | admin | Listar todas las inscripciones |
| GET | `/api/inscripciones/mis-inscripciones` | cualquiera | Inscripciones del usuario autenticado |
| POST | `/api/inscripciones` | cualquiera | Inscribirse a un taller (valida cupo y estado) |
| PUT | `/api/inscripciones/:id/cancelar` | cualquiera | Cancelar inscripción (libera cupo y auto-asigna lista de espera) |
| GET | `/api/lista-espera/mis-solicitudes` | cualquiera | Mis solicitudes en lista de espera (rq-10) |
| POST | `/api/lista-espera` | cualquiera | Solicitar lista de espera para un taller (rq-10) |
| PUT | `/api/lista-espera/:id/cancelar` | cualquiera | Cancelar solicitud de lista de espera (rq-10) |

## Reglas de negocio

| Regla | Código HTTP | Descripción |
|-------|-------------|-------------|
| **Cupo lleno** | 409 | No permite inscribir si el taller alcanzó su capacidad máxima |
| **Taller inactivo** | 422 | No permite inscribir en talleres cerrados o cancelados |
| **Inscripción duplicada** | 409 | No permite inscribirse dos veces al mismo taller |
| **Horario solapado** | 409 | No permite inscribirse si ya tiene otra inscripción activa con horario solapado (rq-06) |
| **Lista de espera** | — | Al cancelar una inscripción, el cupo se asigna automáticamente al primer solicitante en lista de espera (rq-10) |
| **Eliminar con inscritos** | 409 | No permite eliminar un taller con inscripciones activas |

## Evolución del esquema (GEN-12)

| Migración | Fecha | Tipo | Descripción |
|-----------|-------|------|-------------|
| `add-usuario-id-to-inscripciones` | 2026-06-08 | AC (agregar campo) | Agrega `usuario_id` FK a inscripciones para asociar cada inscripción al usuario autenticado |
| `add-imagen-url-to-talleres` | 2026-06-08 | AC (agregar campo) | Agrega `imagen_url` a talleres para mostrar imágenes externas en cards |
| `create-password-reset-tokens` | 2026-06-16 | AG (agregar tabla) | Crea `password_reset_tokens` para restablecimiento de contraseña vía token con expiración (GEN-07) |
| `add-horario-precio-to-talleres` | 2026-06-14 | AC + MT | Agrega `hora_inicio`, `hora_fin`, `precio` y cambia `fecha_fin` a NOT NULL (rq-06) |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el backend con nodemon |
| `npm start` | Inicia el backend en producción |
| `npm run build` | Compila el frontend para producción (Vite) |
| `npm run db:migrate` | Ejecuta migraciones pendientes |
| `npm run db:migrate:undo` | Revierte todas las migraciones |
| `npm run db:seed` | Puebla BD con datos demo (usuarios, talleres, inscripciones) |
| `npm run db:seed:undo` | Revierte todos los seeders |
| `cd client && npm run dev` | Inicia el frontend de desarrollo |

## Base de datos
- Motor: **MySQL**
- ORM: Sequelize
- Migraciones: `npm run db:migrate`

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
| hora_inicio | TIME | Hora de inicio (rq-06) |
| hora_fin | TIME | Hora de término (rq-06) |
| precio | DECIMAL(12,2) | Precio en CLP (opcional) |
| estado | ENUM | activo / cerrado / cancelado |

### Inscripcion — entidad secundaria (rq-02)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre_alumno | STRING(100) | Nombre del alumno |
| email_alumno | STRING(150) | Email de contacto |
| usuario_id | INTEGER | FK → usuarios.id |
| taller_id | INTEGER | FK → talleres.id |
| fecha_inscripcion | DATE | Fecha de inscripción |
| estado | ENUM | pendiente / confirmada / cancelada |

Relaciones: Inscripcion pertenece a Taller **(N:1)** e Inscripcion pertenece a Usuario **(N:1)**

### Usuario — autenticación (GEN-04/GEN-05)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | PK autoincremental |
| nombre | STRING(100) | Nombre del usuario |
| email | STRING(150) | Email único |
| password | STRING(255) | Hash bcrypt |
| rol | ENUM | admin / usuario |

## Deploy en Railway

La aplicación está desplegada en Railway como un **servicio único** que sirve tanto la API como el frontend compilado.

### Arquitectura
- **API + Frontend estático**: Express sirve `client/dist/` en producción
- **Base de datos**: MySQL provisionado como addon de Railway
- **Build automático**: `npm install` → `npm run build` (compila Vite) → `npm start` (migraciones + servidor)

### Variables de entorno en Railway

| Variable | Valor | Nota |
|---|---|---|
| `NODE_ENV` | `production` | Activa servir frontend estático |
| `DATABASE_URL` | _(inyectada por Railway MySQL)_ | Conexión interna `mysql.railway.internal:3306` |
| `JWT_SECRET` | _(aleatorio)_ | Clave para firmar tokens |
| `CORS_ORIGIN` | `*` | Mismo dominio, no requiere CORS |
| `VITE_API_URL` | `/api` | Ruta relativa al mismo servidor |

### Acceder a MySQL desde exterior
Railway expone `MYSQL_PUBLIC_URL` con la conexión pública:
```
mysql://root:<password>@<host>.proxy.rlwy.net:<puerto>/railway
```
Usar `--ssl-mode=REQUIRED` para conectar desde MySQL Workbench o CLI.

### Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run build` | Compila el frontend (se ejecuta automáticamente en Railway) |
| `npm start` | Corre migraciones + inicia servidor |
| Redeploy | Railway → Deployments → Redeploy latest commit |

## Matriz de avance — Hito 3

| ID | Título | Estado |
|----|--------|--------|
| GEN-01 | Estructura del repositorio y README | ✅ |
| GEN-02 | Variables de entorno y `.env.example` | ✅ |
| GEN-03 | Conexión a BD y migraciones Sequelize | ✅ |
| GEN-04 | Registro de usuario | ✅ |
| GEN-05 | Login y emisión JWT | ✅ |
| GEN-06 | Middleware de autenticación | ✅ |
| GEN-07 | Restablecer contraseña | ✅ |
| GEN-08 | Manejo centralizado de errores | ✅ |
| GEN-09 | CRUD REST y pantallas web | ✅ |
| GEN-10 | Validaciones de entrada | ✅ |
| GEN-11 | Colección Postman | ✅ |
| GEN-12 | Evolución de esquema | ✅ |
| GEN-13 | Despliegue Railway | ✅ |
| rq-01 | Modelar entidad principal (Taller) | ✅ |
| rq-02 | Modelar entidad secundaria (Inscripcion) | ✅ |
| rq-03 | CRUD del recurso principal (Talleres) | ✅ |
| rq-04 | CRUD del recurso secundario (Inscripciones) | ✅ |
| rq-05 | Regla de negocio: cupo lleno | ✅ |
| rq-06 | Regla de negocio: sin solapamiento horario | ✅ |
| rq-07 | Consultas con filtros (cupos disponibles) | ✅ |
| rq-08 | Panel de oferta de cursos | ✅ |
| rq-09 | Flujo transaccional: inscribir alumno | ✅ |
| rq-10 | Funcionalidad avanzada (lista de espera) | ✅ |

**Total: 23/23 requisitos (100%)**

## Estructura de carpetas
```
inscripcion-talleres/
├── client/               ← Frontend React
├── src/
│   ├── routes/           ← Rutas Express
│   ├── controllers/      ← Lógica de cada ruta
│   ├── services/         ← Lógica de negocio
│   ├── models/           ← Modelos Sequelize
│   ├── middlewares/      ← Middlewares (auth, errorHandler)
│   ├── config/           ← Configuración BD
│   └── app.js            ← Entrada del servidor
├── migrations/           ← Migraciones Sequelize
├── seeders/
├── postman/
├── .env.example
├── .gitignore
└── README.md
```
