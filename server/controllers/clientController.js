const clientModel = require('../models/db/clientModel');

const createClient = async (req, res) => {
  try {
    const { clientName, email, phone, projectName } = req.body;

    // Verificar si el cliente ya existe
    const existingClients = await clientModel.getClients();
    let client = existingClients.find(c => c.name.toLowerCase() === clientName.toLowerCase());

    if (!client) {
      // Si no existe, crear un nuevo cliente y su proyecto
      client = await clientModel.addClientWithProject({ 
        name: clientName, 
        email, 
        phone_number: phone,
        projectName
      });
    }

    res.status(201).json({ 
      message: 'Cliente y proyecto creados exitosamente',
      client: client 
    });
  } catch (error) {
    console.error('Error creating client and project:', error);
    res.status(500).json({ 
      error: 'Error al crear el cliente y proyecto',
      details: error.message 
    });
  }
};

const fetchClients = async (req, res) => {
  try {
    const clients = await clientModel.getClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const removeClientAndProjects = async (req, res) => {
  try {
    const clientId = req.params.id;
    await clientModel.deleteClient(clientId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getClientById = async (clientId) => {
  const { rows } = await pool.query(
    'SELECT * FROM clients WHERE client_id = \$1',
    [clientId]
  );
  return rows[0];
};
const getClients = async () => {
  const { rows } = await pool.query('SELECT * FROM clients');
  return rows;
};
module.exports = {
  getClients,
  getClientById,
  fetchClients,
  createClient,
  removeClientAndProjects,  
};