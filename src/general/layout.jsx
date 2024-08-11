import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar visible en pantallas grandes y como drawer en pequeñas */}
      <Sidebar isVisible={isSidebarVisible} closeSidebar={closeSidebar} />

      <div className="flex flex-col flex-grow ">
        {/* Header siempre visible */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Contenido principal */}
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
