  const presupuestoModel = require('../models/db/presupuestoModel');

  const fetchBudgets = async (req, res) => {
    try {
      const { projectId } = req.params;
      const budgets = await presupuestoModel.getBudgetsByProjectId(projectId);
      res.status(200).json(budgets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const addBudget = async (req, res) => {
    try {
      const newBudget = await presupuestoModel.addBudgetItem(req.body);
      res.status(201).json(newBudget);
    } catch (error) {
      console.error('Error in addBudget controller:', error);
      res.status(500).json({ error: error.message });
    }
  };

  const updateBudget = async (req, res) => {
    try {
      const { budgetId } = req.params;
      const updatedBudget = await presupuestoModel.updateBudgetItem(budgetId, req.body);
      res.status(200).json(updatedBudget);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteBudget = async (req, res) => {
    try {
      const { budgetId } = req.params;
      const deletedBudget = await presupuestoModel.deleteBudgetItem(budgetId);
      res.status(200).json(deletedBudget);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
