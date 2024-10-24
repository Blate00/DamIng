const clientModel = require('../models/db/clientModel');

const fetchClients = async (req, res) => {
  try {
      const clients = await clientModel.getClients();
      console.log(clients); // Verifica qué datos estás recibiendo
      res.json(clients);
  } catch (error) {
      console.error('Error fetching clients:', error.message);
      res.status(500).json({ error: error.message });
  }
};

const createClientAndProject = async (req, res) => {
  try {
    const { clientName, email, phone, projectName, quoteNumber, status, startDate, endDate } = req.body;

    // Verificar si el cliente ya existe
    const existingClients = await clientModel.getClients();
    let client = existingClients.find(c => c.name.toLowerCase() === clientName.toLowerCase());

    if (!client) {
      // Si no existe, crear un nuevo cliente
      client = await clientModel.addClient({ name: clientName, email, phone_number: phone });
    }

    // Añadir el proyecto
    await clientModel.addProject({
      client_id: client.client_id,
      project_name: projectName,
      quote_number: quoteNumber,
      status,
      start_date: startDate,
      end_date: endDate,
    });

    res.status(201).json({ message: 'Cliente y proyecto creados exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeClientAndProjects = async (req, res) => {
  try {
    const clientId = req.params.id;

    // Obtener proyectos relacionados
    const projects = await clientModel.getProjectsByClientId(clientId);
    const projectIds = projects.map(p => p.project_id);
    const quoteNumbers = projects.map(p => p.quote_number);

    // Eliminar proyectos relacionados
    await clientModel.deleteProjectsByClientId(clientId);

    // Eliminar el cliente
    await clientModel.deleteClient(clientId);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchClients,
  createClientAndProject,
  removeClientAndProjects,
};