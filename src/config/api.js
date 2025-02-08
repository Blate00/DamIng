import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Actualización del apiConfig
export const apiConfig = {
    baseURL: API_URL,
    endpoints: {
        projects: '/api/projects',
        clients: '/api/clients',
        employees: '/api/flujo/employees',
        projectPayments: (projectId) => `/api/flujo/payments/project/${projectId}`,
        payments: '/api/flujo/payments',
        materialLists: {
            projectWithAvailables: (projectId) => `/api/material-lists/project-with-availables/${projectId}`,
            base    : '/api/material-lists'
        },
        // Nuevos endpoints para presupuesto
        budget: {
            base: '/api/presupuesto',
            byProject: (projectId) => `/api/presupuesto/${projectId}`,
            byId: (budgetId) => `/api/presupuesto/${budgetId}`
        }
    }
};

export const api = axios.create({
  baseURL: API_URL,
});