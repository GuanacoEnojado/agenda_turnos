const ExtraShift = require('../models/extrashift');
const Trabajador = require('../models/trabajador');

// CRUD Controllers
// Get all extra shifts
exports.getExtraShifts = (req, res, next) => {
    ExtraShift.findAll({
        include: [{
            model: Trabajador,
            attributes: ['id', 'Name1', 'Name2', 'email']
        }]
    })
        .then(extraShifts => {
            res.status(200).json({ extraShifts: extraShifts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching extra shifts' });
        });
}

// Get extra shift by id
exports.getExtraShift = (req, res, next) => {
    const extraShiftId = req.params.extraShiftId;
    ExtraShift.findByPk(extraShiftId, {
        include: [{
            model: Trabajador,
            attributes: ['id', 'Name1', 'Name2', 'email']
        }]
    })
        .then(extraShift => {
            if (!extraShift) {
                return res.status(404).json({ message: 'Extra shift not found!' });
            }
            res.status(200).json({ extraShift: extraShift });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching extra shift' });
        });
}

// Get extra shifts by trabajador id
exports.getExtraShiftsByTrabajador = (req, res, next) => {
    const trabajadorId = req.params.trabajadorId;
    ExtraShift.findAll({
        where: { trabajadorId: trabajadorId },
        include: [{
            model: Trabajador,
            attributes: ['id', 'Name1', 'Name2', 'email']
        }],
        order: [['fechaTurnoExtra', 'DESC']]
    })
        .then(extraShifts => {
            res.status(200).json({ extraShifts: extraShifts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching extra shifts for trabajador' });
        });
}

// Create extra shift
exports.createExtraShift = (req, res, next) => {
    const { 
        trabajadorId, 
        fechaTurnoExtra, 
        horasExtras, 
        tipoTurno, 
        detalles, 
        estado = 'programado',
        createdBy 
    } = req.body;

    // Validate required fields
    if (!trabajadorId || !fechaTurnoExtra || !horasExtras || !tipoTurno) {
        return res.status(400).json({ 
            message: 'Missing required fields: trabajadorId, fechaTurnoExtra, horasExtras, tipoTurno' 
        });
    }

    // Check if trabajador exists
    Trabajador.findByPk(trabajadorId)
        .then(trabajador => {
            if (!trabajador) {
                return res.status(404).json({ message: 'Trabajador not found!' });
            }

            return ExtraShift.create({
                trabajadorId,
                fechaTurnoExtra,
                horasExtras,
                tipoTurno,
                detalles,
                estado,
                createdBy
            });
        })
        .then(result => {
            console.log('Created Extra Shift');
            res.status(201).json({
                message: 'Extra shift created successfully!',
                extraShift: result
            });
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    message: 'Validation error', 
                    errors: err.errors.map(e => e.message) 
                });
            }
            res.status(500).json({ message: 'Error creating extra shift' });
        });
}

// Update extra shift
exports.updateExtraShift = (req, res, next) => {
    const extraShiftId = req.params.extraShiftId;
    const { 
        fechaTurnoExtra, 
        horasExtras, 
        tipoTurno, 
        detalles, 
        estado,
        createdBy 
    } = req.body;

    ExtraShift.findByPk(extraShiftId)
        .then(extraShift => {
            if (!extraShift) {
                return res.status(404).json({ message: 'Extra shift not found!' });
            }

            // Update only provided fields
            if (fechaTurnoExtra !== undefined) extraShift.fechaTurnoExtra = fechaTurnoExtra;
            if (horasExtras !== undefined) extraShift.horasExtras = horasExtras;
            if (tipoTurno !== undefined) extraShift.tipoTurno = tipoTurno;
            if (detalles !== undefined) extraShift.detalles = detalles;
            if (estado !== undefined) extraShift.estado = estado;
            if (createdBy !== undefined) extraShift.createdBy = createdBy;

            return extraShift.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Extra shift updated successfully!',
                extraShift: result
            });
        })
        .catch(err => {
            console.log(err);
            if (err.name === 'SequelizeValidationError') {
                return res.status(400).json({ 
                    message: 'Validation error', 
                    errors: err.errors.map(e => e.message) 
                });
            }
            res.status(500).json({ message: 'Error updating extra shift' });
        });
}

// Delete extra shift
exports.deleteExtraShift = (req, res, next) => {
    const extraShiftId = req.params.extraShiftId;
    
    ExtraShift.findByPk(extraShiftId)
        .then(extraShift => {
            if (!extraShift) {
                return res.status(404).json({ message: 'Extra shift not found!' });
            }
            return ExtraShift.destroy({
                where: { id: extraShiftId }
            });
        })
        .then(result => {
            res.status(200).json({ message: 'Extra shift deleted successfully!' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error deleting extra shift' });
        });
}

// Get extra shifts by date range
exports.getExtraShiftsByDateRange = (req, res, next) => {
    const { startDate, endDate, trabajadorId } = req.query;
    
    const whereClause = {};
    
    if (startDate && endDate) {
        whereClause.fechaTurnoExtra = {
            [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }
    
    if (trabajadorId) {
        whereClause.trabajadorId = trabajadorId;
    }

    ExtraShift.findAll({
        where: whereClause,
        include: [{
            model: Trabajador,
            attributes: ['id', 'Name1', 'Name2', 'email']
        }],
        order: [['fechaTurnoExtra', 'ASC']]
    })
        .then(extraShifts => {
            res.status(200).json({ extraShifts: extraShifts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Error fetching extra shifts by date range' });
        });
}
