// DashboardSummary.js
import React from 'react';
import { AcademicCapIcon, BriefcaseIcon, ClipboardListIcon, UserGroupIcon } from '@heroicons/react/outline';

const DashboardSummary = ({ activeProjectsCount}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
      <div className="cuadro1 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-red-900 p-3 rounded-lg flex items-center justify-center">
          <AcademicCapIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-white font-medium">Balance Total</h2>
          <p className="text-white text-2xl font-bold"> GG 0</p>
          <p className="text-white text-2xl font-bold"> Gestión 0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <BriefcaseIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Resumen Mano Obra</h2>
          <p className="text-black text-2xl font-bold">0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <ClipboardListIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Resumen Asignación</h2>
          <p className="text-black text-2xl font-bold">0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <UserGroupIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Proyectos Activos</h2>
          <p className="text-black text-2xl font-bold">{activeProjectsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;