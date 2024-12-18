const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/clients', clientController.fetchClients);
router.post('/clients', clientController.createClient);
router.delete('/clients/:id', clientController.removeClientAndProjects);

module.exports = router;