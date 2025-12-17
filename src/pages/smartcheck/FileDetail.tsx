import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    ArrowLeft, FileText, CheckCircle, AlertTriangle,
    Calendar, User, Layers, ExternalLink, Download
} from 'lucide-react';
import type { Deal } from '../../types';
import { useI18n } from '../../i18n/I18nProvider';
import { apiService, type DocumentBatch } from '../../services/api';
import { format } from 'date-fns';
import { toastError } from '../../services/toast';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileDetail = () => {
    const { id } = useParams<{ id: string }>();
    console.log('id', id);
    const navigate = useNavigate();
    const { t } = useI18n();
    const [file, setFile] = useState<DocumentBatch | null>(null);
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);

    // Fetch batch details and deals
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                // Fetch batch details
                const batch = await apiService.getDocumentBatchById(parseInt(id));
                setFile(batch);

                // Fetch deals for this batch
                const batchDeals = await apiService.getDealsByBatch(parseInt(id));
                // Transform deals to match frontend format
                // IMPORTANT: keep backend fields like pdf_path/spending_unit_pdf_path so preview/download works
                const transformedDeals: Deal[] = batchDeals.map(deal => ({
                    ...(deal as any),
                    id: deal.deal_id, // UI uses deal_id as the display id
                    source_file: batch.name,
                    type: deal.deal_type || 'Unknown',
                    user: deal.user_code || 'Unknown',
                    customer: deal.customer_name || 'Unknown',
                    amount_system: deal.amount_system || 0,
                    amount_extract: deal.amount_extract || 0,
                    currency: deal.currency || 'VND',
                    pages: `${deal.start_page}-${deal.end_page}`,
                    status: deal.status === 'matched' ? 'matched' : 'mismatch',
                    score: deal.confidence_score || 0,
                    timestamp: deal.processed_at ? format(new Date(deal.processed_at), 'dd/MM/yyyy HH:mm') : '',
                    signatures: deal.signatures || { teller: { status: 'unknown', name: '' }, supervisor: { status: 'unknown', name: '' } }
                }));
                setDeals(transformedDeals);
                setSelectedDeal(transformedDeals[0] || null);
            } catch (error: any) {
                console.error('Failed to fetch file details:', error);
                toastError('Không thể tải chi tiết tài liệu');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Get PDF URL to display (prioritize spending unit, then receiving unit, then full deal)
    const getPdfUrl = (deal: Deal | null) => {
        if (!deal) return null;

        const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.200:8004';

        // Check if deal has spending or receiving unit PDFs from API response
        const dealData = deal as any;

        console.log('Deal data:', dealData);

        if (dealData.spending_unit_pdf_path) {
            const url = `${API_URL}/${dealData.spending_unit_pdf_path}`;
            console.log('Using spending unit PDF:', url);
            return url;
        }
        if (dealData.receiving_unit_pdf_path) {
            const url = `${API_URL}/${dealData.receiving_unit_pdf_path}`;
            console.log('Using receiving unit PDF:', url);
            return url;
        }
        if (dealData.pdf_path) {
            const url = `${API_URL}/${dealData.pdf_path}`;
            console.log('Using deal PDF:', url);
            return url;
        }

        console.log('No PDF path found for deal');
        return null;
    };

    // Get full document URL
    const getFullDocumentUrl = () => {
        if (!file) return null;
        const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.200:8004';
        return `${API_URL}/${file.file_path}`;
    };

    // Handle view full document
    const handleViewFullDocument = () => {
        const url = getFullDocumentUrl();
        if (url) {
            window.open(url, '_blank');
        }
    };

    // Handle download current document
    const handleDownloadDocument = () => {
        const url = getPdfUrl(selectedDeal);
        if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = `${selectedDeal?.id || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004A99]"></div>
            </div>
        );
    }

    if (!file) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>{t('references.fileDetail.notFound')}</p>
                <button onClick={() => navigate('/documents')} className="text-blue-600 hover:underline mt-2">
                    {t('references.fileDetail.backToList')}
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
                        <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(file.upload_time), 'dd/MM/yyyy HH:mm')}</span>
                        <span className="flex items-center gap-1"><User size={14} /> {file.uploaded_by || 'Unknown'}</span>
                        <span className="flex items-center gap-1"><Layers size={14} /> {t('references.documentManager.pageCount', { count: file.total_pages })}</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Deal List */}
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700">{t('references.fileDetail.dealsList', { count: deals.length })}</h3>
                        <div className="text-xs text-gray-400">{t('references.fileDetail.detectedCount', { count: file.deals_detected || 0 })}</div>
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
                                        <span>{t('references.fileDetail.labels.customer')}:</span>
                                        <span className="font-medium text-right truncate max-w-[120px]" title={deal.customer}>{deal.customer}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>{t('references.fileDetail.labels.amount')}:</span>
                                        <span className="font-medium">{deal.amount_extract.toLocaleString('vi-VN')} {deal.currency}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>{t('references.fileDetail.labels.pages')}:</span>
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
                                {t('references.fileDetail.dataDetail')}
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
                                        {selectedDeal.status === 'matched' ? t('references.fileDetail.validation.matched') : t('references.fileDetail.validation.mismatch')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {t('references.fileDetail.extractionConfidencePrefix')} <strong>{selectedDeal.score}%</strong>.
                                </p>
                            </div>

                            {/* Data Comparison (Simplified for now) */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 text-center border-b pb-1">{t('references.fileDetail.compareData')}</h4>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-0.5">{t('references.fileDetail.labels.dealId')}</label>
                                            <div className="font-medium">{selectedDeal.id}</div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-0.5">{t('references.fileDetail.labels.transactionType')}</label>
                                            <div className="font-medium">{selectedDeal.type}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-xs mb-0.5">{t('references.fileDetail.labels.customer')}</label>
                                        <div className="font-medium text-[#004A99]">{selectedDeal.customer}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                            <label className="block text-gray-400 text-xs mb-1">{t('references.fileDetail.labels.coreBanking')}</label>
                                            <div className="font-bold text-gray-800">{selectedDeal.amount_system.toLocaleString('vi-VN')}</div>
                                            <div className="text-[10px] text-gray-400">{selectedDeal.currency}</div>
                                        </div>
                                        <div className={`p-3 rounded border ${selectedDeal.amount_extract !== selectedDeal.amount_system ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                                            <label className="block text-gray-400 text-xs mb-1">{t('references.fileDetail.labels.ocrExtract')}</label>
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
                                <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-1">{t('references.fileDetail.signatures')}</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">{t('references.fileDetail.labels.teller')}</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{selectedDeal.signatures.teller.name}</div>
                                            <div className="text-[10px] text-green-600 flex items-center justify-end gap-1">
                                                <CheckCircle size={10} /> {t('references.fileDetail.status.valid')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">{t('references.fileDetail.labels.supervisor')}</span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{selectedDeal.signatures.supervisor.name}</div>
                                            {selectedDeal.signatures.supervisor.status === 'review' ? (
                                                <div className="text-[10px] text-amber-600 flex items-center justify-end gap-1">
                                                    <AlertTriangle size={10} /> {t('references.fileDetail.status.lowConfidence')}
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-green-600 flex items-center justify-end gap-1">
                                                    <CheckCircle size={10} /> {t('references.fileDetail.status.valid')}
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
                        {t('references.fileDetail.selectDealPrompt')}
                    </div>
                )}

                {/* Right: PDF Viewer */}
                <div className="flex-1 bg-gray-100 rounded-xl shadow-inner flex flex-col overflow-hidden min-h-[400px]">
                    {/* PDF Viewer Header */}
                    <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-700">{t('references.fileDetail.preview.title')}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleViewFullDocument}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                disabled={!file}
                            >
                                <ExternalLink size={16} />
                                <span>Xem toàn bộ</span>
                            </button>
                            <button
                                onClick={handleDownloadDocument}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-700 hover:bg-green-100 rounded transition-colors"
                                disabled={!selectedDeal}
                            >
                                <Download size={16} />
                                <span>Tải xuống</span>
                            </button>
                        </div>
                    </div>

                    {/* PDF Content */}
                    <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                        {selectedDeal && getPdfUrl(selectedDeal) ? (
                            <div className="bg-white shadow-lg">
                                <Document
                                    file={getPdfUrl(selectedDeal)}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                        <div className="flex items-center justify-center p-20">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        </div>
                                    }
                                    error={
                                        <div className="text-center p-20 text-gray-500">
                                            <FileText size={48} className="opacity-50 mb-4 mx-auto" />
                                            <p>Không thể tải PDF</p>
                                        </div>
                                    }
                                >
                                    {Array.from(new Array(numPages), (_, index) => (
                                        <Page
                                            key={`page_${index + 1}`}
                                            pageNumber={index + 1}
                                            width={600}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                        />
                                    ))}
                                </Document>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <FileText size={48} className="opacity-50 mb-4 mx-auto" />
                                <p className="text-lg font-medium">{t('references.fileDetail.preview.title')}</p>
                                <p className="text-sm opacity-70 mt-2">
                                    {t('references.fileDetail.preview.selectPrompt')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileDetail;
