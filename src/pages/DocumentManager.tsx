import { useState, useEffect, useRef } from 'react';
import {
    Upload, FileText, ChevronDown, ChevronUp,
    Scissors, CheckCircle, AlertTriangle, Eye, Loader2
} from 'lucide-react';
import { apiService } from '../services/api';
import type { DocumentBatch } from '../services/api';

const DocumentManager = () => {
    const [batches, setBatches] = useState<DocumentBatch[]>([]);
    const [expandedFileId, setExpandedFileId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiService.getDocumentBatches();
            setBatches(data);
            if (data.length > 0 && expandedFileId === null) {
                setExpandedFileId(data[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch document batches');
            console.error('Error fetching batches:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Chỉ chấp nhận file PDF');
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            await apiService.uploadDocumentBatch(file);
            await fetchBatches();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
            console.error('Error uploading file:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalDeals = batches.reduce((sum, batch) => sum + batch.deals_detected, 0);
    const totalOrphans = batches.reduce((sum, batch) => {
        return sum + (batch.page_map?.filter(p => p.status === 'error').length || 0);
    }, 0);

    return (
        <div className="p-8 animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý Lô chứng từ</h2>
                    <p className="text-gray-500 mt-1">Upload và theo dõi trạng thái cắt Deal từ file scan</p>
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={isUploading}
                        className="bg-[#004A99] hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Đang upload...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                <span>Upload File Scan Mới</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg"><FileText size={24} /></div>
                    <div><p className="text-sm text-gray-500">Tổng số lô chứng từ</p><p className="text-2xl font-bold">{batches.length}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg"><Scissors size={24} /></div>
                    <div><p className="text-sm text-gray-500">Tổng Deals bóc tách</p><p className="text-2xl font-bold">{totalDeals}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg"><AlertTriangle size={24} /></div>
                    <div><p className="text-sm text-gray-500">Trang chưa nhận diện</p><p className="text-2xl font-bold">{totalOrphans}</p></div>
                </div>
            </div>

            {/* File List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                </div>
            ) : batches.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Chưa có lô chứng từ nào. Nhấn "Upload File Scan Mới" để bắt đầu.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {batches.map((batch) => (
                        <div key={batch.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            {/* File Header */}
                            <div
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setExpandedFileId(expandedFileId === batch.id ? null : batch.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-50 text-red-600 rounded">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#004A99]">{batch.name}</h4>
                                        <p className="text-xs text-gray-500">
                                            Upload: {formatDateTime(batch.upload_time)}
                                            {batch.uploaded_by && ` bởi ${batch.uploaded_by}`}
                                            {batch.total_pages > 0 && ` • ${batch.total_pages} trang`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    {batch.status === 'processing' ? (
                                        <div className="w-48">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-blue-600 font-medium">Đang xử lý...</span>
                                                <span>{batch.process_progress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${batch.process_progress}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                                {batch.deals_detected} Deals
                                            </div>
                                            {batch.page_map && batch.page_map.some(p => p.status === 'error') && (
                                                <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                                                    Lỗi cắt trang
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {expandedFileId === batch.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </div>
                            </div>

                            {/* Expanded Detail (Visual Page Map) */}
                            {expandedFileId === batch.id && batch.page_map && batch.page_map.length > 0 && (
                                <div className="bg-gray-50 p-4 border-t animate-slide-up">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        <Scissors size={14} /> Sơ đồ cắt trang (Splitting Map)
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {batch.page_map.map((item, idx) => (
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
            )}
        </div>
    );
};

export default DocumentManager;
