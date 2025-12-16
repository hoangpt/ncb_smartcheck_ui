import { Scissors, Settings, Database } from 'lucide-react';

const Config = () => {
    return (
        <div className="p-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cấu hình hệ thống</h2>
            <div className="grid gap-8">
                {/* Section 1: Quy tắc cắt trang */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd]">
                    <div className="flex items-center gap-3 mb-4 text-[#004A99]">
                        <Scissors size={24} />
                        <h3 className="font-bold text-lg">Quy tắc Cắt & Phân loại (Splitting Rules)</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Regex nhận diện Deal ID (Start Page)</label>
                            <div className="flex gap-2">
                                <input type="text" defaultValue="^(FC|FT|LD)[0-9]{10,}" className="flex-1 border p-2 rounded font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                                <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium transition-colors">Test</button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Biểu thức chính quy dùng để phát hiện mã giao dịch bắt đầu một hồ sơ mới.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: System Settings (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd]">
                    <div className="flex items-center gap-3 mb-4 text-[#004A99]">
                        <Settings size={24} />
                        <h3 className="font-bold text-lg">Tham số hệ thống</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng cảnh báo lệch tiền (VND)</label>
                                <input type="number" defaultValue="5000000" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Độ tin cậy OCR tối thiểu (%)</label>
                                <input type="number" defaultValue="80" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Data Management (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd] opacity-70">
                    <div className="flex items-center gap-3 mb-4 text-gray-600">
                        <Database size={24} />
                        <h3 className="font-bold text-lg">Quản lý dữ liệu (Coming Soon)</h3>
                    </div>
                    <p className="text-sm text-gray-500">Tính năng sao lưu và phục hồi dữ liệu đang được phát triển.</p>
                </div>
            </div>
        </div>
    );
};

export default Config;
