// ==========================================
// ARCHIVO: src/infrastructure/http/router/lugarTuristico.router.js
// ==========================================
const express = require('express');
const router = express.Router();

const { 
    mostrarLugares, 
    crearLugar, 
    actualizarLugar, 
    eliminarLugar,
    obtenerLugar,
    buscarPorCategoria,
    buscarPorUbicacion,
    agregarResena,
    mostrarZonasSeguras, 
    mostrarPuntosCriticos,
    crearZonaSegura,       
    crearPuntoCritico
} = require('../controllers/lugarTuristico.controller');

// =================== LUGARES TURÍSTICOS ===================
router.get('/lista', mostrarLugares);
router.get('/obtener/:id', obtenerLugar);
router.get('/categoria/:idCategoria', buscarPorCategoria);
router.get('/buscar-ubicacion', buscarPorUbicacion);
router.post('/crear', crearLugar);
router.post('/resena/:id', agregarResena);
router.put('/actualizar/:id', actualizarLugar);
router.delete('/eliminar/:id', eliminarLugar);

// =================== ZONAS SEGURAS ===================
router.get('/zonas-seguras', mostrarZonasSeguras);
router.post('/zonas-seguras/crear', crearZonaSegura);

// ⭐ NUEVOS ENDPOINTS PARA ACTUALIZAR Y ELIMINAR
router.put('/zonas-seguras/actualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreLugar, coordenadas, radio, descripcion } = req.body;

    if (!nombreLugar) {
      return res.status(400).json({ 
        message: 'Nombre es requerido' 
      });
    }

    // Actualizar en SQL
    const { cifrarDatos } = require('../../../application/encrypDates');
    await require('../../database/connection/dataBase.sql').promise().query(
      `UPDATE lugaresTuristicos SET 
        nombreLugar = ?, 
        updateLugar = ? 
       WHERE idLugarTuristico = ?`,
      [
        cifrarDatos(nombreLugar),
        new Date().toLocaleString(),
        id
      ]
    );

    // Actualizar en MongoDB
    const mongo = require('../../database/connection/dataBaseMongose');
    await mongo.lugarTuristicoModel.updateOne(
      { idLugarSql: id },
      {
        $set: {
          descripcionLugar: descripcion || '',
          ubicacionLugar: coordenadas || {},
          radio: radio || 100
        }
      }
    );

    return res.json({ 
      success: true,
      message: 'Zona segura actualizada exitosamente' 
    });

  } catch (error) {
    console.error('Error al actualizar zona segura:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar', 
      error: error.message 
    });
  }
});

router.delete('/zonas-seguras/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await require('../../database/connection/dataBase.sql').promise().query(
      `UPDATE lugaresTuristicos SET 
        estadoLugar = 'inactivo', 
        updateLugar = ? 
       WHERE idLugarTuristico = ?`,
      [new Date().toLocaleString(), id]
    );

    return res.json({ 
      success: true,
      message: 'Zona segura eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar zona segura:', error);
    return res.status(500).json({ 
      message: 'Error al eliminar', 
      error: error.message 
    });
  }
});

// =================== PUNTOS CRÍTICOS ===================
router.get('/puntos-criticos', mostrarPuntosCriticos);
router.post('/puntos-criticos/crear', crearPuntoCritico);

// ⭐ NUEVOS ENDPOINTS PARA ACTUALIZAR Y ELIMINAR
router.put('/puntos-criticos/actualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreLugar, coordenadas, nivelRiesgo, descripcion } = req.body;

    if (!nombreLugar) {
      return res.status(400).json({ 
        message: 'Nombre es requerido' 
      });
    }

    // Actualizar en SQL
    const { cifrarDatos } = require('../../../application/encrypDates');
    await require('../../database/connection/dataBase.sql').promise().query(
      `UPDATE lugaresTuristicos SET 
        nombreLugar = ?, 
        updateLugar = ? 
       WHERE idLugarTuristico = ?`,
      [
        cifrarDatos(nombreLugar),
        new Date().toLocaleString(),
        id
      ]
    );

    // Actualizar en MongoDB
    const mongo = require('../../database/connection/dataBaseMongose');
    await mongo.lugarTuristicoModel.updateOne(
      { idLugarSql: id },
      {
        $set: {
          descripcionLugar: descripcion || '',
          ubicacionLugar: coordenadas || {},
          nivelRiesgo: nivelRiesgo || 'medio'
        }
      }
    );

    return res.json({ 
      success: true,
      message: 'Punto crítico actualizado exitosamente' 
    });

  } catch (error) {
    console.error('Error al actualizar punto crítico:', error);
    return res.status(500).json({ 
      message: 'Error al actualizar', 
      error: error.message 
    });
  }
});

router.delete('/puntos-criticos/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await require('../../database/connection/dataBase.sql').promise().query(
      `UPDATE lugaresTuristicos SET 
        estadoLugar = 'inactivo', 
        updateLugar = ? 
       WHERE idLugarTuristico = ?`,
      [new Date().toLocaleString(), id]
    );

    return res.json({ 
      success: true,
      message: 'Punto crítico eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar punto crítico:', error);
    return res.status(500).json({ 
      message: 'Error al eliminar', 
      error: error.message 
    });
  }
});

module.exports = router;