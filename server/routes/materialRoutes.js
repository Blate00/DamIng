const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

router.get('/materials', materialController.fetchMaterials);

router.get('/materials/:id', materialController.getMaterial);

router.post('/materials', materialController.createMaterial);

router.put('/materials/:id', materialController.updateMaterial);

router.delete('/materials/:id', materialController.removeMaterial);

module.exports = router;