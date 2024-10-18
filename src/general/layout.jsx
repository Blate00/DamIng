import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (nameQuery, phoneQuery, emailQuery) => {
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, { onSearch: handleSearch, filteredClients });
    }
    return children;
  };

  return (
    <div className="flex overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-auto lg:ml-64">
        <main className="  ">
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