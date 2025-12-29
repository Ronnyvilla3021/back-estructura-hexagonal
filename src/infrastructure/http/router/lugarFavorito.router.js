const express = require('express');
const router = express.Router();

const {
    obtenerLugares,
    obtenerLugar,
    crearLugar,
    actualizarLugar,
    eliminarLugar,
    // Nuevos métodos para front externo
    getAllLugares,
    createLugar,
    updateLugar,
    removeLugar
} = require('../controllers/lugarFavorito.controller');

// ===== RUTAS PARA FRONT EXTERNO (REST estándar) =====
// GET todos los lugares (sin cliente específico)
router.get('/', getAllLugares);

// POST crear lugar
router.post('/', createLugar);

// PUT actualizar lugar
router.put('/:id', updateLugar);

// DELETE eliminar lugar
router.delete('/:id', removeLugar);

// ===== RUTAS ORIGINALES (mantener compatibilidad) =====
// Obtener todos los lugares favoritos de un cliente
router.get('/cliente/:idCliente', obtenerLugares);

// Obtener un lugar favorito específico
router.get('/lugar/:id', obtenerLugar);

// Crear nuevo lugar favorito
router.post('/crear', crearLugar);

// Actualizar un lugar favorito
router.put('/actualizar/:id', actualizarLugar);

// Eliminar un lugar favorito
router.delete('/eliminar/:id', eliminarLugar);

module.exports = router;
