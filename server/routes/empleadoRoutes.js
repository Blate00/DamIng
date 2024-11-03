const express = require('express');
const empleadoController = require('../controllers/empleadoController');

const router = express.Router();

router.get('/empleados', empleadoController.fetchEmpleados);
router.post('/empleados', empleadoController.createEmpleado);
router.delete('/empleados/:id', empleadoController.removeEmpleado);

module.exports = router;