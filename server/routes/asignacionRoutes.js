const express = require('express');
const router = express.Router();
const {
  getAsignaciones,
  createAsignacion,
  getTiposPago
} = require('../controllers/asignacionController');

router.get('/asignacion/:quoteNumber', getAsignaciones);
router.post('/asignacion', createAsignacion);
router.get('/tipo-pago', getTiposPago);

module.exports = router;