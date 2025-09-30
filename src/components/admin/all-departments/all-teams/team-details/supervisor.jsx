import React from 'react';
import { useTranslation } from 'react-i18next';

const SupervisorOverview = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    return (
        <div className="bg-[var(--bg-color)] rounded-xl p-4 border border-[var(--border-color)] shadow-sm flex flex-col" style={{ minHeight: '200px' }}>
            <h3 className="text-lg font-semibold text-[var(--text-color)] mb-3">
                {t('teamDetails.supervisorOverview.title')}
            </h3>
            
            <div className="space-y-2 overflow-auto" style={{ maxHeight: '250px' }}>
                {/* Supervisor 1 */}
                <div className="bg-[var(--bg-color)] rounded-lg px-4 py-2 border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <img
                                src="/assets/navbar/Avatar.png"
                                alt="Devon Lane"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                                <h4 className="font-semibold text-[var(--text-color)]">Devon Lane</h4>
                                <p className="text-sm text-[var(--sub-text-color)]">{t('teamDetails.supervisorOverview.role')}</p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center justify-between flex-1 ${isRtl ? 'mr-8' : 'ml-8'}`}>
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm">
                                    <div className="text-lg font-bold text-[var(--accent-color)]">82%</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.teamKpi')}<br/>{t('teamDetails.supervisorOverview.achievement')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm">
                                    <div className="text-lg font-bold text-[var(--accent-color)]">15</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.approvals')}<br/>{t('teamDetails.supervisorOverview.reviews')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm text-center">
                                    <div className="text-sm font-semibold text-[var(--accent-color)]">09:32 AM</div>
                                    <div className="text-xs text-[var(--accent-color)]">Aug 17</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.lastSystem')}<br/>{t('teamDetails.supervisorOverview.activity')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <button className="px-4 py-1.5 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                                    {t('teamDetails.supervisorOverview.viewLogs')}
                                </button>
                                <button className="text-[var(--sub-text-color)] hover:text-[var(--text-color)] text-lg">
                                    ⋯
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supervisor 2 */}
                <div className="bg-[var(--bg-color)] rounded-lg px-4 py-2 border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <img
                                src="/assets/navbar/Avatar.png"
                                alt="Devon Lane"
                                className="w-12 h-12 rounded-full"
                            />
                            <div className={isRtl ? 'text-right' : 'text-left'}>
                                <h4 className="font-semibold text-[var(--text-color)]">Devon Lane</h4>
                                <p className="text-sm text-[var(--sub-text-color)]">{t('teamDetails.supervisorOverview.role')}</p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center justify-between flex-1 ${isRtl ? 'mr-8' : 'ml-8'}`}>
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm">
                                    <div className="text-lg font-bold text-[var(--accent-color)]">82%</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.teamKpi')}<br/>{t('teamDetails.supervisorOverview.achievement')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm">
                                    <div className="text-lg font-bold text-[var(--accent-color)]">15</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.approvals')}<br/>{t('teamDetails.supervisorOverview.reviews')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-2 border border-cyan-200 shadow-sm text-center">
                                    <div className="text-sm font-semibold text-[var(--accent-color)]">09:32 AM</div>
                                    <div className="text-xs text-[var(--accent-color)]">Aug 17</div>
                                </div>
                                <div className={`text-xs text-[var(--sub-text-color)] ${isRtl ? 'text-right' : 'text-left'}`}>
                                    {t('teamDetails.supervisorOverview.lastSystem')}<br/>{t('teamDetails.supervisorOverview.activity')}
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                <button className="px-4 py-1.5 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-lg text-sm hover:bg-[var(--accent-color)] hover:text-white transition-colors">
                                    {t('teamDetails.supervisorOverview.viewLogs')}
                                </button>
                                <button className="text-[var(--sub-text-color)] hover:text-[var(--text-color)] text-lg">
                                    ⋯
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisorOverview;
