// config/db.js
// Configuración de conexión a MySQL

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'estivo',
    password: process.env.DB_PASSWORD || 'winters20042',
    database: process.env.DB_NAME || 'gestion_usuarios',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
