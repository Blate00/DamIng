const { addClient } = require('../models/clientModel');

async function createClient(req, res) {
  const { name, email, phone } = req.body;
  try {
    const newClient = await addClient(name, email, phone);
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error adding client' });
  }
}

module.exports = { createClient };