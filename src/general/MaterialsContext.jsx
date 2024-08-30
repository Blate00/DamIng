import React, { createContext, useContext, useState } from 'react';

const MaterialsContext = createContext();

export const useMaterials = () => useContext(MaterialsContext);

const initialMaterials = [
  { id: 1, item: "A001", group: "alimentador", description: "cámaras de registro de 300x300", value: 50 },
  { id: 2, item: "A002", group: "alimentador", description: "superflex 4 AWG", value: 30 },
  { id: 3, item: "A003", group: "alimentador", description: "soporte para caja", value: 10 },
  { id: 4, item: "A004", group: "alimentador", description: "PVC conduit 32 mm", value: 20 },
  { id: 5, item: "A005", group: "alimentador", description: "salida de caja 32 mm", value: 15 },
  { id: 6, item: "A006", group: "alimentador", description: "vinilit", value: 5 },
  { id: 7, item: "A007", group: "alimentador", description: "camara de registro 200x200", value: 40 },
  { id: 8, item: "A008", group: "alimentador", description: "gas butano", value: 60 },
  { id: 9, item: "A009", group: "alimentador", description: "Cinta de peligro", value: 7 },
  { id: 10, item: "A010", group: "alimentador", description: "Alambre galvanizado 18 awg", value: 25 },
  { id: 11, item: "A011", group: "alimentador", description: "Borne a tierra autoajustable 4 - 6 mm", value: 18 },
  { id: 12, item: "A012", group: "alimentador", description: "Luz piloto riel din", value: 22 },
  { id: 13, item: "B001", group: "empalme", description: "Hormigón", value: 120 },
  { id: 14, item: "B002", group: "empalme", description: "Bifasico 2x40", value: 85 },
  { id: 15, item: "B003", group: "empalme", description: "medidor", value: 100 },
  { id: 16, item: "B004", group: "empalme", description: "galvanizado 32 mm", value: 50 },
  { id: 17, item: "B005", group: "empalme", description: "emt 20 mm", value: 12 },
  { id: 18, item: "B006", group: "empalme", description: "Perfil metalico 100x100 3 m", value: 90 },
  { id: 19, item: "B007", group: "empalme", description: "spray negro", value: 8 },
  { id: 20, item: "B008", group: "empalme", description: "terminal hub 32 mm", value: 14 },
  { id: 21, item: "B009", group: "empalme", description: "terminal recto 32 mm", value: 10 },
  { id: 22, item: "B010", group: "empalme", description: "Caja medidor plastica", value: 35 },
  { id: 23, item: "B011", group: "empalme", description: "saime 40 A", value: 27 },
  { id: 24, item: "B012", group: "empalme", description: "cinta roja blanca y verde (economica)", value: 3 },
  { id: 25, item: "B013", group: "empalme", description: "Terminales ferrule 6 mm", value: 6 },
  { id: 26, item: "B014", group: "empalme", description: "gavinete 300x200 mm", value: 80 },
  { id: 27, item: "B015", group: "empalme", description: "abrazadera caddy 32 mm", value: 5 },
  { id: 28, item: "B016", group: "empalme", description: "abrazadera caddy emt 20 mm", value: 5 },
  { id: 29, item: "B017", group: "empalme", description: "superflex 8 AWG", value: 30 },
  { id: 30, item: "B018", group: "empalme", description: "superflex 10 Awg", value: 20 },
  { id: 31, item: "C001", group: "interior bodega", description: "camara de registro 110", value: 45 },
  { id: 32, item: "C002", group: "interior bodega", description: "barra tierra con prensa 1 metro", value: 50 },
  { id: 33, item: "C003", group: "interior bodega", description: "Salida de caja 32 mm", value: 15 },
  { id: 34, item: "C004", group: "interior bodega", description: "Emt 32 mm", value: 35 },
  { id: 35, item: "C005", group: "interior bodega", description: "Terminal emt 32 mm", value: 10 },
  { id: 36, item: "C006", group: "interior bodega", description: "Emt 20 mm", value: 12 },
  { id: 37, item: "C007", group: "interior bodega", description: "abrazadera caddy 32 mm", value: 5 },
  { id: 38, item: "C008", group: "interior bodega", description: "Terminal emt 20 mm", value: 12 },
  { id: 39, item: "C009", group: "interior bodega", description: "Terminal emt 32 mm", value: 10 },
  { id: 40, item: "C010", group: "interior bodega", description: "bandeja 100x50", value: 18 },
  { id: 41, item: "C011", group: "interior bodega", description: "Tapa finalbandeja 100x50", value: 10 },
  { id: 42, item: "C012", group: "interior bodega", description: "barra tierra y prensa 1 m", value: 30 },
  { id: 43, item: "D001", group: "tablero bodega", description: "bandeja ranurada 60 Alto x 40 ancho", value: 70 },
  { id: 44, item: "D002", group: "tablero bodega", description: "Switch transferencia", value: 150 },
  { id: 45, item: "D003", group: "tablero bodega", description: "Rotulos", value: 5 },
  { id: 46, item: "D004", group: "tablero bodega", description: "bornes viking", value: 18 },
  { id: 47, item: "D005", group: "tablero bodega", description: "bifasico 32A", value: 85 },
  { id: 48, item: "D006", group: "tablero bodega", description: "Luz piloto verde", value: 10 },
  { id: 49, item: "D007", group: "tablero bodega", description: "repartidor bipolar 7 salidas", value: 55 },
  { id: 50, item: "D008", group: "tablero bodega", description: "Tablero metálico 600x400", value: 120 },
  { id: 51, item: "D009", group: "tablero bodega", description: "RIEL DIN SIMETRICO", value: 15 },
  { id: 52, item: "D010", group: "tablero bodega", description: "AUTOMATICO 10 10A", value: 35 },
  { id: 53, item: "D011", group: "tablero bodega", description: "AUTOMATICO 10x20", value: 50 },
  { id: 54, item: "D012", group: "tablero bodega", description: "DIFERENCIAL 2x25 30 mA", value: 80 },
  { id: 55, item: "D013", group: "tablero bodega", description: "Luz piloto roja", value: 10 },
  { id: 56, item: "D014", group: "tablero bodega", description: "porta fusible", value: 5 },
  { id: 57, item: "D015", group: "tablero bodega", description: "fusible 2A", value: 3 },
  { id: 58, item: "D016", group: "tablero bodega", description: "Tapa final", value: 10 },
  { id: 59, item: "D017", group: "tablero bodega", description: "enchufe monofasico industrial sobrepuesto 2p+t", value: 18 },
  { id: 60, item: "D018", group: "tablero bodega", description: "enchufe monofasico industrial volante hembra", value: 12 },
  { id: 61, item: "D019", group: "tablero bodega", description: "Tablero bodega 110x50", value: 50 },
  { id: 62, item: "E001", group: "tablero casa", description: "Tapa final", value: 8 },
  { id: 63, item: "E002", group: "tablero casa", description: "bifasico 32A", value: 85 },
  { id: 64, item: "E003", group: "tablero casa", description: "Luz piloto riel din", value: 12 },
  { id: 65, item: "E004", group: "tablero casa", description: "PORTAFUSIBLE MONOPOLARES", value: 10 },
  { id: 66, item: "E005", group: "tablero casa", description: "fusible 2A", value: 3 },
  { id: 67, item: "E006", group: "tablero casa", description: "soporte bipolar 15 salidas", value: 25 },
  { id: 68, item: "E007", group: "tablero casa", description: "AUTOMATICO-DIFERENCIAL 10 10A", value: 40 },
  { id: 69, item: "E008", group: "tablero casa", description: "Interruptor 32A", value: 25 },
  { id: 70, item: "E009", group: "tablero casa", description: "TABLERO DE TIERRA 12 SALIDAS", value: 35 },
];

const MaterialsProvider = ({ children }) => {
  const [materials, setMaterials] = useState(initialMaterials);

  return (
    <MaterialsContext.Provider value={[materials, setMaterials]}>
      {children}
    </MaterialsContext.Provider>
  );
};

export default MaterialsProvider;
