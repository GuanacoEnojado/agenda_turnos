const Trabajador = require('../models/trabajador');

// Controladores CRUD
// Obtener todos los trabajadores
exports.getTrabajadores = (req, res, next) => {
    Trabajador.findAll()
        .then(trabajadores => {
            res.status(200).json({ trabajadores: trabajadores });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching trabajadores' });
        });
}
// Obtener trabajador por id
exports.getTrabajador = (req, res, next) => {
    const trabajadorId = req.params.trabajadorId;
    Trabajador.findByPk(trabajadorId)
        .then(trabajador => {
            if (!trabajador) {
                return res.status(404).json({ message: 'Trabajador not found!' });
            }
            res.status(200).json({ trabajador: trabajador });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching trabajador' });
        });
}
// Crear trabajador
exports.createTrabajador = (req, res, next) => {
    const { Name1, Name2, fecha_nacimiento, fecha_ingreso, email, turno, fechainicioturno, contrato, estado, nivel, avatarUrl } = req.body;
    Trabajador.create({
        Name1,
        Name2,
        fecha_nacimiento,
        fecha_ingreso,
        email,
        turno,
        fechainicioturno,
        contrato,
        estado,
        nivel,
        avatarUrl
    })
    .then(result => {
        console.log('Created Trabajador');
        res.status(201).json({
            message: 'Trabajador created successfully!',
            trabajador: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Error creating trabajador' });
    });
}
// Actualizar trabajador
exports.updateTrabajador = (req, res, next) => {
    const trabajadorId = req.params.trabajadorId;
    const { Name1, Name2, fecha_nacimiento, fecha_ingreso, email, turno, fechainicioturno, contrato, estado, nivel, avatarUrl } = req.body;
    Trabajador.findByPk(trabajadorId)
        .then(trabajador => {
            if (!trabajador) {
                return res.status(404).json({ message: 'Trabajador not found!' });
            }
            trabajador.Name1 = Name1;
            trabajador.Name2 = Name2;
            trabajador.fecha_nacimiento = fecha_nacimiento;
            trabajador.fecha_ingreso = fecha_ingreso;
            trabajador.email = email;
            trabajador.turno = turno;
            trabajador.fechainicioturno = fechainicioturno;
            trabajador.contrato = contrato;
            trabajador.estado = estado;
            trabajador.nivel = nivel;
            trabajador.avatarUrl = avatarUrl;
            return trabajador.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Trabajador updated successfully!', trabajador: result });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error updating trabajador' });
        });
}

// Eliminar trabajador
exports.deleteTrabajador = (req, res, next) => {
    const trabajadorId = req.params.trabajadorId;
    Trabajador.findByPk(trabajadorId)
        .then(trabajador => {
            if (!trabajador) {
                return res.status(404).json({ message: 'Trabajador not found!' });
            }
            return Trabajador.destroy({
                where: {
                    id: trabajadorId
                }
            });
        })
        .then(result => {
            res.status(200).json({ message: 'Trabajador deleted successfully!' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error deleting trabajador' });
        });
}