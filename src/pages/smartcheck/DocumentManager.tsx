import { useState } from 'react';
import {
    Upload, FileText, ChevronDown, ChevronUp,
    Scissors, CheckCircle, AlertTriangle, Eye
} from 'lucide-react';
import { MOCK_FILES } from '../../data/mock';
import type { FileRecord } from '../../types';

const DocumentManager = () => {
    const [expandedFileId, setExpandedFileId] = useState<string | null>("FILE_20251018_01");

    return (
        <div className="p-8 animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Lô chứng từ</h2>
                    <p className="text-gray-500 mt-1">Upload và theo dõi trạng thái cắt Deal từ file scan</p>
                </div>
                <button className="bg-[#004A99] hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
                    <Upload size={18} />
                    <span>Upload File Scan Mới</span>
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg"><FileText size={24} /></div>
                    <div><p className="text-sm text-gray-500">File trong ngày</p><p className="text-2xl font-bold">12</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg"><Scissors size={24} /></div>
                    <div><p className="text-sm text-gray-500">Tổng Deals bóc tách</p><p className="text-2xl font-bold">186</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg"><AlertTriangle size={24} /></div>
                    <div><p className="text-sm text-gray-500">Trang chưa nhận diện</p><p className="text-2xl font-bold">5</p></div>
                </div>
            </div>

            {/* File List */}
            <div className="space-y-4">
                {MOCK_FILES.map((file: FileRecord) => (
                    <div key={file.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* File Header */}
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors border-[#ddd]"
                            onClick={() => setExpandedFileId(expandedFileId === file.id ? null : file.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-50 text-red-600 rounded">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#004A99]">{file.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        Upload: {file.uploadTime} bởi {file.uploadedBy} • {file.total_pages} trang
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {file.status === 'processing' ? (
                                    <div className="w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-blue-600 font-medium">Đang xử lý...</span>
                                            <span>{file.process_progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${file.process_progress}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                            {file.deals_detected} Deals
                                        </div>
                                        {file.page_map.some(p => p.status === 'error') && (
                                            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                                                Lỗi cắt trang
                                            </div>
                                        )}
                                    </div>
                                )}
                                {expandedFileId === file.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                        </div>

                        {/* Expanded Detail (Visual Page Map) */}
                        {expandedFileId === file.id && file.page_map.length > 0 && (
                            <div className="bg-gray-50 p-4 border-t border-[#ddd] animate-slide-up">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Scissors size={14} /> Sơ đồ cắt trang (Splitting Map)
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {file.page_map.map((item, idx) => (
                                        <div key={idx} className={`relative group p-3 rounded border w-40 flex-shrink-0 flex flex-col gap-2 transition-all hover:shadow-md ${item.status === 'ignored' ? 'bg-gray-200 border-gray-300 opacity-60' :
                                            item.status === 'error' ? 'bg-red-50 border-red-300' :
                                                'bg-white border-blue-200 shadow-sm'
                                            }`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold bg-gray-200 px-1.5 rounded text-gray-600">Trang {item.range}</span>
                                                {item.status === 'valid' && <CheckCircle size={12} className="text-green-600" />}
                                                {item.status === 'error' && <AlertTriangle size={12} className="text-red-600" />}
                                            </div>
                                            <div className="text-xs font-medium truncate" title={item.deal_id}>
                                                {item.deal_id}
                                            </div>
                                            <div className={`text-[10px] px-2 py-0.5 rounded-full w-fit ${item.type === 'Orphan' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {item.type}
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] hidden group-hover:flex items-center justify-center gap-2 rounded transition-all">
                                                <button className="p-1.5 bg-white rounded shadow text-[#004A99] hover:text-blue-800" title="Xem chi tiết">
                                                    <Eye size={14} />
                                                </button>
                                                <button className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-red-600" title="Chỉnh sửa cắt trang">
                                                    <Scissors size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocumentManager;
