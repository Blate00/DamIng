const express = require('express');
const router = express.Router();
const {
  getRendiciones,
  createRendicion,
  updateRendicion,
  deleteRendicion,
  getTotalRendiciones,
  getAsignaciones,
  createAsignacion,
  getProveedores
} = require('../controllers/rendicionController');

// Rutas base
router.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Rutas para proveedores
router.get('/proveedores', getProveedores);

// Rutas para asignaciones
router.get('/asignacion/:quoteNumber', getAsignaciones);
router.post('/asignacion', createAsignacion);

// Rutas para rendiciones
router.get('/rendiciones/project/:projectId', getRendiciones);
router.get('/rendiciones/total/:quoteNumber', getTotalRendiciones);
router.post('/rendiciones', createRendicion);
router.put('/rendiciones/:rendicionId', updateRendicion);
router.delete('/rendiciones/:rendicionId', deleteRendicion);

module.exports = router;