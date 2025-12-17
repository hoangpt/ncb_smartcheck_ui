export interface PageMapItem {
    range: string;
    deal_id: string;
    type: string;
    status: 'ignored' | 'valid' | 'error' | 'review';
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
