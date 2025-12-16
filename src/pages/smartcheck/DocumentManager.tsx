import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Upload, FileText,
    Scissors, CheckCircle, AlertTriangle, Eye
} from 'lucide-react';
import { MOCK_FILES } from '../../data/mock';
import type { FileRecord } from '../../types';
import UploadModal from '../../components/UploadModal';
import SplittingEditor from '../../components/SplittingEditor';
import { format } from 'date-fns';
import { useI18n } from '../../i18n/I18nProvider';

// Timings in milliseconds
const TIMING = {
    UPLOAD: 15000,
    SCAN: 60000,
    SPLIT: 120000,
    STRUCTURE: 120000,
    MATCHING: 195000
};

// Cumulative time points for easier calculation
const TIME_POINTS = {
    UPLOAD_DONE: TIMING.UPLOAD,
    SCAN_DONE: TIMING.UPLOAD + TIMING.SCAN,
    SPLIT_DONE: TIMING.UPLOAD + TIMING.SCAN + TIMING.SPLIT,
    STRUCTURE_DONE: TIMING.UPLOAD + TIMING.SCAN + TIMING.SPLIT + TIMING.STRUCTURE,
    MATCHING_DONE: TIMING.UPLOAD + TIMING.SCAN + TIMING.SPLIT + TIMING.STRUCTURE + TIMING.MATCHING,
};

