import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const Navigate = useNavigate()
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const logout = () => {
    sessionStorage.removeItem('token')
    Navigate('/signin')
  }

  return (
    <>
      <div className='flex justify-between p-2 bg-white shadow-md'>
        <span className="flex items-center">
          <span className='lg:hidden'>
            <button onClick={toggleSidebar}>
              <i className='bi bi-list text-2xl mr-2'></i>
            </button>
            <span className="text-lg font-bold">Assist</span>
          </span>
        </span>

        <div className="relative">
          <button
            className="flex items-center focus:outline-none"
            onClick={toggleDropdown}
          >
            <i className='bi bi-person-circle text-3xl text-themeColor mx-1'></i>
            <strong className="text-themeColor">Assist</strong>
            <i className={`bi bi-caret-down-fill text-themeColor ml-1 transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}></i>
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-1 text-sm z-10">
              <li onClick={logout}>
                <NavLink className="block px-4 py-2 text-gray-700 hover:bg-gray-100" to="/signin">
                  Sign out
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-64 bg-themeColor shadow-lg h-full relative">
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            &times; {/* Close button */}
          </button>
          <Sidebar closeSidebar={closeSidebar} />
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black opacity-50"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
}

export default Navbar;
