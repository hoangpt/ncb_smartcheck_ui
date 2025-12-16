import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    ArrowLeft, FileText, CheckCircle, AlertTriangle,
    Calendar, User, CreditCard, Layers, Eye
} from 'lucide-react';
import { MOCK_FILES, MOCK_DEALS } from '../../data/mock';
import type { Deal } from '../../types';

const FileDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const file = MOCK_FILES.find(f => f.id === id);

    // Filter deals for this file (in a real app, this would be an API call)
    // For mock data, we just assume MOCK_DEALS are related if they match source_file name logic or just show all for demo
    const deals = MOCK_DEALS.filter(d => d.source_file === file?.name);

    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(deals[0] || null);

    if (!file) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Không tìm thấy file.</p>
                <button onClick={() => navigate('/documents')} className="text-blue-600 hover:underline mt-2">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in h-[calc(100vh-64px)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/documents')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        {file.name}
                        <span className={`text-sm px-2 py-0.5 rounded-full border ${file.status === 'processed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                            {file.status}
                        </span>
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {file.uploadTime}</span>
                        <span className="flex items-center gap-1"><User size={14} /> {file.uploadedBy}</span>
                        <span className="flex items-center gap-1"><Layers size={14} /> {file.total_pages} trang</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Deal List */}
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">Danh sách Deal ({deals.length})</h3>
                        <div className="text-xs text-gray-400">Đã nhận diện: {file.deals_detected}</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {deals.map(deal => (
                            <div
                                key={deal.id}
                                onClick={() => setSelectedDeal(deal)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md
                                    ${selectedDeal?.id === deal.id
                                        ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100'
                                        : 'bg-white border-gray-100 hover:border-blue-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-[#004A99] truncate">{deal.id}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${deal.status === 'matched' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                                        }`}>
                                        {deal.score}%
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <p className="flex justify-between">
                                        <span>Khách hàng:</span>
                                        <span className="font-medium text-right truncate max-w-[120px]" title={deal.customer}>{deal.customer}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Số tiền:</span>
                                        <span className="font-medium">{deal.amount_extract.toLocaleString('vi-VN')} {deal.currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Trang:</span>
                                        <span className="bg-gray-100 px-1 rounded">{deal.pages}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle: Detail View */}
                {selectedDeal ? (
                    <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                <FileText size={18} className="text-[#004A99]" />
                                Chi tiết dữ liệu
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Validation Status */}
                            <div className={`p-4 rounded-lg border ${selectedDeal.status === 'matched' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {selectedDeal.status === 'matched'
                                        ? <CheckCircle size={20} className="text-green-600" />
                                        : <AlertTriangle size={20} className="text-red-600" />
                                    }
                                    <span className={`font-bold ${selectedDeal.status === 'matched' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {selectedDeal.status === 'matched' ? 'Dữ liệu khớp hoàn toàn' : 'Phát hiện sai lệch'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Độ tin cậy của dữ liệu trích xuất đạt <strong>{selectedDeal.score}%</strong>.
                                </p>
                            </div>

                            {/* Data Comparison (Simplified for now) */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 text-center border-b pb-1">So sánh dữ liệu</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-0.5">Mã Deal</label>
                                            <div className="font-medium">{selectedDeal.id}</div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-0.5">Loại giao dịch</label>
                                            <div className="font-medium">{selectedDeal.type}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-xs mb-0.5">Khách hàng</label>
                                        <div className="font-medium text-[#004A99]">{selectedDeal.customer}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                            <label className="block text-gray-400 text-xs mb-1">Core Banking</label>
                                            <div className="font-bold text-gray-800">{selectedDeal.amount_system.toLocaleString('vi-VN')}</div>
                                            <div className="text-[10px] text-gray-400">{selectedDeal.currency}</div>
                                        </div>
                                        <div className={`p-3 rounded border ${selectedDeal.amount_extract !== selectedDeal.amount_system ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                            <label className="block text-gray-400 text-xs mb-1">OCR Trích xuất</label>
                                            <div className={`font-bold ${selectedDeal.amount_extract !== selectedDeal.amount_system ? 'text-red-600' : 'text-green-600'}`}>
                                                {selectedDeal.amount_extract.toLocaleString('vi-VN')}
                                            </div>
                                            <div className="text-[10px] text-gray-400">{selectedDeal.currency}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-1">Chữ ký</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Giao dịch viên</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{selectedDeal.signatures.teller.name}</div>
                                            <div className="text-[10px] text-green-600 flex items-center justify-end gap-1">
                                                <CheckCircle size={10} /> Valid
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Kiểm soát viên</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{selectedDeal.signatures.supervisor.name}</div>
                                            {selectedDeal.signatures.supervisor.status === 'review' ? (
                                                <div className="text-[10px] text-amber-600 flex items-center justify-end gap-1">
                                                    <AlertTriangle size={10} /> Low Confidence
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-green-600 flex items-center justify-end gap-1">
                                                    <CheckCircle size={10} /> Valid
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-1/3 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        Chọn một Deal để xem chi tiết
                    </div>
                )}

                {/* Right: PDF Viewer Placeholder */}
                <div className="flex-1 bg-gray-800 rounded-xl shadow-inner flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                    <FileText size={48} className="opacity-50 mb-4" />
                    <p className="text-lg font-medium">Document Preview</p>
                    <p className="text-sm opacity-70">
                        {selectedDeal ? `Viewing Pages ${selectedDeal.pages}` : 'Select a deal to view pages'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FileDetail;
