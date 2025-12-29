// src/infrastructure/http/router/zonaSegura.router.js
const express = require('express');
const router = express.Router();

const {
    getAll,
    getById,
    create,
    update,
    remove
} = require('../controllers/zonaSegura.controller');

// ===== RUTAS PARA ZONAS SEGURAS =====
// GET todas las zonas seguras
router.get('/', getAll);

// GET zona segura por ID
router.get('/:id', getById);

// POST crear nueva zona segura
router.post('/', create);

// PUT actualizar zona segura
router.put('/:id', update);

// DELETE eliminar zona segura
router.delete('/:id', remove);

module.exports = router;