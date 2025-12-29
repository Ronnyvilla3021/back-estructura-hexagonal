const contactoEmergencia = (sequelize, type) => {
    return sequelize.define('contactos_emergencia', {
        idContactoEmergencia: {
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
        nombreContacto: {
            type: type.STRING(100),
            allowNull: false,
        },
        telefono: {
            type: type.STRING(20),
            allowNull: false,
        },
        relacion: {
            type: type.STRING(50),
            allowNull: true,
        },
        prioridad: {
            type: type.INTEGER,
            defaultValue: 1,
            comment: 'Orden de prioridad (1 = más prioritario)',
        },
        createContactoEmergencia: {
            type: type.DATE,
            defaultValue: type.NOW,
        },
        updateContactoEmergencia: {
            type: type.DATE,
            defaultValue: type.NOW,
        },
    }, {
        timestamps: false,
        Comment: 'Tabla Contactos de Emergencia para Accesibilidad'
    });
}

module.exports = contactoEmergencia;
