import React, { useEffect, useState, useRef } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const RegistroPago = () => {
  const [pagos, setPagos] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    setPagos(pagosGuardados);
  }, []);

  const handleDotsClick = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDeletePago = (index) => {
    const updatedPagos = pagos.filter((_, i) => i !== index);
    setPagos(updatedPagos);
    localStorage.setItem('pagos', JSON.stringify(updatedPagos));
    setOpenIndex(null);
  };

  const handleDownloadPago = (pago) => {
    const blob = new Blob([JSON.stringify(pago, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pago.trabajador}_pago.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="uwu p-3 ">
    <div className="uwu2 flex flex-col p-5">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Registro de Pagos</h2>
      {pagos.length === 0 ? (
        <p className="text-gray-600">No hay pagos registrados.</p>
      ) : (
        <table className="w-full border-collapse bg-gray-50 shadow-md rounded-lg">
          <thead>
            <tr className="text-black text-sm leading-normal">
              <th className="py-3 px-6 text-left">Trabajador</th>
              <th className="py-3 px-6 text-left">Fecha</th>
              <th className="py-3 px-6 text-left">Día</th>
              <th className="py-3 px-6 text-left">Colación</th>
              <th className="py-3 px-6 text-left">Gestión</th>
              <th className="py-3 px-6 text-left">Extra</th>
              <th className="py-3 px-6 text-center"></th>
            </tr>
          </thead>
          <tbody className="text-black text-sm font-xl">
            {pagos.map((pago, index) => (
              <React.Fragment key={index}>
                {pago.pagos.map((p, i) => (
                  <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {pago.trabajador}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      Día {i + 1}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {p.dia}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {p.colacion}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {p.gestion}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {p.extra}
                    </td>
                    <td className="py-3 px-6 text-center relative">
                      <DotsVerticalIcon
                        className="h-6 w-6 text-gray-500 cursor-pointer"
                        onClick={() => handleDotsClick(index)}
                      />
                      {openIndex === index && (
                        <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                          <button
                            className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100"
                            onClick={() => handleDownloadPago(pago)}
                          >
                            Descargar
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                            onClick={() => handleDeletePago(index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div></div>
  );
};

export default RegistroPago;
