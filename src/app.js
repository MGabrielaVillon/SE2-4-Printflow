const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const app = express();

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

// ===========================================================================
// LINEAS DE CADA EQUIPO
// Cada equipo SOLO quita el "// " del inicio de las lineas que terminan con
// su etiqueta (por ejemplo "// [B-F1]"). No se escriben lineas nuevas aqui ni se
// tocan las de otro equipo. La etiqueta del final de la linea se queda.
// ===========================================================================

// --- Seguridad de la API (Equipo C, Fase 2): todo /api exige token, salvo login y la ingesta,
//     que usa su propio token. Va ANTES de las rutas.
// const { protect } = require('@middlewares/auth.middleware'); // [C-F2]
// const RUTAS_PUBLICAS = ['/auth/login', '/auth/validate-token']; // [C-F2]
// app.use('/api', (req, res, next) => (RUTAS_PUBLICAS.includes(req.path) || req.path.startsWith('/ingesta') ? next() : protect(req, res, next))); // [C-F2]

// --- Fase 0
// const authRoutes = require('@routes/usuario/usuario.routes'); // [C-F0]
// app.use('/api/auth', authRoutes); // [C-F0]

// --- Fase 1
// const maquinaRoutes = require('@routes/maquina/maquina.routes'); // [A-F1]
// const maquinasCambioRoutes = require('@routes/cambio/maquinasCambio.routes'); // [A-F1]
// app.use('/api/maquinas', maquinaRoutes); // [A-F1]
// app.use('/api/maquinas-cambio', maquinasCambioRoutes); // [A-F1]
// const clienteRoutes = require('@routes/cliente/cliente.routes'); // [B-F1]
// const contratoRoutes = require('@routes/contrato/contrato.routes'); // [B-F1]
// const areaRoutes = require('@routes/area/area.routes'); // [B-F1]
// app.use('/api/clientes', clienteRoutes); // [B-F1]
// app.use('/api/contratos', contratoRoutes); // [B-F1]
// app.use('/api/areas', areaRoutes); // [B-F1]
// const instalacionRoutes = require('@routes/instalacion/instalacion.routes'); // [C-F1]
// app.use('/api/instalacion', instalacionRoutes); // [C-F1]

// --- Fase 2
// const notificacionesRoutes = require('@routes/notificaciones/notificaciones.routes'); // [A-F2]
// app.use('/api/notificaciones', notificacionesRoutes); // [A-F2]
// const ingestaRoutes = require('@routes/ingesta/ingesta.routes'); // [C-F2]
// const lotesRoutes = require('@routes/lotes_carga/lotes_carga.routes'); // [C-F2]
// const stagingRoutes = require('@routes/reportemes_staging/reportemes_staging.routes'); // [C-F2]
// app.use('/api/ingesta', ingestaRoutes); // [C-F2]
// app.use('/api/lotes', lotesRoutes); // [C-F2]
// app.use('/api/staging', stagingRoutes); // [C-F2]

// --- Fase 3
// const reportemesRoutes = require('@routes/reportemes/reportemes.routes'); // [C-F3]
// app.use('/api/reportes', reportemesRoutes); // [C-F3]

module.exports = app;
