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
