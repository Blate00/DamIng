const express = require('express');  
const router = express.Router();  
const listaMaterialesController = require('../controllers/listaMaterialesController');  

// Obtener lista de materiales por proyecto  
router.get('/material-lists/project/:project_id', listaMaterialesController.getMaterialListByProject);  

// Obtener lista de materiales por cotización  
router.get('/material-lists/quote/:quote_number', listaMaterialesController.getMaterialListByQuote);  

// Agregar material a la lista  
router.post('/material-lists', listaMaterialesController.addMaterialsToList);  

// Actualizar cantidad de un material  
router.put('/material-lists/:list_id', listaMaterialesController.updateMaterialQuantity);  

// Eliminar material de la lista  
router.delete('/material-lists/:list_id', listaMaterialesController.removeMaterialFromList);  

module.exports = router;  