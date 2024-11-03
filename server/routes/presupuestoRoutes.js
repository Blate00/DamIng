    const express = require('express');
    const presupuestoController = require('../controllers/presupuestoController');

    const router = express.Router();

    router.get('/presupuesto/:projectId', presupuestoController.fetchBudgets);
    router.post('/presupuesto', presupuestoController.addBudget);
    router.put('/presupuesto/:budgetId', presupuestoController.updateBudget);
    router.delete('/presupuesto/:budgetId', presupuestoController.deleteBudget);

    module.exports = router;
