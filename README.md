# PrintFlow · Backend

API de PrintFlow (Node 22 + Express 5 + PostgreSQL) para DOX S.A.
Frontend: repo `SE2-4-Printflow-Frontend`.

## Correr en local

```bash
cp .env.example .env      # en Windows: copy .env.example .env  (y completar)
npm install
npm start                 # http://localhost:9000
```

- Salud del servicio: `GET /health`
- Documentación de la API: `http://localhost:9000/api-docs`

La base de datos se crea con los scripts de `db/` (ver la sección del Equipo C en `PLAN.md`).

## Cómo trabajamos

Ver `PLAN.md`: equipos, fases, ramas y reglas de PR.
