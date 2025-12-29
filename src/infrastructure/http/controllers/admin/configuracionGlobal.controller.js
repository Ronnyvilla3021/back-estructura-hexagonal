const ConfiguracionGlobal = require('../../../../domain/models/sql/configuracionGlobal');

/**
 * Controlador para Configuración Global del Sistema (Admin)
 *
 * Maneja las preferencias globales que heredan todos los usuarios nuevos.
 * Solo existe UN registro (id=1) en la base de datos.
 */

const configuracionGlobalController = {};

/**
 * GET /api/admin/configuracion
 * Obtiene la configuración global del sistema
 */
configuracionGlobalController.get = async (req, res) => {
    try {
        // Obtener o crear la configuración global (siempre id=1)
        const config = await ConfiguracionGlobal.getOrCreate();

        return res.status(200).json({
            success: true,
            message: 'Configuración global obtenida exitosamente',
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al obtener configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener configuración global',
            error: error.message
        });
    }
};

/**
 * PUT /api/admin/configuracion
 * Actualiza toda la configuración global
 * Body: { accesibilidad: {...}, navegacion: {...}, privacidad: {...} }
 */
configuracionGlobalController.update = async (req, res) => {
    try {
        const updates = req.body;
        const { modificadoPor = 'admin' } = req.body;

        // Obtener configuración global
        const config = await ConfiguracionGlobal.getOrCreate();

        // Mapear las secciones a campos del modelo
        const updateData = {
            // Accesibilidad
            ...(updates.accesibilidad && {
                tamanoFuente: updates.accesibilidad.tamanoFuente,
                temaContraste: updates.accesibilidad.temaContraste,
                idioma: updates.accesibilidad.idioma,
                velocidadVoz: updates.accesibilidad.velocidadVoz,
                volumenVoz: updates.accesibilidad.volumenVoz,
                feedbackHaptico: updates.accesibilidad.feedbackHaptico,
                nivelDetalle: updates.accesibilidad.nivelDetalle
            }),
            // Navegación
            ...(updates.navegacion && {
                longitudMaxima: updates.navegacion.longitudMaxima,
                paradaSegura: updates.navegacion.paradaSegura,
                frecuenciaInstrucciones: updates.navegacion.frecuenciaInstrucciones,
                tipoInstruccion: updates.navegacion.tipoInstruccion,
                alertaDesvio: updates.navegacion.alertaDesvio,
                alertaObstaculo: updates.navegacion.alertaObstaculo
            }),
            // Privacidad
            ...(updates.privacidad && {
                retencionUbicacion: updates.privacidad.retencionUbicacion,
                trackingBackground: updates.privacidad.trackingBackground,
                compartirUbicacion: updates.privacidad.compartirUbicacion,
                guardarHistorial: updates.privacidad.guardarHistorial,
                permitirAnonimo: updates.privacidad.permitirAnonimo
            }),
            // Opciones modificables
            ...(updates.opcionesModificables && {
                opcionesModificables: updates.opcionesModificables
            }),
            // Metadata
            ultimaActualizacion: new Date(),
            modificadoPor
        };

        // Actualizar configuración
        await config.update(updateData);

        return res.status(200).json({
            success: true,
            message: 'Configuración global actualizada exitosamente',
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al actualizar configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar configuración global',
            error: error.message
        });
    }
};

/**
 * PATCH /api/admin/configuracion/field
 * Actualiza un solo campo de la configuración global
 * Body: { field: 'tamanoFuente', value: 'large' }
 */
