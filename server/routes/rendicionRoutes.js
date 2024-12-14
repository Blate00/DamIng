const express = require('express');
const router = express.Router();
const {
  getRendiciones,
  createRendicion,
  updateRendicion,
  deleteRendicion,
  getTotalRendiciones,
  getProveedores
} = require('../controllers/rendicionController');

const validateNumericId = (req, res, next) => {
  const id = req.params.projectId || req.params.rendicionId;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Se requiere un ID válido' });
  }
  next();
};

router.get('/test', (req, res) => {
  res.json({ message: 'API de rendiciones funcionando correctamente' });
});

router.get('/proveedores', getProveedores);

// Rutas para rendiciones
router.get('/rendiciones/project/:projectId', validateNumericId, getRendiciones);
router.get('/rendiciones/total/:quoteNumber', getTotalRendiciones);
router.post('/rendiciones', createRendicion);
router.put('/rendiciones/:rendicionId', validateNumericId, updateRendicion);
router.delete('/rendiciones/:rendicionId', validateNumericId, deleteRendicion);

module.exports = router;