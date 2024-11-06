const rendicionModel = require('../models/db/rendicionModel');


const getRendiciones = async (req, res) => {
  try {
    const { projectId } = req.params;
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
    const { project_id, quote_number, total } = req.body;
    
    if (!project_id || !quote_number || !total) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos' 
      });
    }

    if (isNaN(parseFloat(total))) {
      return res.status(400).json({ 
        error: 'El total debe ser un número válido' 
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
    const { total } = req.body;

    if (total && isNaN(parseFloat(total))) {
      return res.status(400).json({ 
        error: 'El total debe ser un número válido' 
      });
    }

    const updatedRendicion = await rendicionModel.updateRendicion(rendicionId, req.body);
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

const getAsignaciones = async (req, res) => {
  try {
    const { quoteNumber } = req.params;
    const asignaciones = await rendicionModel.getAsignaciones(quoteNumber);
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

    const newAsignacion = await rendicionModel.createAsignacion({
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
  getAsignaciones,
  createAsignacion,
  getProveedores
};