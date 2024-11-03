const pool = require('../config');

// Función para obtener todos los proyectos
const getAllProjects = async () => {
  const { rows } = await pool.query('SELECT * FROM projects');
  return rows;
};

// Nueva función para obtener proyectos filtrados por client_id
const getProjectsByClientId = async (clientId) => {
  const { rows } = await pool.query('SELECT * FROM projects WHERE client_id = \$1', [clientId]);
  return rows;
};

module.exports = {
  getAllProjects, // Exportar la función para obtener todos los proyectos
  getProjectsByClientId, // Exportar la nueva función para obtener proyectos por client_id
};