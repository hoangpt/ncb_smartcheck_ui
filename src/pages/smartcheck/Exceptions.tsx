import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, XCircle } from 'lucide-react';
import { MOCK_EXCEPTIONS, MOCK_FILES } from '../../data/mock';

const Exceptions = () => {
    const navigate = useNavigate();
    const [exceptions, setExceptions] = useState(MOCK_EXCEPTIONS);

    const handleViewSource = (sourceFile: string) => {
        // Find the file ID relevant to this exception
        // In a real app, the exception would likely link directly to a file ID or deal ID
        const file = MOCK_FILES.find(f => f.name === sourceFile);
        if (file) {
            navigate(`/documents/${file.id}`);
        } else {
            alert(`File not found: ${sourceFile}`);
        }
    };

    const handleIgnore = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn bỏ qua lỗi này?')) {
            setExceptions(prev => prev.filter(ex => ex.id !== id));
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Báo cáo ngoại lệ</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-800">
                    <AlertTriangle size={20} />
                    <span className="font-semibold">Phát hiện {exceptions.length} vấn đề cần xử lý thủ công</span>
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
                        {exceptions.length > 0 ? exceptions.map(ex => (
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
                                    <button
                                        onClick={() => handleViewSource(ex.source)}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-4 inline-flex items-center gap-1"
                                    >
                                        <Eye size={14} /> Xem nguồn
                                    </button>
                                    <button
                                        onClick={() => handleIgnore(ex.id)}
                                        className="text-gray-500 hover:text-gray-800 font-medium text-xs inline-flex items-center gap-1"
                                    >
                                        <XCircle size={14} /> Bỏ qua
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <CheckCircle size={48} className="mx-auto mb-3 text-green-500 opacity-50" />
                                    Không có ngoại lệ nào cần xử lý.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Use explicit check import to avoid missing import error if used in conditional
import { CheckCircle } from 'lucide-react';

export default Exceptions;
