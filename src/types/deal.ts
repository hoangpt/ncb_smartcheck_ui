export interface Signature {
    status: 'valid' | 'review' | 'invalid';
    name: string;
}

export interface Deal {
    // Backend identifiers
    id: string; // UI-friendly id (we use deal_id here)
    deal_id?: string;
    batch_id?: number;

    // Pages
    start_page?: number;
    end_page?: number;
    total_pages?: number;
    pages: string;

    // Sections
    spending_unit_start_page?: number | null;
    spending_unit_end_page?: number | null;
    spending_unit_pdf_path?: string | null;
    receiving_unit_start_page?: number | null;
    receiving_unit_end_page?: number | null;
    receiving_unit_pdf_path?: string | null;

    // Core deal data
    source_file: string;
    type: string;
    user: string;
    customer: string;
    customer_name?: string | null;
    deal_type?: string | null;
    user_code?: string | null;
    amount_system: number;
    amount_extract: number;
    currency: string;

    // Status / scoring
    status: 'matched' | 'mismatch' | 'review' | 'processed' | 'pending';
    score: number;
    timestamp: string;
    confidence_score?: number | null;

    // Signatures
    signatures: {
        teller: Signature;
        supervisor: Signature;
    };
    teller_signature_path?: string | null;
    supervisor_signature_path?: string | null;

    // Extracted data blob
    extracted_data?: Record<string, any> | null;

    // File paths
    pdf_path?: string | null;
    file_path?: string | null;
}
