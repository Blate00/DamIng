const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Ruta para obtener proyectos filtrados por client_id
router.get('/projects', projectController.getProjectsByClientId); // Nueva ruta
router.post('/projects', projectController.createProject);
router.put('/projects/:projectId/status', projectController.updateProjectStatus);
module.exports = router;