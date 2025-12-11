import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Scissors, Check, ZoomOut, ZoomIn,
    LayoutDashboard, CheckCircle, X, AlertTriangle, Save
} from 'lucide-react';
import { MOCK_DEALS } from '../data/mock';
import type { Deal } from '../data/mock';
import StatusBadge from '../components/StatusBadge';

const Workbench = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the deal from mock data
    const selectedDeal = MOCK_DEALS.find((deal: Deal) => deal.id === id);

    if (!selectedDeal) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800">Không tìm thấy giao dịch</h2>
                <p className="text-gray-500 mb-4">Giao dịch {id} không tồn tại hoặc đã bị xóa.</p>
                <button onClick={() => navigate('/reconciliation')} className="text-[#004A99] hover:underline">
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    // Check mismatch for highlighting logic
    const isAmountMismatch = selectedDeal.amount_system !== selectedDeal.amount_extract;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-white animate-fade-in">
            {/* Workbench Header */}
            <div className="h-14 border-b bg-white px-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/reconciliation')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
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
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors">
                        <Scissors size={16} /> Cắt lại trang
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-[#004A99] hover:bg-blue-800 text-white rounded text-sm font-medium transition-colors shadow">
                        <Check size={16} /> Duyệt hồ sơ
                    </button>
                </div>
            </div>

            {/* Split View Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT PANE: Document Viewer */}
                <div className="w-1/2 bg-gray-100 border-r flex flex-col relative">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm z-10 flex gap-4">
                        <span>Trang {selectedDeal.pages.split('-')[0]}/44</span>
                        <div className="border-l border-gray-500 mx-2"></div>
                        <ZoomOut size={14} className="cursor-pointer hover:text-blue-300" />
                        <ZoomIn size={14} className="cursor-pointer hover:text-blue-300" />
                    </div>

                    {/* Simulated PDF Viewer */}
                    <div className="flex-1 overflow-auto p-8 flex justify-center custom-scrollbar">
                        <div className="w-full max-w-xl bg-white shadow-xl min-h-[800px] relative transition-transform origin-top">
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
                                <span className="bg-blue-500 text-white text-[10px] px-1 absolute -top-4 left-0 hidden group-hover:block whitespace-nowrap z-20 shadow">Chữ ký GDV</span>
                            </div>
                            <div className="absolute top-[500px] right-[40px] w-[150px] h-[100px] border-2 border-blue-500 bg-blue-500/10 rounded cursor-pointer group">
                                <span className="bg-blue-500 text-white text-[10px] px-1 absolute -top-4 left-0 hidden group-hover:block whitespace-nowrap z-20 shadow">Chữ ký KSV</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANE: Data & Validation */}
                <div className="w-1/2 flex flex-col bg-white overflow-auto custom-scrollbar">
                    <div className="p-6">
                        <h3 className="text-[#004A99] font-bold mb-4 flex items-center gap-2 border-b pb-2">
                            <LayoutDashboard size={18} /> Thông tin giao dịch
                        </h3>

                        {/* Comparison Form */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {/* Header Row */}
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-[-10px]">Dữ liệu trích xuất (OCR)</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-[-10px]">Dữ liệu hệ thống (Core)</div>

                            {/* Deal ID */}
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <label className="text-xs text-gray-500 block mb-1">Deal ID</label>
                                <div className="font-mono font-medium truncate" title={selectedDeal.id}>{selectedDeal.id}</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded border border-blue-100 flex justify-between items-center">
                                <div className="overflow-hidden">
                                    <label className="text-xs text-blue-500 block mb-1">System Ref</label>
                                    <div className="font-mono font-medium truncate" title={selectedDeal.id}>{selectedDeal.id}</div>
                                </div>
                                <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                            </div>

                            {/* Amount - The critical part */}
                            <div className={`p-3 rounded border ${isAmountMismatch ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                                <label className="text-xs text-gray-500 block mb-1">Số tiền (VND)</label>
                                <input
                                    type="text"
                                    className={`w-full bg-transparent font-mono font-bold text-lg outline-none ${isAmountMismatch ? 'text-red-600' : 'text-gray-800'}`}
                                    defaultValue={new Intl.NumberFormat('vi-VN').format(selectedDeal.amount_extract)}
                                />
                                {isAmountMismatch && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={10} /> OCR độ tin cậy thấp (65%)</p>}
                            </div>
                            <div className={`p-3 rounded border flex justify-between items-center ${isAmountMismatch ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-100'}`}>
                                <div>
                                    <label className="text-xs text-blue-500 block mb-1">System Amount</label>
                                    <div className={`font-mono font-bold text-lg ${isAmountMismatch ? 'text-red-700' : 'text-blue-900'}`}>
                                        {new Intl.NumberFormat('vi-VN').format(selectedDeal.amount_system)}
                                    </div>
                                </div>
                                {isAmountMismatch ? (
                                    <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 font-medium hover:bg-red-200">
                                        Điều chỉnh
                                    </button>
                                ) : (
                                    <CheckCircle size={16} className="text-green-600" />
                                )}
                            </div>

                            {/* Customer */}
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 col-span-2">
                                <label className="text-xs text-gray-500 block mb-1">Khách hàng / Đơn vị</label>
                                <div className="font-medium">{selectedDeal.customer}</div>
                            </div>
                        </div>

                        <div className="border-t my-8"></div>

                        {/* Signature Verification Section */}
                        <h3 className="text-[#004A99] font-bold mb-4 flex items-center gap-2 border-b pb-2">
                            <Scissors size={18} /> Đối chiếu chữ ký
                        </h3>

                        <div className="space-y-4">
                            {/* Signature 1 */}
                            <div className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-700">1. Giao dịch viên: <span className="text-blue-600">{selectedDeal.signatures.teller.name}</span></span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Khớp 99%</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Cắt từ chứng từ</p>
                                        <div className="h-20 bg-gray-50 border rounded flex items-center justify-center overflow-hidden">
                                            {/* Simulated Signature Image */}
                                            <span className="font-script text-2xl italic text-blue-900">Ha</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Mẫu trên hệ thống</p>
                                        <div className="h-20 bg-blue-50 border border-blue-100 rounded flex items-center justify-center overflow-hidden">
                                            <span className="font-script text-2xl italic text-blue-900">Ha</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100 border border-green-200 active:scale-95 transition-transform"><Check size={18} /></button>
                                        <button className="p-2 bg-gray-50 text-gray-400 rounded hover:bg-gray-100 border active:scale-95 transition-transform"><X size={18} /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Signature 2 */}
                            <div className={`border rounded-lg p-4 shadow-sm transition-colors ${selectedDeal.signatures.supervisor.status === 'review' ? 'border-amber-300 bg-amber-50/50' : 'bg-white'}`}>
                                <div className="flex justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-700">2. Kiểm soát viên: <span className="text-blue-600">{selectedDeal.signatures.supervisor.name}</span></span>
                                    {selectedDeal.signatures.supervisor.status === 'review' && (
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1 animate-pulse">
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
                                        <div className="h-20 bg-blue-50 border border-blue-100 rounded flex items-center justify-center overflow-hidden">
                                            <span className="font-script text-2xl italic text-blue-900">Huong</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button className="p-2 bg-white text-green-600 rounded hover:bg-green-50 border border-green-200 shadow-sm active:scale-95 transition-transform"><Check size={18} /></button>
                                        <button className="p-2 bg-white text-red-500 rounded hover:bg-red-50 border border-red-200 shadow-sm active:scale-95 transition-transform"><X size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto p-4 border-t bg-gray-50 flex justify-between items-center sticky bottom-0 z-10">
                        <button className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline">Báo cáo sai sót</button>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-white border text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-medium transition-colors" onClick={() => navigate('/reconciliation')}>
                                Bỏ qua
                            </button>
                            <button className="px-6 py-2 bg-[#ED1C24] text-white rounded-lg shadow hover:bg-red-700 text-sm font-medium flex items-center gap-2 transition-colors active:scale-95" onClick={() => navigate('/reconciliation')}>
                                <Save size={16} /> Lưu & Tiếp tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Workbench;
