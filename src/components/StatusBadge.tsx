import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
    status: 'matched' | 'mismatch' | 'review' | 'processed' | 'processing' | 'error';
    score?: number;
}

const StatusBadge = ({ status, score }: StatusBadgeProps) => {
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

export default StatusBadge;
