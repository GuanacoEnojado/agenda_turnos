const express = require('express');
const router = express.Router();
const controller = require('../controllers/trabajadores');

router.get('/', controller.getTrabajadores); // /trabajadores
router.get('/:trabajadorId', controller.getTrabajador); // /trabajadores/:trabajadorId
router.post('/', controller.createTrabajador); // /trabajadores
router.put('/:trabajadorId', controller.updateTrabajador); // /trabajadores/:trabajadorId
router.delete('/:trabajadorId', controller.deleteTrabajador); // /trabajadores/:trabajadorId

module.exports = router;