import { useState, useRef, type DragEvent, useEffect } from 'react';
import { X, Upload, FileText, Trash2, CheckCircle, Check, Minimize2 } from 'lucide-react';
import type { FileRecord } from '../types';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: File[]) => void;
    processingFiles?: FileRecord[]; // Files currently being processed
}

const STAGES = [
    "Upload thành công",
    "Tiến hành scan / ocr",
    "Split file theo các deal_id",
    "Structure các dữ liệu và lưu vào db",
    "Matching data và chấm điểm chứng từ"
];

const UploadModal = ({ isOpen, onClose, onUpload, processingFiles = [] }: UploadModalProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If there are processing files, we are in "uploading/processing" mode
    const isProcessing = processingFiles.length > 0;

    // Reset state only when strictly closed (not just minified conceptually)
    useEffect(() => {
        if (isOpen && !isProcessing) {
            setFiles([]);
            setIsDragging(false);
        }
    }, [isOpen, isProcessing]);

    if (!isOpen) return null;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isProcessing) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (isProcessing) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        if (isProcessing) return;
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUploadClick = () => {
        if (files.length > 0) {
            onUpload(files);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Calculate current stage based on progress of the first file (simplified for now)
    const getStageIndex = (progress: number) => {
        if (progress < 10) return 0; // Uploading
        if (progress < 30) return 1; // Scan
        if (progress < 55) return 2; // Split
        if (progress < 80) return 3; // Structure
        if (progress < 100) return 4; // Matching
        return 5; // Done
    };

    const currentStageIndex = isProcessing ? getStageIndex(processingFiles[0].process_progress) : -1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {isProcessing ? 'Đang xử lý hồ sơ...' : 'Upload File Scan'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {isProcessing ? 'Vui lòng chờ hoặc đóng để xử lý ngầm' : 'Chọn hoặc kéo thả file cần xử lý'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title={isProcessing ? "Đóng và chạy ngầm" : "Đóng"}
                    >
                        {isProcessing ? <Minimize2 size={24} /> : <X size={24} />}
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {isProcessing ? (
                        /* Progress UI based on props */
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 text-[#004A99] rounded-lg">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{processingFiles[0]?.name} {processingFiles.length > 1 ? `và ${processingFiles.length - 1} file khác` : ''}</h3>
                                    <p className="text-sm text-gray-500">Đang thực hiện quy trình tự động hóa ({processingFiles[0].process_progress}%)</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {STAGES.map((stage, index) => {
                                    const isCompleted = currentStageIndex > index;
                                    const isCurrent = currentStageIndex === index;

                                    return (
                                        <div key={index} className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-300
                                            ${isCurrent ? 'bg-blue-50 border-blue-200' : 'border-transparent'}
                                            ${isCompleted ? 'opacity-50' : ''}
                                        `}>
                                            <div className="flex-shrink-0">
                                                {isCompleted ? (
                                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                ) : isCurrent ? (
                                                    <div className="w-6 h-6 border-2 border-[#004A99] border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>
                                                )}
                                            </div>
                                            <span className={`font-medium ${isCurrent ? 'text-[#004A99]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                {stage}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Upload UI */
                        <>
                            <div
                                className={`group relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer
                                    ${isDragging
                                        ? 'border-[#004A99] bg-blue-50/50 scale-[0.99]'
                                        : 'border-gray-300 hover:border-[#004A99] hover:bg-gray-50'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    onChange={handleFileSelect}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                <div className="flex flex-col items-center gap-4 py-4">
                                    <div className={`p-4 rounded-full transition-colors duration-200 
                                        ${isDragging ? 'bg-blue-100 text-[#004A99]' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-[#004A99]'}`}
                                    >
                                        <Upload size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-lg font-semibold text-gray-700">
                                            Click để chọn file hoặc kéo thả vào đây
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Hỗ trợ PDF, JPG, PNG (Tối đa 50MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <CheckCircle size={16} className="text-[#004A99]" />
                                        Đã chọn {files.length} file
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {files.map((file, idx) => (
                                            <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-white rounded border border-gray-200 text-blue-600">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isProcessing && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleUploadClick}
                            disabled={files.length === 0}
                            className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 shadow-sm transition-all
                                ${files.length > 0
                                    ? 'bg-[#004A99] hover:bg-blue-800 active:scale-95 shadow-lg'
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <Upload size={18} />
                            Upload {files.length > 0 ? `(${files.length})` : ''}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadModal;
