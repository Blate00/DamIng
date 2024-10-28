// ProjectForm.jsx
import React, { useState } from 'react';

const ProjectForm = ({ clientId, onProjectAdded }) => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [status, setStatus] = useState('No Iniciado');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from('projects').insert([
        { project_name: projectName, start_date: startDate, status, client_id: clientId },
      ]);

      if (error) throw error;

      setProjectName('');
      setStartDate('');
      setStatus('No Iniciado');
      onProjectAdded(data[0]);
    } catch (error) {
      console.error('Error adding project:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 mb-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Proyecto</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-1 p-2 border w-full rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 p-2 border w-full rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 p-2 border w-full rounded"
        >
          <option value="No Iniciado">No Iniciado</option>
          <option value="Iniciado">Iniciado</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-[#700F23] text-white rounded hover:bg-[#9A1432]"
        disabled={loading}
      >
        {loading ? 'Agregando...' : 'Agregar Proyecto'}
      </button>
    </form>
  );
};

export default ProjectForm;
