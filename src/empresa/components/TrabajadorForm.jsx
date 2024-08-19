import React, { useState, useEffect } from 'react';

const TrabajadorForm = ({ trabajadores, addTrabajador }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
  });
  const [trabajadorMatches, setTrabajadorMatches] = useState([]);

  useEffect(() => {
    if (formData.nombre.trim()) {
      setTrabajadorMatches(
        trabajadores.filter(trabajador =>
          trabajador.nombre.toLowerCase().includes(formData.nombre.toLowerCase())
        )
      );
    } else {
      setTrabajadorMatches([]);
    }
  }, [formData.nombre, trabajadores]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleTrabajadorSelect = (trabajador) => {
    setFormData({
      nombre: trabajador.nombre,
      telefono: trabajador.telefono,
      correo: trabajador.correo,
    });
    setTrabajadorMatches([]);
  };

  const handleAddTrabajador = () => {
    const { nombre, telefono, correo } = formData;
    if (nombre.trim()) {
      addTrabajador(nombre, telefono, correo);
      setFormData({
        nombre: '',
        telefono: '',
        correo: '',
      });
    }
  };

  return (
    <div className="p-4 rounded-md  mb-4 sm:mb-4">
      <h2 className="text-lg font-semibold mb-2">Añadir Trabajador</h2>
      <div className="grid grid-cols-4 gap-4">
        <input
          type="text"
          id="nombre"
          placeholder="Nombre del Trabajador"
          value={formData.nombre}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {trabajadorMatches.length > 0 && (
          <ul className="col-span-4 border border-gray-300 rounded mt-2">
            {trabajadorMatches.map((trabajador, index) => (
              <li
                key={index}
                onClick={() => handleTrabajadorSelect(trabajador)}
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {trabajador.nombre}
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          id="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          id="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900"
          onClick={handleAddTrabajador}
        >
          Guardar Trabajador
        </button>
      </div>
    </div>
  );
};

export default TrabajadorForm;
