const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const TicketSoporte = sequelize.define('TicketSoporte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asunto: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usuario: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_proceso', 'resuelto', 'cerrado'),
    defaultValue: 'pendiente'
  },
  prioridad: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    defaultValue: 'media'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tickets_soporte',
  timestamps: true
});

module.exports = TicketSoporte;
