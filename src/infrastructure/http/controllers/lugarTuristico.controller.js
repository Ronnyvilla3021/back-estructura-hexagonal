// src/infrastructure/http/controllers/lugarTuristico.controller.js
const lugarTuristicoCtl = {};
const orm = require('../../database/connection/dataBase.orm');
const sql = require('../../database/connection/dataBase.sql');
const mongo = require('../../database/connection/dataBaseMongose');
const { cifrarDatos, descifrarDatos } = require('../../../application/encrypDates');

// Función para descifrar de forma segura
const descifrarSeguro = (dato) => {
  try {
    return dato ? descifrarDatos(dato) : '';
  } catch (error) {
    console.error('Error al descifrar:', error);
    return '';
  }
};

// ⭐ NUEVA: Función auxiliar para asegurar que una categoría exista (auto-creación)
const asegurarCategoria = async (nombreCategoria, descripcion) => {
    try {
        // Verificar si la categoría existe
        const [categorias] = await sql.promise().query(
            'SELECT idCategoriaLugar FROM categoriasLugars WHERE nombreCategoriaLugar = ?',
            [nombreCategoria]
        );

        if (categorias.length > 0) {
            console.log(`✅ Categoría "${nombreCategoria}" ya existe (ID: ${categorias[0].idCategoriaLugar})`);
            return categorias[0].idCategoriaLugar;
        }

        // Si no existe, crearla automáticamente
        const [result] = await sql.promise().query(
            'INSERT INTO categoriasLugars (nombreCategoriaLugar, descripcionCategoriaLugar, estadoCategoriaLugar, createCategoriaLugar) VALUES (?, ?, "activo", ?)',
            [nombreCategoria, descripcion, new Date().toLocaleString()]
        );

        console.log(`✅ Categoría "${nombreCategoria}" creada automáticamente con ID: ${result.insertId}`);
        return result.insertId;

    } catch (error) {
        console.error(`❌ Error al crear categoría "${nombreCategoria}":`, error);
        throw error;
    }
};

// ⭐ NUEVA: Función para inicializar categorías al arrancar la app (opcional)
lugarTuristicoCtl.inicializarCategorias = async () => {
    try {
        console.log('🔄 Inicializando categorías necesarias...');
        
        const categoriasNecesarias = [
            { nombre: 'zona_segura', descripcion: 'Zonas consideradas seguras para personas con discapacidad visual' },
            { nombre: 'punto_critico', descripcion: 'Puntos críticos que requieren atención especial' },
        ];
        
        for (const categoria of categoriasNecesarias) {
            const id = await asegurarCategoria(categoria.nombre, categoria.descripcion);
            console.log(`   📍 ${categoria.nombre}: ID ${id}`);
        }
        
        console.log('✅ Todas las categorías están listas');
        return true;
        
    } catch (error) {
        console.error('❌ Error al inicializar categorías:', error);
        return false;
    }
};

