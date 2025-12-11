import React, { useState } from 'react';
import {
    LayoutDashboard, FileText, FileCheck, AlertOctagon, Settings,
    Bell, ChevronDown, LogOut, Menu, X, ArrowRight, BarChart3, PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

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
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active isOpen={isSidebarOpen} />
                    <NavItem icon={<FileText size={20} />} label="Quản lý Lô" isOpen={isSidebarOpen} />
                    <NavItem icon={<FileCheck size={20} />} label="Đối soát" isOpen={isSidebarOpen} />
                    <NavItem icon={<AlertOctagon size={20} />} label="Ngoại lệ" isOpen={isSidebarOpen} />
                    <div className="mt-8 border-t border-blue-800/50 pt-4">
                        <NavItem icon={<Settings size={20} />} label="Cấu hình" isOpen={isSidebarOpen} />
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
                <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm z-10">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard Tổng quan</h1>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Bell size={20} className="text-gray-500 hover:text-[#004A99] cursor-pointer" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group relative">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-700">Admin User</p>
                                <p className="text-xs text-gray-500">System Admin</p>
                            </div>
                            <div className="w-9 h-9 bg-blue-100 text-[#004A99] rounded-full flex items-center justify-center font-bold">A</div>

                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border overflow-hidden hidden group-hover:block animate-fade-in">
                                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Area */}
                <div className="flex-1 overflow-auto p-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-[#004A99] to-[#003366] rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Xin chào, Admin User!</h2>
                            <p className="text-blue-100 max-w-xl">Hệ thống Smart Doc Check đã sẵn sàng. Hôm nay có 12 lô chứng từ mới cần xử lý.</p>
                            <button className="mt-6 bg-white text-[#004A99] px-6 py-2.5 rounded-lg font-bold shadow hover:bg-blue-50 transition-colors flex items-center gap-2">
                                Bắt đầu làm việc <ArrowRight size={18} />
                            </button>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-20 w-32 h-32 bg-[#ED1C24]/20 rounded-full blur-2xl"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="Tỷ lệ Tự động hóa"
                            value="85%"
                            trend="+2.5%"
                            detail="So với tuần trước"
                            icon={<BarChart3 className="text-green-600" size={24} />}
                            color="green"
                        />
                        <StatCard
                            title="Độ chính xác OCR"
                            value="98.2%"
                            trend="+0.8%"
                            detail="Model v2.1"
                            icon={<PieChart className="text-blue-600" size={24} />}
                            color="blue"
                        />
                        <StatCard
                            title="Cảnh báo Rủi ro"
                            value="3"
                            trend="High"
                            detail="Cần xử lý ngay"
                            icon={<AlertOctagon className="text-red-500" size={24} />}
                            color="red"
                        />
                    </div>

                    {/* Placeholder for Analysis */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                                <span>Phân tích Lưu lượng</span>
                                <select className="text-sm bg-gray-50 border rounded px-2 py-1 outline-none text-gray-500">
                                    <option>7 ngày qua</option>
                                    <option>Tháng này</option>
                                </select>
                            </h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-dashed">
                                [Bar Chart Placeholder: Daily Processed Deals]
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4">Trạng thái Gần đây</h3>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-0 border-dashed">
                                        <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#004A99]">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-700">Lô chứng từ #20251018_{item.toString().padStart(2, '0')}</p>
                                            <p className="text-xs text-gray-500">Vừa cập nhật 15 phút trước</p>
                                        </div>
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, isOpen, active = false }: { icon: React.ReactNode, label: string, isOpen: boolean, active?: boolean }) => (
    <button className={`w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200
        ${active ? 'bg-blue-800 border-r-4 border-[#ED1C24] text-white' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}
    `}>
        <div className="flex-shrink-0">{icon}</div>
        <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}`}>
            {label}
        </span>
    </button>
);

const StatCard = ({ title, value, trend, detail, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-50`}>{icon}</div>
        </div>
        <div className="flex items-center gap-2 text-xs">
            <span className={`font-bold ${trend.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>{trend}</span>
            <span className="text-gray-400">{detail}</span>
        </div>
    </div>
);

export default Welcome;
