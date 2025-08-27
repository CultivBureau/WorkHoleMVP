import React, { useState, useEffect, useRef } from "react";
import { ChartColumn } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomPopup from '../ui/custom-popup';
import {
  useGetBreakTypesQuery,
  useStartBreakMutation,
  useStopBreakMutation,
  useGetBreakDashboardQuery,
  useGetBreakStatsQuery,
} from "../../services/apis/BreakApi";

const BreakTime = () => {
    const { t, i18n } = useTranslation();

    // API hooks
    const { data: breakTypes = [], isLoading: typesLoading } = useGetBreakTypesQuery();
    const [startBreak, { isLoading: starting }] = useStartBreakMutation();
    const [stopBreak, { isLoading: stopping }] = useStopBreakMutation();
    const { data: breakDashboard, refetch: refetchDashboard } = useGetBreakDashboardQuery();
    const { data: breakStats, refetch: refetchStats } = useGetBreakStatsQuery({ page: 1, limit: 10 });

    // UI state
    const [time, setTime] = useState(new Date());
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [breakDuration, setBreakDuration] = useState(0); // in seconds
    const [selectedReason, setSelectedReason] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // Restore break state from localStorage on mount
    useEffect(() => {
        const active = localStorage.getItem("breakActive") === "1";
        const start = localStorage.getItem("breakStartTime");
        const reason = localStorage.getItem("breakReason");
        if (active && start) {
            setIsBreakActive(true);
            setBreakStartTime(new Date(start));
            setSelectedReason(reason || "");
        }
    }, []);

    // Persist break state to localStorage on change
    useEffect(() => {
        if (isBreakActive && breakStartTime) {
            localStorage.setItem("breakActive", "1");
            localStorage.setItem("breakStartTime", breakStartTime.toISOString());
            localStorage.setItem("breakReason", selectedReason);
        } else {
            localStorage.removeItem("breakActive");
            localStorage.removeItem("breakStartTime");
            localStorage.removeItem("breakReason");
        }
    }, [isBreakActive, breakStartTime, selectedReason]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            if (isBreakActive && breakStartTime) {
                const currentTime = new Date();
                const duration = Math.floor((currentTime - breakStartTime) / 1000);
                setBreakDuration(duration);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isBreakActive, breakStartTime]);

    // Clock hands
    const secondAngle = time.getSeconds() * 6 - 90;
    const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90;
    const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90;

    // Timer display
    const timerMinutes = Math.floor(breakDuration / 60).toString().padStart(2, "0");
    const timerSeconds = (breakDuration % 60).toString().padStart(2, "0");

    // Reason options from API
    const reasonOptions = [
        { value: "", label: t('breakTime.selectReason') },
        ...breakTypes.map((type) => ({
            value: type.name,
            label: t(`breakTime.reasons.${type.name}`, type.name),
        })),
    ];

    // Start/Stop break integration
    const handleStartBreak = async () => {
        if (!selectedReason) {
            setShowPopup(true);
            return;
        }
        if (!isBreakActive) {
            try {
                await startBreak(selectedReason).unwrap();
                setIsBreakActive(true);
                setBreakStartTime(new Date());
                setBreakDuration(0);
                refetchDashboard();
                refetchStats();
            } catch (err) {
                setShowPopup(true);
            }
        } else {
            try {
                await stopBreak().unwrap();
                setIsBreakActive(false);
                setBreakStartTime(null);
                setBreakDuration(0);
                setSelectedReason("");
                refetchDashboard();
                refetchStats();
            } catch (err) {
                setShowPopup(true);
            }
        }
    };

    // Sort break summary by date (latest first)
    const sortedBreaks = breakStats?.breaks
        ? [...breakStats.breaks].sort((a, b) => {
            const dateA = new Date(a.date.split('/').reverse().join('-'));
            const dateB = new Date(b.date.split('/').reverse().join('-'));
            return dateB - dateA;
        })
        : [];

    function formatMinutes(minutes) {
        minutes = Number(minutes);
        if (isNaN(minutes) || minutes === 0) return '0 min';
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} hr`;
        return `${hours} hr ${mins} min`;
    }

    function formatLocalTime(dateString) {
        if (!dateString) return "--";
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="rounded-2xl shadow-xl border p-6 h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group" 
             style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), 0 4px 15px rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
             }}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold gradient-text tracking-tight">
                    {t('breakTime.title')}
                </h3>
                
                <div className="flex items-center gap-3">
                    {/* Enhanced Select */}
                    <div className="relative">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            disabled={isBreakActive}
                            className="w-[140px] border-2 rounded-xl font-semibold px-4 py-2.5 pr-10 text-xs gradient-text appearance-none backdrop-blur-sm transition-all duration-200 hover:border-opacity-80 focus:ring-2 focus:ring-opacity-20"
                            style={{
                                borderColor: 'var(--accent-color)',
                                backgroundColor: 'var(--bg-color)',
                                opacity: isBreakActive ? 0.6 : 1,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                focusRingColor: 'var(--accent-color)'
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
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-200 group-hover:scale-110">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="gradient-text">
                                <path d="M6 9l6 6 6-6" stroke="url(#gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="var(--gradient-start)" />
                                        <stop offset="100%" stopColor="var(--gradient-end)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>

                    {/* Enhanced Button */}
                    <button
                        onClick={handleStartBreak}
                        className="w-[140px] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                            background: isBreakActive 
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                                : 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                            boxShadow: isBreakActive 
                                ? '0 8px 25px rgba(239, 68, 68, 0.4)' 
                                : '0 8px 25px rgba(21, 145, 155, 0.4)'
                        }}
                        disabled={starting || stopping}
                    >
                        <img 
                            src="/assets/clock.svg" 
                            alt={isBreakActive ? t('breakTime.endBreak', 'End Break') : t('breakTime.startBreak', 'Start Break')} 
                            className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" 
                        />
                        {(starting || stopping) ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            isBreakActive ? t('breakTime.endBreak', 'End Break') : t('breakTime.startBreak', 'Start Break')
                        )}
                    </button>

                    {/* Enhanced Chart Button */}
                    <button
                        className="p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group/chart"
                        style={{
                            backgroundColor: 'var(--hover-color)',
                            color: 'var(--accent-color)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <ChartColumn size={22} strokeWidth={2.5} className="gradient-color transition-transform duration-200 group-hover/chart:rotate-6" />
                    </button>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-4 bg-gradient-to-r from-transparent via-gray-200 to-transparent" 
                 style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Enhanced Clock Section */}
            <div className="flex flex-col items-center justify-center mt-3 mb-8" style={{ height: '90px', minHeight: '90px', maxHeight: '90px' }}>
                {/* Enhanced Analog Clock */}
                <div className="relative mb-2 transition-transform duration-300 hover:scale-105">
                    <svg width="44" height="44" className="drop-shadow-lg">
                        {/* Enhanced Clock face */}
                        <circle
                            cx="22"
                            cy="22"
                            r="20"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            fillOpacity="0.08"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                            className="transition-all duration-300"
                        />
                        
                        {/* Outer ring */}
                        <circle
                            cx="22"
                            cy="22"
                            r="19"
                            fill="none"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="0.5"
                            strokeOpacity="0.3"
                        />

                        {/* Hour markers */}
                        {[...Array(12)].map((_, i) => {
                            const angle = i * 30 - 90;
                            const x1 = 22 + 13 * Math.cos((angle * Math.PI) / 180);
                            const y1 = 22 + 13 * Math.sin((angle * Math.PI) / 180);
                            const x2 = 22 + 16 * Math.cos((angle * Math.PI) / 180);
                            const y2 = 22 + 16 * Math.sin((angle * Math.PI) / 180);

                            return <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                                strokeWidth={i % 3 === 0 ? "2" : "1"}
                                strokeOpacity={i % 3 === 0 ? "0.8" : "0.6"}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                            />;
                        })}

                        {/* Hour hand */}
                        <line
                            x1="22"
                            y1="22"
                            x2={22 + 7 * Math.cos((hourAngle * Math.PI) / 180)}
                            y2={22 + 7 * Math.sin((hourAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />

                        {/* Minute hand */}
                        <line
                            x1="22"
                            y1="22"
                            x2={22 + 10 * Math.cos((minuteAngle * Math.PI) / 180)}
                            y2={22 + 10 * Math.sin((minuteAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />

                        {/* Second hand */}
                        <line
                            x1="22"
                            y1="22"
                            x2={22 + 12 * Math.cos((secondAngle * Math.PI) / 180)}
                            y2={22 + 12 * Math.sin((secondAngle * Math.PI) / 180)}
                            stroke="var(--accent-hover)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            className="transition-all duration-100"
                        />

                        {/* Enhanced Center dot */}
                        <circle
                            cx="22"
                            cy="22"
                            r="2"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            className="transition-all duration-300"
                        />
                        <circle
                            cx="22"
                            cy="22"
                            r="1"
                            fill="white"
                            fillOpacity="0.8"
                        />
                    </svg>
                </div>

                {/* Enhanced Timer Display */}
                <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105" 
                     style={{
                        background: isBreakActive 
                            ? 'linear-gradient(135deg, var(--error-color), #dc2626)' 
                            : 'linear-gradient(135deg, var(--hover-color), rgba(21, 145, 155, 0.1))',
                        boxShadow: isBreakActive 
                            ? '0 8px 25px rgba(239, 68, 68, 0.25), 0 2px 10px rgba(239, 68, 68, 0.1)' 
                            : '0 8px 25px rgba(21, 145, 155, 0.15), 0 2px 10px rgba(21, 145, 155, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                     }}>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-lg font-bold tracking-wider transition-all duration-200" 
                             style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerMinutes}
                        </div>
                        <div className="text-[9px] font-semibold tracking-widest opacity-70 uppercase transition-all duration-200" 
                             style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            MIN
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white bg-opacity-20"></div>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-lg font-bold tracking-wider transition-all duration-200" 
                             style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerSeconds}
                        </div>
                        <div className="text-[9px] font-semibold tracking-widest opacity-70 uppercase transition-all duration-200" 
                             style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            SEC
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-4 bg-gradient-to-r from-transparent via-gray-200 to-transparent" 
                 style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Enhanced Break Dashboard Summary */}
            <div className="flex-1 flex flex-col">
                <h4 className={`text-sm font-bold pb-4 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} transition-all duration-200`} 
                    style={{ color: 'var(--text-color)' }}>
                    {t('breakTime.breakSummary')}
                </h4>

                <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 transition-all duration-200">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-color)' }}>
                            <tr>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.date', 'Date')}
                                </th>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.breakType', 'Break Type')}
                                </th>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.duration', 'Duration')}
                                </th>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.startTime', 'Start')}
                                </th>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.endTime', 'End')}
                                </th>
                                <th className="text-xs font-bold py-2 transition-colors duration-200 hover:opacity-80" 
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.exceeded', 'Exceeded')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBreaks.map((item, idx) => (
                                <tr key={idx} className="hover:bg-opacity-50 transition-all duration-200 group/row" style={{ backgroundColor: 'transparent' }}>
                                    <td className="py-3 text-xs font-medium transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--text-color)' }}>
                                        {item.date}
                                    </td>
                                    <td className="py-3 text-xs font-semibold transition-all duration-200 group-hover/row:scale-105" style={{ color: 'var(--accent-color)' }}>
                                        {t(`breakTime.reasons.${item.breakType}`, item.breakType)}
                                    </td>
                                    <td className="py-3 text-xs transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatMinutes(item.duration.replace(' min', ''))}
                                    </td>
                                    <td className="py-3 text-xs transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatLocalTime(item.startTime)}
                                    </td>
                                    <td className="py-3 text-xs transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatLocalTime(item.endTime)}
                                    </td>
                                    <td className="py-3 text-xs font-semibold transition-all duration-200 group-hover/row:scale-105" style={{ color: item.exceeded ? '#ef4444' : 'var(--sub-text-color)' }}>
                                        {item.exceeded ? t('breakTime.exceededYes', 'Yes') : t('breakTime.exceededNo', 'No')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Enhanced Custom Popup */}
            <CustomPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title={t("breakTime.reasonRequired", "Break Reason Required")}
                message={t("breakTime.selectBreakReasonFirst", "Please select a break reason first!")}
                type="warning"
            />
        </div>
    );
};

export default BreakTime;