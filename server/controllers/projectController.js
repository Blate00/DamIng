const projectModel = require('../models/db/projectModel');

//función para obtener proyectos por client_id
const getProjectsByClientId = async (req, res) => {
  const { client_id } = req.query; // Obtener client_id de los parámetros de la consulta
  try {
    let projects;

    if (client_id) {
      // Filtrar proyectos por client_id si se proporciona
      projects = await projectModel.getProjectsByClientId(client_id);
    } else {
      // Obtener todos los proyectos si no se proporciona client_id
      projects = await projectModel.getAllProjects();
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: error.message });
  }
};
const createProject = async (req, res) => {
  try {
    const { clientId, projectName, startDate, endDate, status } = req.body;
  
    // Generar un número de cotización único
    const quoteNumber = `QN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
    const newProject = await projectModel.createProject({
      clientId,
      projectName,
      quoteNumber,
      status,
      startDate,
      endDate
    });
  
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: error.message });
  }
  };
module.exports = {
  getProjectsByClientId, // Exportar la nueva función
  createProject
};