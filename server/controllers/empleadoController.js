const empleadoModel = require('../models/db/empleadoModel');

const createEmpleado = async (req, res) => {
  try {
    const { name, email, phone_number, banco_id, account_number, tipo_cuenta_id } = req.body;

    // Crear un nuevo empleado
    const empleado = await empleadoModel.addEmpleado({ 
      name, 
      email, 
      phone_number, 
      banco_id, 
      account_number, 
      tipo_cuenta_id 
    });

    res.status(201).json({ 
      message: 'Empleado creado exitosamente',
      empleado 
    });
  } catch (error) {
    console.error('Error creando empleado:', error);
    res.status(500).json({ 
      error: 'Error al crear el empleado',
      details: error.message 
    });
  }
};

const fetchEmpleados = async (req, res) => {
  try {
    const empleados = await empleadoModel.getEmpleados();
    res.json(empleados);
  } catch (error) {
    console.error('Error fetching empleados:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const removeEmpleado = async (req, res) => {
  try {
    const empleadoId = req.params.id;
    await empleadoModel.deleteEmpleado(empleadoId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchEmpleados,
  createEmpleado,
  removeEmpleado,
};