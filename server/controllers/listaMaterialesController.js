const pool = require('../models/config');
const listaMaterialesModel = require('../models/db/listaMaterialesModel');

// controllers/listaMaterialesController.js

const createLista = async (req, res) => {
    try {
      const { project_id, items } = req.body;
    
      // Logging detallado
      console.log('Datos recibidos en el controlador:', {
        project_id: project_id,
        items: items,
        body: req.body
      });
    
      // Validaciones más específicas
      if (!project_id) {
        return res.status(400).json({ 
          error: 'Datos incompletos o inválidos',
          detail: 'project_id es requerido',
          received: req.body 
        });
      }
    
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ 
          error: 'Datos incompletos o inválidos',
          detail: 'items debe ser un array',
          received: req.body 
        });
      }
    
      if (items.length === 0) {
        return res.status(400).json({ 
          error: 'Datos incompletos o inválidos',
          detail: 'items no puede estar vacío',
          received: req.body 
        });
      }
    
      // Validar estructura de cada item
      const itemsValidos = items.every(item => 
        item.material_id && 
        item.cantidad && 
        item.precio_unitario
      );
    
      if (!itemsValidos) {
        return res.status(400).json({ 
          error: 'Datos incompletos o inválidos',
          detail: 'Cada item debe tener material_id, cantidad y precio_unitario',
          received: { items }
        });
      }
    
      // Obtener quote_number del proyecto
      const projectResult = await pool.query(
        'SELECT quote_number FROM projects WHERE project_id = \$1',
        [project_id]
      );
    
      if (!projectResult.rows[0]) {
        return res.status(404).json({ 
          error: 'Proyecto no encontrado',
          project_id: project_id 
        });
      }
    
      const quote_number = projectResult.rows[0].quote_number;
    
      const newLista = await listaMaterialesModel.createLista(
        project_id,
        quote_number,
        items
      );
    
      res.status(201).json(newLista);
    } catch (error) {
      console.error('Error en createLista:', error);
      res.status(500).json({
        error: 'Error al crear la lista',
        detail: error.message
      });
    }
    };

const searchMaterials = async (req, res) => {
try {
  const { term } = req.query;

  if (!term || term.length < 2) {
    return res.json([]);
  }

  const materials = await listaMaterialesModel.searchMaterials(term);
  res.json(materials);
} catch (error) {
  console.error('Error searching materials:', error);
  res.status(500).json({ error: error.message });
}
};

const getListaByProject = async (req, res) => {
  try {
    const { projectId } = req.params; // Asegúrate de que esto esté correcto
    const lista = await listaMaterialesModel.getListaByProject(projectId);
  
    if (!lista) {
      return res.status(404).json({ 
        message: 'No se encontró lista para este proyecto',
        projectId 
      });
    }
  
    res.json(lista);
  } catch (error) {
    console.error('Error al obtener lista por proyecto:', error);
    res.status(500).json({ error: error.message });
  }
  };

const getAllListas = async (req, res) => {
try {
  const listas = await listaMaterialesModel.getAllListas();
  res.json(listas);
} catch (error) {
  console.error('Error al obtener listas:', error);
  res.status(500).json({ error: error.message });
}
};

const getListaById = async (req, res) => {
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
};

const updateLista = async (req, res) => {
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
};

const deleteLista = async (req, res) => {
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
};

module.exports = {
createLista,
searchMaterials,
getListaByProject,
getAllListas,
getListaById,
updateLista,
deleteLista
};