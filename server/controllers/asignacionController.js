const asignacionModel = require('../models/db/asignacionModel');

const getAsignaciones = async (req, res) => {
  try {
    const { quoteNumber } = req.params;
    const asignaciones = await asignacionModel.getAsignaciones(quoteNumber);
    res.status(200).json(asignaciones);
  } catch (error) {
    console.error('Error en getAsignaciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener asignaciones',
      details: error.message 
    });
  }
};

const createAsignacion = async (req, res) => {
  try {
    const { saldo_recibido, quote_number } = req.body;

    if (!saldo_recibido || !quote_number) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos' 
      });
    }

    if (isNaN(parseFloat(saldo_recibido))) {
      return res.status(400).json({ 
        error: 'El saldo recibido debe ser un número válido' 
      });
    }

    const newAsignacion = await asignacionModel.createAsignacion({
      quote_number,
      saldo_recibido: parseFloat(saldo_recibido)
    });

    res.status(201).json(newAsignacion);
  } catch (error) {
    console.error('Error en createAsignacion:', error);
    res.status(500).json({ 
      error: 'Error al crear asignación',
      details: error.message 
    });
  }
};

module.exports = {
  getAsignaciones,
  createAsignacion
};