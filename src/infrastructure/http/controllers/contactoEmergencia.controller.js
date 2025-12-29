const contactoEmergenciaCtl = {};
const sql = require('../../database/connection/dataBase.sql');

// Función auxiliar para asegurar que el cliente existe
async function asegurarClienteExiste(idCliente) {
    try {
        // Verificar si el cliente existe
        const [cliente] = await sql.promise().query(
            'SELECT idClientes FROM clientes WHERE idClientes = ?',
            [idCliente]
        );

        // Si no existe, crearlo
        if (cliente.length === 0) {
            await sql.promise().query(
                'INSERT INTO clientes (idClientes) VALUES (?)',
                [idCliente]
            );
            console.log(`Cliente ${idCliente} creado automáticamente`);
        }
    } catch (error) {
        console.error('Error al asegurar cliente:', error);
        throw error;
    }
}

// Mostrar todos los contactos de emergencia de un cliente
contactoEmergenciaCtl.obtenerContactos = async (req, res) => {
    try {
        const { idCliente } = req.params;

        const [contactos] = await sql.promise().query(
            'SELECT * FROM contactos_emergencia WHERE idCliente = ? ORDER BY prioridad ASC, createContactoEmergencia DESC',
            [idCliente]
        );

        return res.json(contactos);
    } catch (error) {
        console.error('Error al obtener contactos de emergencia:', error);
        return res.status(500).json({
            message: 'Error al obtener contactos de emergencia',
            error: error.message
        });
    }
};

// Obtener un contacto específico
contactoEmergenciaCtl.obtenerContacto = async (req, res) => {
    try {
        const { id } = req.params;

        const [contacto] = await sql.promise().query(
            'SELECT * FROM contactos_emergencia WHERE idContactoEmergencia = ?',
            [id]
        );

        if (contacto.length === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }

        return res.json(contacto[0]);
    } catch (error) {
        console.error('Error al obtener contacto:', error);
        return res.status(500).json({
            message: 'Error al obtener contacto',
            error: error.message
        });
    }
};

// Crear nuevo contacto de emergencia
contactoEmergenciaCtl.crearContacto = async (req, res) => {
    try {
        const { idCliente, nombreContacto, telefono, relacion, prioridad } = req.body;

        if (!idCliente || !nombreContacto || !telefono) {
            return res.status(400).json({
                message: 'idCliente, nombreContacto y telefono son obligatorios'
            });
        }

        // Asegurar que el cliente existe antes de insertar
        await asegurarClienteExiste(idCliente);

        const [result] = await sql.promise().query(
            `INSERT INTO contactos_emergencia
            (idCliente, nombreContacto, telefono, relacion, prioridad, createContactoEmergencia, updateContactoEmergencia)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [idCliente, nombreContacto, telefono, relacion || '', prioridad || 1]
        );

        return res.status(201).json({
            message: 'Contacto de emergencia creado exitosamente',
            idContactoEmergencia: result.insertId
        });

    } catch (error) {
        console.error('Error al crear contacto de emergencia:', error);
        return res.status(500).json({
            message: 'Error al crear contacto de emergencia',
            error: error.message
        });
    }
};

// Actualizar contacto de emergencia
contactoEmergenciaCtl.actualizarContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreContacto, telefono, relacion, prioridad } = req.body;

        if (!nombreContacto || !telefono) {
            return res.status(400).json({
                message: 'nombreContacto y telefono son obligatorios'
            });
        }

        const [result] = await sql.promise().query(
            `UPDATE contactos_emergencia SET
                nombreContacto = ?,
                telefono = ?,
                relacion = ?,
                prioridad = ?,
                updateContactoEmergencia = NOW()
            WHERE idContactoEmergencia = ?`,
            [nombreContacto, telefono, relacion || '', prioridad || 1, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }

        return res.json({ message: 'Contacto actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar contacto:', error);
        return res.status(500).json({
            message: 'Error al actualizar contacto',
            error: error.message
        });
    }
};

// Eliminar contacto de emergencia
contactoEmergenciaCtl.eliminarContacto = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await sql.promise().query(
            'DELETE FROM contactos_emergencia WHERE idContactoEmergencia = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }

        return res.json({ message: 'Contacto eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        return res.status(500).json({
            message: 'Error al eliminar contacto',
            error: error.message
        });
    }
};

// ===== MÉTODOS PARA FRONT EXTERNO (REST estándar con apiResponse) =====

// GET todos los contactos
contactoEmergenciaCtl.getAllContactos = async (req, res) => {
    try {
        const ID_CLIENTE = 1;

        const [contactos] = await sql.promise().query(
            'SELECT idContactoEmergencia as id_contacto, nombreContacto as nombre, telefono, relacion, prioridad FROM contactos_emergencia WHERE idCliente = ? ORDER BY prioridad ASC',
            [ID_CLIENTE]
        );

        return res.apiResponse(contactos);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        return res.apiError('Error al obtener contactos', 500, error.message);
    }
};

// POST crear contacto
contactoEmergenciaCtl.createContacto = async (req, res) => {
    try {
        const { nombre, telefono, relacion, prioridad } = req.body;
        const ID_CLIENTE = 1;

        if (!nombre || !telefono) {
            return res.apiError('Nombre y teléfono son obligatorios', 400);
        }

        // Asegurar que el cliente existe
        await asegurarClienteExiste(ID_CLIENTE);

        const [result] = await sql.promise().query(
            `INSERT INTO contactos_emergencia
            (idCliente, nombreContacto, telefono, relacion, prioridad, createContactoEmergencia, updateContactoEmergencia)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [ID_CLIENTE, nombre, telefono, relacion || '', prioridad || 1]
        );

        const nuevoContacto = {
            id_contacto: result.insertId,
            nombre,
            telefono,
            relacion,
            prioridad: prioridad || 1
        };

        return res.apiResponse(nuevoContacto, 201, 'Contacto creado');
    } catch (error) {
        console.error('Error al crear contacto:', error);
        return res.apiError('Error al crear contacto', 500, error.message);
    }
};

// PUT actualizar contacto
contactoEmergenciaCtl.updateContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, relacion, prioridad } = req.body;

        if (!nombre || !telefono) {
            return res.apiError('Nombre y teléfono son obligatorios', 400);
        }

        const [result] = await sql.promise().query(
            `UPDATE contactos_emergencia SET
                nombreContacto = ?,
                telefono = ?,
                relacion = ?,
                prioridad = ?,
                updateContactoEmergencia = NOW()
            WHERE idContactoEmergencia = ?`,
            [nombre, telefono, relacion || '', prioridad || 1, id]
        );

        if (result.affectedRows === 0) {
            return res.apiError('Contacto no encontrado', 404);
        }

        const contactoActualizado = {
            id_contacto: id,
            nombre,
            telefono,
            relacion,
            prioridad: prioridad || 1
        };

        return res.apiResponse(contactoActualizado, 200, 'Contacto actualizado');
    } catch (error) {
        console.error('Error al actualizar contacto:', error);
        return res.apiError('Error al actualizar contacto', 500, error.message);
    }
};

// DELETE eliminar contacto
contactoEmergenciaCtl.removeContacto = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await sql.promise().query(
            'DELETE FROM contactos_emergencia WHERE idContactoEmergencia = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.apiError('Contacto no encontrado', 404);
        }

        return res.apiResponse(null, 200, 'Contacto eliminado');
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        return res.apiError('Error al eliminar contacto', 500, error.message);
    }
};

module.exports = contactoEmergenciaCtl;
