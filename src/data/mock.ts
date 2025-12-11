export interface PageMapItem {
    range: string;
    deal_id: string;
    type: string;
    status: 'ignored' | 'valid' | 'error';
}

export interface FileRecord {
    id: string;
    name: string;
    uploadedBy: string;
    uploadTime: string;
    total_pages: number;
    deals_detected: number;
    status: 'processed' | 'processing' | 'error';
    process_progress: number;
    page_map: PageMapItem[];
}

export interface Signature {
    status: 'valid' | 'review' | 'invalid';
    name: string;
}

export interface Deal {
    id: string;
    source_file: string;
    type: string;
    user: string;
    customer: string;
    amount_system: number;
    amount_extract: number;
    currency: string;
    pages: string;
    status: 'matched' | 'mismatch' | 'review' | 'processed';
    score: number;
    timestamp: string;
    signatures: {
        teller: Signature;
        supervisor: Signature;
    };
}

export interface Exception {
    id: number;
    type: string;
    desc: string;
    source: string;
    severity: 'low' | 'medium' | 'high';
}

// --- MOCK DATA ---

export const MOCK_FILES: FileRecord[] = [
    {
        id: "FILE_20251018_01",
        name: "18.10.2025 HATTT1_0001.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "18/10/2025 08:30",
        total_pages: 44,
        deals_detected: 16,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-2", deal_id: "N/A", type: "Cover/Summary", status: "ignored" },
            { range: "3-4", deal_id: "FC208TQD...001", type: "Deal", status: "valid" },
            { range: "5-6", deal_id: "FC202TQD...001", type: "Deal", status: "valid" },
            { range: "7-7", deal_id: "Unknown", type: "Orphan", status: "error" },
            { range: "8-10", deal_id: "FC207TQD...002", type: "Deal", status: "valid" },
            { range: "11-12", deal_id: "FC208TQD...003", type: "Deal", status: "valid" },
            { range: "13-14", deal_id: "FC208TQD...004", type: "Deal", status: "valid" },
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

export const MOCK_DEALS: Deal[] = [
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

export const MOCK_EXCEPTIONS: Exception[] = [
    { id: 1, type: "Split Error", desc: "Trang 7 không tìm thấy Deal ID (Trang lẻ)", source: "18.10.2025 HATTT1_0001.pdf", severity: "medium" },
    { id: 2, type: "Data Mismatch", desc: "FC207TQD...002: Lệch số tiền > 5.000.000 VND", source: "18.10.2025 HATTT1_0001.pdf", severity: "high" },
    { id: 3, type: "Low Confidence", desc: "Chữ ký KSV quá mờ (Deal FC206...)", source: "18.10.2025 HATTT1_0001.pdf", severity: "low" }
];
