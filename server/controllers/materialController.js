const materialModel = require('../models/db/materialModel');

const createMaterial = async (req, res) => {
  try {
    const materialData = req.body;
    // Validación de datos
    if (!materialData.category || !materialData.description || !materialData.current_value) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const newMaterial = await materialModel.addMaterial(materialData);
    res.status(201).json(newMaterial);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ error: 'Error al crear el material', details: error.message });
  }
};

const fetchMaterials = async (req, res) => {
  try {
    const { category } = req.query;
    let materials;
    
    if (category) {
      materials = await materialModel.getMaterialsByCategory(category);
    } else {
      materials = await materialModel.getMaterials();
    }
    
    res.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Error al obtener materiales', details: error.message });
  }
};

const getMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const material = await materialModel.getMaterialById(materialId);
    
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    
    res.json(material);
  } catch (error) {
    console.error('Error fetching material:', error);
    res.status(500).json({ error: 'Error al obtener el material', details: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const { new_value } = req.body;
    
    if (!new_value || isNaN(new_value)) {
      return res.status(400).json({ error: 'El valor nuevo es requerido y debe ser numérico' });
    }

    const updatedMaterial = await materialModel.updateMaterialValue(materialId, new_value);
    
    if (!updatedMaterial) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    
    res.json(updatedMaterial);
  } catch (error) {
    console.error('Error updating material:', error);
    res.status(500).json({ error: 'Error al actualizar material', details: error.message });
  }
};

const removeMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;
    const deletedMaterial = await materialModel.deleteMaterial(materialId);
    
    if (!deletedMaterial) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
    
    res.json({ message: 'Material eliminado exitosamente', material: deletedMaterial });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Error al eliminar material', details: error.message });
  }
};

module.exports = {
  createMaterial,
  fetchMaterials,
  getMaterial,
  updateMaterial,
  removeMaterial
};