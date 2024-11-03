const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/tasks', taskController.fetchTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id/status', taskController.updateTask);
router.delete('/tasks/:id', taskController.removeTask);

module.exports = router;