import { ArrowRight, BarChart3, PieChart, AlertOctagon, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="p-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#004A99] to-[#003366] rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Xin chào, Admin User!</h2>
                    <p className="text-blue-100 max-w-xl">Hệ thống Smart Doc Check đã sẵn sàng. Hôm nay có 12 lô chứng từ mới cần xử lý.</p>
                    <button
                        onClick={() => navigate('/documents')}
                        className="mt-6 bg-white text-[#004A99] px-6 py-2.5 rounded-lg font-bold shadow hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] border-gray-200">
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

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] border-gray-200">
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
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, trend, detail, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] border-gray-200 hover:shadow-md transition-shadow">
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

export default Dashboard;
