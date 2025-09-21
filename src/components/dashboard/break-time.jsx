import React, { useState, useEffect, useRef } from "react";
import { ChartColumn } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomPopup from '../ui/custom-popup';
import DigitalNumber from '../ui/DigitalNumber';
import {
    useGetBreakTypesQuery,
    useStartBreakMutation,
    useStopBreakMutation,
    useGetBreakDashboardQuery,
    useGetBreakStatsQuery,
} from "../../services/apis/BreakApi";
import { useNavigate } from "react-router-dom";

const BreakTime = ({ breakDashboard, refetch }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    // API hooks
    const { data: breakTypes = [], isLoading: typesLoading } = useGetBreakTypesQuery();
    const [startBreak, { isLoading: starting }] = useStartBreakMutation();
    const [stopBreak, { isLoading: stopping }] = useStopBreakMutation();
    const { data: breakDashboardData, refetch: refetchDashboard } = useGetBreakDashboardQuery();
    const { data: breakStats, refetch: refetchStats } = useGetBreakStatsQuery({ page: 1, limit: 10 });

    // UI state
    const [time, setTime] = useState(new Date());
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [breakDuration, setBreakDuration] = useState(0);
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
                if (refetchDashboard) refetchDashboard();
                if (refetchStats) refetchStats();
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
                if (refetchDashboard) refetchDashboard();
                if (refetchStats) refetchStats();
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
        <div className="rounded-2xl shadow-xl border p-3 sm:p-4 lg:p-6 h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group"
            style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), 0 4px 15px rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>

            {/* Header - flex-col only for 1024px-1250px range */}
            <div className="flex flex-col lg:flex-col xl:flex-row 2xl:flex-row gap-3 mb-4 sm:mb-6 lg:mb-4 xl:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-lg xl:text-xl font-bold gradient-text tracking-tight transition-all duration-200 group-hover:scale-105">
                    {t('breakTime.title', 'Break Time')}
                </h3>

                {/* Controls - flex-col only for 1024px-1250px range */}
                <div className="flex flex-col lg:flex-col xl:flex-row 2xl:flex-row lg:items-start xl:items-center gap-2 xl:ml-auto">
                    {/* Select Reason */}
                    <div className="relative group/select lg:w-full xl:w-48">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            disabled={isBreakActive}
                            className="w-full border-2 rounded-xl font-semibold px-3 sm:px-4 lg:px-3 xl:px-4 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 pr-8 sm:pr-10 lg:pr-8 xl:pr-10 text-xs sm:text-sm lg:text-xs xl:text-sm gradient-text appearance-none backdrop-blur-sm transition-all duration-300 hover:border-opacity-80 focus:ring-2 focus:ring-opacity-20 focus:scale-[1.02]"
                            style={{
                                borderColor: 'var(--accent-color)',
                                backgroundColor: 'var(--bg-color)',
                                opacity: isBreakActive ? 0.6 : 1,
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
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
                        <div className="absolute right-2 sm:right-3 lg:right-2 xl:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover/select:scale-110 group-hover/select:rotate-180">
                            <svg width="10" height="10" className="sm:w-3 sm:h-3 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 gradient-text" viewBox="0 0 24 24" fill="none" >
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

                    {/* Start Break Button */}
                    <button
                        onClick={handleStartBreak}
                        className="w-full xl:w-auto 2xl:w-auto text-white px-3 sm:px-4 lg:px-3 xl:px-4 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 rounded-xl text-xs sm:text-sm lg:text-xs xl:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
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
                            className="w-3 h-3 sm:w-4 sm:h-4 lg:w-3 lg:h-3 xl:w-4 xl:h-4 transition-transform duration-300 group-hover/btn:rotate-12"
                        />
                        <span>
                            {(starting || stopping) ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : (
                                isBreakActive ? t('breakTime.endBreak', 'End Break') : t('breakTime.startBreak', 'Start Break')
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
                style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Clock Section - Responsive Sizing */}
            <div className="flex flex-col items-center justify-center mt-2 sm:mt-3 mb-3 sm:mb-4 lg:mb-6">

                {/* Analog Clock - Responsive Size */}
                <div className="relative mb-2 sm:mb-3 transition-transform duration-300 hover:scale-105">
                    <svg width="28" height="28" className="sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 drop-shadow-lg">
                        {/* Clock face */}
                        <circle
                            cx="14"
                            cy="14"
                            r="12"
                            className="sm:cx-[16] sm:cy-[16] sm:r-[14] md:cx-[18] md:cy-[18] md:r-[16] lg:cx-[20] lg:cy-[20] lg:r-[18] transition-all duration-300"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            fillOpacity="0.08"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                        />

                        {/* Outer ring */}
                        <circle
                            cx="14"
                            cy="14"
                            r="11"
                            className="sm:cx-[16] sm:cy-[16] sm:r-[13] md:cx-[18] md:cy-[18] md:r-[15] lg:cx-[20] lg:cy-[20] lg:r-[17]"
                            fill="none"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="0.5"
                            strokeOpacity="0.3"
                        />

                        {/* Hour markers - Responsive */}
                        {[...Array(12)].map((_, i) => {
                            const angle = i * 30 - 90;
                            // Base dimensions for mobile (28x28), scale for larger screens
                            const centerX = 14; // Will be overridden by responsive CSS
                            const centerY = 14;
                            const innerRadius = 7;
                            const outerRadius = 10;
                            
                            const x1 = centerX + innerRadius * Math.cos((angle * Math.PI) / 180);
                            const y1 = centerY + innerRadius * Math.sin((angle * Math.PI) / 180);
                            const x2 = centerX + outerRadius * Math.cos((angle * Math.PI) / 180);
                            const y2 = centerY + outerRadius * Math.sin((angle * Math.PI) / 180);

                            return <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                                strokeWidth={i % 3 === 0 ? "1.5" : "1"}
                                strokeOpacity={i % 3 === 0 ? "0.8" : "0.6"}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                            />;
                        })}

                        {/* Hour hand - Responsive */}
                        <line
                            x1="14"
                            y1="14"
                            x2={14 + 4 * Math.cos((hourAngle * Math.PI) / 180)}
                            y2={14 + 4 * Math.sin((hourAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />

                        {/* Minute hand - Responsive */}
                        <line
                            x1="14"
                            y1="14"
                            x2={14 + 6 * Math.cos((minuteAngle * Math.PI) / 180)}
                            y2={14 + 6 * Math.sin((minuteAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />

                        {/* Second hand - Responsive */}
                        <line
                            x1="14"
                            y1="14"
                            x2={14 + 7 * Math.cos((secondAngle * Math.PI) / 180)}
                            y2={14 + 7 * Math.sin((secondAngle * Math.PI) / 180)}
                            stroke="var(--accent-hover)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            className="transition-all duration-100"
                        />

                        {/* Center dot - Responsive */}
                        <circle
                            cx="14"
                            cy="14"
                            r="1.5"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            className="transition-all duration-300"
                        />
                        <circle
                            cx="14"
                            cy="14"
                            r="0.8"
                            fill="white"
                            fillOpacity="0.8"
                        />
                    </svg>
                </div>

                {/* Timer Display - Responsive Sizing */}
                <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
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
                        <DigitalNumber 
                            value={timerMinutes} 
                            size="sm" 
                            className="text-sm sm:text-base transition-all duration-200"
                            style={{ color: 'var(--text-color)', lineHeight: '1' }}
                        />
                        <div className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold tracking-widest opacity-70 uppercase transition-all duration-200"
                            style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            MIN
                        </div>
                    </div>
                    <div className="w-px h-5 sm:h-6 md:h-8 bg-white bg-opacity-20"></div>
                    <div className="flex flex-col items-center">
                        <DigitalNumber 
                            value={timerSeconds} 
                            size="sm" 
                            className="text-sm sm:text-base transition-all duration-200"
                            style={{ color: 'var(--text-color)', lineHeight: '1' }}
                        />
                        <div className="text-[7px] sm:text-[8px] md:text-[9px] font-semibold tracking-widest opacity-70 uppercase transition-all duration-200"
                            style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            SEC
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
                style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Enhanced Break Dashboard Summary - Fully Responsive */}
            <div className="flex-1 flex flex-col min-h-0">
                <h4 className={`text-xs sm:text-sm font-bold pb-1 sm:pb-2 mb-1 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} transition-all duration-200`}
                    style={{ color: 'var(--text-color)' }}>
                    {t('breakTime.breakSummary')}
                </h4>

                <div
                    className="flex-1 overflow-hidden"
                    style={{
                        maxHeight: sortedBreaks.length > 2 ? "100px sm:120px" : "none",
                        overflowY: sortedBreaks.length > 2 ? "auto" : "visible",
                        minHeight: 0,
                    }}
                >
                    {/* Mobile & Small Tablet: Card view */}
                    <div className="block md:hidden space-y-1">
                        {sortedBreaks.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-2 space-y-1" style={{ backgroundColor: 'var(--hover-color)' }}>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] sm:text-[10px] font-medium" style={{ color: 'var(--text-color)' }}>
                                        {item.date}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-semibold" style={{ color: 'var(--accent-color)' }}>
                                        {t(`breakTime.reasons.${item.breakType}`, item.breakType)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[8px] sm:text-[9px]" style={{ color: 'var(--sub-text-color)' }}>
                                    <span>{formatMinutes(item.duration.replace(' min', ''))}</span>
                                    <span className="hidden xs:inline">{formatLocalTime(item.startTime)} - {formatLocalTime(item.endTime)}</span>
                                    <span className={item.exceeded ? 'text-red-500 font-semibold' : ''}>
                                        {item.exceeded ? t('breakTime.exceededYes', 'Yes') : t('breakTime.exceededNo', 'No')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Table view */}
                    <table className="w-full hidden md:table">
                        <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-color)' }}>
                            <tr>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.date', 'Date')}
                                </th>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.breakType', 'Type')}
                                </th>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.duration', 'Duration')}
                                </th>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80 hidden xl:table-cell"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.startTime', 'Start')}
                                </th>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80 hidden xl:table-cell"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.endTime', 'End')}
                                </th>
                                <th className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-bold py-0.5 sm:py-1 transition-colors duration-200 hover:opacity-80"
                                    style={{ color: 'var(--sub-text-color)' }}>
                                    {t('breakTime.exceeded', 'Exceeded')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBreaks.map((item, idx) => (
                                <tr key={idx} className="hover:bg-opacity-50 transition-all duration-200 group/row" style={{ backgroundColor: 'transparent' }}>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--text-color)' }}>
                                        {item.date}
                                    </td>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold transition-all duration-200 group-hover/row:scale-105" style={{ color: 'var(--accent-color)' }}>
                                        {t(`breakTime.reasons.${item.breakType}`, item.breakType)}
                                    </td>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs transition-all duration-200 group-hover/row:opacity-80" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatMinutes(item.duration.replace(' min', ''))}
                                    </td>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs transition-all duration-200 group-hover/row:opacity-80 hidden xl:table-cell" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatLocalTime(item.startTime)}
                                    </td>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs transition-all duration-200 group-hover/row:opacity-80 hidden xl:table-cell" style={{ color: 'var(--sub-text-color)' }}>
                                        {formatLocalTime(item.endTime)}
                                    </td>
                                    <td className="py-0.5 sm:py-1 text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-semibold transition-all duration-200 group-hover/row:scale-105" style={{ color: item.exceeded ? '#ef4444' : 'var(--sub-text-color)' }}>
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