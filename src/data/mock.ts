import type { FileRecord, Deal, Exception } from '../types';

// --- MOCK DATA ---

export const MOCK_FILES: FileRecord[] = [
    // --- 16/12/2025 (3 files) ---
    {
        id: "FILE_20251216_01",
        name: "16.12.2025 HATTT1_0001.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "16/12/2025 08:30",
        total_pages: 44,
        deals_detected: 5,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-2", deal_id: "N/A", type: "Cover/Summary", status: "ignored" },
            { range: "3-4", deal_id: "FC202512160000001", type: "Deal", status: "valid" },
            { range: "5-6", deal_id: "FC202512160000002", type: "Deal", status: "valid" },
            { range: "7-7", deal_id: "Unknown", type: "Orphan", status: "error" },
            { range: "8-10", deal_id: "FC202512160000003", type: "Deal", status: "valid" },
            { range: "11-12", deal_id: "FC202512160000004", type: "Deal", status: "valid" },
            { range: "13-14", deal_id: "FC202512160000005", type: "Deal", status: "valid" },
        ]
    },
    {
        id: "FILE_20251216_02",
        name: "16.12.2025 GDV_HOANGPT01.pdf",
        uploadedBy: "Phạm Thu Hoàng",
        uploadTime: "16/12/2025 09:15",
        total_pages: 12,
        deals_detected: 4,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-1", deal_id: "N/A", type: "Cover", status: "ignored" },
            { range: "2-4", deal_id: "FC202512160000006", type: "Deal", status: "valid" },
            { range: "5-7", deal_id: "FC202512160000007", type: "Deal", status: "valid" },
            { range: "8-9", deal_id: "FC202512160000008", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512160000009", type: "Deal", status: "valid" }
        ]
    },
    {
        id: "FILE_20251216_03",
        name: "16.12.2025 TELLER_ANHNV.pdf",
        uploadedBy: "Nguyễn Văn Anh",
        uploadTime: "16/12/2025 10:30",
        total_pages: 8,
        deals_detected: 2,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512160000010", type: "Deal", status: "valid" },
            { range: "4-4", deal_id: "N/A", type: "Other", status: "ignored" },
            { range: "5-8", deal_id: "FC202512160000011", type: "Deal", status: "valid" }
        ]
    },

    // --- 17/12/2025 (4 files) ---
    {
        id: "FILE_20251217_01",
        name: "17.12.2025 CN_HADONG.pdf",
        uploadedBy: "Lê Văn Cường",
        uploadTime: "17/12/2025 14:20",
        total_pages: 15,
        deals_detected: 2,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-2", deal_id: "FC202512170000012", type: "Deal", status: "valid" },
            { range: "3-15", deal_id: "FC202512170000013", type: "Deal", status: "review" }
        ]
    },
    {
        id: "FILE_20251217_02",
        name: "17.12.2025 PGD_VANQUAN.pdf",
        uploadedBy: "Nguyễn Thu Thủy",
        uploadTime: "17/12/2025 08:45",
        total_pages: 22,
        deals_detected: 1,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-22", deal_id: "BATCH2025121701", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251217_03",
        name: "17.12.2025 CN_THANH_XUAN.pdf",
        uploadedBy: "Phạm Văn Minh",
        uploadTime: "17/12/2025 10:15",
        total_pages: 5,
        deals_detected: 1,
        status: "error",
        process_progress: 100,
        page_map: [
            { range: "1-5", deal_id: "UNKNOWN", type: "Unknown", status: "error" }
        ]
    },
    {
        id: "FILE_20251217_04",
        name: "17.12.2025 HO_SO_BS.pdf",
        uploadedBy: "Lê Văn Cường",
        uploadTime: "17/12/2025 16:00",
        total_pages: 10,
        deals_detected: 1,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-10", deal_id: "FC202512170000014", type: "Deal", status: "valid" }
        ]
    },

    // --- 18/12/2025 (4 files) ---
    {
        id: "FILE_20251218_01",
        name: "18.12.2025 PGD_MYDINH.pdf",
        uploadedBy: "Phạm Thị Hương",
        uploadTime: "18/12/2025 09:00",
        total_pages: 30,
        deals_detected: 10,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512180000020", type: "Deal", status: "valid" },
            { range: "4-6", deal_id: "FC202512180000021", type: "Deal", status: "valid" },
            { range: "7-9", deal_id: "FC202512180000022", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512180000023", type: "Deal", status: "valid" },
            { range: "13-15", deal_id: "FC202512180000024", type: "Deal", status: "valid" },
            { range: "16-18", deal_id: "FC202512180000025", type: "Deal", status: "valid" },
            { range: "19-21", deal_id: "FC202512180000026", type: "Deal", status: "review" },
            { range: "22-24", deal_id: "FC202512180000027", type: "Deal", status: "valid" },
            { range: "25-27", deal_id: "FC202512180000028", type: "Deal", status: "valid" },
            { range: "28-30", deal_id: "FC202512180000029", type: "Deal", status: "valid" }
        ]
    },
    {
        id: "FILE_20251218_02",
        name: "18.12.2025 KHO_QUY_01.pdf",
        uploadedBy: "Trần Văn Nam",
        uploadTime: "18/12/2025 09:30",
        total_pages: 50,
        deals_detected: 15,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-50", deal_id: "BATCH2025121801", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251218_03",
        name: "18.12.2025 KHO_QUY_02.pdf",
        uploadedBy: "Trần Văn Nam",
        uploadTime: "18/12/2025 13:30",
        total_pages: 45,
        deals_detected: 12,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-45", deal_id: "BATCH2025121802", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251218_04",
        name: "18.12.2025 GDV_QUAY3.pdf",
        uploadedBy: "Nguyễn Thị Lan",
        uploadTime: "18/12/2025 15:45",
        total_pages: 12,
        deals_detected: 4,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512180000030", type: "Deal", status: "valid" },
            { range: "4-6", deal_id: "FC202512180000031", type: "Deal", status: "valid" },
            { range: "7-9", deal_id: "FC202512180000032", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512180000033", type: "Deal", status: "valid" }
        ]
    },

    // --- 19/12/2025 (3 files) ---
    {
        id: "FILE_20251219_01",
        name: "19.12.2025 CN_THANHXUAN_SANG.pdf",
        uploadedBy: "Nguyễn Minh Tuấn",
        uploadTime: "19/12/2025 08:30",
        total_pages: 18,
        deals_detected: 5,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512190000040", type: "Deal", status: "valid" },
            { range: "4-6", deal_id: "FC202512190000041", type: "Deal", status: "valid" },
            { range: "7-9", deal_id: "FC202512190000042", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512190000043", type: "Deal", status: "valid" },
            { range: "13-18", deal_id: "FC202512190000044", type: "Deal", status: "review" }
        ]
    },
    {
        id: "FILE_20251219_02",
        name: "19.12.2025 CN_THANHXUAN_CHIEU.pdf",
        uploadedBy: "Nguyễn Minh Tuấn",
        uploadTime: "19/12/2025 14:00",
        total_pages: 22,
        deals_detected: 7,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-22", deal_id: "BATCH2025121902", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251219_03",
        name: "19.12.2025 GIAO_NHAN.pdf",
        uploadedBy: "Lê Thị Bích",
        uploadTime: "19/12/2025 16:30",
        total_pages: 4,
        deals_detected: 1,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-4", deal_id: "FC202512190000045", type: "Deal", status: "valid" }
        ]
    },

    // --- 20/12/2025 (3 files) ---
    {
        id: "FILE_20251220_01",
        name: "20.12.2025 HO_SO_QUYET_TOAN.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "20/12/2025 16:45",
        total_pages: 5,
        deals_detected: 1,
        status: "error",
        process_progress: 100,
        page_map: [
            { range: "1-5", deal_id: "UNKNOWN_ERR", type: "Unknown", status: "error" }
        ]
    },
    {
        id: "FILE_20251220_02",
        name: "20.12.2025 KIEM_KE_CUOI_TUAN.pdf",
        uploadedBy: "Trần Thu Hà",
        uploadTime: "20/12/2025 17:00",
        total_pages: 12,
        deals_detected: 0,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-12", deal_id: "N/A", type: "Audit", status: "ignored" }
        ]
    },
    {
        id: "FILE_20251220_03",
        name: "20.12.2025 TONG_HOP.pdf",
        uploadedBy: "Lê Văn Cường",
        uploadTime: "20/12/2025 17:30",
        total_pages: 8,
        deals_detected: 0,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-8", deal_id: "N/A", type: "Report", status: "ignored" }
        ]
    },

    // --- 21/12/2025 (4 files) ---
    {
        id: "FILE_20251221_01",
        name: "21.12.2025 GDV_LANPT_CA1.pdf",
        uploadedBy: "Phan Thị Lan",
        uploadTime: "21/12/2025 08:15",
        total_pages: 22,
        deals_detected: 7,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512210000050", type: "Deal", status: "valid" },
            { range: "4-6", deal_id: "FC202512210000051", type: "Deal", status: "valid" },
            { range: "7-9", deal_id: "FC202512210000052", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512210000053", type: "Deal", status: "valid" },
            { range: "13-15", deal_id: "FC202512210000054", type: "Deal", status: "valid" },
            { range: "16-18", deal_id: "FC202512210000055", type: "Deal", status: "valid" },
            { range: "19-22", deal_id: "FC202512210000056", type: "Deal", status: "valid" }
        ]
    },
    {
        id: "FILE_20251221_02",
        name: "21.12.2025 GDV_LANPT_CA2.pdf",
        uploadedBy: "Phan Thị Lan",
        uploadTime: "21/12/2025 14:00",
        total_pages: 18,
        deals_detected: 5,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-3", deal_id: "FC202512210000057", type: "Deal", status: "valid" },
            { range: "4-6", deal_id: "FC202512210000058", type: "Deal", status: "valid" },
            { range: "7-9", deal_id: "FC202512210000059", type: "Deal", status: "valid" },
            { range: "10-12", deal_id: "FC202512210000060", type: "Deal", status: "valid" },
            { range: "13-18", deal_id: "FC202512210000061", type: "Deal", status: "valid" }
        ]
    },
    {
        id: "FILE_20251221_03",
        name: "21.12.2025 GDV_HUNGNV.pdf",
        uploadedBy: "Nguyễn Văn Hùng",
        uploadTime: "21/12/2025 09:00",
        total_pages: 35,
        deals_detected: 10,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-35", deal_id: "BATCH2025122101", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251221_04",
        name: "21.12.2025 GDV_MAIT T.pdf",
        uploadedBy: "Trần Thị Mai",
        uploadTime: "21/12/2025 10:30",
        total_pages: 12,
        deals_detected: 3,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-4", deal_id: "FC202512210000062", type: "Deal", status: "valid" },
            { range: "5-8", deal_id: "FC202512210000063", type: "Deal", status: "valid" },
            { range: "9-12", deal_id: "FC202512210000064", type: "Deal", status: "valid" }
        ]
    },

    // --- 22/12/2025 (5 files) ---
    {
        id: "FILE_20251222_01",
        name: "22.12.2025 KHO_BAC_DAU_NGAY.pdf",
        uploadedBy: "Đỗ Văn Hùng",
        uploadTime: "22/12/2025 08:00",
        total_pages: 50,
        deals_detected: 20,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-50", deal_id: "BATCH2025122201", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251222_02",
        name: "22.12.2025 KHO_BAC_CUOI_NGAY.pdf",
        uploadedBy: "Đỗ Văn Hùng",
        uploadTime: "22/12/2025 16:30",
        total_pages: 55,
        deals_detected: 22,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-55", deal_id: "BATCH2025122203", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251222_03",
        name: "22.12.2025 CN_MY_DINH_1.pdf",
        uploadedBy: "Nguyễn Thịnh",
        uploadTime: "22/12/2025 09:15",
        total_pages: 20,
        deals_detected: 8,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-2", deal_id: "N/A", type: "Cover", status: "ignored" },
            { range: "3-4", deal_id: "FC202512220000070", type: "Deal", status: "valid" },
            { range: "5-6", deal_id: "FC202512220000071", type: "Deal", status: "valid" },
            { range: "7-8", deal_id: "FC202512220000072", type: "Deal", status: "valid" },
            { range: "9-10", deal_id: "FC202512220000073", type: "Deal", status: "valid" },
            { range: "11-12", deal_id: "FC202512220000074", type: "Deal", status: "valid" },
            { range: "13-14", deal_id: "FC202512220000075", type: "Deal", status: "valid" },
            { range: "15-16", deal_id: "FC202512220000076", type: "Deal", status: "valid" },
            { range: "17-18", deal_id: "FC202512220000077", type: "Deal", status: "valid" },
            { range: "19-20", deal_id: "N/A", type: "Summary", status: "ignored" }
        ]
    },
    {
        id: "FILE_20251222_04",
        name: "22.12.2025 CN_MY_DINH_2.pdf",
        uploadedBy: "Nguyễn Thịnh",
        uploadTime: "22/12/2025 14:15",
        total_pages: 25,
        deals_detected: 9,
        status: "processed",
        process_progress: 100,
        page_map: [
            { range: "1-25", deal_id: "BATCH2025122202", type: "Batch", status: "valid" }
        ]
    },
    {
        id: "FILE_20251222_05",
        name: "22.12.2025 NGOAI_LE_XU_LY.pdf",
        uploadedBy: "Admin",
        uploadTime: "22/12/2025 17:45",
        total_pages: 2,
        deals_detected: 0,
        status: "error",
        process_progress: 0,
        page_map: [
            { range: "1-2", deal_id: "ERR_999", type: "Unknown", status: "error" }
        ]
    }
];

