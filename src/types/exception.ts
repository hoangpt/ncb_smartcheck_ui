export interface Exception {
    id: number;
    type: string;
    desc: string;
    source: string;
    severity: 'low' | 'medium' | 'high';
}
