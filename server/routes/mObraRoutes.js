const express = require('express');
const router = express.Router();
const {
  getManoObra,
  createManoObra
} = require('../controllers/mObraController');

// Rutas para mano de obra
router.get('/mano-obra/:quoteNumber', getManoObra);
router.post('/mano-obra', createManoObra);

module.exports = router;