const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Obtener todos los materiales (con opción de filtrar por categoría)
router.get('/materials', materialController.fetchMaterials);

// Obtener un material específico
router.get('/materials/:id', materialController.getMaterial);

// Crear un nuevo material
router.post('/materials', materialController.createMaterial);

// Actualizar valor de un material
router.put('/materials/:id', materialController.updateMaterial);

// Eliminar un material
router.delete('/materials/:id', materialController.removeMaterial);

module.exports = router;