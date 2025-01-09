import React from 'react';
import Navbar from './components/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import PrivateRoute from './PrivateRoute';

function Layout() {
    const location = useLocation();
    const isLoginScreen = location.pathname === '/signin';
    const shouldHideSidebarNavbar = isLoginScreen;

    return (
        <div className="flex h-screen">
            {!shouldHideSidebarNavbar && (
                <div className={`w-1/6 shadow bg-themeColor px-3 text-black h-full overflow-y-auto hidden lg:block`}>
                    <Sidebar />
                </div>
            )}

            <div
                className={`flex-grow ${shouldHideSidebarNavbar ? 'w-full' : 'w-4/6'} h-full overflow-y-auto`}
            >
                {!shouldHideSidebarNavbar && (
                    <div className="shadow-lg">
                        <Navbar />
                    </div>
                )}

                <PrivateRoute Component={Outlet} />
            </div>
        </div>
    );
}

export default Layout;
