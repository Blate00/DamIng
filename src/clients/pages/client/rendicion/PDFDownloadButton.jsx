// src/components/PDFDownloadButton.jsx
import React from 'react';
import { PDFGenerator } from './PDFGenerator';

const PDFDownloadButton = ({ job, items, proveedores, asignacionesData, manoObraData, formatCLP, logo }) => {
const handleDownload = async () => {
  try {
    const pdfGenerator = new PDFGenerator(
      job,
      items,
      proveedores,
      asignacionesData,
      manoObraData,
      formatCLP,
      logo    );

    await pdfGenerator.generatePDF();
  } catch (error) {
    console.error('Error en la descarga:', error);
    alert('Error al generar el PDF');
  }
};

return (
  <button 
    onClick={handleDownload}
    className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
  >
    Generar Informe Completo PDF
  </button>
);
};

export default PDFDownloadButton;