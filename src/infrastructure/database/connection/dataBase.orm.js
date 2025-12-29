const { Sequelize } = require("sequelize");
const { MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT, MYSQL_URI } = require("../../../config/keys");

let sequelize;

// ==================== CONFIGURACIÓN SEQUELIZE ====================
// Usar URI de conexión si está disponible
if (MYSQL_URI && MYSQL_URI.trim() !== '') {
    sequelize = new Sequelize(MYSQL_URI, {
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
            connectTimeout: 60000, // 60 segundos
        },
        pool: {
            max: 20,
            min: 5,
            acquire: 60000,
            idle: 10000
        },
        logging: false,
        retry: {
            max: 3
        }
    });
} else {
    // Configuración para parámetros individuales
    sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
        host: MYSQLHOST,
        port: MYSQLPORT,
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4',
            connectTimeout: 60000,
        },
        pool: {
            max: 20,
            min: 5,
            acquire: 60000,
            idle: 10000
        },
        logging: false,
        retry: {
            max: 3
        }
    });
}

// ==================== AUTENTICACIÓN ====================
sequelize.authenticate()
    .then(() => {
        console.log("✅ Conexión establecida con MySQL");
    })
    .catch((err) => {
        console.error("❌ No se pudo conectar a MySQL:", err.message);
    });

// ==================== SINCRONIZACIÓN ====================
// alter: false para no modificar tablas existentes automáticamente
const syncOptions = { alter: false };

sequelize.sync(syncOptions)
    .then(() => {
        console.log('✅ Modelos sincronizados con MySQL');
    })
    .catch((error) => {
        console.error('❌ Error al sincronizar modelos:', error.message);
    });

// ==================== IMPORTAR MODELOS ====================
const usuarioModel = require('../../../domain/models/sql/usuario');
const rolModel = require('../../../domain/models/sql/rol');
const detalleRolModel = require('../../../domain/models/sql/detalleRol');
const pageModel = require('../../../domain/models/sql/page');
const categoriaTransporteModel = require('../../../domain/models/sql/categoriaTransporte');
const transporteModel = require('../../../domain/models/sql/transporte');
const empresaTransporteModel = require('../../../domain/models/sql/empresaTransporte');
const conductorModel = require('../../../domain/models/sql/conductor');
const estacionModel = require('../../../domain/models/sql/estacion');
const categoriaEstacionModel = require('../../../domain/models/sql/categoriaEstacion');
const rutaModel = require('../../../domain/models/sql/ruta');
const rutaEstacionModel = require('../../../domain/models/sql/rutaEstacion');
const horarioModel = require('../../../domain/models/sql/horario');
const metodoIngresoModel = require('../../../domain/models/sql/metodoIngreso');
const estacionMetodoModel = require('../../../domain/models/sql/estacionMetodo');
const categoriaLugarModel = require('../../../domain/models/sql/categoriaLugar');
const lugarTuristicoModel = require('../../../domain/models/sql/lugarTuristico');
const tipoMensajeModel = require('../../../domain/models/sql/tipoMensaje');
const mensajeModel = require('../../../domain/models/sql/mensaje');
const guiaVozModel = require('../../../domain/models/sql/guiaVoz');
const idiomaModel = require('../../../domain/models/sql/idioma');
const calificacionModel = require('../../../domain/models/sql/calificacion');
const tarifaModel = require('../../../domain/models/sql/tarifa');
const clienteModel = require('../../../domain/models/sql/cliente');
const lugarFavoritoModel = require('../../../domain/models/sql/lugarFavorito');
const contactoEmergenciaModel = require('../../../domain/models/sql/contactoEmergencia');

