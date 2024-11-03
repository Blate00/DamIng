const taskModel = require('../models/db/taskModel');

const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await taskModel.addTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error al crear la tarea', details: error.message });
  }
};

const fetchTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const updatedTask = await taskModel.updateTaskStatus(taskId, status);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const removeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    await taskModel.deleteTask(taskId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  fetchTasks,
  updateTask,
  removeTask,
};