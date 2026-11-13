# PrintFlow · Backend

[![CI backend](https://github.com/MGabrielaVillon/SE2-4-Printflow/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/MGabrielaVillon/SE2-4-Printflow/actions/workflows/ci.yml)

API del sistema **PrintFlow**, que registra los contadores de las impresoras que DOX S.A. tiene en sus clientes y calcula el consolidado mensual a facturar por cliente y período.

Proyecto de la materia **Ingeniería de Software II** (ESPOL, sección 4).

| | |
|---|---|
| Frontend | [MarSalvatore28/SE2-4-Printflow-Frontend](https://github.com/MarSalvatore28/SE2-4-Printflow-Frontend) |
| Plan de trabajo | [`PLAN.md`](PLAN.md) |
| Documentación de la API | `/api-docs` (Swagger), con el sistema levantado |

---

## Contenido

1. [Cómo funciona](#cómo-funciona)
2. [Tecnologías](#tecnologías)
3. [Requisitos](#requisitos)
4. [Inicio rápido con Docker](#inicio-rápido-con-docker)
5. [Desarrollo sin Docker](#desarrollo-sin-docker)
6. [Variables de entorno](#variables-de-entorno)
7. [Scripts](#scripts)
8. [Estructura del proyecto](#estructura-del-proyecto)
9. [Flujo de trabajo](#flujo-de-trabajo)
10. [Equipo](#equipo)

---

## Cómo funciona

```text
Impresoras del cliente ──correo──▶ Buzón ──▶ n8n ──▶ API PrintFlow ──▶ PostgreSQL
                                                         │
                                         Socket.IO ◀─────┤
                                                         ▼
                                                  Web (React)
```

1. Las impresoras envían sus reportes de contadores por correo. Esa configuración la provee DOX y está fuera del alcance del proyecto (ver [`PLAN.md`, sección 1.1](PLAN.md)).
2. **n8n** lee el buzón, extrae los contadores y los envía a `POST /api/ingesta/cargar`.
3. La API guarda cada envío como un **lote en revisión**, avisa en tiempo real a los operadores y, al aprobarse, registra las lecturas.
4. Con las lecturas, los contratos y las tarifas, la API calcula el **consolidado por cliente y período**, que se exporta a PDF y Excel desde la web.

> Durante el desarrollo se trabaja únicamente con **datos simulados**: un buzón de prueba y máquinas ficticias. Ningún dato real de clientes de DOX entra en este repositorio.

## Tecnologías

| Capa | Herramienta |
|---|---|
| Lenguaje y servidor | Node.js 22 · Express 5 |
| Base de datos | PostgreSQL 17 (`pg`) |
| Tiempo real | Socket.IO + `LISTEN/NOTIFY` de PostgreSQL |
| Autenticación | JWT (`jsonwebtoken`) · `bcrypt` |
| Documentación | Swagger (`swagger-jsdoc`, `swagger-ui-express`) |
| Automatización | n8n |
| Entorno | Docker Compose · GitHub Actions |

## Requisitos

- [Git](https://git-scm.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose v2)
- [Node.js 22](https://nodejs.org/), solo para desarrollar sin Docker

## Inicio rápido con Docker

Los dos repositorios deben estar **en la misma carpeta**, porque Docker construye la web desde `../SE2-4-Printflow-Frontend`.

```powershell
mkdir C:\printflow; cd C:\printflow
git clone https://github.com/MGabrielaVillon/SE2-4-Printflow.git
git clone https://github.com/MarSalvatore28/SE2-4-Printflow-Frontend.git

cd SE2-4-Printflow
copy .env.example .env     # completar DB_PASSWORD y SECRET_KEY
docker compose up -d --build
```

| Servicio | Dirección | Notas |
|---|---|---|
| Web | http://localhost:8080 | nginx sirve la web y reenvía `/api` y `/socket.io` a la API |
| API | solo dentro de Docker (`api:9000`) | se accede a través de la web |
| Swagger | http://localhost:8080/api-docs | |
| n8n | http://localhost:5678 | solo en el equipo local |
| PostgreSQL | `127.0.0.1:5433` | para psql o pgAdmin |

Comandos útiles:

```powershell
docker compose ps                 # estado de los servicios
docker compose logs -f api        # registros de la API
docker compose down               # apagar
docker compose down -v            # apagar y borrar la base (se recrea al volver a levantar)
```

La base se crea la **primera vez** que se levanta el volumen: `docker/postgres/init.sh` aplica en orden los scripts de `db/migrations` y luego los de `db/seeds`. Después de cambiar el SQL hay que recrearla con `docker compose down -v`.

## Desarrollo sin Docker

Útil para depurar la API. La base puede seguir corriendo en Docker:

```powershell
docker compose up -d db
npm install
npm start                         # http://localhost:9000
```

En el `.env`, usar `DB_HOST=localhost` y `DB_PORT=5433` (el valor de `DB_HOST_PORT`).

## Variables de entorno

Se definen en `.env`, a partir de [`.env.example`](.env.example). El archivo `.env` **nunca** se sube al repositorio.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `PORT` | Puerto de la API | `9000` |
| `DB_HOST`, `DB_PORT` | Servidor de PostgreSQL (en Docker se fijan solos) | `localhost`, `5432` |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credenciales y nombre de la base | `postgres`, *(propia)*, `printflow` |
| `DB_SSL` | `true` solo si la base es externa (por ejemplo, Supabase) | `false` |
| `SECRET_KEY` | Clave para firmar los JWT | *(generada, ver `.env.example`)* |
| `CORS_ORIGINS` | Orígenes permitidos, separados por coma | `http://localhost:5173` |
| `INGESTA_TOKEN` | Token que n8n envía a la ingesta | *(generado)* |
| `DB_HOST_PORT`, `WEB_PORT` | Puertos publicados en el equipo local | `5433`, `8080` |

## Scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia la API |
| `npm run verificar` | Comprueba que la aplicación carga sin errores (lo usa el CI) |
| `npm test` | Ejecuta las pruebas con el *test runner* de Node |

## Estructura del proyecto

```text
.
├── src/
│   ├── server.js            # arranque del servidor HTTP y de Socket.IO
│   ├── app.js               # Express: middlewares y rutas
│   ├── socket.js            # notificaciones en tiempo real
│   ├── config/              # base de datos y Swagger
│   ├── routes/              # rutas por módulo
│   ├── controllers/         # lógica de cada endpoint
│   ├── models/              # consultas SQL
│   ├── middlewares/         # autenticación, roles y token de ingesta
│   └── documentation/       # definiciones de Swagger
├── db/
│   ├── migrations/          # esquema, en orden numérico
│   └── seeds/               # catálogos y usuarios de prueba
├── n8n/                     # flujo de ingesta exportado, sin credenciales
├── docker/postgres/init.sh  # inicializa la base en Docker
├── docker-compose.yml
├── Dockerfile
└── PLAN.md                  # equipos, fases y calendario
```

Los módulos se incorporan por fases según [`PLAN.md`](PLAN.md). Algunas carpetas aparecen a medida que cada equipo integra su parte.

## Flujo de trabajo

- **Ramas:** `main` para lo entregado, `develop` para la integración y `feature/<fase>-<tema>` para cada tarea.
- **Pull requests** hacia `develop`, con la plantilla completa, una aprobación y el CI en verde.
- **Commits** en español y en presente, con prefijo de tipo: `feat(clientes): valida RUC de 13 dígitos`.
- **El CI** verifica en cada PR:
  - que no haya archivos `.env`;
  - que las dependencias instalen y la aplicación cargue;
  - que pasen las pruebas;
  - que la imagen de Docker se construya.
- **Nunca se suben** credenciales, archivos `.env` ni datos reales de clientes.

## Equipo

| Equipo | Integrantes | Responsabilidades |
|---|---|---|
| A | Kiara Morán · Marlo Valle | Infraestructura, CI, máquinas, notificaciones, n8n y despliegue |
| B | María Gabriela Villón · Roberto Barrios | Interfaz web, clientes, contratos, áreas, informes y usuarios |
| C | Samuel Chichande · Christian Villacrés | Base de datos, autenticación, ingesta, cálculo del informe y pruebas |

Cliente: **DOX S.A.**

---

Proyecto académico. El código no se distribuye bajo una licencia de código abierto.
