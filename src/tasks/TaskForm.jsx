import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client'; // Asegúrate de que la ruta sea correcta

const TaskForm = ({ addTask }) => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-md mb-4 sm:mb-4">
      <h2 className="text-lg font-semibold mb-2">Añadir Tarea</h2>
      <div className="grid grid-cols-4 gap-4">
        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
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
          className="w-full p-2 border border-gray-300 rounded"
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
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900"
        >
          Añadir Tarea
        </button>
      </div>
    </form>
  );
};

export default TaskForm;