export const MOCK_DEALS: Deal[] = [
    {
        id: "FC202512160000001",
        source_file: "16.12.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "KHO CAU GIAY",
        amount_system: 1538494000,
        amount_extract: 1538494000,
        currency: "VND",
        pages: "3-4",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 07:51",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "valid", name: "Nguyễn Thúy Hường" }
        }
    },
    {
        id: "FC202512160000002",
        source_file: "16.12.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "CN HN-BA DINH",
        amount_system: 970090000,
        amount_extract: 970090000,
        currency: "VND",
        pages: "5-6",
        status: "matched",
        score: 98,
        timestamp: "16/12/2025 07:51",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "valid", name: "Nguyễn Thúy Hường" }
        }
    },
    {
        id: "FC202512160000003",
        source_file: "16.12.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "CN HN-TRUNG HOA",
        amount_system: 1067666000,
        amount_extract: 1060666000,
        currency: "VND",
        pages: "8-10",
        status: "mismatch",
        score: 85,
        timestamp: "16/12/2025 07:52",
        signatures: {
            teller: { status: "valid", name: "Trần Thị Thu Hà" },
            supervisor: { status: "review", name: "Nguyễn Thúy Hường" }
        }
    },
    {
        id: "FC202512160000004",
        source_file: "16.12.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "CN HN-TRUNG HOA",
        amount_system: 500000000,
        amount_extract: 500000000,
        currency: "VND",
        pages: "11-12",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 08:00",
        signatures: { teller: { status: "valid", name: "Trần Thị Thu Hà" }, supervisor: { status: "valid", name: "Nguyễn Thúy Hường" } }
    },
    {
        id: "FC202512160000005",
        source_file: "16.12.2025 HATTT1_0001.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "HATTT1",
        customer: "KHO CAU GIAY",
        amount_system: 2000000000,
        amount_extract: 2000000000,
        currency: "VND",
        pages: "13-14",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 08:15",
        signatures: { teller: { status: "valid", name: "Trần Thị Thu Hà" }, supervisor: { status: "valid", name: "Nguyễn Thúy Hường" } }
    },
    {
        id: "FC202512160000006",
        source_file: "16.12.2025 GDV_HOANGPT01.pdf",
        type: "Giao dịch",
        user: "HOANGPT",
        customer: "KH VANG LAI",
        amount_system: 100000000,
        amount_extract: 100000000,
        currency: "VND",
        pages: "2-4",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 09:20",
        signatures: { teller: { status: "valid", name: "Phạm Thu Hoàng" }, supervisor: { status: "valid", name: "Nguyễn Văn A" } }
    },
    {
        id: "FC202512160000007",
        source_file: "16.12.2025 GDV_HOANGPT01.pdf",
        type: "Giao dịch",
        user: "HOANGPT",
        customer: "CTY TNHH ABC",
        amount_system: 500000000,
        amount_extract: 500000000,
        currency: "VND",
        pages: "5-7",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 09:30",
        signatures: { teller: { status: "valid", name: "Phạm Thu Hoàng" }, supervisor: { status: "valid", name: "Nguyễn Văn A" } }
    },
    {
        id: "FC202512160000008",
        source_file: "16.12.2025 GDV_HOANGPT01.pdf",
        type: "Giao dịch",
        user: "HOANGPT",
        customer: "CTY TNHH XYZ",
        amount_system: 300000000,
        amount_extract: 300000000,
        currency: "VND",
        pages: "8-9",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 09:45",
        signatures: { teller: { status: "valid", name: "Phạm Thu Hoàng" }, supervisor: { status: "valid", name: "Nguyễn Văn A" } }
    },
    {
        id: "FC202512160000009",
        source_file: "16.12.2025 GDV_HOANGPT01.pdf",
        type: "Giao dịch",
        user: "HOANGPT",
        customer: "KH VIP",
        amount_system: 1500000000,
        amount_extract: 1500000000,
        currency: "VND",
        pages: "10-12",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 10:00",
        signatures: { teller: { status: "valid", name: "Phạm Thu Hoàng" }, supervisor: { status: "valid", name: "Nguyễn Văn A" } }
    },
    {
        id: "FC202512160000010",
        source_file: "16.12.2025 TELLER_ANHNV.pdf",
        type: "Chuyển tiền",
        user: "ANHNV",
        customer: "NGUYEN VAN B",
        amount_system: 25000000,
        amount_extract: 25000000,
        currency: "VND",
        pages: "1-3",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 10:35",
        signatures: { teller: { status: "valid", name: "Nguyễn Văn Anh" }, supervisor: { status: "valid", name: "Lê Thị C" } }
    },
    {
        id: "FC202512160000011",
        source_file: "16.12.2025 TELLER_ANHNV.pdf",
        type: "Rút tiền",
        user: "ANHNV",
        customer: "TRAN THI D",
        amount_system: 10000000,
        amount_extract: 10000000,
        currency: "VND",
        pages: "5-8",
        status: "matched",
        score: 100,
        timestamp: "16/12/2025 11:00",
        signatures: { teller: { status: "valid", name: "Nguyễn Văn Anh" }, supervisor: { status: "valid", name: "Lê Thị C" } }
    },
    // --- 17/12 Deals ---
    {
        id: "FC202512170000012",
        source_file: "17.12.2025 CN_HADONG.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "CN_HADONG",
        customer: "PGD VAN QUAN",
        amount_system: 500000000,
        amount_extract: 500000000,
        currency: "VND",
        pages: "1-2",
        status: "matched",
        score: 100,
        timestamp: "17/12/2025 14:00",
        signatures: { teller: { status: "valid", name: "Lê Văn Cường" }, supervisor: { status: "valid", name: "Phạm Văn Minh" } }
    },
    {
        id: "FC202512170000013",
        source_file: "17.12.2025 CN_HADONG.pdf",
        type: "Tiếp quỹ ĐVKD",
        user: "CN_HADONG",
        customer: "PGD XA LA",
        amount_system: 1200000000,
        amount_extract: 1200000000,
        currency: "VND",
        pages: "3-15",
        status: "review",
        score: 88,
        timestamp: "17/12/2025 14:05",
        signatures: { teller: { status: "valid", name: "Lê Văn Cường" }, supervisor: { status: "review", name: "Phạm Văn Minh" } }
    },
    {
        id: "BATCH2025121701",
        source_file: "17.12.2025 PGD_VANQUAN.pdf",
        type: "Cuối ngày",
        user: "PGD_VANQUAN",
        customer: "NOI_BO",
        amount_system: 2500000000,
        amount_extract: 2500000000,
        currency: "VND",
        pages: "1-22",
        status: "matched",
        score: 100,
        timestamp: "17/12/2025 08:30",
        signatures: { teller: { status: "valid", name: "Nguyễn Thu Thủy" }, supervisor: { status: "valid", name: "Trần Văn Nam" } }
    },
    {
        id: "FC202512170000014",
        source_file: "17.12.2025 HO_SO_BS.pdf",
        type: "Bổ sung",
        user: "CN_HADONG",
        customer: "KHO",
        amount_system: 100000000,
        amount_extract: 100000000,
        currency: "VND",
        pages: "1-10",
        status: "matched",
        score: 100,
        timestamp: "17/12/2025 15:50",
        signatures: { teller: { status: "valid", name: "Lê Văn Cường" }, supervisor: { status: "valid", name: "Phạm Văn Minh" } }
    },

    // --- 18/12 Deals ---
    {
        id: "BATCH2025121801",
        source_file: "18.12.2025 PGD_MYDINH.pdf",
        type: "Cuối ngày",
        user: "PGD_MYDINH",
        customer: "NOI_BO",
        amount_system: 3000000000,
        amount_extract: 3000000000,
        currency: "VND",
        pages: "1-30",
        status: "matched",
        score: 100,
        timestamp: "18/12/2025 08:30",
        signatures: { teller: { status: "valid", name: "Phạm Thị Hương" }, supervisor: { status: "valid", name: "Trần Văn Nam" } }
    },
    {
        id: "BATCH2025121802",
        source_file: "18.12.2025 KHO_QUY_01.pdf",
        type: "Kho Quỹ",
        user: "KHO_QUY",
        customer: "NOI_BO",
        amount_system: 5000000000,
        amount_extract: 5000000000,
        currency: "VND",
        pages: "1-50",
        status: "matched",
        score: 100,
        timestamp: "18/12/2025 09:30",
        signatures: { teller: { status: "valid", name: "Trần Văn Nam" }, supervisor: { status: "valid", name: "Nguyễn Văn Hùng" } }
    },
    // Correcting 18/12 Deals based on MOCK_FILES:
    { id: "FC202512180000020", source_file: "18.12.2025 PGD_MYDINH.pdf", type: "Deal", user: "PGD_MYDINH", customer: "KH1", amount_system: 100000000, amount_extract: 100000000, currency: "VND", pages: "1-3", status: "review", score: 90, timestamp: "18/12/2025 09:00", signatures: { teller: { status: "valid", name: "A" }, supervisor: { status: "valid", name: "B" } } },
    { id: "FC202512180000021", source_file: "18.12.2025 PGD_MYDINH.pdf", type: "Deal", user: "PGD_MYDINH", customer: "KH2", amount_system: 100000000, amount_extract: 100000000, currency: "VND", pages: "4-6", status: "review", score: 95, timestamp: "18/12/2025 09:05", signatures: { teller: { status: "valid", name: "A" }, supervisor: { status: "valid", name: "B" } } },
    { id: "FC202512180000026", source_file: "18.12.2025 PGD_MYDINH.pdf", type: "Deal", user: "PGD_MYDINH", customer: "KH_REV", amount_system: 500000000, amount_extract: 500000000, currency: "VND", pages: "19-21", status: "review", score: 80, timestamp: "18/12/2025 09:15", signatures: { teller: { status: "valid", name: "A" }, supervisor: { status: "review", name: "B" } } },

    // BATCH DEALS
    {
        id: "BATCH2025121801",
        source_file: "18.12.2025 KHO_QUY_01.pdf",
        type: "Kho Quỹ",
        user: "KHO_QUY",
        customer: "NOI_BO",
        amount_system: 5000000000,
        amount_extract: 5000000000,
        currency: "VND",
        pages: "1-50",
        status: "matched",
        score: 100,
        timestamp: "18/12/2025 09:30",
        signatures: { teller: { status: "valid", name: "Trần Văn Nam" }, supervisor: { status: "valid", name: "Nguyễn Văn Hùng" } }
    },
    {
        id: "BATCH2025121802",
        source_file: "18.12.2025 KHO_QUY_02.pdf",
        type: "Kho Quỹ",
        user: "KHO_QUY",
        customer: "NOI_BO",
        amount_system: 4500000000,
        amount_extract: 4500000000,
        currency: "VND",
        pages: "1-45",
        status: "matched",
        score: 100,
        timestamp: "18/12/2025 13:30",
        signatures: { teller: { status: "valid", name: "Trần Văn Nam" }, supervisor: { status: "valid", name: "Nguyễn Văn Hùng" } }
    },

    { id: "FC202512180000030", source_file: "18.12.2025 GDV_QUAY3.pdf", type: "Tiếp quỹ", user: "GDV_QUAY3", customer: "KH_LE_01", amount_system: 100000000, amount_extract: 100000000, currency: "VND", pages: "1-3", status: "matched", score: 100, timestamp: "18/12/2025 15:45", signatures: { teller: { status: "valid", name: "Nguyễn Thị Lan" }, supervisor: { status: "valid", name: "Lê Thị Bích" } } },
    { id: "FC202512180000031", source_file: "18.12.2025 GDV_QUAY3.pdf", type: "Tiếp quỹ", user: "GDV_QUAY3", customer: "KH_LE_02", amount_system: 200000000, amount_extract: 200000000, currency: "VND", pages: "4-6", status: "matched", score: 100, timestamp: "18/12/2025 15:50", signatures: { teller: { status: "valid", name: "Nguyễn Thị Lan" }, supervisor: { status: "valid", name: "Lê Thị Bích" } } },
    { id: "FC202512180000032", source_file: "18.12.2025 GDV_QUAY3.pdf", type: "Tiếp quỹ", user: "GDV_QUAY3", customer: "KH_LE_03", amount_system: 300000000, amount_extract: 300000000, currency: "VND", pages: "7-9", status: "matched", score: 100, timestamp: "18/12/2025 15:55", signatures: { teller: { status: "valid", name: "Nguyễn Thị Lan" }, supervisor: { status: "valid", name: "Lê Thị Bích" } } },
    { id: "FC202512180000033", source_file: "18.12.2025 GDV_QUAY3.pdf", type: "Tiếp quỹ", user: "GDV_QUAY3", customer: "KH_LE_04", amount_system: 400000000, amount_extract: 400000000, currency: "VND", pages: "10-12", status: "matched", score: 100, timestamp: "18/12/2025 16:00", signatures: { teller: { status: "valid", name: "Nguyễn Thị Lan" }, supervisor: { status: "valid", name: "Lê Thị Bích" } } },

    // --- 19/12 Deals ---
    { id: "FC202512190000040", source_file: "19.12.2025 CN_THANHXUAN_SANG.pdf", type: "Giao dịch", user: "CN_THANHXUAN", customer: "CTY ABC", amount_system: 550000000, amount_extract: 550000000, currency: "VND", pages: "1-3", status: "matched", score: 100, timestamp: "19/12/2025 08:30", signatures: { teller: { status: "valid", name: "Nguyễn Minh Tuấn" }, supervisor: { status: "valid", name: "Trần Thu Hà" } } },
    { id: "FC202512190000044", source_file: "19.12.2025 CN_THANHXUAN_SANG.pdf", type: "Giao dịch", user: "CN_THANHXUAN", customer: "CTY XYZ", amount_system: 800000000, amount_extract: 800000000, currency: "VND", pages: "13-18", status: "review", score: 90, timestamp: "19/12/2025 09:00", signatures: { teller: { status: "valid", name: "Nguyễn Minh Tuấn" }, supervisor: { status: "review", name: "Trần Thu Hà" } } },
    { id: "BATCH2025121902", source_file: "19.12.2025 CN_THANHXUAN_CHIEU.pdf", type: "Cuối ngày", user: "CN_THANHXUAN", customer: "NOI_BO", amount_system: 1500000000, amount_extract: 1500000000, currency: "VND", pages: "1-22", status: "matched", score: 100, timestamp: "19/12/2025 14:00", signatures: { teller: { status: "valid", name: "Nguyễn Minh Tuấn" }, supervisor: { status: "valid", name: "Trần Thu Hà" } } },

    // --- 21/12 Deals ---
    { id: "FC202512210000050", source_file: "21.12.2025 GDV_LANPT_CA1.pdf", type: "Tiếp quỹ", user: "GDV_LANPT", customer: "KH_A", amount_system: 110000000, amount_extract: 110000000, currency: "VND", pages: "1-3", status: "matched", score: 100, timestamp: "21/12/2025 08:15", signatures: { teller: { status: "valid", name: "Phan Thị Lan" }, supervisor: { status: "valid", name: "Đỗ Văn Hùng" } } },
    { id: "FC202512210000056", source_file: "21.12.2025 GDV_LANPT_CA1.pdf", type: "Tiếp quỹ", user: "GDV_LANPT", customer: "KH_G", amount_system: 770000000, amount_extract: 770000000, currency: "VND", pages: "19-22", status: "matched", score: 100, timestamp: "21/12/2025 08:45", signatures: { teller: { status: "valid", name: "Phan Thị Lan" }, supervisor: { status: "valid", name: "Đỗ Văn Hùng" } } },
    { id: "BATCH2025122101", source_file: "21.12.2025 GDV_HUNGNV.pdf", type: "Batch", user: "GDV_HUNGNV", customer: "NOI_BO", amount_system: 3500000000, amount_extract: 3500000000, currency: "VND", pages: "1-35", status: "matched", score: 100, timestamp: "21/12/2025 09:00", signatures: { teller: { status: "valid", name: "Nguyễn Văn Hùng" }, supervisor: { status: "valid", name: "Đỗ Văn Hùng" } } },

    // --- 22/12 Deals ---
    { id: "BATCH2025122201", source_file: "22.12.2025 KHO_BAC_DAU_NGAY.pdf", type: "Batch", user: "KHO_BAC", customer: "NOI_BO", amount_system: 10000000000, amount_extract: 10000000000, currency: "VND", pages: "1-50", status: "matched", score: 100, timestamp: "22/12/2025 08:00", signatures: { teller: { status: "valid", name: "Đỗ Văn Hùng" }, supervisor: { status: "valid", name: "Admin" } } },
    { id: "BATCH2025122203", source_file: "22.12.2025 KHO_BAC_CUOI_NGAY.pdf", type: "Batch", user: "KHO_BAC", customer: "NOI_BO", amount_system: 12000000000, amount_extract: 12000000000, currency: "VND", pages: "1-55", status: "matched", score: 100, timestamp: "22/12/2025 16:30", signatures: { teller: { status: "valid", name: "Đỗ Văn Hùng" }, supervisor: { status: "valid", name: "Admin" } } },
    { id: "BATCH2025122202", source_file: "22.12.2025 CN_MY_DINH_2.pdf", type: "Batch", user: "CN_MY_DINH", customer: "NOI_BO", amount_system: 2200000000, amount_extract: 2200000000, currency: "VND", pages: "1-25", status: "matched", score: 100, timestamp: "22/12/2025 14:15", signatures: { teller: { status: "valid", name: "Nguyễn Thịnh" }, supervisor: { status: "valid", name: "Trần Thu Hà" } } }
];

export const MOCK_EXCEPTIONS: Exception[] = [
    { id: 1, type: "Split Error", desc: "Trang 7 không tìm thấy Deal ID (Trang lẻ)", source: "18.10.2025 HATTT1_0001.pdf", severity: "medium" },
    { id: 2, type: "Data Mismatch", desc: "FC202512160000003: Lệch số tiền > 5.000.000 VND", source: "18.10.2025 HATTT1_0001.pdf", severity: "high" },
    { id: 3, type: "Low Confidence", desc: "Chữ ký KSV quá mờ (Deal FC206...)", source: "18.10.2025 HATTT1_0001.pdf", severity: "low" }
];
