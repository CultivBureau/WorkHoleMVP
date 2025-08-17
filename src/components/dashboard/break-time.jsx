import React from "react";
import { ChartColumn } from "lucide-react";
import { useTranslation } from "react-i18next";

const BreakTime = () => {
    const { t } = useTranslation();

    const reasonOptions = [
        { value: "", label: t('breakTime.selectReason') },
        { value: "prayer", label: t('breakTime.reasons.prayer') },
        { value: "lunch", label: t('breakTime.reasons.lunch') },
        { value: "meeting", label: t('breakTime.reasons.meeting') },
        { value: "bathroom", label: t('breakTime.reasons.bathroom') },
        { value: "coffee", label: t('breakTime.reasons.coffee') },
        { value: "phone", label: t('breakTime.reasons.phone') },
        { value: "personal", label: t('breakTime.reasons.personal') }
    ];

    const breakSummaryData = [
        {
            type: t('breakTime.reasons.prayer'),
            dailyAverage: "15 " + t('breakTime.minutes'),
            total: "2:15:00"
        },
        {
            type: t('breakTime.reasons.lunch'),
            dailyAverage: "30 " + t('breakTime.minutes'),
            total: "2:45:00"
        },
        {
            type: t('breakTime.reasons.lunch'),
            dailyAverage: "30 " + t('breakTime.minutes'),
            total: "2:30:00"
        }
    ];

    return (
        <div className=" rounded-xl shadow-sm p-5 h-full flex flex-col" style={{ backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold gradient-text">{t('breakTime.title')}</h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            className="border rounded font-bold px-2 py-2 pr-8 text-xs gradient-text appearance-none"
                            style={{
                                borderColor: 'var(--accent-color)',
                                backgroundColor: 'var(--bg-color)',
                            }}
                        >
                            {reasonOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    style={{ color: 'var(--sub-text-color)' }}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {/* Custom Dropdown Arrow */}
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="gradient-text">
                                <path d="M6 9l6 6 6-6" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--gradient-start)" />
                                        <stop offset="100%" stopColor="var(--gradient-end)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <button
                        className="gradient-bg text-white px-3 py-2 rounded text-xs font-medium flex items-center gap-1"
                    >
                        <img src="/assets/clock.svg" alt={t('breakTime.startBreak')} className="w-4 h-4" />
                        {t('breakTime.startBreak')}
                    </button>
                    <button
                        className="p-2 rounded-lg transition-colors duration-200 hover:opacity-80"
                        style={{
                            backgroundColor: 'var(--hover-color)',
                            color: 'var(--accent-color)'
                        }}
                    >
                        <ChartColumn size={20} strokeWidth={2.5} className="gradient-color" />
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div
                className="w-full h-px mb-4"
                style={{ backgroundColor: 'var(--divider-color)' }}
            ></div>

            {/* Break Summary */}
            <div className="flex-1">
                <h4
                    className="text-sm font-semibold mb-1"
                    style={{ color: 'var(--text-color)' }}
                >
                    {t('breakTime.breakSummary')}
                </h4>
                <p
                    className="text-xs mb-3"
                    style={{ color: 'var(--sub-text-color)' }}
                >
                    {t('breakTime.breakPatterns')}
                </p>

                <div className="space-y-0">
                    {breakSummaryData.map((item, index) => (
                        <React.Fragment key={index}>
                            <div
                                className="flex items-center justify-between py-2 px-3 rounded"
                                style={{ backgroundColor: 'var(--hover-color)' }}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-xs font-medium px-2 py-1 rounded"
                                        style={{
                                            color: 'var(--accent-color)',
                                            backgroundColor: 'var(--border-color)'
                                        }}
                                    >
                                        {item.type}
                                    </span>
                                </div>
                                <div
                                    className="text-xs"
                                    style={{ color: 'var(--sub-text-color)' }}
                                >
                                    {t('breakTime.dailyAverage')}: {item.dailyAverage}
                                </div>
                                <div
                                    className="text-xs font-semibold"
                                    style={{ color: 'var(--text-color)' }}
                                >
                                    {item.total} {t('breakTime.total')}
                                </div>
                            </div>
                            {/* Divider between items (except last) */}
                            {index < breakSummaryData.length - 1 && (
                                <div
                                    className="w-full h-px"
                                    style={{ backgroundColor: 'var(--divider-color)' }}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreakTime;