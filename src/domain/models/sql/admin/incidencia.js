const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');

const Incidencia = sequelize.define('Incidencia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  zona: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('accesibilidad', 'señalización', 'infraestructura', 'otro'),
    defaultValue: 'accesibilidad'
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_revision', 'resuelta', 'descartada'),
    defaultValue: 'pendiente'
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
  tableName: 'incidencias',
  timestamps: true
});

module.exports = Incidencia;
