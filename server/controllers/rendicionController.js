const rendicionModel = require('../models/db/rendicionModel');

const getRendiciones = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: 'Se requiere el ID del proyecto' });
    }
    const rendiciones = await rendicionModel.getRendiciones(projectId);
    res.status(200).json(rendiciones);
  } catch (error) {
    console.error('Error en getRendiciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener rendiciones',
      details: error.message 
    });
  }
};

const createRendicion = async (req, res) => {
  try {
    const { project_id, quote_number, total, proveedor_id } = req.body;
    
    // Validaciones mejoradas
    if (!project_id || !quote_number || !total || !proveedor_id) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos (project_id, quote_number, total, proveedor_id)' 
      });
    }

    if (isNaN(parseFloat(total)) || parseFloat(total) <= 0) {
      return res.status(400).json({ 
        error: 'El total debe ser un número válido mayor a 0' 
      });
    }

    const newRendicion = await rendicionModel.createRendicion(req.body);
    res.status(201).json(newRendicion);
  } catch (error) {
    console.error('Error en createRendicion:', error);
    res.status(500).json({ 
      error: 'Error al crear rendición',
      details: error.message 
    });
  }
};

const updateRendicion = async (req, res) => {
  try {
    const { rendicionId } = req.params;
    const { total, quote_number } = req.body;

    if (!rendicionId) {
      return res.status(400).json({ 
        error: 'Se requiere el ID de la rendición' 
      });
    }

    if (total && (isNaN(parseFloat(total)) || parseFloat(total) <= 0)) {
      return res.status(400).json({ 
        error: 'El total debe ser un número válido mayor a 0' 
      });
    }

    const updatedRendicion = await rendicionModel.updateRendicion(rendicionId, { ...req.body, quote_number });
    res.status(200).json(updatedRendicion);
  } catch (error) {
    console.error('Error en updateRendicion:', error);
    res.status(500).json({ 
      error: 'Error al actualizar rendición',
      details: error.message 
    });
  }
};

const deleteRendicion = async (req, res) => {
  try {
    const { rendicionId } = req.params;
    
    if (!rendicionId) {
      return res.status(400).json({ 
        error: 'Se requiere el ID de la rendición' 
      });
    }

    const deletedRendicion = await rendicionModel.deleteRendicion(rendicionId);
    res.status(200).json(deletedRendicion);
  } catch (error) {
    console.error('Error en deleteRendicion:', error);
    res.status(500).json({ 
      error: 'Error al eliminar rendición',
      details: error.message 
    });
  }
};

const getTotalRendiciones = async (req, res) => {
  try {
    const { quoteNumber } = req.params;
    
    if (!quoteNumber) {
      return res.status(400).json({ 
        error: 'Se requiere el número de cotización' 
      });
    }

    const total = await rendicionModel.getTotalRendiciones(quoteNumber);
    res.status(200).json({ total });
  } catch (error) {
    console.error('Error en getTotalRendiciones:', error);
    res.status(500).json({ 
      error: 'Error al calcular total',
      details: error.message 
    });
  }
};

const getProveedores = async (req, res) => {
  try {
    const proveedores = await rendicionModel.getProveedores();
    res.status(200).json(proveedores);
  } catch (error) {
    console.error('Error en getProveedores:', error);
    res.status(500).json({ 
      error: 'Error al obtener proveedores',
      details: error.message 
    });
  }
};

module.exports = {
  getRendiciones,
  createRendicion,
  updateRendicion,
  deleteRendicion,
  getTotalRendiciones,
  getProveedores
};