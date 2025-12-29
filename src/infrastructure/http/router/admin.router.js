const express = require('express');
const router = express.Router();

const configuracionGlobalController = require('../controllers/admin/configuracionGlobal.controller');
const metricasController = require('../controllers/admin/metricas.controller');
const incidenciasController = require('../controllers/admin/incidencias.controller');
const soporteController = require('../controllers/admin/soporte.controller');

/**
 * Router de Módulo Admin
 *
 * Agrupa todas las rutas del panel de administración:
 * - Configuración Global del Sistema
 * - Métricas y Dashboard
 * - Gestión de Incidencias (MALDONADO DELGADO DAVID ALEJANDRO)
 * - Gestión de Soporte (MALDONADO DELGADO DAVID ALEJANDRO)
 *
 * MOPOSITA PILATAXI JOSSELYN PAMELA (N°5)
 * MALDONADO DELGADO DAVID ALEJANDRO (N°5)
 */

// ═══════════════════════════════════════════════════
// CONFIGURACIÓN GLOBAL DEL SISTEMA
// ═══════════════════════════════════════════════════

/**
 * GET /api/admin/configuracion
 * Obtiene la configuración global (valores por defecto del sistema)
 */
router.get('/configuracion', configuracionGlobalController.get);

/**
 * PUT /api/admin/configuracion
 * Actualiza toda la configuración global
 * Body: { accesibilidad: {...}, navegacion: {...}, privacidad: {...} }
 */
router.put('/configuracion', configuracionGlobalController.update);

/**
 * PATCH /api/admin/configuracion/field
 * Actualiza un solo campo de la configuración
 * Body: { field: 'tamanoFuente', value: 'large' }
 */
router.patch('/configuracion/field', configuracionGlobalController.updateField);

/**
 * POST /api/admin/configuracion/reset
 * Resetea la configuración a valores por defecto
 */
router.post('/configuracion/reset', configuracionGlobalController.reset);

/**
 * DELETE /api/admin/configuracion
 * Soft delete de la configuración global
 */
router.delete('/configuracion', configuracionGlobalController.delete);

/**
 * POST /api/admin/configuracion/restore
 * Restaura configuración eliminada (soft delete)
 */
router.post('/configuracion/restore', configuracionGlobalController.restore);

// ═══════════════════════════════════════════════════
// MÉTRICAS Y DASHBOARD
// ═══════════════════════════════════════════════════

/**
 * GET /api/admin/metricas/resumen
 * Resumen general con todas las métricas principales
 */
router.get('/metricas/resumen', metricasController.getResumen);

/**
 * GET /api/admin/metricas/usuarios
 * Métricas detalladas de usuarios activos, nuevos, etc.
 */
router.get('/metricas/usuarios', metricasController.getUsuarios);

/**
 * GET /api/admin/metricas/rutas
 * Métricas de rutas generadas, por día, zonas populares, etc.
 * Query params: ?periodo=dia|semana|mes
 */
router.get('/metricas/rutas', metricasController.getRutas);

/**
 * GET /api/admin/metricas/incidencias
 * Métricas de incidencias reportadas, resueltas, etc.
 */
router.get('/metricas/incidencias', metricasController.getIncidencias);

/**
 * GET /api/admin/metricas/uso-modulos
 * Estadísticas de uso de módulos (navegación, tarjeta, contactos)
 */
router.get('/metricas/uso-modulos', metricasController.getUsoModulos);

// ═══════════════════════════════════════════════════
// GESTIÓN DE INCIDENCIAS (David Maldonado)
// ═══════════════════════════════════════════════════

/** GET /api/admin/incidencias - Listar todas las incidencias */
router.get('/incidencias', incidenciasController.getAll);

/** GET /api/admin/incidencias/:id - Obtener incidencia por ID */
router.get('/incidencias/:id', incidenciasController.getById);

/** POST /api/admin/incidencias - Crear nueva incidencia */
router.post('/incidencias', incidenciasController.create);

/** PUT /api/admin/incidencias/:id - Actualizar incidencia */
router.put('/incidencias/:id', incidenciasController.update);

/** DELETE /api/admin/incidencias/:id - Eliminar incidencia */
router.delete('/incidencias/:id', incidenciasController.delete);

// ═══════════════════════════════════════════════════
// GESTIÓN DE SOPORTE (David Maldonado)
// ═══════════════════════════════════════════════════

/** GET /api/admin/soporte - Listar todos los tickets */
router.get('/soporte', soporteController.getAll);

/** GET /api/admin/soporte/:id - Obtener ticket por ID */
router.get('/soporte/:id', soporteController.getById);

/** PUT /api/admin/soporte/:id - Actualizar ticket */
router.put('/soporte/:id', soporteController.update);

/** DELETE /api/admin/soporte/:id - Archivar ticket */
router.delete('/soporte/:id', soporteController.delete);

module.exports = router;
