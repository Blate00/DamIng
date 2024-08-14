import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleSearch = (nameQuery, phoneQuery, emailQuery) => {
    // Aquí puedes manejar la búsqueda o pasarla a un componente descendiente
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, { onSearch: handleSearch, filteredClients });
    }
    return children;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
      <div className="flex flex-col flex-grow">
        <Header toggleSidebar={toggleSidebar} onSearch={handleSearch} />
        <main className="flex-grow overflow-y-auto rounded-lg">
          {handleSearch(children)}
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
