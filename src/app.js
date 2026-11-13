const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const app = express();

// ---------------------------------------------------------------------------
// RUTAS POR MODULO
// Cada equipo agrega aqui el require y el app.use de su modulo en su PR.
// No borrar las lineas de otro equipo.
// ---------------------------------------------------------------------------
// [Fase 0 · Equipo C] auth
// [Fase 1 · Equipo B] clientes, contratos, areas
// [Fase 1 · Equipo A] maquinas, maquinas-cambio
// [Fase 1 · Equipo C] instalacion (asignaciones)
// [Fase 2 · Equipo C] ingesta, lotes, staging
// [Fase 2 · Equipo A] notificaciones
// [Fase 3 · Equipo C] reportes

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(morgan('dev'));

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, _res, next) => {
  req.pool = pool;
  next();
});

app.get('/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS now');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (error) {
    console.error('Error consultando la BD:', error);
    res.status(500).json({ status: 'error', message: 'Error al conectar con la base de datos' });
  }
});

// app.use('/api/auth', authRoutes);              // Fase 0 · C
// app.use('/api/clientes', clienteRoutes);       // Fase 1 · B
// app.use('/api/contratos', contratoRoutes);     // Fase 1 · B
// app.use('/api/areas', areaRoutes);             // Fase 1 · B
// app.use('/api/maquinas', maquinaRoutes);       // Fase 1 · A
// app.use('/api/maquinas-cambio', maquinasCambioRoutes); // Fase 1 · A
// app.use('/api/instalacion', instalacionRoutes);        // Fase 1 · C
// app.use('/api/ingesta', ingestaRoutes);        // Fase 2 · C
// app.use('/api/lotes', lotesRoutes);            // Fase 2 · C
// app.use('/api/staging', stagingRoutes);        // Fase 2 · C
// app.use('/api/notificaciones', notificacionesRoutes);  // Fase 2 · A
// app.use('/api/reportes', reportemesRoutes);    // Fase 3 · C

module.exports = app;
