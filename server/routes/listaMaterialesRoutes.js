const express = require('express');
const router = express.Router();
const listaMaterialesController = require('../controllers/listaMaterialesController');

// Rutas existentes
router.get('/lista-materiales', listaMaterialesController.getAllListas);
router.get('/lista-materiales/:id', listaMaterialesController.getListaById);
router.post('/lista-materiales', listaMaterialesController.createLista);
router.put('/lista-materiales/:id', listaMaterialesController.updateLista);
router.delete('/lista-materiales/:id', listaMaterialesController.deleteLista);

// Nuevas rutas
router.get('/lista/search', listaMaterialesController.searchMaterials);
router.get('/lista-materiales/project/:projectId', listaMaterialesController.getListaByProject);

module.exports = router;