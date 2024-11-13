const manoObraModel = require('../models/db/mObraModel');

const getManoObra = async (req, res) => {
  try {
    const { quoteNumber } = req.params;
    const manoObra = await manoObraModel.getManoObra(quoteNumber);
    res.status(200).json(manoObra);
  } catch (error) {
    console.error('Error en getManoObra:', error);
    res.status(500).json({ 
      error: 'Error al obtener mano de obra',
      details: error.message 
    });
  }
};

const createManoObra = async (req, res) => {
  try {
    const { saldo_recibido, quote_number, tipo_pago_id } = req.body;

    if (!saldo_recibido || !quote_number || !tipo_pago_id) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos' 
      });
    }

    if (isNaN(parseFloat(saldo_recibido))) {
      return res.status(400).json({ 
        error: 'El saldo recibido debe ser un número válido' 
      });
    }

    const newManoObra = await manoObraModel.createManoObra({
      quote_number,
      saldo_recibido: parseFloat(saldo_recibido),
      tipo_pago_id
    });

    res.status(201).json(newManoObra);
  } catch (error) {
    console.error('Error en createManoObra:', error);
    res.status(500).json({ 
      error: 'Error al crear mano de obra',
      details: error.message 
    });
  }
};

module.exports = {
  getManoObra,
  createManoObra
};