/**
 * Exporta la conexión de Sequelize para los modelos SQL
 *
 * Este archivo actúa como un puente entre los modelos (domain)
 * y la configuración de base de datos (infrastructure)
 */

const { sequelize } = require('../../infrastructure/database/connection/dataBase.orm');

module.exports = sequelize;
