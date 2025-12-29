// src/infrastructure/http/router/configuracion.router.js - VERSIÓN CORREGIDA
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

// GET /api/configuracion - Obtener configuración
router.get('/', async (req, res) => {
  try {
    const configDefault = {
      idCard: {
        fields: [
          { id: '1', name: 'fullName', label: 'Nombre Completo', required: true, visible: true, order: 1 },
          { id: '2', name: 'email', label: 'Email', required: true, visible: true, order: 2 },
          { id: '3', name: 'phone', label: 'Teléfono', required: false, visible: true, order: 3 },
        ],
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
          { 
            channel: 'push', 
            enabled: true, 
            types: {
              route_start: true,
              route_end: true,
              safety_alert: true,
              support_message: true,
              emergency: true
            }
          },
          { 
            channel: 'email', 
            enabled: true, 
            types: {
              route_start: false,
              route_end: false,
              safety_alert: false,
              support_message: true,
              emergency: true
            }
          },
          { 
            channel: 'sms', 
            enabled: false, 
            types: {
              route_start: false,
              route_end: false,
              safety_alert: false,
              support_message: false,
              emergency: true
            }
          }
        ],
        templates: [
          {
            type: 'route_start',
            subject: 'Inicio de Ruta - OpenBlind',
            body: 'Hola {{userName}}, has iniciado tu ruta hacia {{destination}}.',
            variables: ['userName', 'destination', 'timestamp']
          },
          {
            type: 'route_end',
            subject: 'Ruta Finalizada - OpenBlind',
            body: 'Hola {{userName}}, has finalizado tu ruta exitosamente.',
            variables: ['userName', 'destination', 'timestamp']
          },
          {
            type: 'safety_alert',
            subject: 'Alerta de Seguridad - OpenBlind',
            body: 'Alerta: Se ha detectado una situación de riesgo en {{location}}.',
            variables: ['userName', 'location', 'alertType', 'timestamp']
          },
          {
            type: 'support_message',
            subject: 'Mensaje de Soporte - OpenBlind',
            body: 'Hola {{userName}}, hemos recibido tu mensaje. Te responderemos pronto.',
            variables: ['userName', 'ticketId', 'timestamp']
          },
          {
            type: 'emergency',
            subject: 'EMERGENCIA - OpenBlind',
            body: 'EMERGENCIA: {{userName}} ha activado una alerta de emergencia en {{location}}.',
            variables: ['userName', 'location', 'contacts', 'timestamp']
          }
        ],
        legalText: 'Este mensaje fue enviado por OpenBlind. Para dejar de recibir notificaciones, actualiza tus preferencias en la aplicación.'
      }
    };
    
    return res.json(configDefault);
  } catch (error) {
    console.error('Error en GET /api/configuracion:', error);
    return res.status(500).json({ error: error.message });
  }
});

// ⭐ NUEVOS ENDPOINTS PARA ACTUALIZAR
// PUT /api/configuracion/tarjeta-id/actualizar
router.put('/tarjeta-id/actualizar', async (req, res) => {
  try {
    const { idCard } = req.body;
    
    console.log('📤 Actualizando Tarjeta ID:', idCard);

    // Por ahora, solo devolver éxito (sin guardar en BD)
    return res.json({
      success: true,
      message: 'Configuración de Tarjeta ID actualizada (mock)',
      data: { idCard }
    });
  } catch (error) {
    console.error('Error actualizando Tarjeta ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar Tarjeta ID',
      error: error.message
    });
  }
});

// PUT /api/configuracion/notificaciones/actualizar
router.put('/notificaciones/actualizar', async (req, res) => {
  try {
    const { notifications } = req.body;
    
    console.log('📤 Actualizando Notificaciones:', notifications);

    // Por ahora, solo devolver éxito (sin guardar en BD)
    return res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada (mock)',
      data: { notifications }
    });
  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar notificaciones',
      error: error.message
    });
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