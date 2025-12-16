import React, { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    LayoutDashboard, FileText, FileCheck, AlertOctagon,
    Settings, LogOut, Menu, Bell, X, Globe
} from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useI18n } from '../i18n/I18nProvider';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, lang, setLang } = useI18n();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [notifications] = useState<Array<{ id: string; title: string; time: string; read?: boolean }>>([]);
    const notifRef = useRef<HTMLDivElement | null>(null);
    const userRef = useRef<HTMLDivElement | null>(null);
    const langRef = useRef<HTMLDivElement | null>(null);
    // removed hover timer; using click toggles now
    const closeTimerRef = useRef<number | null>(null);

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

    useEffect(() => {
        const handleClickOutsideNotif = (e: MouseEvent) => {
            if (!isNotifOpen) return;
            const target = e.target as Node;
            if (notifRef.current && !notifRef.current.contains(target)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutsideNotif);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideNotif);
        };
    }, [isNotifOpen]);

    useEffect(() => {
        const handleClickOutsideUser = (e: MouseEvent) => {
            if (!isUserMenuOpen) return;
            const target = e.target as Node;
            const container = userRef.current;
            if (container && !container.contains(target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideUser);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideUser);
        };
    }, [isUserMenuOpen]);
    
    useEffect(() => {
        const handleClickOutsideLang = (e: MouseEvent) => {
            if (!isLangOpen) return;
            const target = e.target as Node;
            const container = langRef.current;
            if (container && !container.contains(target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutsideLang);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideLang);
        };
    }, [isLangOpen]);

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
                        label={t('nav.dashboard')}
                        isOpen={isSidebarOpen}
                        active={isActive('/')}
                        onClick={() => navigate('/')}
                    />
                    <NavItem
                        icon={<FileText size={20} />}
                        label={t('nav.documents')}
                        isOpen={isSidebarOpen}
                        active={isActive('/documents')}
                        onClick={() => navigate('/documents')}
                    />
                    <NavItem
                        icon={<FileCheck size={20} />}
                        label={t('nav.reconciliation')}
                        isOpen={isSidebarOpen}
                        active={isActive('/reconciliation')} // Placeholder
                        onClick={() => navigate('/reconciliation')}
                    />
                    <NavItem
                        icon={<AlertOctagon size={20} />}
                        label={t('nav.exceptions')}
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
                            label={t('nav.config')}
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
                {/* Toasts centered relative to main content (excluding sidebar) */}
                <Toaster
                    position="top-center"
                    gutter={8}
                    toastOptions={{
                        style: { border: '1px solid #ddd', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }
                    }}
                    containerStyle={{
                        left: isSidebarOpen ? 256 : 80,
                        right: 0,
                        top: 16
                    }}
                />
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10 border-[#ddd]">
                    <h1 className="text-xl font-bold text-gray-800">
                        {isActive('/') && t('header.title.dashboard')}
                        {isActive('/documents') && t('header.title.documents')}
                        {isActive('/reconciliation') && t('header.title.reconciliation')}
                        {isActive('/exceptions') && t('header.title.exceptions')}
                        {isActive('/users') && t('header.title.users')}
                        {isActive('/config') && t('header.title.config')}
                    </h1>

                    <div className="flex items-center gap-6">
                        {/* Language dropdown */}
                        <div className="relative" ref={langRef}>
                            <button
                                type="button"
                                onClick={() => setIsLangOpen(v => !v)}
                                className="flex items-center gap-2 border border-gray-300 px-3 py-1.5 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                                aria-haspopup="true"
                                aria-expanded={isLangOpen}
                            >
                                <Globe size={16} className="text-gray-600" />
                                <span className="text-xs font-medium">{lang === 'en' ? 'GB' : 'VN'}</span>
                                <span className="text-sm">{lang === 'en' ? 'English' : 'Tiếng Việt'}</span>
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-[#ddd] z-50 overflow-hidden ${isLangOpen ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={() => { setLang('en'); setIsLangOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <span className="text-xs w-8">GB</span>
                                    <span>English</span>
                                </button>
                                <button
                                    onClick={() => { setLang('vi'); setIsLangOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <span className="text-xs w-8">VN</span>
                                    <span>Tiếng Việt</span>
                                </button>
                            </div>
                        </div>
                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={isNotifOpen}
                                onClick={() => setIsNotifOpen((v) => !v)}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <Bell size={20} className="text-gray-500 hover:text-[#004A99] cursor-pointer" />
                            </button>
                            {(() => {
                                const hasUnread = notifications.some(n => !n.read);
                                return (
                                    <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${hasUnread ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                );
                            })()}

                            {/* Notifications dropdown */}
                            <div
                                className={`absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-[#ddd] z-50 ${isNotifOpen ? 'block' : 'hidden'}`}
                                role="dialog"
                                aria-label={t('notifications.ariaLabel')}
                            >
                                <div className="flex flex-col gap-3 p-2 max-h-64 overflow-auto">
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-28 gap-1.5 text-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Bell size={18} className="text-gray-400" />
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">{t('notifications.empty.title')}</div>
                                            <div className="text-xs text-gray-500">{t('notifications.empty.subtitle')}</div>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-gray-800">{n.title}</span>
                                                <span className="text-xs text-gray-500">{n.time}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className="relative pl-6 border-l border-gray-200"
                            ref={userRef}
                            onMouseEnter={() => {
                                if (closeTimerRef.current) {
                                    window.clearTimeout(closeTimerRef.current);
                                    closeTimerRef.current = null;
                                }
                                setIsUserMenuOpen(true);
                            }}
                            onMouseLeave={() => {
                                // Small delay to allow cursor to move into the dropdown smoothly
                                closeTimerRef.current = window.setTimeout(() => {
                                    setIsUserMenuOpen(false);
                                    closeTimerRef.current = null;
                                }, 150);
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((v) => !v)}
                                className="flex items-center gap-3 cursor-pointer select-none"
                                aria-haspopup="true"
                                aria-expanded={isUserMenuOpen}
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700">{username}</p>
                                    <p className="text-xs text-gray-500">{isAdmin ? t('common.role.admin') : t('common.role.user')}</p>
                                </div>
                                <div className="w-9 h-9 bg-blue-100 text-[#004A99] rounded-full flex items-center justify-center font-bold">
                                    {username[0]?.toUpperCase() || 'U'}
                                </div>
                            </button>
                            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#ddd] overflow-hidden z-50 ${isUserMenuOpen ? 'block' : 'hidden'}`}>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                >
                                    <LogOut size={16} /> {t('common.logout')}
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
