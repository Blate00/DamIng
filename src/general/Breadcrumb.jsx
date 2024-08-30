import React from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();

  // Convierte la ruta en un formato amigable "DamING/CurrentPage"
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumb = ['Dashboard', ...pathnames.map(capitalize)].join('/');

  // Función para capitalizar la primera letra de cada palabra
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="text-gray-500 font-semibold mb-4">
      {breadcrumb}
    </div>
  );
};

export default Breadcrumb;
