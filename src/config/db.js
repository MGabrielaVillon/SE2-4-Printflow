const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// DB_SSL=true solo cuando la base esta fuera del servidor (p. ej. Supabase).
// En Docker local o en el servidor de DOX va en false.
const useSsl = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.connect()
  .then((client) => {
    console.log('Conexion a PostgreSQL exitosa');
    client.release();
  })
  .catch((err) => {
    console.error('Error al conectar a PostgreSQL:', err.message);
  });

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