configuracionGlobalController.updateField = async (req, res) => {
    try {
        const { field, value, modificadoPor = 'admin' } = req.body;

        if (!field || value === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere "field" y "value" en el body'
            });
        }

        // Obtener configuración global
        const config = await ConfiguracionGlobal.getOrCreate();

        // Validar que el campo existe en el modelo
        const allowedFields = [
            'tamanoFuente', 'temaContraste', 'idioma', 'velocidadVoz', 'volumenVoz',
            'feedbackHaptico', 'nivelDetalle', 'longitudMaxima', 'paradaSegura',
            'frecuenciaInstrucciones', 'tipoInstruccion', 'alertaDesvio', 'alertaObstaculo',
            'retencionUbicacion', 'trackingBackground', 'compartirUbicacion',
            'guardarHistorial', 'permitirAnonimo', 'opcionesModificables'
        ];

        if (!allowedFields.includes(field)) {
            return res.status(400).json({
                success: false,
                message: `Campo "${field}" no es válido. Campos permitidos: ${allowedFields.join(', ')}`
            });
        }

        // Actualizar el campo
        await config.update({
            [field]: value,
            ultimaActualizacion: new Date(),
            modificadoPor
        });

        return res.status(200).json({
            success: true,
            message: `Campo "${field}" actualizado exitosamente`,
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al actualizar campo:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar campo',
            error: error.message
        });
    }
};

/**
 * POST /api/admin/configuracion/reset
 * Resetea la configuración global a valores por defecto
 */
configuracionGlobalController.reset = async (req, res) => {
    try {
        const { modificadoPor = 'admin' } = req.body;

        // Obtener configuración global
        const config = await ConfiguracionGlobal.getOrCreate();

        // Valores por defecto (deben coincidir con el modelo)
        const defaults = {
            // Accesibilidad
            tamanoFuente: 'medium',
            temaContraste: 'normal',
            idioma: 'es',
            velocidadVoz: 1.0,
            volumenVoz: 80,
            feedbackHaptico: true,
            nivelDetalle: 'completo',
            // Navegación
            longitudMaxima: 10,
            paradaSegura: true,
            frecuenciaInstrucciones: 'media',
            tipoInstruccion: 'distancia',
            alertaDesvio: true,
            alertaObstaculo: true,
            // Privacidad
            retencionUbicacion: 30,
            trackingBackground: false,
            compartirUbicacion: true,
            guardarHistorial: true,
            permitirAnonimo: false,
            // Opciones modificables (por defecto todo modificable excepto políticas críticas)
            opcionesModificables: {
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
                    paradaSegura: false,
                    frecuenciaInstrucciones: true,
                    tipoInstruccion: true,
                    alertaDesvio: false,
                    alertaObstaculo: false
                },
                privacidad: {
                    retencionUbicacion: false,
                    trackingBackground: true,
                    compartirUbicacion: true,
                    guardarHistorial: true,
                    permitirAnonimo: false
                }
            },
            // Metadata
            ultimaActualizacion: new Date(),
            modificadoPor
        };

        await config.update(defaults);

        return res.status(200).json({
            success: true,
            message: 'Configuración global reseteada a valores por defecto',
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al resetear configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al resetear configuración global',
            error: error.message
        });
    }
};

/**
 * DELETE /api/admin/configuracion
 * Soft delete de la configuración global (marca como inactiva)
 */
configuracionGlobalController.delete = async (req, res) => {
    try {
        const { modificadoPor = 'admin' } = req.body;

        // Obtener configuración global
        const config = await ConfiguracionGlobal.getOrCreate();

        // SOFT DELETE: Marcar como inactiva
        await config.update({
            activo: false,
            fechaEliminacion: new Date(),
            modificadoPor
        });

        return res.status(200).json({
            success: true,
            message: 'Configuración global desactivada exitosamente (soft delete)',
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al eliminar configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar configuración global',
            error: error.message
        });
    }
};

/**
 * POST /api/admin/configuracion/restore
 * Restaura una configuración global eliminada (soft delete)
 */
configuracionGlobalController.restore = async (req, res) => {
    try {
        const { modificadoPor = 'admin' } = req.body;

        // Buscar configuración (incluso si está inactiva)
        const config = await ConfiguracionGlobal.findByPk(1);

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'Configuración global no encontrada'
            });
        }

        // Restaurar
        await config.update({
            activo: true,
            fechaEliminacion: null,
            ultimaActualizacion: new Date(),
            modificadoPor
        });

        return res.status(200).json({
            success: true,
            message: 'Configuración global restaurada exitosamente',
            data: config
        });
    } catch (error) {
        console.error('[ConfigGlobal] Error al restaurar configuración:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al restaurar configuración global',
            error: error.message
        });
    }
};

module.exports = configuracionGlobalController;
