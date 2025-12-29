const { createPool } = require("mysql2");
const { promisify } = require("util");
const dotenv = require('dotenv');

dotenv.config();

const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT } = require("../../../config/keys");

// ==================== CONFIGURACIÓN DEL POOL ====================
// Pool optimizado para conexiones MySQL raw (sin ORM)
const pool = createPool({
    host: MYSQLHOST,
    port: MYSQLPORT,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE,
    // Configuración del pool
    connectionLimit: 20,        // Máximo de conexiones simultáneas
    queueLimit: 0,              // Sin límite en la cola de espera
    waitForConnections: true,   // Esperar si no hay conexiones disponibles
    // Timeouts (opciones válidas para MySQL2)
    connectTimeout: 60000,      // 60 segundos para establecer conexión
    // Opciones adicionales
    multipleStatements: false,  // Seguridad: no permitir múltiples statements
    charset: 'utf8mb4',         // Soporte completo UTF-8
    timezone: 'Z',              // UTC
    enableKeepAlive: true,      // Mantener conexiones vivas
    keepAliveInitialDelay: 0    // Sin delay inicial para keepalive
});

// ==================== MANEJO DE ERRORES DE CONEXIÓN ====================
pool.getConnection((err, connection) => {
    if (err) {
        switch (err.code) {
            case 'PROTOCOL_CONNECTION_LOST':
                console.error('❌ Se cerró la conexión a MySQL');
                break;
            case 'ER_CON_COUNT_ERROR':
                console.error('❌ MySQL tiene demasiadas conexiones');
                break;
            case 'ECONNREFUSED':
                console.error('❌ Conexión a MySQL rechazada');
                break;
            case 'ETIMEDOUT':
                console.error('❌ Timeout al conectar con MySQL');
                break;
            case 'ER_ACCESS_DENIED_ERROR':
                console.error('❌ Credenciales MySQL inválidas');
                break;
            default:
                console.error('❌ Error MySQL:', err.message);
        }
        return;
    }

    if (connection) {
        connection.release();
        console.log('✅ Pool de conexiones MySQL raw configurado correctamente');
    }
});

// ==================== MANEJO DE ERRORES DEL POOL ====================
pool.on('error', (err) => {
    console.error('❌ Error en pool MySQL:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('🔄 Reconectando...');
    }
});

pool.on('connection', (connection) => {
    console.log('🔗 Nueva conexión MySQL establecida (ID:', connection.threadId, ')');
});

pool.on('release', (connection) => {
    console.log('🔓 Conexión MySQL liberada (ID:', connection.threadId, ')');
});

// ==================== PROMISIFY PARA ASYNC/AWAIT ====================
// Convertir métodos a promesas para usar async/await
pool.query = promisify(pool.query);

// ==================== FUNCIÓN DE SALUD ====================
// Función helper para verificar la salud de la conexión
pool.healthCheck = async () => {
    try {
        await pool.query('SELECT 1');
        return { status: 'healthy', message: 'MySQL connection is healthy' };
    } catch (error) {
        return { status: 'unhealthy', message: error.message };
    }
};

// ==================== CIERRE GRACEFUL ====================
// Cerrar el pool cuando la aplicación se cierra
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('❌ Error al cerrar pool MySQL:', err.message);
            process.exit(1);
        }
        console.log('🔌 Pool MySQL cerrado correctamente');
        process.exit(0);
    });
});

module.exports = pool;