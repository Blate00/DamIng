import React from 'react';

const ExportButtons = ({ exportToPDF, exportToExcel }) => (
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
);

export default ExportButtons;