// ==================== INSTANCIAR MODELOS ====================
const usuario = usuarioModel(sequelize, Sequelize);
const rol = rolModel(sequelize, Sequelize);
const detalleRol = detalleRolModel(sequelize, Sequelize);
const page = pageModel(sequelize, Sequelize);
const categoriaTransporte = categoriaTransporteModel(sequelize, Sequelize);
const transporte = transporteModel(sequelize, Sequelize);
const empresaTransporte = empresaTransporteModel(sequelize, Sequelize);
const conductor = conductorModel(sequelize, Sequelize);
const estacion = estacionModel(sequelize, Sequelize);
const categoriaEstacion = categoriaEstacionModel(sequelize, Sequelize);
const ruta = rutaModel(sequelize, Sequelize);
const rutaEstacion = rutaEstacionModel(sequelize, Sequelize);
const horario = horarioModel(sequelize, Sequelize);
const metodoIngreso = metodoIngresoModel(sequelize, Sequelize);
const estacionMetodo = estacionMetodoModel(sequelize, Sequelize);
const categoriaLugar = categoriaLugarModel(sequelize, Sequelize);
const lugarTuristico = lugarTuristicoModel(sequelize, Sequelize);
const tipoMensaje = tipoMensajeModel(sequelize, Sequelize);
const mensaje = mensajeModel(sequelize, Sequelize);
const guiaVoz = guiaVozModel(sequelize, Sequelize);
const idioma = idiomaModel(sequelize, Sequelize);
const calificacion = calificacionModel(sequelize, Sequelize);
const tarifa = tarifaModel(sequelize, Sequelize);
const cliente = clienteModel(sequelize, Sequelize);
const lugarFavorito = lugarFavoritoModel(sequelize, Sequelize);
const contactoEmergencia = contactoEmergenciaModel(sequelize, Sequelize);

// ==================== RELACIONES (FOREIGN KEYS) ====================

// RELACIONES USUARIO-ROL
usuario.hasMany(detalleRol, { foreignKey: 'idUser', onDelete: 'CASCADE' });
detalleRol.belongsTo(usuario, { foreignKey: 'idUser' });

rol.hasMany(detalleRol, { foreignKey: 'idRol', onDelete: 'CASCADE' });
detalleRol.belongsTo(rol, { foreignKey: 'idRol' });

// RELACIONES USUARIO-PAGE
usuario.hasMany(page, { foreignKey: 'idUser', onDelete: 'SET NULL' });
page.belongsTo(usuario, { foreignKey: 'idUser' });

// RELACIONES TRANSPORTE
categoriaTransporte.hasMany(transporte, { constraints: false });
transporte.belongsTo(categoriaTransporte, { constraints: false });

empresaTransporte.hasMany(transporte, { constraints: false });
transporte.belongsTo(empresaTransporte, { constraints: false });

conductor.hasMany(transporte, { constraints: false });
transporte.belongsTo(conductor, { constraints: false });

ruta.hasMany(transporte, { constraints: false });
transporte.belongsTo(ruta, { constraints: false });

// RELACIONES ESTACION
categoriaEstacion.hasMany(estacion, { constraints: false });
estacion.belongsTo(categoriaEstacion, { constraints: false });

// RELACIONES RUTA-ESTACION (N:M)
ruta.hasMany(rutaEstacion, { constraints: false });
rutaEstacion.belongsTo(ruta, { constraints: false });

estacion.hasMany(rutaEstacion, { constraints: false });
rutaEstacion.belongsTo(estacion, { constraints: false });

// RELACIONES HORARIOS
ruta.hasMany(horario, { constraints: false });
horario.belongsTo(ruta, { constraints: false });

estacion.hasMany(horario, { constraints: false });
horario.belongsTo(estacion, { constraints: false });

// RELACIONES METODOS INGRESO-ESTACION (N:M)
estacion.hasMany(estacionMetodo, { constraints: false });
estacionMetodo.belongsTo(estacion, { constraints: false });

metodoIngreso.hasMany(estacionMetodo, { constraints: false });
estacionMetodo.belongsTo(metodoIngreso, { constraints: false });

