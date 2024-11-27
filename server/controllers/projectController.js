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
// projectController.js
const createProject = async (req, res) => {
  try {
    console.log('Datos recibidos en el controlador:', req.body);
  
    const { client_id, project_name, status } = req.body;
  
    // Validación de datos
    if (!project_name) {
      return res.status(400).json({
        error: 'El nombre del proyecto es requerido',
        receivedData: req.body
      });
    }
  
    if (!client_id) {
      return res.status(400).json({
        error: 'El ID del cliente es requerido',
        receivedData: req.body
      });
    }
  
    // Generar quote_number
    const quote_number = `QN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
    const newProject = await projectModel.createProject({
      clientId: client_id,
      projectName: project_name,
      quoteNumber: quote_number,
      status: status || 'No Iniciado'
    });
  
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error en createProject:', error);
    res.status(500).json({
      error: error.message,
      detail: error.detail,
      receivedData: req.body
    });
  }
  };

  const updateProjectStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, start_date, end_date } = req.body;
    
      // Validar los datos
      if (!status) {
        return res.status(400).json({ error: 'El estado es requerido' });
      }
    
      const updatedProject = await projectModel.updateProjectStatus(
        id,
        status,
        start_date,
        end_date
      );
    
      res.json(updatedProject);
    } catch (error) {
      console.error('Error in updateProjectStatus:', error);
      res.status(500).json({ error: error.message });
    }
    };
module.exports = {
  getProjectsByClientId, // Exportar la nueva función
  createProject,
  updateProjectStatus
};