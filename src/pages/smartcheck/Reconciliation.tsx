import { useNavigate } from 'react-router-dom';
import { Filter, Download } from 'lucide-react';
import { MOCK_DEALS } from '../../data/mock';
import type { Deal } from '../../types';
import StatusBadge from '../../components/StatusBadge';

const Reconciliation = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Đối soát giao dịch</h2>
                    <p className="text-gray-500 mt-1">Danh sách các Deal đã được cắt và sẵn sàng chấm điểm</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white border rounded-lg text-gray-600 shadow-sm hover:bg-gray-50">
                        <Filter size={18} />
                    </button>
                    <button className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium shadow-sm">
                        <Download size={18} /> Xuất Excel
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-1">
                <button className="px-4 py-2 text-[#004A99] font-bold border-b-2 border-[#004A99]">Tất cả (16)</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t">Chờ duyệt (4)</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t">Ngoại lệ (2)</button>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t">Đã hoàn thành (10)</button>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Deal ID</th>
                            <th className="px-6 py-4">Nguồn File</th>
                            <th className="px-6 py-4">Đơn vị</th>
                            <th className="px-6 py-4 text-right">Giá trị (VND)</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {MOCK_DEALS.map((deal: Deal) => (
                            <tr
                                key={deal.id}
                                className="hover:bg-blue-50 cursor-pointer group transition-colors"
                                onClick={() => navigate(`/reconciliation/${deal.id}`)}
                            >
                                <td className="px-6 py-4 font-mono font-medium text-[#004A99]">{deal.id}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[150px]" title={deal.source_file}>
                                    {deal.source_file} <br /> <span className="bg-gray-200 px-1 rounded">Trang {deal.pages}</span>
                                </td>
                                <td className="px-6 py-4">{deal.customer}</td>
                                <td className="px-6 py-4 text-right font-mono text-gray-700">
                                    {new Intl.NumberFormat('vi-VN').format(deal.amount_system)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center"><StatusBadge status={deal.status} score={deal.score} /></div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[#004A99] font-medium text-xs border border-blue-200 px-3 py-1 rounded bg-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white">
                                        Chấm điểm
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reconciliation;
