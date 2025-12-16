import React, { useState } from 'react';
import {
    LayoutDashboard, FileText, FileCheck, AlertOctagon,
    Settings, LogOut, Menu, Bell, X
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    let closeTimer: number | null = null;

    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username') || 'User';
    const isAdmin = role === 'Admin';

    const handleLogout = async () => {
        try {
            await apiService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            navigate('/login');
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* Sidebar */}
            <aside className={`bg-[#003366] text-white transition-all duration-300 flex flex-col z-20 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="h-16 flex items-center px-4 border-b border-blue-800/50">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-white rounded flex-shrink-0 flex items-center justify-center text-[#004A99] font-bold text-xs">NCB</div>
                        <span className={`font-bold text-lg whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Smart Check</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-x-hidden">
                    <NavItem
                        icon={<LayoutDashboard size={20} />}
                        label="Dashboard"
                        isOpen={isSidebarOpen}
                        active={isActive('/')}
                        onClick={() => navigate('/')}
                    />
                    <NavItem
                        icon={<FileText size={20} />}
                        label="Quản lý Lô"
                        isOpen={isSidebarOpen}
                        active={isActive('/documents')}
                        onClick={() => navigate('/documents')}
                    />
                    <NavItem
                        icon={<FileCheck size={20} />}
                        label="Đối soát"
                        isOpen={isSidebarOpen}
                        active={isActive('/reconciliation')} // Placeholder
                        onClick={() => navigate('/reconciliation')}
                    />
                    <NavItem
                        icon={<AlertOctagon size={20} />}
                        label="Ngoại lệ"
                        isOpen={isSidebarOpen}
                        active={isActive('/exceptions')} // Placeholder
                        onClick={() => navigate('/exceptions')}
                    />
                    {/* {isAdmin && (
                        <NavItem
                            icon={<Users size={20} />}
                            label="Quản lý User"
                            isOpen={isSidebarOpen}
                            active={isActive('/users')}
                            onClick={() => navigate('/users')}
                        />
                    )} */}
                    <div className="mt-8 border-t border-blue-800/50 pt-4">
                        <NavItem
                            icon={<Settings size={20} />}
                            label="Cấu hình"
                            isOpen={isSidebarOpen}
                            active={isActive('/config')} // Placeholder
                            onClick={() => navigate('/config')}
                        />
                    </div>
                </nav>

                <div className="p-4 border-t border-blue-800/50">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded hover:bg-blue-800/50 text-blue-300 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10 border-[#ddd]">
                    <h1 className="text-xl font-bold text-gray-800">
                        {isActive('/') && "Dashboard Tổng quan"}
                        {isActive('/documents') && "Quản lý Lô chứng từ"}
                        {isActive('/reconciliation') && "Đối soát giao dịch"}
                        {isActive('/exceptions') && "Báo cáo ngoại lệ"}
                        {isActive('/users') && "Quản lý Người dùng"}
                        {isActive('/config') && "Cấu hình hệ thống"}
                    </h1>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Bell size={20} className="text-gray-500 hover:text-[#004A99] cursor-pointer" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div
                            className="relative pl-6 border-l border-gray-200"
                            onMouseEnter={() => {
                                if (closeTimer) {
                                    window.clearTimeout(closeTimer);
                                    closeTimer = null;
                                }
                                setIsUserMenuOpen(true);
                            }}
                            onMouseLeave={() => {
                                // Small delay to allow cursor to move into the dropdown smoothly
                                closeTimer = window.setTimeout(() => {
                                    setIsUserMenuOpen(false);
                                    closeTimer = null;
                                }, 150);
                            }}
                        >
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700">{username}</p>
                                    <p className="text-xs text-gray-500">{isAdmin ? 'Quản trị viên' : 'Người dùng'}</p>
                                </div>
                                <div className="w-9 h-9 bg-blue-100 text-[#004A99] rounded-full flex items-center justify-center font-bold">
                                    {username[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>

                            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#ddd] overflow-hidden z-50 ${isUserMenuOpen ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Outlet />
                </div>
            </main>
        </div>

    );
};

const NavItem = ({ icon, label, isOpen, active = false, onClick }: { icon: React.ReactNode, label: string, isOpen: boolean, active?: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200
        ${active ? 'bg-blue-800 border-r-4 border-[#28a6cf] text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}
    `}>
        <div className="flex-shrink-0">{icon}</div>
        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}`}>
            {label}
        </span>
    </button>
);

export default MainLayout;
