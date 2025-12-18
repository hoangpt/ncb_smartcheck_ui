import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Calendar } from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import { toastInfo } from '../../services/toast';
import { MOCK_DEALS } from '../../data/mock';
import type { Deal } from '../../types';
import StatusBadge from '../../components/StatusBadge';

const Reconciliation = () => {
    const navigate = useNavigate();
    const { t } = useI18n();


    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'exceptions' | 'done'>('all');

    // Filter deals based on selectedDate
    // Deal timestamp format: "18/10/2025 07:51" (dd/MM/yyyy HH:mm)
    const dateFilteredDeals = MOCK_DEALS.filter(deal => {
        if (!selectedDate) return true;
        const [day, month, year] = deal.timestamp.split(' ')[0].split('/');
        // Create date string in yyyy-MM-dd for comparison
        const dealDate = `${year}-${month}-${day}`;
        return dealDate === selectedDate;
    });

    const pendingCount = dateFilteredDeals.filter(d => d.status === 'review').length;
    const exceptionCount = dateFilteredDeals.filter(d => d.status === 'mismatch').length;
    const doneCount = dateFilteredDeals.filter(d => d.status === 'matched').length;

    const filteredDeals = dateFilteredDeals.filter(deal => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return deal.status === 'review';
        if (activeTab === 'exceptions') return deal.status === 'mismatch';
        if (activeTab === 'done') return deal.status === 'matched';
        return true;
    });

    const tabs = [
        { id: 'all', label: t('reconciliation.tabs.all', { total: dateFilteredDeals.length }) },
        { id: 'pending', label: t('reconciliation.tabs.pending', { count: pendingCount }) },
        { id: 'exceptions', label: t('reconciliation.tabs.exceptions', { count: exceptionCount }) },
        { id: 'done', label: t('reconciliation.tabs.done', { count: doneCount }) }
    ] as const;

    return (
        <div className="p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('reconciliation.title')}</h2>
                    <p className="text-gray-500 mt-1">{t('reconciliation.subtitle')}</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50">
                        <span className="text-sm text-gray-600">{t('common.date')}:</span>
                        <span className="text-sm font-bold text-[#004A99] flex items-center gap-2">
                            {selectedDate.split('-').reverse().join('/')}
                            <Calendar size={16} className="text-gray-400" />
                        </span>
                        <input
                            type="date"
                            value={selectedDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toastInfo('Coming soon')}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium shadow-sm"
                        >
                            <Download size={18} /> {t('reconciliation.exportExcel')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-1 border-[#ccc]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-t transition-colors ${activeTab === tab.id
                            ? 'text-[#004A99] font-bold border-b-2 border-[#004A99] bg-blue-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow border border-[#ddd] overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">{t('reconciliation.table.dealId')}</th>
                            <th className="px-6 py-4">{t('reconciliation.table.sourceFile')}</th>
                            <th className="px-6 py-4">{t('reconciliation.table.unit')}</th>
                            <th className="px-6 py-4 text-right">{t('reconciliation.table.amountVND')}</th>
                            <th className="px-6 py-4" style={{ width: '20%' }}>{t('reconciliation.table.status')}</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ddd]">
                        {filteredDeals.length > 0 ? (
                            filteredDeals.map((deal: Deal) => (
                                <tr
                                    key={deal.id}
                                    className="hover:bg-blue-50 cursor-pointer group transition-colors"
                                    onClick={() => navigate(`/reconciliation/${deal.id}`)}
                                >
                                    <td className="px-6 py-4 font-mono font-medium text-[#004A99]">{deal.id}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-[150px]" title={deal.source_file}>
                                        {deal.source_file} <br /> <span className="bg-gray-200 px-1 rounded">{t('reconciliation.pageLabel', { range: deal.pages })}</span>
                                    </td>
                                    <td className="px-6 py-4">{deal.customer}</td>
                                    <td className="px-6 py-4 text-right font-mono text-gray-700">
                                        {new Intl.NumberFormat('vi-VN').format(deal.amount_system)}
                                    </td>
                                    <td className="px-6 py-4" style={{ width: '20%' }}>
                                        <div className="flex"><StatusBadge status={deal.status} score={deal.score} /></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#004A99] font-medium text-xs border border-blue-200 px-3 py-1 rounded bg-white opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white">
                                            {t('reconciliation.table.scoreAction')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 italic">
                                    {t('common.noData')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Toast is rendered globally via <Toaster /> */}
        </div>
    );
};

export default Reconciliation;
