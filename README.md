# PrintFlow · Backend

API de PrintFlow (Node 22 + Express 5 + PostgreSQL) para DOX S.A.
Frontend: https://github.com/MarSalvatore28/SE2-4-Printflow-Frontend

## Repositorios

| Repo | Enlace |
|---|---|
| Backend (API, base de datos, Docker) | https://github.com/MGabrielaVillon/SE2-4-Printflow |
| Frontend (web) | https://github.com/MarSalvatore28/SE2-4-Printflow-Frontend |

Clonar **los dos lado a lado** en la misma carpeta (Docker busca el frontend en `../SE2-4-Printflow-Frontend`):

```powershell
mkdir C:\printflow; cd C:\printflow
git clone https://github.com/MGabrielaVillon/SE2-4-Printflow.git
git clone https://github.com/MarSalvatore28/SE2-4-Printflow-Frontend.git
```

## Levantar todo con Docker (recomendado)

```powershell
cd C:\printflow\SE2-4-Printflow
copy .env.example .env     # completar DB_PASSWORD y SECRET_KEY
docker compose up --build
```

- Web: http://localhost:8080 (cambia con `WEB_PORT`)
- n8n: http://localhost:5678
- PostgreSQL: `127.0.0.1:5433` (cambia con `DB_HOST_PORT`)

## Correr solo este repo (sin Docker)

```bash
cp .env.example .env      # en Windows: copy .env.example .env  (y completar)
npm install
npm start                 # http://localhost:9000
```

- Salud del servicio: `GET /health`
- Documentación de la API: `http://localhost:9000/api-docs`

La base de datos se crea con los scripts de `db/` (ver la sección del Equipo C en `PLAN.md`).

## Cómo trabajamos

1. Ramas: `main` (entregas) ← `develop` (integración) ← `feature/fN-<tema>` (una por caja).
2. Siempre partir de `develop` actualizado: `git checkout develop; git pull; git checkout -b feature/...`
3. **Líneas etiquetadas:** en `App.tsx`, `modulos.data.ts` y `Sidebar.tsx` (frontend) y en `src/app.js` (backend) las rutas de todos los equipos ya están escritas y comentadas, terminadas en `// [X-FN]` (ej. `// [B-F1]`). Cada equipo solo quita el `// ` del inicio de **sus** líneas y no toca las de otro equipo.
4. PR hacia `develop`, con la plantilla llena y 1 aprobación. El CI debe pasar.
5. Orden en cada fase: **Equipo A → Equipo B → Equipo C**. Una caja empieza cuando la anterior está mergeada.
6. **Nunca** subir `.env`, contraseñas ni datos reales de clientes.

Equipos, calendario y detalle: `PLAN.md` en el repo del backend.
