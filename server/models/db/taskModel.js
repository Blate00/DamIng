const pool = require('../config');

const addTask = async (taskData) => {
  const { project_id, task_name, responsible_employee_id, status } = taskData;
  const result = await pool.query(
    'INSERT INTO tasks (project_id, task_name, responsible_employee_id, status) VALUES (\$1, \$2, \$3, \$4) RETURNING *',
    [project_id, task_name, responsible_employee_id, status]
  );
  return result.rows[0];
};

const getTasks = async () => {
  const result = await pool.query(`
    SELECT t.*, p.project_name, e.name AS responsible_employee_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.project_id
    LEFT JOIN employees e ON t.responsible_employee_id = e.employee_id
  `);
  return result.rows;
};

const getTaskById = async (taskId) => {
  const result = await pool.query('SELECT * FROM tasks WHERE task_id = \$1', [taskId]);
  return result.rows[0];
};

const updateTaskStatus = async (taskId, status) => {
  const result = await pool.query(
    'UPDATE tasks SET status = \$1 WHERE task_id = \$2 RETURNING *',
    [status, taskId]
  );
  return result.rows[0];
};

const deleteTask = async (taskId) => {
  await pool.query('DELETE FROM tasks WHERE task_id = \$1', [taskId]);
};

module.exports = {
  addTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask,
};