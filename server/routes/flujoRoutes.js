const express = require('express');
const flujoController = require('../controllers/flujoController');

const router = express.Router();

// Rutas existentes
router.get('/employees', flujoController.getEmployees);
router.post('/payments', flujoController.createPayment);
router.get('/payments/project/:projectId', flujoController.getProjectPayments);

// Nueva ruta para obtener pagos por empleado
router.get('/payments/employee/:employeeId', flujoController.getEmployeePayments);
router.get('/payments/quote/:quoteNumber', flujoController.getQuotePayments);
module.exports = router;