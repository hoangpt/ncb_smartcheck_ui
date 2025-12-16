import React, { useState } from 'react';
import { useI18n } from '../src/i18n/I18nProvider';
import {
    FileText, CheckCircle, AlertTriangle, XCircle, Upload, Search, Filter,
    ChevronRight, ArrowLeft, Save, Download, Eye, Scissors, Check, X,
    FileCheck, LayoutDashboard, Settings, Bell, Menu, MoreVertical,
    ZoomIn, ZoomOut, FileInput, Layers, AlertOctagon, Database, Sliders, ChevronDown, ChevronUp,
    Maximize, Minimize
} from 'lucide-react';

// --- MOCK DATA ---

// 1. Dữ liệu Lô (Files gốc được upload)
const MOCK_FILES = [
    {
        id: "FILE_20251018_01",
        name: "18.10.2025 HATTT1_0001.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "18/10/2025 08:30",
        total_pages: 44,
        deals_detected: 16,
        status: "processed", // processing, processed, error
        process_progress: 100,
        // Page map mô phỏng việc cắt trang
        page_map: [
            { range: "1-2", deal_id: "N/A", type: "Cover/Summary", status: "ignored" },
            { range: "3-4", deal_id: "FC208TQD...001", type: "Deal", status: "valid" },
            { range: "5-6", deal_id: "FC202TQD...001", type: "Deal", status: "valid" },
            { range: "7-7", deal_id: "Unknown", type: "Orphan", status: "error" }, // Trang lẻ loi
            { range: "8-10", deal_id: "FC207TQD...002", type: "Deal", status: "valid" },
            // ... giả lập tiếp
        ]
    },
    {
        id: "FILE_20251018_02",
        name: "18.10.2025 HATTT1_0002.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "18/10/2025 09:15",
        total_pages: 12,
        deals_detected: 0,
        status: "processing",
        process_progress: 45,
        page_map: []
    }
];

// 2. Dữ liệu Deals (Đã được cắt ra từ file gốc) - Dùng cho màn Đối soát
const MOCK_DEALS = [
    {
        id: "FC208TQD251017001",
        source_file: "18.10.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "KHO CAU GIAY",
        amount_system: 1538494000,
        amount_extract: 1538494000,
        currency: "VND",
        pages: "3-4",
        status: "matched",
        score: 100,
        timestamp: "18/10/2025 07:51",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "valid", name: "Nguyễn Thúy Hường" }
        }
    },
    {
        id: "FC202TQD251017001",
        source_file: "18.10.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "CN HN-BA DINH",
        amount_system: 970090000,
        amount_extract: 970090000,
        currency: "VND",
        pages: "5-6",
        status: "matched",
        score: 98,
        timestamp: "18/10/2025 07:51",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "valid", name: "Nguyễn Thúy Hường" }
        }
    },
    {
        id: "FC207TQD251017002",
        source_file: "18.10.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "CN HN-TRUNG HOA",
        amount_system: 1067666000,
        amount_extract: 1060666000,
        currency: "VND",
        pages: "8-10",
        status: "mismatch",
        score: 85,
        timestamp: "18/10/2025 07:52",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "review", name: "Nguyễn Thúy Hường" }
        }
    }
];

