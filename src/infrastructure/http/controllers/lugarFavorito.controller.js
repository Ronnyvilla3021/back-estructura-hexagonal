const lugarFavoritoCtl = {};
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

// Mostrar todos los lugares favoritos de un cliente
lugarFavoritoCtl.obtenerLugares = async (req, res) => {
    try {
        const { idCliente } = req.params;

        const [lugares] = await sql.promise().query(
            'SELECT * FROM lugares_favoritos WHERE idCliente = ? ORDER BY createLugarFavorito DESC',
            [idCliente]
        );

        return res.json(lugares);
    } catch (error) {
        console.error('Error al obtener lugares favoritos:', error);
        return res.status(500).json({
            message: 'Error al obtener lugares favoritos',
            error: error.message
        });
    }
};

// Obtener un lugar favorito específico
lugarFavoritoCtl.obtenerLugar = async (req, res) => {
    try {
        const { id } = req.params;

        const [lugar] = await sql.promise().query(
            'SELECT * FROM lugares_favoritos WHERE idLugarFavorito = ?',
            [id]
        );

        if (lugar.length === 0) {
            return res.status(404).json({ message: 'Lugar no encontrado' });
        }

        return res.json(lugar[0]);
    } catch (error) {
        console.error('Error al obtener lugar:', error);
        return res.status(500).json({
            message: 'Error al obtener lugar',
            error: error.message
        });
    }
};

// Crear nuevo lugar favorito
lugarFavoritoCtl.crearLugar = async (req, res) => {
    try {
        const { idCliente, nombreLugar, direccion, latitud, longitud, icono } = req.body;

        if (!idCliente || !nombreLugar || !direccion) {
            return res.status(400).json({
                message: 'idCliente, nombreLugar y direccion son obligatorios'
            });
        }

        // Asegurar que el cliente existe antes de insertar
        await asegurarClienteExiste(idCliente);

        const [result] = await sql.promise().query(
            `INSERT INTO lugares_favoritos
            (idCliente, nombreLugar, direccion, latitud, longitud, icono, createLugarFavorito, updateLugarFavorito)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [idCliente, nombreLugar, direccion, latitud || null, longitud || null, icono || 'place']
        );

        return res.status(201).json({
            message: 'Lugar favorito creado exitosamente',
            idLugarFavorito: result.insertId
        });

    } catch (error) {
        console.error('Error al crear lugar favorito:', error);
        return res.status(500).json({
            message: 'Error al crear lugar favorito',
            error: error.message
        });
    }
};

// Actualizar lugar favorito
lugarFavoritoCtl.actualizarLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreLugar, direccion, latitud, longitud, icono } = req.body;

        if (!nombreLugar || !direccion) {
            return res.status(400).json({
                message: 'nombreLugar y direccion son obligatorios'
            });
        }

        const [result] = await sql.promise().query(
            `UPDATE lugares_favoritos SET
                nombreLugar = ?,
                direccion = ?,
                latitud = ?,
                longitud = ?,
                icono = ?,
                updateLugarFavorito = NOW()
            WHERE idLugarFavorito = ?`,
            [nombreLugar, direccion, latitud || null, longitud || null, icono || 'place', id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Lugar no encontrado' });
        }

        return res.json({ message: 'Lugar actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar lugar:', error);
        return res.status(500).json({
            message: 'Error al actualizar lugar',
            error: error.message
        });
    }
};

// Eliminar lugar favorito
lugarFavoritoCtl.eliminarLugar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await sql.promise().query(
            'DELETE FROM lugares_favoritos WHERE idLugarFavorito = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Lugar no encontrado' });
        }

        return res.json({ message: 'Lugar eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar lugar:', error);
        return res.status(500).json({
            message: 'Error al eliminar lugar',
            error: error.message
        });
    }
};

// ===== MÉTODOS PARA FRONT EXTERNO (REST estándar con apiResponse) =====

// GET todos los lugares
lugarFavoritoCtl.getAllLugares = async (req, res) => {
    try {
        // Por defecto, obtenemos del ID_CLIENTE = 1
        const ID_CLIENTE = 1;

        const [lugares] = await sql.promise().query(
            'SELECT idLugarFavorito as id_lugar, nombreLugar as nombre, direccion, latitud, longitud, icono FROM lugares_favoritos WHERE idCliente = ? ORDER BY createLugarFavorito DESC',
            [ID_CLIENTE]
        );

        return res.apiResponse(lugares);
    } catch (error) {
        console.error('Error al obtener lugares:', error);
        return res.apiError('Error al obtener lugares favoritos', 500, error.message);
    }
};

// POST crear lugar
lugarFavoritoCtl.createLugar = async (req, res) => {
    try {
        const { nombre, direccion, icono, latitud, longitud } = req.body;
        const ID_CLIENTE = 1;

        if (!nombre || !direccion) {
            return res.apiError('Nombre y dirección son obligatorios', 400);
        }

        // Asegurar que el cliente existe
        await asegurarClienteExiste(ID_CLIENTE);

        const [result] = await sql.promise().query(
            `INSERT INTO lugares_favoritos
            (idCliente, nombreLugar, direccion, latitud, longitud, icono, createLugarFavorito, updateLugarFavorito)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [ID_CLIENTE, nombre, direccion, latitud || null, longitud || null, icono || 'place']
        );

        const nuevoLugar = {
            id_lugar: result.insertId,
            nombre,
            direccion,
            latitud,
            longitud,
            icono: icono || 'place'
        };

        return res.apiResponse(nuevoLugar, 201, 'Lugar favorito creado');
    } catch (error) {
        console.error('Error al crear lugar:', error);
        return res.apiError('Error al crear lugar favorito', 500, error.message);
    }
};

// PUT actualizar lugar
lugarFavoritoCtl.updateLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, icono, latitud, longitud } = req.body;

        if (!nombre || !direccion) {
            return res.apiError('Nombre y dirección son obligatorios', 400);
        }

        const [result] = await sql.promise().query(
            `UPDATE lugares_favoritos SET
                nombreLugar = ?,
                direccion = ?,
                latitud = ?,
                longitud = ?,
                icono = ?,
                updateLugarFavorito = NOW()
            WHERE idLugarFavorito = ?`,
            [nombre, direccion, latitud || null, longitud || null, icono || 'place', id]
        );

        if (result.affectedRows === 0) {
            return res.apiError('Lugar no encontrado', 404);
        }

        const lugarActualizado = {
            id_lugar: id,
            nombre,
            direccion,
            latitud,
            longitud,
            icono: icono || 'place'
        };

        return res.apiResponse(lugarActualizado, 200, 'Lugar favorito actualizado');
    } catch (error) {
        console.error('Error al actualizar lugar:', error);
        return res.apiError('Error al actualizar lugar favorito', 500, error.message);
    }
};

// DELETE eliminar lugar
lugarFavoritoCtl.removeLugar = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await sql.promise().query(
            'DELETE FROM lugares_favoritos WHERE idLugarFavorito = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.apiError('Lugar no encontrado', 404);
        }

        return res.apiResponse(null, 200, 'Lugar favorito eliminado');
    } catch (error) {
        console.error('Error al eliminar lugar:', error);
        return res.apiError('Error al eliminar lugar favorito', 500, error.message);
    }
};

module.exports = lugarFavoritoCtl;
