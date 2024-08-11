import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import damLogo from '../../../assets/dam.jpg';

const Presupuesto = () => {
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  const [items, setItems] = useState([
    { description: '', quantity: '', unitValue: '', total: '' }
  ]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'quantity' || field === 'unitValue') {
      updatedItems[index].total = (updatedItems[index].quantity * updatedItems[index].unitValue).toFixed(2);
    }
    setItems(updatedItems);

    // Agregar una nueva fila si la actual está completa
    if (
      updatedItems[index].description &&
      updatedItems[index].quantity &&
      updatedItems[index].unitValue &&
      index === updatedItems.length - 1
    ) {
      setItems([...updatedItems, { description: '', quantity: '', unitValue: '', total: '' }]);
    }
  };

  const formatCLP = (value) => {
    return parseFloat(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const calculateNetTotal = () => {
    return items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
  };

  const netTotal = calculateNetTotal();
  const gg = (netTotal * 0.20).toFixed(2);
  const gestion = (netTotal * 0.08).toFixed(2);
  const totalNet = (parseFloat(netTotal) + parseFloat(gg) + parseFloat(gestion)).toFixed(2);

  const exportToPDF = () => {
    const input = document.getElementById('presupuesto-content');
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Añadiendo el logo y ajustando el contenido
        pdf.addImage(damLogo, 'JPEG', 20, 20, 20, 20);
        pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
        pdf.save('presupuesto.pdf');
      })
      .catch(err => console.error(err));
  };

  const exportToExcel = () => {
    const filteredItems = items.filter(item => item.description || item.quantity || item.unitValue);

    const data = [
      ["", "", "", "", "", ""],
      ["", "DAM INGENIERIA", "", job.name, "Nº CTZ:", "249"],
      ["", "", "", "", ""],
      ["", "", client.name, "", job.date],
      ["", "", , "",],
      ["ITEM", "DESCRIPCIÓN", "cantidad", "VALOR UNIT", "TOTAL"],
      ...filteredItems.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        item.unitValue,
        item.total
      ]),
      ["OBS:", "Documento: Boleta Honorario (+ Impto)"],
      ["", "Condición de pago por estado de avance"],
      ["", `inversión $ ${formatCLP(netTotal)}`],
      ["", "COTIZACIÓN VALIDA POR 20 DÍAS"],
      ["", "", "", "NETO", formatCLP(netTotal)],
      ["", "", "", "GG", formatCLP(gg)],
      ["", "", "", "Gestion", formatCLP(gestion)],
      ["", "", "", "TOTAL NETO", formatCLP(totalNet)]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Presupuesto');
    XLSX.writeFile(wb, 'Presupuesto.xlsx');
  };

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  const job = client.jobs.find(job => job.id === jobId);

  if (!job) {
    return <div>Trabajo no encontrado</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
  <div className="p-4 flex-grow">
    <div id="presupuesto-content" className="bg-white p-6 md:p-8 rounded-md shadow-md">
      <div className="mb-6 text-left">
        <h2 className="text-lg md:text-2xl font-semibold">{client.name}</h2>
        
        <p className="mt-2 text-gray-500 text-xs md:text-sm">Dirección: {client.address}</p>
        <p className="text-gray-500 text-xs md:text-sm">Tipo de Trabajo: {job.name}</p>
        <p className="text-gray-500 text-xs md:text-sm">Fecha del Trabajo: {job.date}</p>
      </div>
      
      <h4 className="text-base md:text-xl font-semibold mt-4 mb-4">Rendición de Fondos</h4>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-red-900 text-white">
            <tr>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">ITEM</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">FECHA</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">DETALLE</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">PROVEEDOR</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">FOLIO</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">DOCUMENTO</th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-base">TOTAL</th>
           
            </tr>
          </thead>
          <tbody className="text-center">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="py-2 px-2 md:px-4 border text-xs md:text-base">{index + 1}</td>
                <td className="py-2 px-2 md:px-4 border">
                <input
  type="text"
  value={item.description}
  onChange={(e) => handleChange(index, 'description', e.target.value)}
  className="p-1 w-full text-left text-xs md:text-base border-none"
/>

                </td>
                <td className="py-2 px-2 md:px-4 border">
                <input
  type="text"
  value={item.description}
  onChange={(e) => handleChange(index, 'description', e.target.value)}
  className="p-1 w-full text-left text-xs md:text-base border-none"
/>

                </td> <td className="py-2 px-2 md:px-4 border">
                <input
  type="text"
  value={item.description}
  onChange={(e) => handleChange(index, 'description', e.target.value)}
  className="p-1 w-full text-left text-xs md:text-base border-none"
/>

                </td>
                <td className="py-2 px-2 md:px-4 border">
                  <input
                    type="number"
                    value={item.unitValue}
                    onChange={(e) => handleChange(index, 'unitValue', e.target.value)}
                    className="p-1 w-full text-left text-xs md:text-base border-none"
                  />
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs md:text-base">{formatCLP(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-right">
        <p className="text-sm md:text-lg text-gray-600">Neto <span className="font-bold">{formatCLP(netTotal)}</span></p>
        <p className="text-sm md:text-lg text-gray-600">GG  <span className="font-bold">{formatCLP(gg)}</span></p>
        <p className="text-sm md:text-lg text-gray-600">Gestión <span className="font-bold">{formatCLP(gestion)}</span></p>
        <p className="text-sm md:text-lg text-gray-700">Total Neto <span className="font-bold">{formatCLP(totalNet)}</span></p>
      </div>
    </div>

    <div className="mt-4 flex flex-col md:flex-row gap-4">
      <button 
        onClick={exportToPDF} 
        className="bg-red-700 text-white p-2 rounded-md hover:bg-red-800 text-sm md:text-base">
        Exportar a PDF
      </button>
      <button 
        onClick={exportToExcel} 
        className="bg-red-700 text-white p-2 rounded-md hover:bg-red-800 text-sm md:text-base">
        Exportar a Excel
      </button>
    </div>
  </div>
</div>

  );
};

export default Presupuesto;
