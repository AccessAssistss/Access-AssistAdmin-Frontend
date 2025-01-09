import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ closeSidebar }) {
    const menuItem = [
        { id: 1, name: "Home", link: "", icon: "house-fill" },
        { id: 2, name: "Job", link: "job", icon: "person-fill" },
        { id: 3, name: "Blog", link: "blog", icon: "chat-square-text" },
    ];

    return (
        <div className="flex flex-col flex-shrink-0 p-4 bg-themeColor">
            <NavLink
                to="/"
                className="flex items-center mb-4 ml-4 text-white text-lg font-bold"
                onClick={closeSidebar}
            >
                Admin
            </NavLink>

            <ul className="flex flex-col space-y-2">
                {menuItem.map((item) => (
                    <li key={item.id}>
                        <NavLink
                            to={item.link}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded transition-colors ${isActive
                                    ? 'bg-white text-black-600'
                                    : 'text-white hover:bg-blue-800'
                                }`
                            }
                            onClick={closeSidebar}
                        >
                            <i className={`bi bi-${item.icon} mr-2`}></i>
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
