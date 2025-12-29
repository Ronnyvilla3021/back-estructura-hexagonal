const lugarFavorito = (sequelize, type) => {
    return sequelize.define('lugares_favoritos', {
        idLugarFavorito: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idCliente: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: 'clientes',
                key: 'idClientes'
            }
        },
        nombreLugar: {
            type: type.STRING(100),
            allowNull: false,
        },
        direccion: {
            type: type.STRING(255),
            allowNull: false,
        },
        latitud: {
            type: type.DECIMAL(10, 8),
            allowNull: true,
        },
        longitud: {
            type: type.DECIMAL(11, 8),
            allowNull: true,
        },
        icono: {
            type: type.STRING(50),
            defaultValue: 'place',
        },
        createLugarFavorito: {
            type: type.DATE,
            defaultValue: type.NOW,
        },
        updateLugarFavorito: {
            type: type.DATE,
            defaultValue: type.NOW,
        },
    }, {
        timestamps: false,
        Comment: 'Tabla Lugares Favoritos para Accesibilidad'
    });
}

module.exports = lugarFavorito;
