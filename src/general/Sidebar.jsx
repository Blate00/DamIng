// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <ul>
        <li>
          <Link to="/clients">Clientes</Link>
        </li>
        <li>
          <Link to="/materials">Materiales</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
