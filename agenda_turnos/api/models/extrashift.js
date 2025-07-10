const Sequelize = require('sequelize');
const db = require('../util/database');
const Trabajador = require('./trabajador');

const ExtraShift = db.define('extrashift', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    trabajadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Trabajador,
            key: 'id'
        }
    },
    fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    fechaTurnoExtra: {
        type: Sequelize.DATE,
        allowNull: false
    },
    horasExtras: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tipoTurno: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: [['day', 'night']]
        }
    },
    detalles: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'programado',
        validate: {
            isIn: [['programado', 'completado', 'cancelado']]
        }
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'users', // Assuming users table exists
            key: 'id'
        }
    }
}, {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
    tableName: 'extrashifts'
});

// Define associations
ExtraShift.belongsTo(Trabajador, { foreignKey: 'trabajadorId' });
Trabajador.hasMany(ExtraShift, { foreignKey: 'trabajadorId' });

module.exports = ExtraShift;
