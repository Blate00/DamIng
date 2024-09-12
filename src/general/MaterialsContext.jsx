import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client'; // Ajusta la ruta según la ubicación de tu archivo

// Crear el contexto
const MaterialsContext = createContext();

// Proveedor del contexto
const MaterialsProvider = ({ children }) => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Función para obtener datos de Supabase
    const fetchMaterials = async () => {
      try {
        const { data, error } = await supabase
          .from('materiales')
          .select('*');
        if (error) throw error;
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <MaterialsContext.Provider value={[materials, setMaterials]}>
      {children}
    </MaterialsContext.Provider>
  );
};

// Hook para usar el contexto
const useMaterials = () => useContext(MaterialsContext);

// Exportar como exportación por defecto
export default MaterialsProvider;
export { useMaterials };
