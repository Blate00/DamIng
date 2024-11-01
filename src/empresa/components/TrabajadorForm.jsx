import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrabajadorForm = ({ onTrabajadorAdded, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    banco_id: '',
    tipo_cuenta_id: '',
    account_number: '',
  });
  const [bancos, setBancos] = useState([]);
  const [tiposCuenta, setTiposCuenta] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchBancos();
      fetchTiposCuenta();
    }
  }, [isOpen]);

  const fetchBancos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/banco'); // Asegúrate de que esta ruta exista
      setBancos(response.data);
    } catch (error) {
      console.error('Error fetching bancos:', error);
    }
  };

  const fetchTiposCuenta = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tipocuenta'); // Asegúrate de que esta ruta exista
      setTiposCuenta(response.data);
    } catch (error) {
      console.error('Error fetching tipos de cuenta:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/api/empleados', formData);
        console.log('Trabajador añadido:', response.data);
        onTrabajadorAdded();
        setFormData({
          name: '',
          phone_number: '',
          email: '',
          banco_id: '',
          tipo_cuenta_id: '',
          account_number: '',
        });
        onClose();
      } catch (error) {
        console.error('Error al añadir trabajador:', error);
      }
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-red-100">
          <h3 className="text-2xl font-bold text-red-800">Nuevo Trabajador</h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Trabajador</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre completo"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Ej: +56 9 1234 5678"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ejemplo@correo.com"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
            <div>
              <label htmlFor="banco_id" className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
              <select
                id="banco_id"
                value={formData.banco_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="">Seleccione un banco</option>
                {bancos.map(banco => (
                  <option key={banco.banco_id} value={banco.banco_id}>{banco.nombre_banco}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tipo_cuenta_id" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
              <select
                id="tipo_cuenta_id"
                value={formData.tipo_cuenta_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="">Seleccione tipo de cuenta</option>
                {tiposCuenta.map(tipo => (
                  <option key={tipo.tipo_cuenta_id} value={tipo.tipo_cuenta_id}>{tipo.nombre_tipo_cuenta}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="account_number" className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta</label>
              <input
                type="text"
                id="account_number"
                value={formData.account_number}
                onChange={handleInputChange}
                placeholder="Ingrese el número de cuenta"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Guardar Trabajador
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrabajadorForm;