const mongoose = require('mongoose');
const { MONGODB_URI } = require('../../../config/keys');

// ==================== CONFIGURACIÓN DE EVENTOS DE MONGOOSE ====================

// Evento: Conexión establecida
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB en:', mongoose.connection.host);
});

// Evento: Error durante la conexión
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión Mongoose:', err.message);
});

// Evento: Desconexión
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// Evento: Reconexión automática
mongoose.connection.on('reconnected', () => {
  console.log('🔄 Mongoose reconectado a MongoDB');
});

// Evento: Intento de reconexión fallido
mongoose.connection.on('reconnectFailed', () => {
  console.error('❌ Mongoose falló al reconectar a MongoDB');
});

// ==================== FUNCIÓN DE CONEXIÓN MEJORADA ====================
const connectDB = async () => {
  try {
    // Codificar contraseña por si contiene caracteres especiales
    const encodedPassword = encodeURIComponent('0987021692@Rj');
    const connectionURI = MONGODB_URI.replace('<PASSWORD>', encodedPassword);

    // Opciones de conexión optimizadas
    const options = {
      // Timeouts
      connectTimeoutMS: 30000,       // 30 segundos para establecer conexión
      socketTimeoutMS: 45000,        // 45 segundos para operaciones de socket
      serverSelectionTimeoutMS: 30000, // 30 segundos para seleccionar servidor

      // Pool de conexiones
      maxPoolSize: 20,               // Máximo de conexiones en el pool
      minPoolSize: 5,                // Mínimo de conexiones en el pool

      // Heartbeat
      heartbeatFrequencyMS: 10000,   // Verificar conexión cada 10 segundos

      // Retry
      retryWrites: true,             // Reintentar escrituras fallidas
      retryReads: true,              // Reintentar lecturas fallidas

      // Buffers
      bufferCommands: false,         // No almacenar comandos si no hay conexión
      autoIndex: false,              // No crear índices automáticamente en producción

      // Otros
      family: 4                      // Usar IPv4
    };

    await mongoose.connect(connectionURI, options);

    console.log('🚀 MongoDB conectado correctamente');
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔢 Puerto:', mongoose.connection.port);
  } catch (err) {
    console.error('💥 Error en conexión MongoDB:', err.message);

    // Mostrar detalles adicionales del error
    if (err.name === 'MongooseServerSelectionError') {
      console.error('⚠️  No se pudo seleccionar un servidor MongoDB');
      console.error('   Verifica que MongoDB esté ejecutándose y accesible');
    } else if (err.name === 'MongoParseError') {
      console.error('⚠️  Error al parsear la URI de MongoDB');
      console.error('   Verifica el formato de MONGODB_URI en las variables de entorno');
    }

    console.warn('⚠️  La aplicación continuará sin MongoDB. Algunas funcionalidades pueden no estar disponibles.');
    // NO terminar la aplicación - permitir que corra sin MongoDB en desarrollo
  }
};

// ==================== MANEJO DE CIERRE GRACEFUL ====================
// Cerrar conexión cuando la aplicación se cierra
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada por terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al cerrar conexión MongoDB:', err.message);
    process.exit(1);
  }
});

// Cerrar conexión en caso de terminación inesperada
process.on('SIGTERM', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada por SIGTERM');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al cerrar conexión MongoDB:', err.message);
    process.exit(1);
  }
});

// ==================== FUNCIÓN DE SALUD ====================
// Función helper para verificar el estado de la conexión
const healthCheck = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      // 1 = connected
      await mongoose.connection.db.admin().ping();
      return {
        status: 'healthy',
        message: 'MongoDB connection is healthy',
        readyState: mongoose.connection.readyState
      };
    } else {
      return {
        status: 'unhealthy',
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      readyState: mongoose.connection.readyState
    };
  }
};

// ==================== INICIAR CONEXIÓN ====================
connectDB();

// ==================== IMPORTAR MODELOS MONGODB ====================
const pageModel = require('../../../domain/models/mongodb/page');
const calificacionModel = require('../../../domain/models/mongodb/calificacion');
const clienteModel = require('../../../domain/models/mongodb/cliente');
const conductorModel = require('../../../domain/models/mongodb/conductor');
const estacionModel = require('../../../domain/models/mongodb/estacion');
const guiaVozModel = require('../../../domain/models/mongodb/guiaVoz');
const lugarTuristicoModel = require('../../../domain/models/mongodb/lugarTuristico');
const mensajeModel = require('../../../domain/models/mongodb/mensaje');
const rutaModel = require('../../../domain/models/mongodb/ruta');
const transporteModel = require('../../../domain/models/mongodb/trasporte');

// ==================== EXPORTAR MODELOS Y UTILIDADES ====================
module.exports = {
  // Modelos MongoDB
  pageModel,
  calificacionModel,
  clienteModel,
  conductorModel,
  estacionModel,
  guiaVozModel,
  lugarTuristicoModel,
  mensajeModel,
  rutaModel,
  transporteModel,

  // Utilidades
  healthCheck,              // Función para verificar salud de la conexión
  mongoose                  // Instancia de Mongoose (para operaciones avanzadas)
};