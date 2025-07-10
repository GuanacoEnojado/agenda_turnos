const express = require('express');
const router = express.Router();
const controller = require('../controllers/extrashifts');

// Basic CRUD routes
router.get('/', controller.getExtraShifts); // /extrashifts
router.get('/:extraShiftId', controller.getExtraShift); // /extrashifts/:extraShiftId
router.post('/', controller.createExtraShift); // /extrashifts
router.put('/:extraShiftId', controller.updateExtraShift); // /extrashifts/:extraShiftId
router.delete('/:extraShiftId', controller.deleteExtraShift); // /extrashifts/:extraShiftId

// Additional routes for specific queries
router.get('/trabajador/:trabajadorId', controller.getExtraShiftsByTrabajador); // /extrashifts/trabajador/:trabajadorId
router.get('/range/dates', controller.getExtraShiftsByDateRange); // /extrashifts/range/dates?startDate=...&endDate=...&trabajadorId=...

module.exports = router;