// Mostrar todos los lugares turísticos activos
lugarTuristicoCtl.mostrarLugares = async (req, res) => {
    try {
        // ⚠️ CORREGIR: Cambiar 'categoriaLugarIdCategoriaLugar' por 'categoriasLugarIdCategoriaLugar'
        const [listaLugares] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar, e.nombreEstacion
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            LEFT JOIN estaciones e ON lt.estacioneIdEstacion = e.idEstacion
            WHERE lt.estadoLugar = "activo"
        `);
        
        const lugaresCompletos = await Promise.all(
            listaLugares.map(async (lugar) => {
                const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
                    idLugarSql: lugar.idLugarTuristico 
                });

                const [calificacionPromedio] = await sql.promise().query(`
                    SELECT AVG(puntajeCalificacion) as promedio, COUNT(*) as total
                    FROM calificaciones 
                    WHERE lugarTuristicoIdLugarTuristico = ? AND estadoCalificacion = "activo"
                `, [lugar.idLugarTuristico]);

                return {
                    ...lugar,
                    nombreLugar: descifrarSeguro(lugar.nombreLugar),
                    codigoLugar: descifrarSeguro(lugar.codigoLugar),
                    nombreEstacion: descifrarSeguro(lugar.nombreEstacion),
                    calificacion: {
                        promedio: calificacionPromedio[0].promedio || 0,
                        totalCalificaciones: calificacionPromedio[0].total || 0
                    },
                    detallesMongo: lugarMongo ? {
                        descripcion: lugarMongo.descripcionLugar,
                        ubicacion: lugarMongo.ubicacionLugar,
                        referencias: lugarMongo.referenciasLugar,
                        imagenes: lugarMongo.imagenesLugar,
                        videos: lugarMongo.videosLugar,
                        horarios: lugarMongo.horariosLugar,
                        tarifas: lugarMongo.tarifasLugar,
                        servicios: lugarMongo.serviciosLugar,
                        contacto: lugarMongo.contactoLugar
                    } : null
                };
            })
        );

        return res.json(lugaresCompletos);
    } catch (error) {
        console.error('Error al mostrar lugares turísticos:', error);
        return res.status(500).json({ message: 'Error al obtener los lugares', error: error.message });
    }
};

// Crear nuevo lugar turístico
lugarTuristicoCtl.crearLugar = async (req, res) => {
    try {
        const { 
            nombreLugar, codigoLugar, categoriaLugarId, estacionId, usuarioRegistraId,
            descripcion, ubicacion, referencias, imagenes, videos, horarios, 
            tarifas, servicios, contacto
        } = req.body;

        if (!nombreLugar) {
            return res.status(400).json({ message: 'Nombre del lugar es obligatorio' });
        }

        const nuevoLugar = await orm.lugarTuristico.create({
            nombreLugar: cifrarDatos(nombreLugar),
            codigoLugar: cifrarDatos(codigoLugar || ''),
            estadoLugar: 'activo',
            categoriasLugarIdCategoriaLugar: categoriaLugarId, // ⚠️ CORREGIDO: con "s"
            estacioneIdEstacion: estacionId, // ⚠️ NOTA: Así está en tu tabla
            idUser: usuarioRegistraId, // ⚠️ CORREGIDO: según tu estructura
            createLugar: new Date().toLocaleString(),
        });

        if (descripcion || ubicacion || referencias || imagenes || videos || horarios || tarifas || servicios || contacto) {
            await mongo.lugarTuristicoModel.create({
                descripcionLugar: descripcion || '',
                ubicacionLugar: ubicacion || {},
                referenciasLugar: referencias || [],
                imagenesLugar: imagenes || [],
                videosLugar: videos || [],
                horariosLugar: horarios || [],
                tarifasLugar: tarifas || {},
                serviciosLugar: servicios || {},
                contactoLugar: contacto || {},
                reseñasLugar: [],
                idLugarSql: nuevoLugar.idLugarTuristico
            });
        }

        return res.status(201).json({ 
            message: 'Lugar turístico creado exitosamente',
            idLugar: nuevoLugar.idLugarTuristico
        });

    } catch (error) {
        console.error('Error al crear lugar turístico:', error);
        return res.status(500).json({ 
            message: 'Error al crear el lugar', 
            error: error.message 
        });
    }
};

// Actualizar lugar turístico
lugarTuristicoCtl.actualizarLugar = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombreLugar, codigoLugar,
            descripcion, ubicacion, referencias, imagenes, videos, horarios, 
            tarifas, servicios, contacto
        } = req.body;

        if (!nombreLugar) {
            return res.status(400).json({ message: 'Nombre del lugar es obligatorio' });
        }

        await sql.promise().query(
            `UPDATE lugaresTuristicos SET 
                nombreLugar = ?, 
                codigoLugar = ?, 
                updateLugar = ? 
             WHERE idLugarTuristico = ?`,
            [
                cifrarDatos(nombreLugar),
                cifrarDatos(codigoLugar || ''),
                new Date().toLocaleString(),
                id
            ]
        );

        if (descripcion || ubicacion || referencias || imagenes || videos || horarios || tarifas || servicios || contacto) {
            await mongo.lugarTuristicoModel.updateOne(
                { idLugarSql: id },
                {
                    $set: {
                        descripcionLugar: descripcion || '',
                        ubicacionLugar: ubicacion || {},
                        referenciasLugar: referencias || [],
                        imagenesLugar: imagenes || [],
                        videosLugar: videos || [],
                        horariosLugar: horarios || [],
                        tarifasLugar: tarifas || {},
                        serviciosLugar: servicios || {},
                        contactoLugar: contacto || {}
                    }
                }
            );
        }

        return res.json({ message: 'Lugar turístico actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar lugar:', error);
        return res.status(500).json({ message: 'Error al actualizar', error: error.message });
    }
};

// Eliminar (desactivar) lugar turístico
lugarTuristicoCtl.eliminarLugar = async (req, res) => {
    try {
        const { id } = req.params;

        await sql.promise().query(
            `UPDATE lugaresTuristicos SET 
                estadoLugar = 'inactivo', 
                updateLugar = ? 
             WHERE idLugarTuristico = ?`,
            [new Date().toLocaleString(), id]
        );

        return res.json({ message: 'Lugar turístico desactivado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar lugar:', error);
        return res.status(500).json({ message: 'Error al desactivar', error: error.message });
    }
};

// Obtener lugar turístico por ID
lugarTuristicoCtl.obtenerLugar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [lugar] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar, e.nombreEstacion
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            LEFT JOIN estaciones e ON lt.estacioneIdEstacion = e.idEstacion
            WHERE lt.idLugarTuristico = ? AND lt.estadoLugar = "activo"
        `, [id]);

        if (lugar.length === 0) {
            return res.status(404).json({ message: 'Lugar turístico no encontrado' });
        }

        const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
            idLugarSql: id 
        });

        const [calificaciones] = await sql.promise().query(`
            SELECT c.*, u.nombreUsuario
            FROM calificaciones c
            LEFT JOIN usuarios u ON c.usuarioIdUsuario = u.idUsuario
            WHERE c.lugarTuristicoIdLugarTuristico = ? AND c.estadoCalificacion = "activo"
            ORDER BY c.createCalificacion DESC
        `, [id]);

        const lugarCompleto = {
            ...lugar[0],
            nombreLugar: descifrarSeguro(lugar[0].nombreLugar),
            codigoLugar: descifrarSeguro(lugar[0].codigoLugar),
            nombreEstacion: descifrarSeguro(lugar[0].nombreEstacion),
            calificaciones: calificaciones.map(cal => ({
                ...cal,
                nombreUsuario: descifrarSeguro(cal.nombreUsuario)
            })),
            detallesMongo: lugarMongo || null
        };

        return res.json(lugarCompleto);
    } catch (error) {
        console.error('Error al obtener lugar:', error);
        return res.status(500).json({ message: 'Error al obtener lugar', error: error.message });
    }
};

