const projectModel = require('../models/db/projectModel');

const getProjectsByClientId = async (req, res) => {
  try {
    const clientId = req.query.client_id; // Obtener client_id de la consulta
    const projects = await projectModel.getProjectsByClientId(clientId); // Asegúrate de que esta función esté definida
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProjectsByClientId,
  // Otras funciones...
};