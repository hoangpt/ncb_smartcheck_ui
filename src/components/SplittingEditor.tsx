import { useState, useMemo } from 'react';
import { Save, Plus, Scissors, Check, ArrowRight } from 'lucide-react';
import type { FileRecord, PageMapItem } from '../types';
import { useI18n } from '../i18n/I18nProvider';

interface SplittingEditorProps {
    file: FileRecord;
    onSave: (updatedMap: PageMapItem[]) => void;
    onClose: () => void;
}

interface PageNode {
    pageNumber: number;
    dealId: string;
    type: string; // 'Orphan' | 'Deal'
    status: 'ignored' | 'valid' | 'error';
}

const SplittingEditor = ({ file, onSave, onClose }: SplittingEditorProps) => {
    const { t } = useI18n();
    // Flatten the page map into individual pages for easier editing
    const initialPages = useMemo(() => {
        const pages: PageNode[] = [];
        // Map ranges to individual pages
        file.page_map.forEach(item => {
            const [start, end] = item.range.split('-').map(Number);
            const endPage = end || start;
            for (let i = start; i <= endPage; i++) {
                pages.push({
                    pageNumber: i,
                    dealId: item.deal_id || 'Unassigned',
                    type: item.type,
                    status: item.status
                });
            }
        });
        return pages.sort((a, b) => a.pageNumber - b.pageNumber);
    }, [file]);

    const [pages, setPages] = useState<PageNode[]>(initialPages);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);
    const [activeDealFilter, setActiveDealFilter] = useState<string | null>(null);

    // Get unique deals
    const deals = useMemo(() => {
        const unique = new Set(pages.map(p => p.dealId));
        return Array.from(unique).filter(id => id !== 'Unassigned').sort();
    }, [pages]);

    const togglePageSelection = (pageNumber: number) => {
        setSelectedPages(prev => {
            if (prev.includes(pageNumber)) {
                return prev.filter(p => p !== pageNumber);
            }
            return [...prev, pageNumber];
        });
    };

    const handleCreateNewDeal = () => {
        if (selectedPages.length === 0) return;
        const newDealId = `DEAL_${Date.now().toString().slice(-4)}`;

        setPages(prev => prev.map(p => {
            if (selectedPages.includes(p.pageNumber)) {
                return { ...p, dealId: newDealId, type: 'Deal', status: 'valid' };
            }
            return p;
        }));
        setSelectedPages([]);
    };

    const handleAssignToDeal = (dealId: string) => {
        if (selectedPages.length === 0) return;

        setPages(prev => prev.map(p => {
            if (selectedPages.includes(p.pageNumber)) {
                return { ...p, dealId, type: 'Deal', status: 'valid' };
            }
            return p;
        }));
        setSelectedPages([]);
    };

    const handleSave = () => {
        // Convert back to PageMapItem[] (ranges)
        const newMap: PageMapItem[] = [];
        let currentRangeStart = -1;
        let currentRangeEnd = -1;
        let currentDealId = '';
        let currentType = '';
        let currentStatus: 'ignored' | 'valid' | 'error' = 'valid';

        const flushRange = () => {
            if (currentRangeStart !== -1) {
                newMap.push({
                    range: currentRangeStart === currentRangeEnd ? `${currentRangeStart}` : `${currentRangeStart}-${currentRangeEnd}`,
                    deal_id: currentDealId,
                    type: currentType,
                    status: currentStatus
                });
            }
        };

        pages.forEach((page, index) => {
            if (index === 0) {
                currentRangeStart = page.pageNumber;
                currentRangeEnd = page.pageNumber;
                currentDealId = page.dealId;
                currentType = page.type;
                currentStatus = page.status;
            } else {
                if (page.dealId === currentDealId && page.type === currentType && page.status === currentStatus && page.pageNumber === currentRangeEnd + 1) {
                    currentRangeEnd = page.pageNumber; // Continue range
                } else {
                    flushRange();
                    currentRangeStart = page.pageNumber;
                    currentRangeEnd = page.pageNumber;
                    currentDealId = page.dealId;
                    currentType = page.type;
                    currentStatus = page.status;
                }
            }
        });
        flushRange();

        onSave(newMap);
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col animate-fade-in">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-[#004A99] rounded-lg">
                        <Scissors size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{t('references.documentManager.editSplittingTitle', { name: file.name })}</h2>
                        <p className="text-sm text-gray-500">{t('references.documentManager.editSplittingHelp')}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#004A99] text-white rounded-lg hover:bg-blue-800 shadow-lg flex items-center gap-2"
                    >
                        <Save size={18} /> {t('common.saveChanges')}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Deals List */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-4 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">{t('references.documentManager.dealsList')}</h3>

                    <button
                        onClick={() => setActiveDealFilter(null)}
                        className={`text-left p-3 rounded-lg border transition-all ${activeDealFilter === null ? 'bg-blue-50 border-blue-200 text-[#004A99]' : 'border-transparent hover:bg-gray-50'}`}
                    >
                        <span className="font-bold">{t('references.documentManager.allPages')}</span>
                        <span className="float-right text-xs bg-gray-200 px-2 py-0.5 rounded-full">{pages.length}</span>
                    </button>

                    {deals.map(dealId => {
                        const pageCount = pages.filter(p => p.dealId === dealId).length;
                        return (
                            <div key={dealId} className="group relative">
                                <button
                                    onClick={() => setActiveDealFilter(dealId)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${activeDealFilter === dealId ? 'bg-blue-50 border-blue-200 text-[#004A99]' : 'bg-gray-50 border-gray-100 hover:border-blue-200'}`}
                                >
                                    <div className="font-bold truncate">{dealId}</div>
                                    <div className="text-xs text-gray-400 mt-1">{t('references.documentManager.pageCount', { count: pageCount })}</div>
                                </button>
                                {/* Quick Assign Button (Only visible if selection exists) */}
                                {selectedPages.length > 0 && activeDealFilter !== dealId && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAssignToDeal(dealId); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#004A99] text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        title={t('references.documentManager.assignToDeal')}
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Main Content - Page Grid */}
                <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                    {/* Action Bar */}
                    <div className="mb-6 flex items-center justify-between sticky top-0 z-10 bg-gray-100/95 backdrop-blur py-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-700">{t('references.documentManager.selectedPages', { count: selectedPages.length })}</span>
                            {selectedPages.length > 0 && (
                                <button onClick={() => setSelectedPages([])} className="text-xs text-red-500 hover:underline cursor-pointer">{t('references.documentManager.clearSelection')}</button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateNewDeal}
                                disabled={selectedPages.length === 0}
                                className="px-4 py-2 bg-white border border-blue-200 text-[#004A99] rounded-lg shadow-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus size={16} /> {t('references.documentManager.createNewDeal')}
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-6 gap-4">
                        {pages.map((page) => {
                            // Filter logic
                            if (activeDealFilter && page.dealId !== activeDealFilter) return null;

                            const isSelected = selectedPages.includes(page.pageNumber);
                            const isOrphan = page.type === 'Orphan' || page.dealId === 'Unassigned';

                            return (
                                <div
                                    key={page.pageNumber}
                                    onClick={() => togglePageSelection(page.pageNumber)}
                                    className={`relative aspect-[3/4] bg-white rounded border-2 cursor-pointer transition-all hover:shadow-lg flex flex-col items-center justify-center gap-2 p-4 select-none
                                        ${isSelected ? 'border-[#004A99] ring-2 ring-blue-100 transform scale-105 z-10' : 'border-gray-200 hover:border-blue-300'}
                                    `}
                                >
                                    <span className="text-2xl font-bold text-gray-300 pointer-events-none">
                                        {page.pageNumber}
                                    </span>

                                    <div className={`text-[10px] px-2 py-1 rounded w-full text-center truncate ${isOrphan ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#004A99]'
                                        }`}>
                                        {page.dealId === 'Unassigned' ? t('references.documentManager.unassigned') : page.dealId}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#004A99] rounded-full flex items-center justify-center text-white shadow-sm">
                                            <Check size={14} />
                                        </div>
                                    )}

                                    {/* Link indicator (if connected to prev page in same deal) */}
                                    {page.pageNumber > 1 && pages.find(p => p.pageNumber === page.pageNumber - 1)?.dealId === page.dealId && !activeDealFilter && (
                                        <div className="absolute -left-5 top-1/2 w-6 h-1 bg-gray-200 -z-10" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplittingEditor;
