// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Pclient from './clients/pages/Pclient';
import Pmaterial from './materials/pages/Pmaterial';
import MaterialsProvider from './general/MaterialsContext';
import './index.css'
function App() {
  return (
    <MaterialsProvider>
    <Router>
      <Routes>
        <Route path="/clients" element={<Pclient />} />
        <Route path="/materials" element={<Pmaterial />} />
        <Route path="/" element={<Navigate to="/clients" />} />
        <Route path="*" element={<div>Página no encontrada (404)</div>} />
      </Routes>
    </Router>
  </MaterialsProvider>
  );
}

export default App;
