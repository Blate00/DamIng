import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiConfig = {
    baseURL: API_URL,
    endpoints: {
        projects: '/api/projects',
        clients: '/api/clients',
        clientDelete:(clientId)=>`/api/clients/${clientId}` ,
        employees: '/api/flujo/employees',
        projectPayments: (projectId) => `/api/flujo/payments/project/${projectId}`,
        payments: '/api/flujo/payments',
        materialLists: {
            projectWithAvailables: (projectId) => `/api/material-lists/project-with-availables/${projectId}`,
            base    : '/api/material-lists'
        },
        budget: {
            base: '/api/presupuesto',
            byProject: (projectId) => `/api/presupuesto/${projectId}`,
            byId: (budgetId) => `/api/presupuesto/${budgetId}`
        },
        status:'/api/projects/${projectId}/status',
        asignacion:{
            base:'/api/asignacion',
           
            fetch:(quote_number) =>`/api/asignacion/${quote_number}`,
        },
         tipoPago:'/api/tipo-pago',
         manoObra:{
            base:'/api/mano-obra',
            fetch:(quote_number) => `/api/mano-obra/${quote_number}`,
         },
         proveedores: '/api/proveedores',
         rendicion:{
           fetch:  (projectId) => `/api/rendiciones/project/${projectId}`,
           fix: (rendicion_id) => `/api/rendiciones/${rendicion_id} `,
           post: '/api/rendiciones',
         } ,
         archives: {
            get:(projectId) => `/api/archives/${projectId}`,
         },

     }
};

export const api = axios.create({
  baseURL: API_URL,
});