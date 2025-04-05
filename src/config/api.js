import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const apiConfig = {
    baseURL: API_URL,
    endpoints: {
        projects: '/api/projects',
        clients: '/api/clients',
        clientDelete:(clientId)=>`/api/clients/${clientId}` ,
        employeesFlujo: '/api/flujo/employees',
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
         employees:{
            post: '/api/empleados',
            delete:  (id)=> `/api/empleados/${id}`,
            payEmployee: (employee_id) => `/api/empleados/${employee_id}/payments`,
            paymentsByDate: (employee_id,fechaPago) => `/api/empleados/${employee_id}/payments/${fechaPago}`
           
         },
         bank: '/api/banco',
         tipoCuenta: '/api/tipocuenta',
         materials:{
            post:'/api/materials',
            put: (materialId) => `/api/materials/${materialId}`,
         },
         task:{
            get: '/api/tasks',
            putStatus: (taskId) => `/api/tasks/${taskId}/status`,
            delete: (taskId) => `/api/tasks/${taskId}`,
         }

     }
};
export const api = axios.create({
   baseURL: API_URL,
   headers: {
       'Content-Type': 'application/json'
   },
   withCredentials: true
});

// Mejora el manejo de errores en los interceptores
api.interceptors.request.use(
   config => {
       // Puedes agregar headers adicionales aquí si es necesario
       return config;
   },
   error => {
       console.error('Request Error:', error);
       return Promise.reject(error);
   }
);

api.interceptors.response.use(
   response => response,
   error => {
       if (error.response) {
           // El servidor respondió con un código de estado fuera del rango 2xx
           console.error('Response Error:', {
               status: error.response.status,
               data: error.response.data,
               headers: error.response.headers
           });
       } else if (error.request) {
           // La petición fue hecha pero no se recibió respuesta
           console.error('No response received:', error.request);
       } else {
           // Algo sucedió en la configuración de la petición
           console.error('Error setting up request:', error.message);
       }
       return Promise.reject(error);
   }
);