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
    turno: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['4to_turno_modificado', '3er_turno', '4to_turno', 'diurno_hospital', 'diurno_empresa', 'volante']]
        }
    },
    fechainicioturno: Sequelize.DATE,
    contrato: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['contrato_indefinido', 'contrato_fijo', 'planta', 'contrata', 'volante']]
        }
    },
    estado: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['activo', 'inactivo', 'licencia', 'vacaciones', 'suspendido', 'turnocambiadoOFF', 'turnocamdiadoON', 'activoextra', 'permisoadm', 'permisoadmAM', 'permisoadmPM', 'inasistente']]
        }
    },
    nivel: {
        type: Sequelize.STRING,
        validate: {
            isIn: [['tecnico', 'manipulador', 'auxiliar', 'profesional']]
        }
    },
    avatarUrl: Sequelize.STRING,
});

module.exports = Trabajador