// Buscar lugares por categoría
lugarTuristicoCtl.buscarPorCategoria = async (req, res) => {
    try {
        const { idCategoria } = req.params;

        const [lugaresPorCategoria] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar
            FROM lugaresTuristicos lt
            JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            WHERE lt.categoriasLugarIdCategoriaLugar = ? AND lt.estadoLugar = "activo"
        `, [idCategoria]);

        const lugaresCompletos = await Promise.all(
            lugaresPorCategoria.map(async (lugar) => {
                const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
                    idLugarSql: lugar.idLugarTuristico 
                });

                return {
                    ...lugar,
                    nombreLugar: descifrarSeguro(lugar.nombreLugar),
                    detallesMongo: lugarMongo ? {
                        descripcion: lugarMongo.descripcionLugar,
                        ubicacion: lugarMongo.ubicacionLugar,
                        imagenes: lugarMongo.imagenesLugar,
                        tarifas: lugarMongo.tarifasLugar
                    } : null
                };
            })
        );

        return res.json(lugaresCompletos);
    } catch (error) {
        console.error('Error al buscar lugares por categoría:', error);
        return res.status(500).json({ message: 'Error en la búsqueda', error: error.message });
    }
};

// Buscar lugares por ubicación (usando MongoDB)
lugarTuristicoCtl.buscarPorUbicacion = async (req, res) => {
    try {
        const { latitud, longitud, radio = 10000 } = req.query;

        if (!latitud || !longitud) {
            return res.status(400).json({ message: 'Latitud y longitud son requeridas' });
        }

        const lugaresCercanos = await mongo.lugarTuristicoModel.find({
            'ubicacionLugar.latitud': {
                $gte: parseFloat(latitud) - (radio / 111000),
                $lte: parseFloat(latitud) + (radio / 111000)
            },
            'ubicacionLugar.longitud': {
                $gte: parseFloat(longitud) - (radio / 111000),
                $lte: parseFloat(longitud) + (radio / 111000)
            }
        });

        const lugaresCompletos = await Promise.all(
            lugaresCercanos.map(async (lugarMongo) => {
                const [lugarSql] = await sql.promise().query(
                    'SELECT * FROM lugaresTuristicos WHERE idLugarTuristico = ? AND estadoLugar = "activo"',
                    [lugarMongo.idLugarSql]
                );

                if (lugarSql.length > 0) {
                    return {
                        ...lugarSql[0],
                        nombreLugar: descifrarSeguro(lugarSql[0].nombreLugar),
                        detallesMongo: lugarMongo
                    };
                }
                return null;
            })
        );

        const lugaresFiltrados = lugaresCompletos.filter(lugar => lugar !== null);
        return res.json(lugaresFiltrados);
    } catch (error) {
        console.error('Error al buscar lugares por ubicación:', error);
        return res.status(500).json({ message: 'Error en la búsqueda', error: error.message });
    }
};

// ⭐ NUEVA: Mostrar zonas seguras (CON AUTO-CREACIÓN DE CATEGORÍA)
lugarTuristicoCtl.mostrarZonasSeguras = async (req, res) => {
    try {
        console.log('🔍 Obteniendo zonas seguras...');
        
        // 1. Asegurar que la categoría exista (se crea automáticamente si no)
        const categoriaId = await asegurarCategoria(
            'zona_segura',
            'Zonas consideradas seguras para personas con discapacidad visual'
        );
        
        console.log(`✅ Categoría zona_segura lista (ID: ${categoriaId})`);
        
        // 2. Buscar lugares con esa categoría
        const [lugares] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            WHERE lt.categoriasLugarIdCategoriaLugar = ? AND lt.estadoLugar = "activo"
        `, [categoriaId]);

        console.log(`✅ Encontrados ${lugares.length} zonas seguras`);
        
        // 3. Si no hay lugares, devolver array vacío (esto es normal, no es error)
        if (lugares.length === 0) {
            return res.json([]);
        }
        
        // 4. Procesar resultados
        const lugaresCompletos = await Promise.all(
            lugares.map(async (lugar) => {
                const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
                    idLugarSql: lugar.idLugarTuristico 
                });
                
                const ubicacion = lugarMongo?.ubicacionLugar || { lat: 0, lng: 0 };
                
                return {
                    ...lugar,
                    nombreLugar: descifrarSeguro(lugar.nombreLugar),
                    coordenadas: ubicacion, // ⭐ Formato esperado por el frontend
                    radio: lugarMongo?.radio || 100, // ⭐ Radio en metros
                    detallesMongo: lugarMongo
                };
            })
        );
        
        return res.json(lugaresCompletos);
        
    } catch (error) {
        console.error('❌ Error en mostrarZonasSeguras:', error);
        return res.status(500).json({ 
            message: 'Error al obtener zonas seguras', 
            error: error.message 
        });
    }
};

