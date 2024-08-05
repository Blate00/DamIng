import React, { createContext, useContext, useState, useEffect } from 'react';

const MaterialsContext = createContext();

export const useMaterials = () => useContext(MaterialsContext);

const initialMaterials = [
  { group: "alimentador", description: "cámaras de registro de 300x300", value: 50 },
  { group: "alimentador", description: "superflex 4 AWG", value: 30 },
  { group: "alimentador", description: "soporte para caja", value: 10 },
  { group: "alimentador", description: "PVC conduit 32 mm", value: 20 },
  { group: "alimentador", description: "salida de caja 32 mm", value: 15 },
  { group: "alimentador", description: "vinilit", value: 5 },
  { group: "alimentador", description: "camara de registro 200x200", value: 40 },
  { group: "alimentador", description: "gas butano", value: 60 },
  { group: "alimentador", description: "Cinta de peligro", value: 7 },
  { group: "alimentador", description: "Alambre galvanizado 18 awg", value: 25 },
  { group: "alimentador", description: "Borne a tierra autoajustable 4 - 6 mm", value: 18 },
  { group: "alimentador", description: "Luz piloto riel din", value: 22 },
  { group: "empalme", description: "Hormigón", value: 120 },
  { group: "empalme", description: "Bifasico 2x40", value: 85 },
  { group: "empalme", description: "medidor", value: 100 },
  { group: "empalme", description: "galvanizado 32 mm", value: 50 },
  { group: "empalme", description: "emt 20 mm", value: 12 },
  { group: "empalme", description: "Perfil metalico 100x100 3 m", value: 90 },
  { group: "empalme", description: "spray negro", value: 8 },
  { group: "empalme", description: "terminal hub 32 mm", value: 14 },
  { group: "empalme", description: "terminal recto 32 mm", value: 10 },
  { group: "empalme", description: "Caja medidor plastica", value: 35 },
  { group: "empalme", description: "saime 40 A", value: 27 },
  { group: "empalme", description: "cinta roja blanca y verde (economica)", value: 3 },
  { group: "empalme", description: "Terminales ferrule 6 mm", value: 6 },
  { group: "empalme", description: "gavinete 300x200 mm", value: 80 },
  { group: "empalme", description: "abrazadera caddy 32 mm", value: 5 },
  { group: "empalme", description: "abrazadera caddy emt 20 mm", value: 5 },
  { group: "empalme", description: "superflex 8 AWG", value: 30 },
  { group: "empalme", description: "superflex 10 Awg", value: 20 },
  { group: "empalme", description: "superflex 10 Awg", value: 20 },
  { group: "interior bodega", description: "camara de registro 110", value: 45 },
  { group: "interior bodega", description: "barra tierra con prensa 1 metro", value: 50 },
  { group: "interior bodega", description: "Salida de caja 32 mm", value: 15 },
  { group: "interior bodega", description: "Emt 32 mm", value: 35 },
  { group: "interior bodega", description: "Terminal emt 32 mm", value: 10 },
  { group: "interior bodega", description: "Emt 20 mm", value: 12 },
  { group: "interior bodega", description: "abrazadera caddy 32 mm", value: 5 },
  // Otros materiales aquí...
];

const MaterialsProvider = ({ children }) => {
  const [materials, setMaterials] = useState(() => {
    const savedMaterials = localStorage.getItem('materials');
    if (savedMaterials) {
      try {
        return JSON.parse(savedMaterials);
      } catch (e) {
        console.error("Error al analizar los materiales guardados:", e);
        return initialMaterials;
      }
    } 
    return initialMaterials;
  });

  useEffect(() => {
    // Guardar materiales iniciales en localStorage si no están presentes
    if (!localStorage.getItem('materials')) {
      localStorage.setItem('materials', JSON.stringify(initialMaterials));
    }
  }, []);

  useEffect(() => {
    // Guardar materiales en localStorage cada vez que cambien
    localStorage.setItem('materials', JSON.stringify(materials));
  }, [materials]);

  return (
    <MaterialsContext.Provider value={[materials, setMaterials]}>
      {children}
    </MaterialsContext.Provider>
  );
};

export default MaterialsProvider;
