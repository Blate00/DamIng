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
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Agregar Trabajador</h2>
      <div className="mb-4">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Trabajador
        </label>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
        {trabajadorMatches.length > 0 && (
          <ul className="border border-gray-300 rounded-md mt-2">
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
      </div>
      {['telefono', 'correo'].map(field => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'correo' ? 'email' : 'text'}
            id={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          onClick={handleAddTrabajador}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
        >
          Guardar Trabajador
        </button>
      </div>
    </div>
  );
};

export default TrabajadorForm;
