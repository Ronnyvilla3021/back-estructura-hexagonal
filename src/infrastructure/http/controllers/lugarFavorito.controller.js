// src/infrastructure/http/controllers/lugarFavorito.controller.js - VERSIÓN CORREGIDA
const lugarFavoritoCtl = {};
const sql = require('../../database/connection/dataBase.sql');

// ===== MÉTODOS PARA FRONT EXTERNO (REST estándar con apiResponse) =====

// GET todos los lugares
lugarFavoritoCtl.getAllLugares = async (req, res) => {
    try {
        const ID_CLIENTE = 1; // Cliente por defecto

        const [lugares] = await sql.promise().query(
            'SELECT * FROM lugares_favoritos WHERE idCliente = ? ORDER BY createLugarFavorito DESC',
            [ID_CLIENTE]
        );

        return res.json({
            success: true,
            message: '',
            data: lugares
        });
    } catch (error) {
        console.error('Error al obtener lugares:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al obtener lugares favoritos', 
            error: error.message 
        });
    }
};

// POST crear lugar - ⭐ CORREGIDO PARA ACEPTAR EL FORMATO DEL FRONTEND
lugarFavoritoCtl.createLugar = async (req, res) => {
    try {
        const { nombre, coordenadas, estado, userId } = req.body;
        
        console.log('📥 Datos recibidos:', req.body);

        if (!nombre || !coordenadas) {
            return res.status(400).json({ 
                success: false,
                message: 'Nombre y coordenadas son obligatorios' 
            });
        }

        const ID_CLIENTE = userId || 1; // Usar userId del frontend o 1 por defecto

        // Asegurar que el cliente existe
        const [cliente] = await sql.promise().query(
            'SELECT idClientes FROM clientes WHERE idClientes = ?',
            [ID_CLIENTE]
        );

        if (cliente.length === 0) {
            await sql.promise().query(
                'INSERT INTO clientes (idClientes) VALUES (?)',
                [ID_CLIENTE]
            );
        }

        // Insertar lugar favorito
        const [result] = await sql.promise().query(
            `INSERT INTO lugares_favoritos
            (idCliente, nombreLugar, direccion, latitud, longitud, icono, createLugarFavorito, updateLugarFavorito)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                ID_CLIENTE, 
                nombre, 
                '', // direccion vacía
                coordenadas.lat || 0, 
                coordenadas.lng || 0, 
                'place'
            ]
        );

        const nuevoLugar = {
            idLugarFavorito: result.insertId,
            idCliente: ID_CLIENTE,
            nombreLugar: nombre,
            direccion: '',
            latitud: coordenadas.lat || 0,
            longitud: coordenadas.lng || 0,
            icono: 'place'
        };

        return res.status(201).json({
            success: true,
            message: 'Lugar favorito creado',
            data: nuevoLugar
        });
    } catch (error) {
        console.error('❌ Error al crear lugar:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al crear lugar favorito', 
            error: error.message 
        });
    }
};

// PUT actualizar lugar
lugarFavoritoCtl.updateLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, coordenadas } = req.body;

        if (!nombre || !coordenadas) {
            return res.status(400).json({ 
                success: false,
                message: 'Nombre y coordenadas son obligatorios' 
            });
        }

        const [result] = await sql.promise().query(
            `UPDATE lugares_favoritos SET
                nombreLugar = ?,
                latitud = ?,
                longitud = ?,
                updateLugarFavorito = NOW()
            WHERE idLugarFavorito = ?`,
            [nombre, coordenadas.lat || 0, coordenadas.lng || 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Lugar no encontrado' 
            });
        }

        return res.json({
            success: true,
            message: 'Lugar favorito actualizado',
            data: { id, nombre, coordenadas }
        });
    } catch (error) {
        console.error('Error al actualizar lugar:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al actualizar lugar favorito', 
            error: error.message 
        });
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
            return res.status(404).json({ 
                success: false,
                message: 'Lugar no encontrado' 
            });
        }

        return res.json({
            success: true,
            message: 'Lugar favorito eliminado'
        });
    } catch (error) {
        console.error('Error al eliminar lugar:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al eliminar lugar favorito', 
            error: error.message 
        });
    }
};

// ===== MANTENER MÉTODOS ORIGINALES (compatibilidad) =====
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

lugarFavoritoCtl.crearLugar = async (req, res) => {
    try {
        const { idCliente, nombreLugar, direccion, latitud, longitud, icono } = req.body;
        if (!idCliente || !nombreLugar || !direccion) {
            return res.status(400).json({
                message: 'idCliente, nombreLugar y direccion son obligatorios'
            });
        }
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

module.exports = lugarFavoritoCtl;