const DocumentManager = () => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [files, setFiles] = useState<FileRecord[]>(MOCK_FILES);
    const [activeUploadIds, setActiveUploadIds] = useState<string[]>([]);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Effect to run simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            setFiles(currentFiles => {
                let hasChanges = false;
                const updatedFiles = currentFiles.map(file => {
                    // Skip files that are already completed or not new uploads
                    if (file.status !== 'processing' || !file.id.startsWith('NEW_FILE')) {
                        return file;
                    }

                    const startTime = parseInt(file.id.split('_')[2]); // Extract timestamp from ID
                    const elapsed = Date.now() - startTime;

                    let newProgress = file.process_progress;
                    let newStatus: 'processing' | 'processed' | 'error' = 'processing';

                    // Update progress based on elapsed time vs total time
                    if (elapsed < TIME_POINTS.UPLOAD_DONE) {
                        const stageProgress = (elapsed / TIMING.UPLOAD) * 10;
                        newProgress = Math.min(10, stageProgress);
                    } else if (elapsed < TIME_POINTS.SCAN_DONE) {
                        const stageElapsed = elapsed - TIME_POINTS.UPLOAD_DONE;
                        const stageProgress = (stageElapsed / TIMING.SCAN) * 20;
                        newProgress = 10 + stageProgress;
                    } else if (elapsed < TIME_POINTS.SPLIT_DONE) {
                        const stageElapsed = elapsed - TIME_POINTS.SCAN_DONE;
                        const stageProgress = (stageElapsed / TIMING.SPLIT) * 25;
                        newProgress = 30 + stageProgress;
                    } else if (elapsed < TIME_POINTS.STRUCTURE_DONE) {
                        const stageElapsed = elapsed - TIME_POINTS.SPLIT_DONE;
                        const stageProgress = (stageElapsed / TIMING.STRUCTURE) * 25;
                        newProgress = 55 + stageProgress;
                    } else if (elapsed < TIME_POINTS.MATCHING_DONE) {
                        const stageElapsed = elapsed - TIME_POINTS.STRUCTURE_DONE;
                        const stageProgress = (stageElapsed / TIMING.MATCHING) * 20;
                        newProgress = 80 + stageProgress;
                    } else {
                        newProgress = 100;
                        newStatus = 'processed';
                    }

                    if (Math.floor(newProgress) !== Math.floor(file.process_progress) || newStatus !== file.status) {
                        hasChanges = true;
                        return {
                            ...file,
                            process_progress: Math.floor(newProgress),
                            status: newStatus
                        };
                    }
                    return file;
                });

                return hasChanges ? updatedFiles : currentFiles;
            });
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, []);

    const handleUpload = (uploadedFiles: File[]) => {
        // Create new records for uploaded files
        const newFileIds: string[] = [];
        const newRecords: FileRecord[] = uploadedFiles.map((file, index) => {
            const id = `NEW_FILE_${Date.now()}_${index}`;
            newFileIds.push(id);
            return {
                id,
                name: file.name,
                // Format: dd/MM/yyyy HH:mm
                uploadTime: format(new Date(), 'dd/MM/yyyy HH:mm'),
                uploadedBy: "Admin User",
                status: 'processing',
                process_progress: 0,
                total_pages: Math.floor(Math.random() * 10) + 1,
                deals_detected: Math.floor(Math.random() * 5) + 1,
                page_map: []
            };
        });

        setActiveUploadIds(newFileIds);
        setFiles(prev => [...newRecords, ...prev]);
        // Do NOT close modal automatically, keep it open to show progress
    };

    const handleCloseModal = () => {
        setActiveUploadIds([]); // Clear active uploads view
        setIsUploadModalOpen(false);
    };

    const handleSaveSplitting = (fileId: string, newPageMap: any[]) => {
        setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
                // Determine new deals count based on unique deal IDs in newPageMap
                const uniqueDeals = new Set(newPageMap.map(p => p.deal_id).filter(id => id));
                return {
                    ...f,
                    page_map: newPageMap,
                    deals_detected: uniqueDeals.size
                };
            }
            return f;
        }));
        setEditingFileId(null);
    };

    // Filter files based on selectedDate
    // Mock data format: "18/10/2025 08:30" (dd/MM/yyyy HH:mm)
    // selectedDate format: "yyyy-MM-dd"
    const filteredFiles = files.filter(f => {
        if (!selectedDate) return true;
        const [day, month, year] = f.uploadTime.split(' ')[0].split('/');
        // Create date string in yyyy-MM-dd for comparison
        const fileDate = `${year}-${month}-${day}`;
        return fileDate === selectedDate;
    });

    // Filter files that are currently being viewed in the modal (from the full list or filtered list? 
    // Usually modal runs on activeUploadIds, independent of view filter, 
    // but here we pass 'processingFiles' to modal. Let's keep using 'files' (all files) for modal consistency
    // so user can still see upload progress even if they filtered away the date.
    const processingFiles = files.filter(f => activeUploadIds.includes(f.id));

    // Stats
    const totalFiles = filteredFiles.length;

    // Note: The original hardcoded value was 186. 
    // Now we sum up `deals_detected` from the filtered list.
    // For processing files, deals_detected is random but exists.
    const totalDeals = filteredFiles.reduce((sum, file) => sum + (file.deals_detected || 0), 0);

    // Count pages with errors or specific conditions if needed. 
    // The previous hardcoded "5" was "Trang chưa nhận diện".
    // We can count items in page_map that are 'Orphan' or 'error' status? 
    // Let's assume "Trang chưa nhận diện" maps to "Orphan" or "error" in splits.
    const totalUnidentified = filteredFiles.reduce((sum, file) => {
        if (!file.page_map) return sum;
        return sum + file.page_map.filter(p => p.type === 'Orphan').length;
    }, 0);

    // Helper to get localized status text
    const getStatusText = (progress: number) => {
        if (progress < 10) return t('references.documentManager.status.upload');
        if (progress < 30) return t('references.documentManager.status.scan');
        if (progress < 55) return t('references.documentManager.status.split');
        if (progress < 80) return t('references.documentManager.status.structure');
        if (progress < 100) return t('references.documentManager.status.matching');
        return t('references.documentManager.status.done');
    };

    return (
        <div className="p-8 animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('references.documentManager.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('references.documentManager.subtitle')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm">
                        <span className="text-sm text-gray-600">{t('common.date')}:</span>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="outline-none text-sm text-gray-800 bg-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-[#004A99] hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                        <Upload size={18} />
                        <span>{t('references.documentManager.uploadNew')}</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg"><FileText size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.filesToday')}</p><p className="text-2xl font-bold">{totalFiles}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg"><Scissors size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.totalDealsExtracted')}</p><p className="text-2xl font-bold">{totalDeals}</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg"><AlertTriangle size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.unrecognizedPages')}</p><p className="text-2xl font-bold">{totalUnidentified}</p></div>
                </div>
            </div>

            {/* File List */}
            <div className="space-y-4">
                {filteredFiles.map((file: FileRecord) => (
                    <div key={file.id} className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                        {/* File Header */}
                        <div
                            className="p-4 flex items-center justify-between border-b border-[#ddd]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-50 text-red-600 rounded">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#004A99]">{file.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {t('references.documentManager.uploadMeta', { time: file.uploadTime, user: file.uploadedBy, pages: file.total_pages })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Hover Action: View Details (Right Side) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/documents/${file.id}`);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#004A99] border border-[#004A99] px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 hover:bg-blue-50"
                                >
                                    <Eye size={14} /> {t('references.documentManager.viewDetail')}
                                </button>

                                {file.status === 'processing' ? (
                                    <div className="w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-blue-600 font-medium">{getStatusText(file.process_progress)}</span>
                                            <span>{file.process_progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${file.process_progress}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                            {t('references.documentManager.dealsCount', { count: file.deals_detected })}
                                        </div>
                                        {file.page_map.some(p => p.status === 'error') && (
                                            <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">
                                                {t('references.documentManager.splitError')}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Arrows Removed */}
                            </div>
                        </div>

                        {/* Always Visible Detail (Visual Page Map) */}
                        {file.page_map.length > 0 && (
                            <div className="bg-gray-50 p-4 border-t border-[#ddd]">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Scissors size={14} /> {t('references.documentManager.splittingMap')}
                                </h5>
                                <div className="grid grid-cols-8 gap-2">
                                    {file.page_map.map((item, idx) => (
                                        <div key={idx} className={`relative group p-2 rounded border flex flex-col gap-1 transition-all hover:shadow-md ${item.status === 'ignored' ? 'bg-gray-200 border-gray-300 opacity-60' :
                                            item.status === 'error' ? 'bg-red-50 border-red-300' :
                                                'bg-white border-blue-200 shadow-sm'
                                            }`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold bg-gray-200 px-1.5 rounded text-gray-600">{t('references.documentManager.pageLabel', { range: item.range })}</span>
                                                {item.status === 'valid' && <CheckCircle size={10} className="text-green-600" />}
                                                {item.status === 'error' && <AlertTriangle size={10} className="text-red-600" />}
                                            </div>
                                            <div className="text-[10px] font-medium truncate text-gray-700" title={item.deal_id}>
                                                {item.deal_id}
                                            </div>
                                            <div className={`text-[9px] px-1.5 py-0.5 rounded-full w-fit ${item.type === 'Orphan' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                                                }`}>
                                                {item.type}
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] hidden group-hover:flex items-center justify-center gap-1 rounded transition-all">
                                                <button
                                                    onClick={() => navigate(`/documents/${file.id}`)}
                                                    className="p-1 bg-white rounded shadow text-[#004A99] hover:text-blue-800"
                                                    title={t('references.documentManager.viewDetail')}
                                                >
                                                    <Eye size={12} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingFileId(file.id)}
                                                    className="p-1 bg-white rounded shadow text-gray-600 hover:text-red-600"
                                                    title={t('references.documentManager.editSplitting')}
                                                >
                                                    <Scissors size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* View Details bottom overlay removed */}
                    </div>
                ))}
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={handleCloseModal}
                onUpload={handleUpload}
                processingFiles={processingFiles}
            />

            {editingFileId && (
                <SplittingEditor
                    file={files.find(f => f.id === editingFileId)!}
                    onClose={() => setEditingFileId(null)}
                    onSave={(newMap) => handleSaveSplitting(editingFileId, newMap)}
                />
            )}
        </div>
    );
};

export default DocumentManager;