import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client'; // Asegúrate de que la ruta sea correcta

const TaskForm = ({ addTask }) => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    task_name: '',
    responsible_employee_id: '',
    status: 'Pendiente'
  });

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('project_id, project_name');
    if (error) console.error('Error fetching projects:', error);
    else setProjects(data);
  };

  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('employee_id,name');
    if (error) console.error('Error fetching employees:', error);
    else setEmployees(data);
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
      setIsFormOpen(false);
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Agregar</h2>
        <button onClick={toggleForm} className="focus:outline-none transition-transform transform hover:scale-110">
          {isFormOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-800 hover:text-red-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-800 hover:text-green-900">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg shadow-md sm:grid-cols-2 md:grid-cols-1">
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          >
            <option value="">Seleccione Proyecto</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name}
              </option>
            ))}
          </select>

          <select
            name="responsible_employee_id"
            value={formData.responsible_employee_id}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="">Seleccione Responsable</option>
            {employees.map((employee) => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="task_name"
            placeholder="Nombre de la Tarea"
            value={formData.task_name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
            required
          />

          <button
            type="submit"
            className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900 transition-colors duration-200"
          >
            Añadir Tarea
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskForm;