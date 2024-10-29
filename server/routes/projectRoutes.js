const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Middleware para logging
router.use((req, res, next) => {
  console.log(`Project Route: ${req.method} ${req.url}`);
  next();
});

// Ruta para obtener proyectos por client_id
router.get('/', projectController.getProjectsByClientId); // Asegúrate de que esta función esté definida
router.post('/projects', projectController.createProject);
router.patch('/projects/:projectId/status', projectController.updateStatus);
router.delete('/projects/:projectId/client/:clientId', projectController.deleteProject);

module.exports = router;