// ⭐ NUEVA: Mostrar puntos críticos (CON AUTO-CREACIÓN DE CATEGORÍA)
lugarTuristicoCtl.mostrarPuntosCriticos = async (req, res) => {
    try {
        console.log('🔍 Obteniendo puntos críticos...');
        
        // 1. Asegurar que la categoría exista (se crea automáticamente si no)
        const categoriaId = await asegurarCategoria(
            'punto_critico',
            'Puntos críticos que requieren atención especial'
        );
        
        console.log(`✅ Categoría punto_critico lista (ID: ${categoriaId})`);
        
        // 2. Buscar lugares con esa categoría
        const [lugares] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            WHERE lt.categoriasLugarIdCategoriaLugar = ? AND lt.estadoLugar = "activo"
        `, [categoriaId]);

        console.log(`✅ Encontrados ${lugares.length} puntos críticos`);
        
        // 3. Si no hay lugares, devolver array vacío (esto es normal, no es error)
        if (lugares.length === 0) {
            return res.json([]);
        }
        
        // 4. Procesar resultados
        const lugaresCompletos = await Promise.all(
            lugares.map(async (lugar) => {
                const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
                    idLugarSql: lugar.idLugarTuristico 
                });
                
                const ubicacion = lugarMongo?.ubicacionLugar || { lat: 0, lng: 0 };
                
                return {
                    ...lugar,
                    nombreLugar: descifrarSeguro(lugar.nombreLugar),
                    coordenadas: ubicacion, // ⭐ Formato esperado por el frontend
                    nivelRiesgo: lugarMongo?.nivelRiesgo || 'medio', // ⭐ Nivel de riesgo
                    detallesMongo: lugarMongo
                };
            })
        );
        
        return res.json(lugaresCompletos);
        
    } catch (error) {
        console.error('❌ Error en mostrarPuntosCriticos:', error);
        return res.status(500).json({ 
            message: 'Error al obtener puntos críticos', 
            error: error.message 
        });
    }
};

// ⭐ NUEVA: Crear zona segura
lugarTuristicoCtl.crearZonaSegura = async (req, res) => {
    try {
        console.log('➕ Creando nueva zona segura...');
        
        const { 
            nombreLugar, 
            coordenadas, 
            radio = 100,
            descripcion 
        } = req.body;

        if (!nombreLugar || !coordenadas) {
            return res.status(400).json({ 
                message: 'Nombre y coordenadas son requeridos' 
            });
        }

        // 1. Asegurar que la categoría exista
        const categoriaId = await asegurarCategoria(
            'zona_segura',
            'Zonas consideradas seguras para personas con discapacidad visual'
        );

        // 2. Crear en SQL
        const [result] = await sql.promise().query(
            `INSERT INTO lugaresTuristicos (
                nombreLugar, 
                codigoLugar, 
                estadoLugar, 
                categoriasLugarIdCategoriaLugar,
                createLugar
            ) VALUES (?, ?, "activo", ?, ?)`,
            [
                cifrarDatos(nombreLugar),
                cifrarDatos(`ZONA-${Date.now()}`), // Código único
                categoriaId,
                new Date().toLocaleString()
            ]
        );

        const nuevoId = result.insertId;
        console.log(`✅ Zona segura creada en SQL (ID: ${nuevoId})`);

        // 3. Crear en MongoDB con datos adicionales
        await mongo.lugarTuristicoModel.create({
            descripcionLugar: descripcion || `Zona segura: ${nombreLugar}`,
            ubicacionLugar: coordenadas,
            radio: radio,
            referenciasLugar: [],
            imagenesLugar: [],
            videosLugar: [],
            horariosLugar: [],
            tarifasLugar: {},
            serviciosLugar: {},
            contactoLugar: {},
            reseñasLugar: [],
            idLugarSql: nuevoId
        });

        // 4. Obtener el lugar completo para devolverlo
        const [lugarCreado] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            WHERE lt.idLugarTuristico = ?
        `, [nuevoId]);

        const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
            idLugarSql: nuevoId 
        });

        const respuesta = {
            ...lugarCreado[0],
            nombreLugar: descifrarSeguro(lugarCreado[0].nombreLugar),
            coordenadas: lugarMongo?.ubicacionLugar || coordenadas,
            radio: lugarMongo?.radio || radio,
            detallesMongo: lugarMongo
        };

        return res.status(201).json({
            message: 'Zona segura creada exitosamente',
            data: respuesta
        });

    } catch (error) {
        console.error('❌ Error al crear zona segura:', error);
        return res.status(500).json({ 
            message: 'Error al crear zona segura', 
            error: error.message 
        });
    }
};

