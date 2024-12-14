const express = require('express');
const flujoController = require('../controllers/flujoController');

const router = express.Router();

router.get('/employees', flujoController.getEmployees);
router.post('/payments', flujoController.createPayment);
router.get('/payments/project/:projectId', flujoController.getProjectPayments);

router.get('/payments/employee/:employeeId', flujoController.getEmployeePayments);
router.get('/payments/quote/:quoteNumber', flujoController.getQuotePayments);


module.exports = router;