// 3. Dữ liệu Ngoại lệ
const MOCK_EXCEPTIONS = [
    { id: 1, type: "Split Error", desc: "Trang 7 không tìm thấy Deal ID (Trang lẻ)", source: "18.10.2025 HATTT1_0001.pdf", severity: "medium" },
    { id: 2, type: "Data Mismatch", desc: "FC207TQD...002: Lệch số tiền > 5.000.000 VND", source: "18.10.2025 HATTT1_0001.pdf", severity: "high" },
    { id: 3, type: "Low Confidence", desc: "Chữ ký KSV quá mờ (Deal FC206...)", source: "18.10.2025 HATTT1_0001.pdf", severity: "low" }
];

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status, score }) => {
    const styles = {
        matched: "bg-green-100 text-green-700 border-green-200",
        review: "bg-amber-100 text-amber-700 border-amber-200",
        mismatch: "bg-red-100 text-red-700 border-red-200",
        processed: "bg-blue-100 text-blue-700 border-blue-200",
        processing: "bg-gray-100 text-gray-700 border-gray-200",
        error: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
        matched: "Khớp đúng",
        review: "Cần kiểm tra",
        mismatch: "Lệch dữ liệu",
        processed: "Đã xử lý",
        processing: "Đang chạy...",
        error: "Lỗi"
    };

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${styles[status]}`}>
            {status === 'matched' && <CheckCircle size={14} />}
            {status === 'review' && <AlertTriangle size={14} />}
            {status === 'mismatch' && <XCircle size={14} />}
            {status === 'processing' && <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />}
            <span>{labels[status]} {score ? `(${score}%)` : ''}</span>
        </div>
    );
};

const Header = () => (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#004A99] rounded flex items-center justify-center text-white font-bold text-lg">
                NCB
            </div>
            <div>
                <h1 className="text-[#004A99] font-bold text-lg leading-tight">Smart Doc Check</h1>
                <p className="text-xs text-gray-500">Hệ thống bóc tách & đối soát chứng từ</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative">
                <Bell size={20} className="text-gray-500 hover:text-[#004A99] cursor-pointer" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[#004A99] font-bold text-xs">
                    TT
                </div>
                <div className="hidden md:block text-sm">
                    <p className="font-semibold text-gray-700">Trần Thu Hà</p>
                    <p className="text-xs text-gray-500">Kiểm soát viên</p>
                </div>
            </div>
        </div>
    </header>
);

// --- APP COMPONENT ---

const App = () => {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState('doc_manager'); // dashboard, doc_manager, reconciliation, exceptions, config
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [expandedFileId, setExpandedFileId] = useState("FILE_20251018_01");

    // --- SUB-VIEWS ---

    // 1. MÀN HÌNH QUẢN LÝ LÔ (DOCUMENT MANAGER)
    const DocumentManagerView = () => (
        <div className="p-8 animate-fade-in space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('references.documentManager.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('references.documentManager.subtitle')}</p>
                </div>
                <button className="bg-[#004A99] hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
                    <Upload size={18} />
                    <span>{t('references.documentManager.uploadNew')}</span>
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg"><FilesIcon size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.filesToday')}</p><p className="text-2xl font-bold">12</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg"><Layers size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.totalDealsExtracted')}</p><p className="text-2xl font-bold">186</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 border-[#ddd]">
                    <div className="p-3 bg-amber-50 text-amber-700 rounded-lg"><AlertOctagon size={24} /></div>
                    <div><p className="text-sm text-gray-500">{t('references.stats.unrecognizedPages')}</p><p className="text-2xl font-bold">5</p></div>
                </div>
            </div>

            {/* File List */}
            <div className="space-y-4">
                {MOCK_FILES.map(file => (
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
                            <div className="bg-gray-50 p-4 border-t">
                                <h5 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                    <Scissors size={14} /> Sơ đồ cắt trang (Splitting Map)
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {file.page_map.map((item, idx) => (
                                        <div key={idx} className={`relative group p-3 rounded border w-40 flex-shrink-0 flex flex-col gap-2 ${item.status === 'ignored' ? 'bg-gray-200 border-gray-300 opacity-60' :
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
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setActiveTab('reconciliation')}
                                        className="text-sm text-[#004A99] font-semibold hover:underline flex items-center gap-1"
                                    >
                                        {t('references.documentManager.goToScoring')} <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // 2. MÀN HÌNH ĐỐI SOÁT (RECONCILIATION)
    const ReconciliationListView = () => (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('references.reconciliation.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('references.reconciliation.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border rounded-lg text-gray-600 shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Download size={18} /> {t('references.reconciliation.exportExcel')}
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-1 border-[#ddd]">
                <button className="px-4 py-2 text-[#004A99] font-bold border-b-2 border-[#004A99]">{t('references.reconciliation.tabs.all', { total: 16 })}</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">{t('references.reconciliation.tabs.pending', { count: 4 })}</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">{t('references.reconciliation.tabs.exceptions', { count: 2 })}</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700">{t('references.reconciliation.tabs.done', { count: 10 })}</button>
            </div>

            <div className="bg-white rounded-lg shadow border border-[#ddd] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">{t('references.reconciliation.table.dealId')}</th>
                            <th className="px-6 py-4">{t('references.reconciliation.table.sourceFile')}</th>
                            <th className="px-6 py-4">{t('references.reconciliation.table.unit')}</th>
                            <th className="px-6 py-4 text-right">{t('references.reconciliation.table.amountVND')}</th>
                            <th className="px-6 py-4 text-center">{t('references.reconciliation.table.status')}</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd]">
                        {MOCK_DEALS.map(deal => (
                            <tr key={deal.id} className="hover:bg-blue-50 cursor-pointer group" onClick={() => { setSelectedDeal(deal); setActiveTab('workbench'); }}>
                                <td className="px-6 py-4 font-mono font-medium text-[#004A99]">{deal.id}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[150px]" title={deal.source_file}>
                                    {deal.source_file} <br /> <span className="bg-gray-200 px-1 rounded">Trang {deal.pages}</span>
                                </td>
                                <td className="px-6 py-4">{deal.customer}</td>
                                <td className="px-6 py-4 text-right font-mono text-gray-700">{new Intl.NumberFormat('vi-VN').format(deal.amount_system)}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center"><StatusBadge status={deal.status} score={deal.score} /></div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[#004A99] font-medium text-xs border border-blue-200 px-3 py-1 rounded bg-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50">
                                        {t('references.reconciliation.table.scoreAction')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // 3. MÀN HÌNH BÁO CÁO NGOẠI LỆ
    const ExceptionView = () => (
        <div className="p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('references.exceptions.title')}</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* ... (Giữ nguyên như cũ) */}
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-800">
                    <AlertTriangle size={20} />
                    <span className="font-semibold">Phát hiện 3 vấn đề cần xử lý thủ công</span>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3 text-left">{t('references.exceptions.table.severity')}</th>
                            <th className="px-6 py-3 text-left">{t('references.exceptions.table.errorType')}</th>
                            <th className="px-6 py-3 text-left">{t('references.exceptions.table.description')}</th>
                            <th className="px-6 py-3 text-left">{t('references.exceptions.table.source')}</th>
                            <th className="px-6 py-3 text-right">{t('references.exceptions.table.actions')}</th>
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
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs mr-3">{t('references.exceptions.table.viewSource')}</button>
                                    <button className="text-gray-600 hover:text-gray-800 font-medium text-xs">{t('references.exceptions.table.ignore')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // 4. MÀN HÌNH CẤU HÌNH
    const ConfigView = () => (
        <div className="p-8 animate-fade-in max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('references.config.title')}</h2>
            <div className="grid gap-8">
                {/* Section 1: Quy tắc cắt trang */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#ddd]">
                    <div className="flex items-center gap-3 mb-4 text-[#004A99]">
                        <Scissors size={24} />
                        <h3 className="font-bold text-lg">{t('references.config.splittingRules')}</h3>
                    </div>
                    {/* ... giữ nguyên nội dung ... */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('references.config.regexDealId')}</label>
                            <div className="flex gap-2">
                                <input type="text" defaultValue="^(FC|FT|LD)[0-9]{10,}" className="flex-1 border p-2 rounded font-mono text-sm bg-gray-50" />
                                <button className="px-3 py-2 bg-gray-200 rounded text-sm font-medium">{t('references.config.test')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ... giữ nguyên các phần còn lại ... */}
            </div>
        </div>
    );

    // 5. MÀN HÌNH WORKBENCH (CHẤM ĐIỂM) - FULLY IMPLEMENTED
    const WorkbenchView = () => {
        if (!selectedDeal) return null;

        // Check mismatch for highlighting
        const isAmountMismatch = selectedDeal.amount_system !== selectedDeal.amount_extract;

        return (
            <div className="h-[calc(100vh-64px)] flex flex-col bg-white">
                {/* Workbench Header */}
                <div className="h-14 border-b bg-white px-4 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveTab('reconciliation')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-800 text-lg font-mono">{selectedDeal.id}</span>
                                <StatusBadge status={selectedDeal.status} score={selectedDeal.score} />
                            </div>
                            <p className="text-xs text-gray-500">File: {selectedDeal.source_file} • Trang: {selectedDeal.pages}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium">
                            <Scissors size={16} /> Cắt lại trang
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#004A99] hover:bg-blue-800 text-white rounded text-sm font-medium">
                            <Check size={16} /> Duyệt hồ sơ
                        </button>
                    </div>
                </div>

                {/* Split View Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANE: Document Viewer */}
                    <div className="w-1/2 bg-gray-100 border-r flex flex-col relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm z-10 flex gap-4">
                            <span>Trang 5/44</span>
                            <div className="border-l border-gray-500 mx-2"></div>
                            <ZoomOut size={14} className="cursor-pointer hover:text-blue-300" />
                            <ZoomIn size={14} className="cursor-pointer hover:text-blue-300" />
                        </div>

                        {/* Simulated PDF Viewer */}
                        <div className="flex-1 overflow-auto p-8 flex justify-center">
                            <div className="w-full max-w-xl bg-white shadow-xl min-h-[800px] relative">
                                {/* Mock Content imitating the PDF */}
                                <div className="p-10 opacity-80 select-none pointer-events-none">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="text-xs font-bold text-blue-900">NCB BANK</div>
                                        <div className="text-xs">MB04/QD.VH.015</div>
                                    </div>
                                    <div className="text-center font-bold text-lg mb-6 uppercase border-b pb-4">Biên bản giao nhận</div>
                                    <div className="space-y-4 text-xs font-serif text-gray-600">
                                        <p>Hôm nay, ngày 18 tháng 10 năm 2025...</p>
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="font-bold">Bên giao: KHO CAU GIAY</p>
                                            </div>
                                            <div>
                                                <p className="font-bold">Bên nhận: {selectedDeal.customer}</p>
                                            </div>
                                        </div>
                                        <table className="w-full border mt-6">
                                            <thead><tr className="bg-gray-100"><th className="border p-1">Mệnh giá</th><th className="border p-1">Thành tiền</th></tr></thead>
                                            <tbody>
                                                <tr><td className="border p-1">500,000</td><td className="border p-1 text-right">...</td></tr>
                                                <tr><td className="border p-1">200,000</td><td className="border p-1 text-right">...</td></tr>
                                                <tr className="font-bold bg-yellow-50"><td className="border p-1">Tổng cộng</td><td className="border p-1 text-right">{new Intl.NumberFormat('vi-VN').format(selectedDeal.amount_extract)}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Signature Area Mock */}
                                    <div className="flex justify-between mt-20 pt-10">
                                        <div className="text-center">
                                            <p className="font-bold">Người giao</p>
                                            <div className="h-16 font-script text-2xl text-blue-800 italic flex items-center justify-center">Ha</div>
                                            <p>{selectedDeal.signatures.teller.name}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">Kiểm soát viên</p>
                                            <div className="h-16 font-script text-2xl text-blue-800 italic flex items-center justify-center">Huong</div>
                                            <p>{selectedDeal.signatures.supervisor.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Overlays (Highlights) */}
                                <div className="absolute top-[280px] right-[40px] w-[120px] h-[30px] border-2 border-green-500 bg-green-500/10 rounded cursor-pointer" title="Extracted Amount"></div>
                                <div className="absolute top-[500px] left-[40px] w-[150px] h-[100px] border-2 border-blue-500 bg-blue-500/10 rounded cursor-pointer group">
                                    <span className="bg-blue-500 text-white text-[10px] px-1 absolute -top-4 left-0 hidden group-hover:block">Chữ ký GDV</span>
                                </div>
                                <div className="absolute top-[500px] right-[40px] w-[150px] h-[100px] border-2 border-blue-500 bg-blue-500/10 rounded cursor-pointer group">
                                    <span className="bg-blue-500 text-white text-[10px] px-1 absolute -top-4 left-0 hidden group-hover:block">Chữ ký KSV</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANE: Data & Validation */}
                    <div className="w-1/2 flex flex-col bg-white overflow-auto">
                        <div className="p-6">
                            <h3 className="text-[#004A99] font-bold mb-4 flex items-center gap-2">
                                <LayoutDashboard size={18} /> {t('references.workbench.transactionInfo')}
                            </h3>

                            {/* Comparison Form */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                {/* Header Row */}
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-[-10px]">{t('references.workbench.ocrData')}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-[-10px]">{t('references.workbench.coreData')}</div>

                                {/* Deal ID */}
                                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                    <label className="text-xs text-gray-500 block mb-1">Deal ID</label>
                                    <div className="font-mono font-medium">{selectedDeal.id}</div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded border border-blue-100 flex justify-between items-center">
                                    <div>
                                        <label className="text-xs text-blue-500 block mb-1">System Ref</label>
                                        <div className="font-mono font-medium">{selectedDeal.id}</div>
                                    </div>
                                    <CheckCircle size={16} className="text-green-600" />
                                </div>

                                {/* Amount - The critical part */}
                                <div className={`p-3 rounded border ${isAmountMismatch ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <label className="text-xs text-gray-500 block mb-1">{t('references.workbench.amountVND')}</label>
                                    <input
                                        type="text"
                                        className={`w-full bg-transparent font-mono font-bold text-lg outline-none ${isAmountMismatch ? 'text-red-600' : 'text-gray-800'}`}
                                        defaultValue={new Intl.NumberFormat('vi-VN').format(selectedDeal.amount_extract)}
                                    />
                                    {isAmountMismatch && <p className="text-[10px] text-red-500 mt-1">OCR độ tin cậy thấp (65%)</p>}
                                </div>
                                <div className={`p-3 rounded border flex justify-between items-center ${isAmountMismatch ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                    <div>
                                        <label className="text-xs text-blue-500 block mb-1">{t('references.workbench.systemAmount')}</label>
                                        <div className={`font-mono font-bold text-lg ${isAmountMismatch ? 'text-red-700' : 'text-blue-900'}`}>
                                            {new Intl.NumberFormat('vi-VN').format(selectedDeal.amount_system)}
                                        </div>
                                    </div>
                                    {isAmountMismatch ? (
                                        <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 font-medium">
                                            Điều chỉnh
                                        </button>
                                    ) : (
                                        <CheckCircle size={16} className="text-green-600" />
                                    )}
                                </div>

                                {/* Customer */}
                                <div className="bg-gray-50 p-3 rounded border border-gray-200 col-span-2">
                                    <label className="text-xs text-gray-500 block mb-1">{t('references.workbench.customerUnit')}</label>
                                    <div className="font-medium">{selectedDeal.customer}</div>
                                </div>
                            </div>

                            <div className="border-t my-6"></div>

                            {/* Signature Verification Section */}
                            <h3 className="text-[#004A99] font-bold mb-4 flex items-center gap-2">
                                <FileCheck size={18} /> {t('references.workbench.signatureMatch')}
                            </h3>

                            <div className="space-y-4">
                                {/* Signature 1 */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-700">1. Giao dịch viên: <span className="text-blue-600">{selectedDeal.signatures.teller.name}</span></span>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Khớp 99%</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-gray-400 mb-1">Cắt từ chứng từ</p>
                                            <div className="h-20 bg-gray-50 border rounded flex items-center justify-center">
                                                {/* Simulated Signature Image */}
                                                <span className="font-script text-2xl italic text-blue-900">Ha</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-gray-400 mb-1">Mẫu trên hệ thống</p>
                                            <div className="h-20 bg-blue-50 border border-blue-100 rounded flex items-center justify-center">
                                                <span className="font-script text-2xl italic text-blue-900">Ha</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200"><Check size={18} /></button>
                                            <button className="p-2 bg-gray-50 text-gray-400 rounded hover:bg-gray-100 border"><X size={18} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Signature 2 */}
                                <div className={`border rounded-lg p-4 ${selectedDeal.signatures.supervisor.status === 'review' ? 'border-amber-300 bg-amber-50' : ''}`}>
                                    <div className="flex justify-between mb-3">
                                        <span className="text-sm font-semibold text-gray-700">2. Kiểm soát viên: <span className="text-blue-600">{selectedDeal.signatures.supervisor.name}</span></span>
                                        {selectedDeal.signatures.supervisor.status === 'review' && (
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                                <AlertTriangle size={10} /> Cần xác nhận
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-gray-400 mb-1">Cắt từ chứng từ</p>
                                            <div className="h-20 bg-white border rounded flex items-center justify-center relative overflow-hidden">
                                                <span className="font-script text-2xl italic text-blue-900 opacity-60">Huong</span>
                                                {/* Noise simulation */}
                                                <div className="absolute inset-0 bg-black/5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center">
                                            <p className="text-xs text-gray-400 mb-1">Mẫu trên hệ thống</p>
                                            <div className="h-20 bg-blue-50 border border-blue-100 rounded flex items-center justify-center">
                                                <span className="font-script text-2xl italic text-blue-900">Huong</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button className="p-2 bg-white text-green-600 rounded hover:bg-green-50 border border-green-200 shadow-sm"><Check size={18} /></button>
                                            <button className="p-2 bg-white text-red-500 rounded hover:bg-red-50 border border-red-200 shadow-sm"><X size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="mt-auto p-4 border-t bg-gray-50 flex justify-between items-center">
                            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">{t('references.workbench.reportIssue')}</button>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium">{t('references.workbench.skip')}</button>
                                <button className="px-6 py-2 bg-[#ED1C24] text-white rounded-lg shadow hover:bg-red-700 text-sm font-medium flex items-center gap-2">
                                    <Save size={16} /> {t('references.workbench.saveAndContinue')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex">
            {/* SIDEBAR */}
            <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl z-30">
                <div className="h-16 flex items-center px-6 border-b border-blue-800/50">
                    <span className="font-bold text-xl tracking-tight">NCB CORE</span>
                </div>

                <nav className="flex-1 py-6 space-y-1">
                    <button
                        onClick={() => setActiveTab('doc_manager')}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'doc_manager' ? 'bg-blue-800 border-r-4 border-[#ED1C24]' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
                    >
                        <Layers size={18} /> Quản lý Lô chứng từ
                    </button>

                    <button
                        onClick={() => setActiveTab('reconciliation')}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'reconciliation' || activeTab === 'workbench' ? 'bg-blue-800 border-r-4 border-[#ED1C24]' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
                    >
                        <FileCheck size={18} /> Đối soát giao dịch
                    </button>

                    <button
                        onClick={() => setActiveTab('exceptions')}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'exceptions' ? 'bg-blue-800 border-r-4 border-[#ED1C24]' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
                    >
                        <AlertOctagon size={18} /> Báo cáo ngoại lệ
                    </button>

                    <div className="pt-4 mt-4 border-t border-blue-800/50">
                        <p className="px-6 text-xs text-blue-400 uppercase font-bold mb-2">Hệ thống</p>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'config' ? 'bg-blue-800 border-r-4 border-[#ED1C24]' : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'}`}
                        >
                            <Settings size={18} /> Cấu hình
                        </button>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />

                <div className="flex-1 overflow-auto relative">
                    {activeTab === 'doc_manager' && <DocumentManagerView />}
                    {activeTab === 'reconciliation' && <ReconciliationListView />}
                    {activeTab === 'workbench' && <WorkbenchView />}
                    {activeTab === 'exceptions' && <ExceptionView />}
                    {activeTab === 'config' && <ConfigView />}
                </div>
            </main>
        </div>
    );
};

// Helper Icon
const FilesIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2" /><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" /><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" /></svg>
)

export default App;