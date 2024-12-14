const express = require('express');  
const router = express.Router();  
const listaMaterialesController = require('../controllers/listaMaterialesController');  

router.get('/material-lists/project/:project_id', listaMaterialesController.getMaterialListByProject);  
router.get('/material-lists/quote/:quote_number', listaMaterialesController.getMaterialListByQuote);  
router.post('/material-lists', listaMaterialesController.addMaterialsToList);  
router.put('/material-lists/:list_id', listaMaterialesController.updateMaterialQuantity);  
router.delete('/material-lists/:list_id', listaMaterialesController.removeMaterialFromList);  
router.get('/material-lists/project-with-availables/:project_id', listaMaterialesController.getMaterialListWithAvailables);
module.exports = router;  