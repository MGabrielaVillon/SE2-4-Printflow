const { Server } = require('socket.io');
const { Client } = require('pg'); 
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let io;
let pgClient;

// Mismas reglas que src/config/db.js y src/app.js
const useSsl = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

module.exports = {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: allowedOrigins,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        pgClient = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            ssl: useSsl ? { rejectUnauthorized: false } : false
        });

        pgClient.connect(err => {
            if (err) {
                console.error('❌ Error conectando cliente PG para notificaciones:', err);
            } else {
                console.log('✅ Cliente PG conectado para escuchar notificaciones');
                pgClient.query('LISTEN nueva_notificacion');
            }
        });

        pgClient.on('notification', (msg) => {
            if (msg.channel === 'nueva_notificacion') {
                try {
                    const payload = JSON.parse(msg.payload);
                    io.emit('nueva_notificacion', payload);
                } catch (e) {
                    console.error('Error parseando notificación:', e);
                }
            }
        });

        pgClient.on('error', err => {
            console.error('❌ Error en cliente PG de notificaciones:', err);
        });

        console.log('Socket.IO Initialized');
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
