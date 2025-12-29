const Configuracion = require('../../../domain/models/sql/configuracion');

/**
 * CONTROLLER: CONFIGURACIÓN
 *
 * CRUD completo para configuración de usuario:
 * - CREATE: Crear configuración inicial (al registrarse)
 * - READ: Obtener configuración actual del usuario
 * - UPDATE: Actualizar valores de configuración
 * - DELETE/RESET: Resetear a valores por defecto
 */

const configuracionController = {};

// ═══════════════════════════════════════════════════
// CREATE: Crear configuración inicial
// ═══════════════════════════════════════════════════
configuracionController.create = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        // Verificar si ya existe configuración para este usuario
        const existente = await Configuracion.findOne({ where: { userId } });
        if (existente) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya tiene configuración creada',
                data: existente
            });
        }

        // Crear con valores por defecto o los proporcionados
        const nuevaConfig = await Configuracion.create({
            userId,
            ...req.body // Permite sobrescribir valores por defecto
        });

        res.status(201).json({
            success: true,
            message: 'Configuración creada exitosamente',
            data: nuevaConfig
        });

    } catch (error) {
        console.error('Error creando configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear configuración',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// READ: Obtener configuración del usuario (solo activas)
// ═══════════════════════════════════════════════════
configuracionController.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        let config = await Configuracion.findOne({
            where: {
                userId,
                activo: true // Solo configuraciones activas (no eliminadas)
            }
        });

        // Si no existe (o fue eliminada lógicamente), crear con valores por defecto
        if (!config) {
            config = await Configuracion.create({
                userId,
                activo: true
            });
        }

        res.json({
            success: true,
            data: config
        });

    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener configuración',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// UPDATE: Actualizar configuración
// ═══════════════════════════════════════════════════
configuracionController.update = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        let config = await Configuracion.findOne({ where: { userId } });

        // Si no existe, crear primero
        if (!config) {
            config = await Configuracion.create({
                userId,
                ...req.body
            });

            return res.json({
                success: true,
                message: 'Configuración creada y actualizada',
                data: config
            });
        }

        // Actualizar campos proporcionados
        await config.update({
            ...req.body,
            ultimaActualizacion: new Date()
        });

        res.json({
            success: true,
            message: 'Configuración actualizada exitosamente',
            data: config
        });

    } catch (error) {
        console.error('Error actualizando configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar configuración',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// UPDATE PARTIAL: Actualizar solo un campo
// ═══════════════════════════════════════════════════
configuracionController.updateField = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);
        const { field, value } = req.body;

        if (!userId || !field || value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'userId, field y value son requeridos'
            });
        }

        let config = await Configuracion.findOne({ where: { userId } });

        if (!config) {
            config = await Configuracion.create({ userId });
        }

        // Actualizar solo el campo específico
        await config.update({
            [field]: value,
            ultimaActualizacion: new Date()
        });

        res.json({
            success: true,
            message: `Campo ${field} actualizado exitosamente`,
            data: config
        });

    } catch (error) {
        console.error('Error actualizando campo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar campo',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// RESET: Resetear a valores por defecto
// ═══════════════════════════════════════════════════
configuracionController.reset = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);
        const { tipo } = req.body; // 'accesibilidad', 'navegacion', 'privacidad', o 'todo'

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        let config = await Configuracion.findOne({ where: { userId } });

        if (!config) {
            config = await Configuracion.create({ userId });
            return res.json({
                success: true,
                message: 'Configuración creada con valores por defecto',
                data: config
            });
        }

        // Valores por defecto por tipo
        const defaults = {
            accesibilidad: {
                tamanoFuente: 'medium',
                temaContraste: 'normal',
                idioma: 'es',
                velocidadVoz: 1.0,
                volumenVoz: 80,
                feedbackHaptico: true,
                nivelDetalle: 'completo'
            },
            navegacion: {
                longitudMaxima: 10,
                paradaSegura: true,
                frecuenciaInstrucciones: 'media',
                tipoInstruccion: 'distancia',
                alertaDesvio: true,
                alertaObstaculo: true
            },
            privacidad: {
                retencionUbicacion: 30,
                trackingBackground: false,
                compartirUbicacion: true,
                guardarHistorial: true,
                permitirAnonimo: false
            }
        };

        // Determinar qué resetear
        let updateData = {};
        if (tipo === 'todo' || !tipo) {
            updateData = { ...defaults.accesibilidad, ...defaults.navegacion, ...defaults.privacidad };
        } else if (defaults[tipo]) {
            updateData = defaults[tipo];
        } else {
            return res.status(400).json({
                success: false,
                message: 'Tipo inválido. Usa: accesibilidad, navegacion, privacidad, o todo'
            });
        }

        await config.update({
            ...updateData,
            ultimaActualizacion: new Date()
        });

        res.json({
            success: true,
            message: `Configuración de ${tipo || 'todo'} reseteada exitosamente`,
            data: config
        });

    } catch (error) {
        console.error('Error reseteando configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al resetear configuración',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// DELETE: Eliminar configuración (BORRADO LÓGICO)
// ═══════════════════════════════════════════════════
configuracionController.delete = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        const config = await Configuracion.findOne({
            where: {
                userId,
                activo: true // Solo buscar configuraciones activas
            }
        });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuración no encontrada o ya eliminada'
            });
        }

        // BORRADO LÓGICO: Marcar como inactivo en lugar de eliminar
        await config.update({
            activo: false,
            fechaEliminacion: new Date()
        });

        res.json({
            success: true,
            message: 'Configuración eliminada exitosamente (borrado lógico)',
            data: {
                userId: config.userId,
                eliminadoEn: config.fechaEliminacion
            }
        });

    } catch (error) {
        console.error('Error eliminando configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar configuración',
            error: error.message
        });
    }
};

// ═══════════════════════════════════════════════════
// RESTORE: Restaurar configuración eliminada (recuperar)
// ═══════════════════════════════════════════════════
configuracionController.restore = async (req, res) => {
    try {
        const userId = req.params.userId || (req.user ? req.user.id : null);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'userId es requerido'
            });
        }

        const config = await Configuracion.findOne({
            where: {
                userId,
                activo: false // Buscar eliminadas
            }
        });

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'No hay configuración eliminada para restaurar'
            });
        }

        // Restaurar: marcar como activo nuevamente
        await config.update({
            activo: true,
            fechaEliminacion: null
        });

        res.json({
            success: true,
            message: 'Configuración restaurada exitosamente',
            data: config
        });

    } catch (error) {
        console.error('Error restaurando configuración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al restaurar configuración',
            error: error.message
        });
    }
};

module.exports = configuracionController;
