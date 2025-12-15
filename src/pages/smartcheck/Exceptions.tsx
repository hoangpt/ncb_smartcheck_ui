import { AlertTriangle } from 'lucide-react';
import { MOCK_EXCEPTIONS } from '../../data/mock';

const Exceptions = () => {
    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Báo cáo ngoại lệ</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-800">
                    <AlertTriangle size={20} />
                    <span className="font-semibold">Phát hiện {MOCK_EXCEPTIONS.length} vấn đề cần xử lý thủ công</span>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">Mức độ</th>
                            <th className="px-6 py-3 text-left">Loại lỗi</th>
                            <th className="px-6 py-3 text-left">Mô tả chi tiết</th>
                            <th className="px-6 py-3 text-left">Nguồn</th>
                            <th className="px-6 py-3 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd]">
                        {MOCK_EXCEPTIONS.map(ex => (
                            <tr key={ex.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {ex.severity === 'high' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Cao</span>}
                                    {ex.severity === 'medium' && <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">TB</span>}
                                    {ex.severity === 'low' && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">Thấp</span>}
                                </td>
                                <td className="px-6 py-4 font-medium">{ex.type}</td>
                                <td className="px-6 py-4 text-gray-600">{ex.desc}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{ex.source}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3">Xem nguồn</button>
                                    <button className="text-gray-600 hover:text-gray-800 font-medium text-xs">Bỏ qua</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Exceptions;