// ⭐ NUEVA: Crear punto crítico
lugarTuristicoCtl.crearPuntoCritico = async (req, res) => {
    try {
        console.log('➕ Creando nuevo punto crítico...');
        
        const { 
            nombreLugar, 
            coordenadas, 
            nivelRiesgo = 'medio',
            descripcion 
        } = req.body;

        if (!nombreLugar || !coordenadas) {
            return res.status(400).json({ 
                message: 'Nombre y coordenadas son requeridos' 
            });
        }

        // 1. Asegurar que la categoría exista
        const categoriaId = await asegurarCategoria(
            'punto_critico',
            'Puntos críticos que requieren atención especial'
        );

        // 2. Crear en SQL
        const [result] = await sql.promise().query(
            `INSERT INTO lugaresTuristicos (
                nombreLugar, 
                codigoLugar, 
                estadoLugar, 
                categoriasLugarIdCategoriaLugar,
                createLugar
            ) VALUES (?, ?, "activo", ?, ?)`,
            [
                cifrarDatos(nombreLugar),
                cifrarDatos(`PUNTO-${Date.now()}`), // Código único
                categoriaId,
                new Date().toLocaleString()
            ]
        );

        const nuevoId = result.insertId;
        console.log(`✅ Punto crítico creado en SQL (ID: ${nuevoId})`);

        // 3. Crear en MongoDB con datos adicionales
        await mongo.lugarTuristicoModel.create({
            descripcionLugar: descripcion || `Punto crítico: ${nombreLugar}`,
            ubicacionLugar: coordenadas,
            nivelRiesgo: nivelRiesgo,
            referenciasLugar: [],
            imagenesLugar: [],
            videosLugar: [],
            horariosLugar: [],
            tarifasLugar: {},
            serviciosLugar: {},
            contactoLugar: {},
            reseñasLugar: [],
            idLugarSql: nuevoId
        });

        // 4. Obtener el lugar completo para devolverlo
        const [lugarCreado] = await sql.promise().query(`
            SELECT lt.*, cl.nombreCategoriaLugar
            FROM lugaresTuristicos lt
            LEFT JOIN categoriasLugars cl ON lt.categoriasLugarIdCategoriaLugar = cl.idCategoriaLugar
            WHERE lt.idLugarTuristico = ?
        `, [nuevoId]);

        const lugarMongo = await mongo.lugarTuristicoModel.findOne({ 
            idLugarSql: nuevoId 
        });

        const respuesta = {
            ...lugarCreado[0],
            nombreLugar: descifrarSeguro(lugarCreado[0].nombreLugar),
            coordenadas: lugarMongo?.ubicacionLugar || coordenadas,
            nivelRiesgo: lugarMongo?.nivelRiesgo || nivelRiesgo,
            detallesMongo: lugarMongo
        };

        return res.status(201).json({
            message: 'Punto crítico creado exitosamente',
            data: respuesta
        });

    } catch (error) {
        console.error('❌ Error al crear punto crítico:', error);
        return res.status(500).json({ 
            message: 'Error al crear punto crítico', 
            error: error.message 
        });
    }
};

// Agregar reseña a un lugar
lugarTuristicoCtl.agregarResena = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, calificacion, comentario } = req.body;

        if (!usuario || !calificacion || calificacion < 1 || calificacion > 5) {
            return res.status(400).json({ message: 'Usuario y calificación (1-5) son requeridos' });
        }

        const nuevaResena = {
            usuario,
            calificacion,
            comentario: comentario || '',
            fecha: new Date()
        };

        await mongo.lugarTuristicoModel.updateOne(
            { idLugarSql: id },
            { $push: { reseñasLugar: nuevaResena } }
        );

        return res.status(201).json({ message: 'Reseña agregada exitosamente' });

    } catch (error) {
        console.error('Error al agregar reseña:', error);
        return res.status(500).json({ message: 'Error al agregar reseña', error: error.message });
    }
};

module.exports = lugarTuristicoCtl;