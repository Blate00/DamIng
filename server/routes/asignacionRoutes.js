const express = require('express');
const router = express.Router();
const {
  getAsignaciones,
  createAsignacion
} = require('../controllers/asignacionController');

// Rutas para asignaciones
router.get('/asignacion/:quoteNumber', getAsignaciones);
router.post('/asignacion', createAsignacion);

module.exports = router;