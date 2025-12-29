const express = require('express');
const router = express.Router();

const {
    create,
    getByUserId,
    update,
    updateField,
    reset,
    delete: deleteConfig,
    restore
} = require('../controllers/configuracion.controller');

// ═══════════════════════════════════════════════════
// RUTAS CRUD DE CONFIGURACIÓN (Usuario final, NO admin)
// ═══════════════════════════════════════════════════

// GET /api/configuracion/:userId - Obtener configuración de un usuario
// GET /api/configuracion - Obtener config general o del usuario actual
router.get('/', async (req, res) => {
  try {
    // Opción 1: Devuelve configuración por defecto
    const configDefault = {
      idCard: {
        fields: [],
        qrConfig: {
          includePhoto: true,
          includeEmergencyContacts: true,
          includeMedicalInfo: true,
          includeBloodType: true,
          includeAllergies: true,
          expirationDays: 365
        }
      },
      notifications: {
        channels: [
          { channel: 'push', enabled: true, types: { /* ... */ } },
          { channel: 'email', enabled: true, types: { /* ... */ } },
          { channel: 'sms', enabled: false, types: { /* ... */ } }
        ],
        templates: [],
        legalText: ''
      }
    };
    
    return res.json(configDefault);
    
    // Opción 2: Usa un userId por defecto (ej: 1)
    // return await getByUserId(req, res);
  } catch (error) {
    console.error('Error en GET /api/configuracion:', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/configuracion - Crear configuración inicial
router.post('/', create);

// PUT /api/configuracion/:userId - Actualizar configuración completa
router.put('/:userId', update);

// PATCH /api/configuracion/:userId/field - Actualizar solo un campo
router.patch('/:userId/field', updateField);

// POST /api/configuracion/:userId/reset - Resetear a valores por defecto
router.post('/:userId/reset', reset);

// DELETE /api/configuracion/:userId - Eliminar configuración (borrado lógico)
router.delete('/:userId', deleteConfig);

// POST /api/configuracion/:userId/restore - Restaurar configuración eliminada
router.post('/:userId/restore', restore);

module.exports = router;
