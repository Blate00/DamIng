import React from 'react';

const GroupFilter = ({ groups, selectedGroups, toggleGroupSelection }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold mb-2">Filtrar por Grupo</h2>
    <div className="grid grid-cols-5 gap-">
      {groups.map((group, index) => (
        <label key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedGroups.includes(group)}
            onChange={() => toggleGroupSelection(group)}
            className="form-checkbox h-5 w-5 text-red-600"
          />
          <span className="text-gray-700">{group}</span>
        </label>
      ))}
    </div>
  </div>
);

export default GroupFilter;
