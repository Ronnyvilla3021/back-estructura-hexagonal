const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

/**
 * Modelo de Configuración Global del Sistema (Admin)
 *
 * Define los valores POR DEFECTO que heredan todos los usuarios nuevos:
 * - Accesibilidad (fuente, tema, idioma, voz)
 * - Navegación (longitud ruta, paradas, frecuencia)
 * - Privacidad (retención ubicaciones, tracking)
 *
 * Solo existe UN registro (id=1) que el administrador puede modificar.
 * Los usuarios nuevos heredan estos valores al crear su cuenta.
 */

const ConfiguracionGlobal = sequelize.define('ConfiguracionGlobal', {
    // ═══════════════════════════════════════════════════
    // IDENTIFICADOR
    // ═══════════════════════════════════════════════════
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único (siempre será 1 para configuración global)'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN GLOBAL DE ACCESIBILIDAD
    // Valores por defecto que heredan todos los usuarios
    // ═══════════════════════════════════════════════════
    tamanoFuente: {
        type: DataTypes.ENUM('small', 'medium', 'large', 'extra-large'),
        defaultValue: 'medium',
        allowNull: false,
        comment: 'Tamaño de fuente por defecto para nuevos usuarios'
    },

    temaContraste: {
        type: DataTypes.ENUM('normal', 'alto-contraste'),
        defaultValue: 'normal',
        allowNull: false,
        comment: 'Tema de contraste visual por defecto'
    },

    idioma: {
        type: DataTypes.STRING(5),
        defaultValue: 'es',
        allowNull: false,
        comment: 'Idioma de la aplicación por defecto (es, en)'
    },

    velocidadVoz: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 1.0,
        allowNull: false,
        validate: {
            min: 0.5,
            max: 2.0
        },
        comment: 'Velocidad de síntesis de voz por defecto (0.5 - 2.0)'
    },

    volumenVoz: {
        type: DataTypes.INTEGER,
        defaultValue: 80,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        },
        comment: 'Volumen de síntesis de voz por defecto (0-100)'
    },

    feedbackHaptico: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Activar/desactivar vibraciones por defecto'
    },

    nivelDetalle: {
        type: DataTypes.ENUM('basico', 'completo', 'experto'),
        defaultValue: 'completo',
        allowNull: false,
        comment: 'Nivel de detalle de instrucciones de voz por defecto'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN GLOBAL DE NAVEGACIÓN
    // Preferencias globales para rutas y navegación
    // ═══════════════════════════════════════════════════
    longitudMaxima: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
        allowNull: false,
        validate: {
            min: 1,
            max: 50
        },
        comment: 'Longitud máxima de ruta por defecto en kilómetros (1-50)'
    },

    paradaSegura: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Criterio para sugerir paradas seguras durante navegación'
    },

    frecuenciaInstrucciones: {
        type: DataTypes.ENUM('baja', 'media', 'alta'),
        defaultValue: 'media',
        allowNull: false,
        comment: 'Frecuencia de instrucciones de navegación por defecto'
    },

    tipoInstruccion: {
        type: DataTypes.ENUM('distancia', 'tiempo'),
        defaultValue: 'distancia',
        allowNull: false,
        comment: 'Tipo de instrucción por defecto (por metro o por tiempo)'
    },

    alertaDesvio: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Alertar cuando el usuario se desvía de la ruta (por defecto)'
    },

    alertaObstaculo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Alertar sobre obstáculos en el camino (por defecto)'
    },

    // ═══════════════════════════════════════════════════
    // CONFIGURACIÓN GLOBAL DE PRIVACIDAD Y GEOLOCALIZACIÓN
    // Políticas globales de retención y tracking
    // ═══════════════════════════════════════════════════
    retencionUbicacion: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
        allowNull: false,
        validate: {
            isIn: [[7, 14, 30, 90]]
        },
        comment: 'Política de retención de historial de ubicaciones (días)'
    },

    trackingBackground: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Permitir tracking en segundo plano (política global)'
    },

    compartirUbicacion: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Permitir compartir ubicación con contactos (por defecto)'
    },

    guardarHistorial: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: 'Guardar historial de rutas y ubicaciones (política global)'
    },

    permitirAnonimo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Modo anónimo disponible (no guardar datos)'
    },

    // ═══════════════════════════════════════════════════
    // CONTROL DE OPCIONES MODIFICABLES POR USUARIO
    // Define qué configuraciones pueden cambiar los usuarios
    // ═══════════════════════════════════════════════════
    opcionesModificables: {
        type: DataTypes.JSON,
        defaultValue: {
            accesibilidad: {
                tamanoFuente: true,
                temaContraste: true,
                idioma: true,
                velocidadVoz: true,
                volumenVoz: true,
                feedbackHaptico: true,
                nivelDetalle: true
            },
            navegacion: {
                longitudMaxima: true,
                paradaSegura: false, // Admin controla esto
                frecuenciaInstrucciones: true,
                tipoInstruccion: true,
                alertaDesvio: false, // Admin controla esto
                alertaObstaculo: false // Admin controla esto
            },
            privacidad: {
                retencionUbicacion: false, // Política fija
                trackingBackground: true,
                compartirUbicacion: true,
                guardarHistorial: true,
                permitirAnonimo: false // Admin controla esto
            }
        },
        allowNull: false,
        comment: 'Define qué opciones el usuario puede modificar y cuáles son fijas'
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
        comment: 'Última vez que el admin modificó la configuración'
    },

    fechaEliminacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        comment: 'Fecha de borrado lógico (si activo = false)'
    },

    modificadoPor: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'admin',
        comment: 'Usuario admin que realizó la última modificación'
    }
}, {
    tableName: 'configuracion_global',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    comment: 'Configuración global del sistema (Admin) - valores por defecto para todos los usuarios'
});

/**
 * Hook para asegurar que solo exista un registro (id=1)
 */
ConfiguracionGlobal.beforeCreate(async (configuracion) => {
    const count = await ConfiguracionGlobal.count();
    if (count > 0) {
        throw new Error('Solo puede existir un registro de configuración global (id=1)');
    }
    configuracion.id = 1;
});

/**
 * Método estático para obtener o crear la configuración global
 */
ConfiguracionGlobal.getOrCreate = async () => {
    let config = await ConfiguracionGlobal.findByPk(1, {
        where: { activo: true }
    });

    if (!config) {
        config = await ConfiguracionGlobal.create({
            id: 1,
            modificadoPor: 'system'
        });
    }

    return config;
};

module.exports = ConfiguracionGlobal;
