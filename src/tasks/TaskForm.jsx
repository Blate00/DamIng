import React, { useState, useEffect } from 'react';

const TaskForm = ({ addTask, isOpen, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    project_id: '',
    task_name: '',
    responsible_employee_id: '',
    status: 'Pendiente'
  });

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects'); // Cambia la ruta según tu configuración
      const data = await response.json();
      if (response.ok) {
        setProjects(data);
      } else {
        console.error('Error fetching projects:', data.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/empleados'); // Cambia la ruta según tu configuración
      const data = await response.json();
      if (response.ok) {
        setEmployees(data);
      } else {
        console.error('Error fetching employees:', data.error);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.project_id && formData.task_name) {
      await addTask(formData);
      setFormData({
        project_id: '',
        task_name: '',
        responsible_employee_id: '',
        status: 'Pendiente'
      });
      onClose();
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] to-white shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-red-100">
          <h3 className="text-2xl font-bold text-red-800">Agregar Tarea</h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              >
                <option value="">Seleccione Proyecto</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="responsible_employee_id" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
              <select
                id="responsible_employee_id"
                name="responsible_employee_id"
                value={formData.responsible_employee_id}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="">Seleccione Responsable</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task_name" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Tarea</label>
              <input
                type="text"
                id="task_name"
                name="task_name"
                placeholder="Ingrese el nombre de la tarea"
                value={formData.task_name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>
          </form>
        </div>
        <div className="border-t border-red-100 p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Añadir Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;