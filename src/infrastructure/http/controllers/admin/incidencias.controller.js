const Incidencia = require('../../../../domain/models/sql/admin/incidencia');

const incidenciasController = {};

// GET - Listar todas las incidencias
incidenciasController.getAll = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll({
      where: { activo: true },
      order: [['fecha', 'DESC']]
    });

    res.json({
      success: true,
      data: incidencias
    });
  } catch (error) {
    console.error('Error obteniendo incidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener incidencias',
      error: error.message
    });
  }
};

// GET - Obtener una incidencia por ID
incidenciasController.getById = async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    res.json({
      success: true,
      data: incidencia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener incidencia',
      error: error.message
    });
  }
};

// POST - Crear nueva incidencia
incidenciasController.create = async (req, res) => {
  try {
    const nuevaIncidencia = await Incidencia.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Incidencia creada exitosamente',
      data: nuevaIncidencia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear incidencia',
      error: error.message
    });
  }
};

// PUT - Actualizar incidencia
incidenciasController.update = async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    await incidencia.update(req.body);

    res.json({
      success: true,
      message: 'Incidencia actualizada exitosamente',
      data: incidencia
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar incidencia',
      error: error.message
    });
  }
};

// DELETE - Eliminar incidencia (borrado lógico)
incidenciasController.delete = async (req, res) => {
  try {
    const incidencia = await Incidencia.findByPk(req.params.id);

    if (!incidencia) {
      return res.status(404).json({
        success: false,
        message: 'Incidencia no encontrada'
      });
    }

    await incidencia.update({ activo: false });

    res.json({
      success: true,
      message: 'Incidencia eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar incidencia',
      error: error.message
    });
  }
};

module.exports = incidenciasController;
