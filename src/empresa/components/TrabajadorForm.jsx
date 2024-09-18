import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

const TrabajadorForm = ({ onTrabajadorAdded }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    fetchBancos();
    fetchTiposCuenta();
  }, []);

  const fetchBancos = async () => {
    const { data, error } = await supabase
      .from('banco')
      .select('banco_id, nombre_banco');
    if (error) console.error('Error fetching bancos:', error);
    else setBancos(data);
  };

  const fetchTiposCuenta = async () => {
    const { data, error } = await supabase
      .from('tipocuenta')
      .select('tipo_cuenta_id, nombre_tipo_cuenta');
    if (error) console.error('Error fetching tipos de cuenta:', error);
    else setTiposCuenta(data);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleAddTrabajador = async (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      try {
        const { data, error } = await supabase
          .from('employees')
          .insert([formData])
          .select();

        if (error) throw error;

        console.log('Trabajador añadido:', data);
        onTrabajadorAdded();
        setFormData({
          name: '',
          phone_number: '',
          email: '',
          banco_id: '',
          tipo_cuenta_id: '',
          account_number: '',
        });
        setIsFormOpen(false);
      } catch (error) {
        console.error('Error al añadir trabajador:', error);
      }
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="p-4 rounded-md mb-4 sm:mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Añadir Trabajador</h2>
        <button onClick={toggleForm} className="focus:outline-none">
          {isFormOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleAddTrabajador} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            id="name"
            placeholder="Nombre del Trabajador"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            id="phone_number"
            placeholder="Teléfono"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            id="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            id="banco_id"
            value={formData.banco_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccione un banco</option>
            {bancos.map(banco => (
              <option key={banco.banco_id} value={banco.banco_id}>
                {banco.nombre_banco}
              </option>
            ))}
          </select>
          <select
            id="tipo_cuenta_id"
            value={formData.tipo_cuenta_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccione tipo de cuenta</option>
            {tiposCuenta.map(tipo => (
              <option key={tipo.tipo_cuenta_id} value={tipo.tipo_cuenta_id}>
                {tipo.nombre_tipo_cuenta}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="account_number"
            placeholder="Número de Cuenta"
            value={formData.account_number}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900 sm:col-span-2"
          >
            Guardar Trabajador
          </button>
        </form>
      )}
    </div>
  );
};

export default TrabajadorForm;