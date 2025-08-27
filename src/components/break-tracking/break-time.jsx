import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomPopup from '../ui/custom-popup';
import {
    useGetBreakTypesQuery,
    useStartBreakMutation,
    useStopBreakMutation,
    useGetBreakDashboardQuery,
} from "../../services/apis/BreakApi";

const BreakTime = () => {
    const { t, i18n } = useTranslation();

    // مزامنة اللغة من localStorage
    useEffect(() => {
        const lang = localStorage.getItem("lang") || "en";
        i18n.changeLanguage(lang);
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }, [i18n]);

    // API hooks
    const { data: breakTypes = [] } = useGetBreakTypesQuery();
    const [startBreak, { isLoading: starting }] = useStartBreakMutation();
    const [stopBreak, { isLoading: stopping }] = useStopBreakMutation();
    const { data: breakDashboard, refetch: refetchDashboard } = useGetBreakDashboardQuery();

    // UI state
    const [time, setTime] = useState(new Date());
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [breakDuration, setBreakDuration] = useState(0);
    const [selectedReason, setSelectedReason] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    // Restore break state from localStorage
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

    // Persist break state to localStorage
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
            } catch (err) {
                console.error(err); // Use err to avoid ESLint warning
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
            } catch (err) {
                console.error(err); // Use err to avoid ESLint warning
                setShowPopup(true);
            }
        }
    };

    // Timer display
    const timerMinutes = Math.floor(breakDuration / 60).toString().padStart(2, "0");
    const timerSeconds = (breakDuration % 60).toString().padStart(2, "0");

    // Calculate angles for clock hands
    const secondAngle = time.getSeconds() * 6 - 90;
    const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90;
    const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90;

    // احسب مدة البريك من نوع البريك المختار
    const selectedTypeObj = breakTypes.find((type) => type.name === selectedReason);
    const breakTypeDuration = selectedTypeObj ? selectedTypeObj.duration : 0; // بالدقائق

    // احسب الوقت المتبقي
    const remainingSeconds = isBreakActive && breakStartTime && breakTypeDuration
        ? breakTypeDuration * 60 - breakDuration
        : breakTypeDuration * 60;

    const remainingMinutes = Math.max(Math.floor(remainingSeconds / 60), 0);
    const remainingSecs = Math.max(remainingSeconds % 60, 0);

    return (
        <div className="rounded-2xl shadow-xl border p-6 h-full flex flex-col backdrop-blur-sm transition-all duration-300 hover:shadow-2xl group"
            style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 15px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold gradient-text tracking-tight transition-all duration-200 group-hover:scale-105">
                    {t('breakTime.title', 'Break Time')}
                </h3>

                <div className="flex items-center gap-3">
                    {/* Enhanced Select */}
                    <div className="relative group/select">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            disabled={isBreakActive}
                            className="border-2 rounded-xl font-semibold px-4 py-2.5 pr-10 text-xs gradient-text appearance-none backdrop-blur-sm transition-all duration-300 hover:border-opacity-80 focus:ring-2 focus:ring-opacity-20 focus:scale-[1.02]"
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
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 group-hover/select:scale-110 group-hover/select:rotate-180">
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
                        className="text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
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
                            className="w-4 h-4 transition-transform duration-300 group-hover/btn:rotate-12"
                        />
                        {(starting || stopping) ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            isBreakActive ? t('breakTime.endBreak', 'End Break') : t('breakTime.startBreak', 'Start Break')
                        )}
                    </button>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30"
                style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Enhanced Clock Section */}
            <div className="flex flex-col items-center justify-center mt-3 mb-8" style={{ height: '110px', minHeight: '110px', maxHeight: '110px' }}>
                {/* Enhanced Analog Clock */}
                <div className="relative mb-3 transition-transform duration-300 hover:scale-110 group/clock">
                    <svg width="44" height="44" className="drop-shadow-lg">
                        {/* Enhanced Clock face */}
                        <circle
                            cx="22"
                            cy="22"
                            r="20"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            fillOpacity="0.1"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                            className="transition-all duration-300 group-hover/clock:fill-opacity-20"
                        />

                        {/* Outer ring */}
                        <circle
                            cx="22"
                            cy="22"
                            r="19"
                            fill="none"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="0.5"
                            strokeOpacity="0.4"
                            className="transition-all duration-300"
                        />

                        {/* Enhanced Hour markers */}
                        {[...Array(12)].map((_, i) => {
                            const angle = i * 30 - 90;
                            const x1 = 22 + 14 * Math.cos((angle * Math.PI) / 180);
                            const y1 = 22 + 14 * Math.sin((angle * Math.PI) / 180);
                            const x2 = 22 + 17 * Math.cos((angle * Math.PI) / 180);
                            const y2 = 22 + 17 * Math.sin((angle * Math.PI) / 180);

                            return <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                                strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                                strokeOpacity={i % 3 === 0 ? "0.9" : "0.7"}
                                strokeLinecap="round"
                                className="transition-all duration-300"
                            />;
                        })}

                        {/* Enhanced Hour hand */}
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

                        {/* Enhanced Minute hand */}
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

                        {/* Enhanced Second hand */}
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
                            fillOpacity="0.9"
                        />
                    </svg>
                </div>

                {/* Enhanced Timer Display */}
                <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 group/timer"
                    style={{
                        background: isBreakActive
                            ? 'linear-gradient(135deg, var(--error-color), #dc2626)'
                            : 'linear-gradient(135deg, var(--hover-color), rgba(21, 145, 155, 0.15))',
                        boxShadow: isBreakActive
                            ? '0 8px 25px rgba(239, 68, 68, 0.3), 0 2px 10px rgba(239, 68, 68, 0.15)'
                            : '0 8px 25px rgba(21, 145, 155, 0.2), 0 2px 10px rgba(21, 145, 155, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-lg font-bold tracking-wider transition-all duration-200 group-hover/timer:scale-110"
                            style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerMinutes}
                        </div>
                        <div className="text-[9px] font-semibold tracking-widest opacity-75 uppercase transition-all duration-200"
                            style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            MIN
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white bg-opacity-30"></div>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-lg font-bold tracking-wider transition-all duration-200 group-hover/timer:scale-110"
                            style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerSeconds}
                        </div>
                        <div className="text-[9px] font-semibold tracking-widest opacity-75 uppercase transition-all duration-200"
                            style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>
                            SEC
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Divider */}
            <div className="w-full h-px mb-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30"
                style={{ backgroundColor: 'var(--divider-color)' }}></div>

            {/* Enhanced Summary Boxes */}
            <div className="flex gap-4 mt-4">
                <div className="flex-1 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group/box1"
                    style={{ backgroundColor: 'var(--container-color)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div className="text-xl font-bold mb-2 transition-all duration-200 group-hover/box1:scale-110"
                        style={{ color: 'var(--text-color)' }}>
                        {breakTypeDuration ? `${breakTypeDuration}m` : "--"}
                    </div>
                    <div className="text-xs font-medium transition-all duration-200"
                        style={{ color: 'var(--sub-text-color)' }}>
                        {t("breakTime.breakTime", "Break Time")}
                    </div>
                </div>
                <div className="flex-1 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group/box2"
                    style={{ backgroundColor: 'var(--container-color)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
                    <div className="text-xl font-bold mb-2 transition-all duration-200 group-hover/box2:scale-110"
                        style={{
                            color: remainingSeconds <= 0 && isBreakActive ? '#ef4444' : 'var(--text-color)',
                            filter: remainingSeconds <= 0 && isBreakActive ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none'
                        }}>
                        {isBreakActive
                            ? `${remainingMinutes}m ${remainingSecs.toString().padStart(2, "0")}s`
                            : `${breakTypeDuration}m`}
                    </div>
                    <div className="text-xs font-medium transition-all duration-200"
                        style={{ color: 'var(--sub-text-color)' }}>
                        {t("breakTime.remaining", "Remaining")}
                    </div>
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
