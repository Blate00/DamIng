import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Pclient from './clients/pages/Pclient';
import Pmaterial from './materials/pages/Pmaterial';
import Archives from './clients/pages/client/Archives';
import MaterialesPage from './clients/pages/client/materiales/Materiales';
import PresupuestoPage from './clients/pages/client/presupuesto/Presupuesto';
import RendicionPage from './clients/pages/client/rendicion/Rendicion';
import FlujoPage from './clients/pages/client/flujocaja/FlujoCaja';
import ListadoTrabajos from './clients/pages/client/projects/ListadoTrabajos';
import Pempresa from './empresa/pages/Trabajadores';
import Layout from './general/layout';
import Ptasks from './tasks/Ptasks';
import Phome from './home/Phome';
import ListaPagos from './empresa/components/Liquidaciones';
import RegistroPagos from './empresa/components/DetallePago';
import './index.css';

function App() {
  return (

        <Router>
          <Layout>
            <Routes>

              <Route path="/clients" element={<Pclient />} />
              <Route path="/materials" element={<Pmaterial />} />
              <Route path="/clients/trabajos/:client_id" element={<ListadoTrabajos />} />
                 {'rutas archives'}
              <Route path="/clients/materiales/:id/:projectId" element={<MaterialesPage />} />
                <Route path="/clients/presupuesto/:id/:projectId" element={<PresupuestoPage />} />
              <Route path="/clients/rendicion/:id/:projectId" element={<RendicionPage />} />
              <Route path="/clients/flujo/:id/:projectId" element={<FlujoPage />} />
              <Route path="/clients/archives/:id/:projectId" element={<Archives />} />

              <Route path="/home" element={<Phome />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/tasks" element={<Ptasks />} />
              <Route path="/empresa" element={<Pempresa />} />
           
              <Route path="/empresa/liquidaciones" element={<ListaPagos />} />
              <Route path="/empresa/liquidaciones/detalle" element={<RegistroPagos />} />
              <Route path="*" element={<div>Página no encontrada (404)</div>} />
            </Routes>
          </Layout>
        </Router>

  );
}

export default App;
