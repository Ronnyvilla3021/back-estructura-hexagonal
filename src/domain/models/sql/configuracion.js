const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modelo de Configuración de Usuario
 *
 * Almacena las preferencias globales del usuario para:
 * - Accesibilidad (fuente, tema, idioma, voz)
 * - Navegación (longitud ruta, paradas, frecuencia)
 * - Privacidad (retención ubicaciones, tracking)
 */

const Configuracion = sequelize.define('Configuracion', {
    // ═══════════════════════════════════════════════════
    // IDENTIFICADORES
    // ═══════════════════════════════════════════════════
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario (FK a tabla usuario)'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN DE ACCESIBILIDAD
    // ═══════════════════════════════════════════════════
    tamanoFuente: {
        type: DataTypes.ENUM('small', 'medium', 'large', 'extra-large'),
        defaultValue: 'medium',
        allowNull: false,
        comment: 'Tamaño de fuente global'
    },

    temaContraste: {
        type: DataTypes.ENUM('normal', 'alto-contraste'),
        defaultValue: 'normal',
        allowNull: false,
        comment: 'Tema de contraste visual'
    },

    idioma: {
        type: DataTypes.STRING(5),
        defaultValue: 'es',
        allowNull: false,
        comment: 'Idioma de la aplicación (es, en)'
    },

    velocidadVoz: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 1.0,
        allowNull: false,
        validate: {
            min: 0.5,
            max: 2.0
        },
        comment: 'Velocidad de síntesis de voz (0.5 - 2.0)'
    },

    volumenVoz: {
        type: DataTypes.INTEGER,
        defaultValue: 80,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        },
        comment: 'Volumen de síntesis de voz (0-100)'
    },

    feedbackHaptico: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Activar/desactivar vibraciones'
    },

    nivelDetalle: {
        type: DataTypes.ENUM('basico', 'completo', 'experto'),
        defaultValue: 'completo',
        allowNull: false,
        comment: 'Nivel de detalle de instrucciones de voz'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN DE NAVEGACIÓN
    // ═══════════════════════════════════════════════════
    longitudMaxima: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false,
        validate: {
            min: 1,
            max: 50
        },
        comment: 'Longitud máxima de ruta en kilómetros (1-50)'
    },

    paradaSegura: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Sugerir paradas seguras durante navegación'
    },

    frecuenciaInstrucciones: {
        type: DataTypes.ENUM('baja', 'media', 'alta'),
        defaultValue: 'media',
        allowNull: false,
        comment: 'Frecuencia de instrucciones de navegación'
    },

    tipoInstruccion: {
        type: DataTypes.ENUM('distancia', 'tiempo'),
        defaultValue: 'distancia',
        allowNull: false,
        comment: 'Tipo de instrucción (por distancia o por tiempo)'
    },

    alertaDesvio: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Alertar cuando el usuario se desvía de la ruta'
    },

    alertaObstaculo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Alertar sobre obstáculos en el camino'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN DE PRIVACIDAD
    // ═══════════════════════════════════════════════════
    retencionUbicacion: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
        allowNull: false,
        validate: {
            isIn: [[7, 14, 30, 90]]
        },
        comment: 'Días de retención de historial de ubicaciones'
    },

    trackingBackground: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Permitir tracking en segundo plano'
    },

    compartirUbicacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Permitir compartir ubicación con contactos'
    },

    guardarHistorial: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Guardar historial de rutas y ubicaciones'
    },

    permitirAnonimo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Modo anónimo (no guardar datos)'
    },

    // ═══════════════════════════════════════════════════
    // METADATOS Y BORRADO LÓGICO
    // ═══════════════════════════════════════════════════
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Borrado lógico: true = activo, false = eliminado'
    },

    ultimaActualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        comment: 'Última vez que se modificó la configuración'
    },

    fechaEliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Fecha de borrado lógico (si activo = false)'
    }
}, {
    tableName: 'configuracion',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
        {
            unique: true,
            fields: ['userId'],
            name: 'idx_configuracion_userId'
        }
    ],
    comment: 'Configuración global de usuario (accesibilidad, navegación, privacidad)'
});

module.exports = Configuracion;
