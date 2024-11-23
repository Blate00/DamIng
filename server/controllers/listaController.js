const listaMaterialesModel = require('../models/db/listaMaterialesModel');

const listaMaterialesController = {
// Crear nueva lista
createLista: async (req, res) => {
  try {
    const { project_id, items } = req.body;

    // Obtener quote_number del proyecto
    const projectResult = await pool.query(
      'SELECT quote_number FROM projects WHERE project_id = \$1',
      [project_id]
    );

    if (!projectResult.rows[0]) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    const quote_number = projectResult.rows[0].quote_number;

    const newLista = await listaMaterialesModel.createLista(
      project_id,
      quote_number,
      items
    );

    res.status(201).json(newLista);
  } catch (error) {
    console.error('Error al crear lista:', error);
    res.status(500).json({ error: error.message });
  }
},

// Obtener todas las listas
getAllListas: async (req, res) => {
  try {
    const listas = await listaMaterialesModel.getAllListas();
    res.json(listas);
  } catch (error) {
    console.error('Error al obtener listas:', error);
    res.status(500).json({ error: error.message });
  }
},

// Obtener una lista específica
getListaById: async (req, res) => {
  try {
    const lista = await listaMaterialesModel.getListaById(req.params.id);
    if (!lista) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener lista:', error);
    res.status(500).json({ error: error.message });
  }
},

// Actualizar lista
updateLista: async (req, res) => {
  try {
    const { items } = req.body;
    const updatedLista = await listaMaterialesModel.updateLista(
      req.params.id,
      items
    );
    res.json(updatedLista);
  } catch (error) {
    console.error('Error al actualizar lista:', error);
    res.status(500).json({ error: error.message });
  }
},

// Eliminar lista
deleteLista: async (req, res) => {
  try {
    const deletedLista = await listaMaterialesModel.deleteLista(req.params.id);
    if (!deletedLista) {
      return res.status(404).json({ error: 'Lista no encontrada' });
    }
    res.json({ message: 'Lista eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar lista:', error);
    res.status(500).json({ error: error.message });
  }
}
};

module.exports = listaMaterialesController;