// src/domain/models/sql/detalleRol.js
const detalleRol = (sequelize, type) => {
    return sequelize.define('detalleRols', {
        idDetalleRol: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userIdUser: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: 'users',      // Tabla referenciada
                key: 'idUser'        // Columna referenciada
            }
        },
        roleIdRol: {
            type: type.INTEGER,
            allowNull: false,
            references: {
                model: 'roles',      // Tabla referenciada
                key: 'idRol'         // Columna referenciada
            }
        },
        createDetalleRol: {
            type: type.STRING,
            defaultValue: () => new Date().toLocaleString()
        },
        updateDetalleRol: type.STRING
    }, {
        timestamps: false,
        tableName: 'detallerols',    // Nombre exacto de la tabla en MySQL
        comment: 'Tabla de detalle Rol'
    });
};

module.exports = detalleRol;