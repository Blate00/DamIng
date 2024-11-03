// DashboardSummary.js
import React from 'react';
import { AcademicCapIcon, BriefcaseIcon, ClipboardListIcon, UserGroupIcon } from '@heroicons/react/outline';

const DashboardSummary = ({ activeProjectsCount}) => {
  return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-5">
  <div className="p-4 h-32 rounded-xl shadow-md flex items-center bg-gradient-to-r from-red-800 to-red-900">
    <div className="bg-red-800 p-3 rounded-full flex items-center justify-center">
      <AcademicCapIcon className="w-6 h-6 text-white" />
    </div>
    <div className="ml-4 text-left">
      <h2 className="text-white font-semibold">Resumen Mano Obra</h2>
      <p className="text-white text-xl font-bold">0</p>
    </div>
  </div>

 

  <div className="p-4 h-32 rounded-xl shadow-md flex items-center bg-gradient-to-r from-gray-500 to-gray-700">
    <div className="bg-gray-800 p-3 rounded-full flex items-center justify-center">
      <ClipboardListIcon className="w-6 h-6 text-white" />
    </div>
    <div className="ml-4 text-left">
      <h2 className="text-white font-semibold">Resumen Asignación</h2>
      <p className="text-white text-xl font-bold">0</p>
    </div>
  </div>

  <div className="p-4 h-32 rounded-xl shadow-md flex items-center bg-gradient-to-r from-gray-500 to-gray-700">
    <div className="bg-gray-800 p-3 rounded-full flex items-center justify-center">
      <UserGroupIcon className="w-6 h-6 text-white" />
    </div>
    <div className="ml-4 text-left">
      <h2 className="text-white font-semibold">Proyectos Activos</h2>
      <p className="text-white text-xl font-bold">{activeProjectsCount}</p>
    </div>
  </div>
</div>
  );
};

export default DashboardSummary;