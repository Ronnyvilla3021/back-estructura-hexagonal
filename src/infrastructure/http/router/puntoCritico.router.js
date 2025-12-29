// src/infrastructure/http/router/puntoCritico.router.js
const express = require('express');
const router = express.Router();

const {
    getAll,
    getById,
    create,
    update,
    remove
} = require('../controllers/puntoCritico.controller');

// ===== RUTAS PARA PUNTOS CRÍTICOS =====
// GET todos los puntos críticos
router.get('/', getAll);

// GET punto crítico por ID
router.get('/:id', getById);

// POST crear nuevo punto crítico
router.post('/', create);

// PUT actualizar punto crítico
router.put('/:id', update);

// DELETE eliminar punto crítico
router.delete('/:id', remove);

module.exports = router;