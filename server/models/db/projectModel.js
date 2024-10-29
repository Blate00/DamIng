const pool = require('../config');

const getProjects = async (clientId) => {
  return await getProjectsByClientId(clientId);
};

const getProjectsByClientId = async (clientId) => {
  const { rows } = await pool.query(
    'SELECT * FROM projects WHERE client_id = \$1 ORDER BY project_id DESC',
    [clientId]
  );
  return rows;
};


const updateProjectStatus = async (projectId, status) => {
  const { rows } = await pool.query(
    'UPDATE projects SET status = \$1 WHERE project_id = \$2 RETURNING *',
    [status, projectId]
  );
  return rows[0];
};

const deleteProject = async (projectId) => {
  await pool.query('DELETE FROM projects WHERE project_id = \$1', [projectId]);
};

const addProject = async (clientId, projectName, quoteNumber) => {
  const { rows } = await pool.query(
    'INSERT INTO projects (client_id, project_name, quote_number, status) VALUES (\$1, \$2, \$3, \$4) RETURNING *',
    [clientId, projectName, quoteNumber, 'No Iniciado'] // Asegúrate de establecer un estado por defecto
  );
  return rows[0];
};

module.exports = {
  getProjects,
  getProjectsByClientId,
  updateProjectStatus,
  deleteProject,
  addProject, // Asegúrate de exportar esta función
};