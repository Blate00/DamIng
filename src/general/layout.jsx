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
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, { onSearch: handleSearch, filteredClients });
    }
    return children;
  };

  return (
    <div className="flex flex-grow full-height">
      <Sidebar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />
      <div className="flex flex-col flex-grow ml-64 bg-white full-height">
        <main className="flex-grow overflow-y-auto">
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
