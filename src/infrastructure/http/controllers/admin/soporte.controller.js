const TicketSoporte = require('../../../../domain/models/sql/admin/ticketSoporte');

const soporteController = {};

// GET - Listar todos los tickets
soporteController.getAll = async (req, res) => {
  try {
    const tickets = await TicketSoporte.findAll({
      where: { activo: true },
      order: [['prioridad', 'DESC'], ['fecha', 'DESC']]
    });

    res.json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tickets',
      error: error.message
    });
  }
};

// GET - Obtener un ticket por ID
soporteController.getById = async (req, res) => {
  try {
    const ticket = await TicketSoporte.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ticket',
      error: error.message
    });
  }
};

// PUT - Actualizar ticket (solo estado y respuesta)
soporteController.update = async (req, res) => {
  try {
    const ticket = await TicketSoporte.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.update(req.body);

    res.json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ticket',
      error: error.message
    });
  }
};

// DELETE - Archivar ticket
soporteController.delete = async (req, res) => {
  try {
    const ticket = await TicketSoporte.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket no encontrado'
      });
    }

    await ticket.update({ activo: false });

    res.json({
      success: true,
      message: 'Ticket archivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al archivar ticket',
      error: error.message
    });
  }
};

module.exports = soporteController;
