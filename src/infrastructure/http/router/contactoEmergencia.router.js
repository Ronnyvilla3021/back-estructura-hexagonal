const express = require('express');
const router = express.Router();

const {
    obtenerContactos,
    obtenerContacto,
    crearContacto,
    actualizarContacto,
    eliminarContacto,
    // Nuevos métodos para front externo
    getAllContactos,
    createContacto,
    updateContacto,
    removeContacto
} = require('../controllers/contactoEmergencia.controller');

// ===== RUTAS PARA FRONT EXTERNO (REST estándar) =====
// GET todos los contactos (sin cliente específico)
router.get('/', getAllContactos);

// POST crear contacto
router.post('/', createContacto);

// PUT actualizar contacto
router.put('/:id', updateContacto);

// DELETE eliminar contacto
router.delete('/:id', removeContacto);

// ===== RUTAS ORIGINALES (mantener compatibilidad) =====
// Obtener todos los contactos de emergencia de un cliente
router.get('/cliente/:idCliente', obtenerContactos);

// Obtener un contacto específico
router.get('/contacto/:id', obtenerContacto);

// Crear nuevo contacto de emergencia
router.post('/crear', crearContacto);

// Actualizar un contacto de emergencia
router.put('/actualizar/:id', actualizarContacto);

// Eliminar un contacto de emergencia
router.delete('/eliminar/:id', eliminarContacto);

module.exports = router;