// RELACIONES LUGARES TURISTICOS
categoriaLugar.hasMany(lugarTuristico, { constraints: false });
lugarTuristico.belongsTo(categoriaLugar, { constraints: false });

estacion.hasMany(lugarTuristico, { constraints: false });
lugarTuristico.belongsTo(estacion, { constraints: false });

usuario.hasMany(lugarTuristico, { foreignKey: 'idUser', constraints: false });
lugarTuristico.belongsTo(usuario, { foreignKey: 'idUser', constraints: false });

// RELACIONES MENSAJES
tipoMensaje.hasMany(mensaje, { constraints: false });
mensaje.belongsTo(tipoMensaje, { constraints: false });

usuario.hasMany(mensaje, { foreignKey: 'idUser', constraints: false });
mensaje.belongsTo(usuario, { foreignKey: 'idUser', constraints: false });

// RELACIONES GUIAS DE VOZ
mensaje.hasMany(guiaVoz, { constraints: false });
guiaVoz.belongsTo(mensaje, { constraints: false });

idioma.hasMany(guiaVoz, { constraints: false });
guiaVoz.belongsTo(idioma, { constraints: false });

lugarTuristico.hasMany(guiaVoz, { constraints: false });
guiaVoz.belongsTo(lugarTuristico, { constraints: false });

usuario.hasMany(guiaVoz, { foreignKey: 'idUser', constraints: false });
guiaVoz.belongsTo(usuario, { foreignKey: 'idUser', constraints: false });

// RELACIONES CALIFICACIONES
usuario.hasMany(calificacion, { foreignKey: 'idUser', constraints: false });
calificacion.belongsTo(usuario, { foreignKey: 'idUser', constraints: false });

transporte.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(transporte, { constraints: false });

conductor.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(conductor, { constraints: false });

ruta.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(ruta, { constraints: false });

estacion.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(estacion, { constraints: false });

lugarTuristico.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(lugarTuristico, { constraints: false });

guiaVoz.hasMany(calificacion, { constraints: false });
calificacion.belongsTo(guiaVoz, { constraints: false });

// RELACIONES TARIFAS
ruta.hasMany(tarifa, { constraints: false });
tarifa.belongsTo(ruta, { constraints: false });

transporte.hasMany(tarifa, { constraints: false });
tarifa.belongsTo(transporte, { constraints: false });

lugarTuristico.hasMany(tarifa, { constraints: false });
tarifa.belongsTo(lugarTuristico, { constraints: false });

// RELACIONES ADICIONALES
usuario.hasMany(conductor, { foreignKey: 'idUser', constraints: false });
conductor.belongsTo(usuario, { foreignKey: 'idUser', constraints: false });

// RELACIONES ACCESIBILIDAD (OPENBLIND)
cliente.hasMany(lugarFavorito, { foreignKey: 'idCliente', onDelete: 'CASCADE' });
lugarFavorito.belongsTo(cliente, { foreignKey: 'idCliente' });

cliente.hasMany(contactoEmergencia, { foreignKey: 'idCliente', onDelete: 'CASCADE' });
contactoEmergencia.belongsTo(cliente, { foreignKey: 'idCliente' });

// ==================== EXPORTAR MODELOS ====================
module.exports = {
  // Autenticación y permisos
  usuario,
  rol,
  detalleRol,
  page,

  // Transporte
  categoriaTransporte,
  transporte,
  empresaTransporte,
  conductor,

  // Estaciones
  estacion,
  categoriaEstacion,
  metodoIngreso,
  estacionMetodo,

  // Rutas
  ruta,
  rutaEstacion,
  horario,

  // Lugares
  categoriaLugar,
  lugarTuristico,

  // Comunicación
  tipoMensaje,
  mensaje,
  guiaVoz,
  idioma,

  // Evaluación
  calificacion,
  tarifa,
  cliente,

  // Accesibilidad (OpenBlind)
  lugarFavorito,
  contactoEmergencia,

  // Instancia de Sequelize (para queries directas)
  sequelize
};
