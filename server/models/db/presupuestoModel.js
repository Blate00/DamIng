const pool = require('../config');

const getBudgetsByProjectId = async (projectId) => {
  const query = `
    SELECT 
      budget_id,
      project_id,
      quote_number,
      description,
      quantity,
      unit_price,
      total,
      ROUND(gg_percentage::numeric)::integer as gg_percentage,
      ROUND(gestion_percentage::numeric)::integer as gestion_percentage,
      gg_amount,
      gestion_amount,
      subtotal,
      budget_date
    FROM description_budgets 
    WHERE project_id = \$1
  `;
  const { rows } = await pool.query(query, [projectId]);
  return rows;
};

const addBudgetItem = async (item) => {
  const query = `
    INSERT INTO description_budgets (
      project_id, 
      quote_number, 
      description, 
      quantity, 
      unit_price, 
      total, 
      gg_percentage, 
      gestion_percentage,
      gg_amount, 
      gestion_amount, 
      subtotal
    )
    VALUES (\$1, \$2, \$3, \$4, \$5, \$6, 
      ROUND(\$7::numeric)::integer, 
      ROUND(\$8::numeric)::integer, 
      \$9, \$10, \$11)
    RETURNING 
      budget_id,
      project_id,
      quote_number,
      description,
      quantity,
      unit_price,
      total,
      ROUND(gg_percentage::numeric)::integer as gg_percentage,
      ROUND(gestion_percentage::numeric)::integer as gestion_percentage,
      gg_amount,
      gestion_amount,
      subtotal,
      budget_date;
  `;

  try {
    const values = [
      item.project_id,
      item.quote_number,
      item.description,
      item.quantity,
      item.unit_price,
      item.total,
      item.gg_percentage,
      item.gestion_percentage,
      item.gg_amount,
      item.gestion_amount,
      item.subtotal
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error detallado:', error);
    if (error.code === '23503') {
      throw new Error(`Error de referencia: Asegúrate de que el proyecto y la cotización existan.`);
    }
    throw new Error('Error al agregar el ítem de presupuesto');
  }
};

const updateBudgetItem = async (budgetId, data) => {
  const query = `
    UPDATE description_budgets
    SET 
      description = \$1, 
      quantity = \$2, 
      unit_price = \$3, 
      total = \$4, 
      gg_percentage = ROUND(\$5::numeric)::integer, 
      gestion_percentage = ROUND(\$6::numeric)::integer, 
      gg_amount = \$7, 
      gestion_amount = \$8, 
      subtotal = \$9
    WHERE budget_id = \$10
    RETURNING 
      budget_id,
      project_id,
      quote_number,
      description,
      quantity,
      unit_price,
      total,
      ROUND(gg_percentage::numeric)::integer as gg_percentage,
      ROUND(gestion_percentage::numeric)::integer as gestion_percentage,
      gg_amount,
      gestion_amount,
      subtotal,
      budget_date;
  `;
  
  const values = [
    data.description, 
    data.quantity, 
    data.unit_price, 
    data.total,
    data.gg_percentage, 
    data.gestion_percentage, 
    data.gg_amount,
    data.gestion_amount, 
    data.subtotal, 
    budgetId
  ];
  
  const { rows } = await pool.query(query, values);
  if (rows.length === 0) {
    throw new Error(`Budget with ID ${budgetId} not found`);
  }
  return rows[0];
};

const deleteBudgetItem = async (budgetId) => {
  const query = 'DELETE FROM description_budgets WHERE budget_id = \$1 RETURNING *;';
  const { rows } = await pool.query(query, [budgetId]);
  return rows[0];
};

module.exports = {
  getBudgetsByProjectId,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
};