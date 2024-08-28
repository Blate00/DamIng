import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Pclient from './clients/pages/Pclient';
import Pmaterial from './materials/pages/Pmaterial';
import MaterialsProvider from './general/MaterialsContext';
import Archives from './clients/pages/client/Archives';
import MaterialesPage from './clients/pages/client/Materiales';
import PresupuestoPage from './clients/pages/client/Presupuesto';
import RendicionPage from './clients/pages/client/Rendicion';
import FlujoPage from './clients/pages/client/FlujoCaja';
import ListadoTrabajos from './clients/pages/client/ListadoTrabajos';
import Pempresa from './empresa/pages/Trabajadores';
import Layout from './general/layout';
import Ptasks from './tasks/Ptasks';
import Phome from './home/Phome';
import Pagos from './clients/pages/client/components/PagoTrabajador';
import RegistroPagos from './clients/pages/client/components/RegistroPagos';
import { SearchProvider } from './general/SearchContext';

import './index.css';

function App() {
  return (
    <MaterialsProvider>
      <SearchProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/clients" element={<Pclient />} />
              <Route path="/materials" element={<Pmaterial />} />
              <Route path="/trabajos/:id" element={<ListadoTrabajos />} />
              <Route path="/Materiales/:id" element={<MaterialesPage />} />
              <Route path="/Presupuesto/:id" element={<PresupuestoPage />} />
              <Route path="/rendicion/:id" element={<RendicionPage />} />
              <Route path="/flujo/:id" element={<FlujoPage />} />

              <Route path="/archives/:id" element={<Archives />} />

              <Route path="/home" element={<Phome />} />
              <Route path="/" element={<Navigate to="/home" />} /> 
              <Route path="/tasks" element={<Ptasks />} />
              <Route path="/empresa" element={<Pempresa />} />
              <Route path="*" element={<div>Página no encontrada (404)</div>} />
              <Route path="/pago" element={<Pagos />} />
              <Route path="/pagos" element={<RegistroPagos />} />
            </Routes>
          </Layout>
        </Router>
      </SearchProvider>
    </MaterialsProvider>
  );
}

export default App;
