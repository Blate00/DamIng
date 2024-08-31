  import React, { useState, useEffect } from 'react';
  import { UserIcon } from '@heroicons/react/outline';

  const ClientForm = ({ clients, addClient }) => {
    const [formData, setFormData] = useState({
      clientName: '',
      email: '',
      address: '',
      phone: '',
      jobType: '',
      clientImage: ''
    });
    const [clientMatches, setClientMatches] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (formData.clientName.trim()) {
        const matches = clients.filter(client =>
          client.name.toLowerCase().includes(formData.clientName.toLowerCase())
        );
        if (matches.length === 1 && matches[0].name.toLowerCase() === formData.clientName.toLowerCase()) {
          handleClientSelect(matches[0]);
        } else {
          setClientMatches(matches);
        }
      } else {
        setClientMatches([]);
      }
    }, [formData.clientName, clients]);

    const handleInputChange = (e) => {
      const { id, value } = e.target;
      setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleClientSelect = (client) => {
      setFormData({
        clientName: client.name,
        email: client.email,
        address: client.address,
        phone: client.phone,
        jobType: '',
        clientImage: client.image || client.name.charAt(0).toUpperCase()
      });
      setClientMatches([]);
    };

    const handleAddClient = () => {
      const { clientName, email, address, phone, jobType, clientImage } = formData;
      if (clientName.trim()) {
        addClient(clientName, email, address, phone, jobType, clientImage);
        setFormData({
          clientName: '',
          email: '',
          address: '',
          phone: '',
          jobType: '',
          clientImage: ''
        });
        setShowModal(true);
      }
    };

    const closeModal = () => setShowModal(false);

    return (
      <div className=" bg-gray-50 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <UserIcon className="h-6 w-6 text-red-800 mr-2" />
        Nuevo Proyecto
        </h2>
        <div className="mb-4">
          <input
            type="text"
            id="clientName"
            placeholder="Nombre del Cliente"
            value={formData.clientName}
            onChange={handleInputChange}
            className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
          />
          {clientMatches.length > 0 && (
            <ul className="border border-gray-300 rounded-lg mt-2 bg-white shadow-md">
              {clientMatches.map((client, index) => (
                <li
                  key={index}
                  onClick={() => handleClientSelect(client)}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                >
                  {client.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            placeholder="Correo Electrónico"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="jobType"
            placeholder="Tipo de Trabajo"
            value={formData.jobType}
            onChange={handleInputChange}
            className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddClient}
            className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition"
          >
            Guardar Cliente
          </button>
        </div>

        {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-800">Proyecto Registrado</h3>
              <button
                onClick={closeModal}
                className="mt-4 bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default ClientForm;  
