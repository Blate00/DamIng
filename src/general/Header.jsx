// src/components/Header.js
import React from 'react';
import {ArrowSmLeftIcon} from '@heroicons/react/outline';

const Header = ({ toggleSidebar }) => {
  return (
    <div className="header bg-white text-white p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="">
      <ArrowSmLeftIcon className="h-5 w-5 fill-current text-black"/>


      </button>
      <h1 className="text-2xl text-black">Dam Ingenieria</h1>
    </div>
  );
};

export default Header;
