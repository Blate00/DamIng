import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';
import { useSearch } from '../../general/SearchContext';

const ClientSearch = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [queryName, setQueryName] = useState(searchQuery.name);
  const [queryPhone, setQueryPhone] = useState(searchQuery.phone);
  const [queryEmail, setQueryEmail] = useState(searchQuery.email);

  useEffect(() => {
    setSearchQuery({ name: queryName, phone: queryPhone, email: queryEmail });
  }, [queryName, queryPhone, queryEmail, setSearchQuery]);

  return (
    <div className="bg- p-4 rounded-lg mt-0 flex flex-col md:flex-row items-center mb-0">
      <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0 md:mr-2">
        
        <input
          type="text"
          placeholder="Buscar Archivo"
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
        />
      </div>
     
    </div>
  );
};

export default ClientSearch;
