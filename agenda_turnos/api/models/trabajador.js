const Sequelize = require('sequelize');
const db = require('../util/database');

const Trabajador = db.define('trabajador', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name1: Sequelize.STRING,
    Name2: Sequelize.STRING,
    fecha_nacimiento: Sequelize.DATE,
    fecha_ingreso: Sequelize.DATE,
    email: Sequelize.STRING,
    turno: Sequelize.STRING,
    fechainicioturno: Sequelize.DATE,
    contrato: Sequelize.STRING,
    estado: Sequelize.STRING,
    nivel: Sequelize.STRING,
    avatarUrl: Sequelize.STRING,
});

module.exports = Trabajador