import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomPopup from '../ui/custom-popup';

const BreakTime = () => {
    const { t, i18n } = useTranslation();
    const [time, setTime] = useState(new Date());
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [breakDuration, setBreakDuration] = useState(0); // in seconds
    const [selectedReason, setSelectedReason] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());

            // Update break duration if break is active
            if (isBreakActive && breakStartTime) {
                const currentTime = new Date();
                const duration = Math.floor((currentTime - breakStartTime) / 1000);
                setBreakDuration(duration);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [isBreakActive, breakStartTime]);

    // Calculate angles for clock hands
    const secondAngle = time.getSeconds() * 6 - 90;
    const minuteAngle = time.getMinutes() * 6 + time.getSeconds() * 0.1 - 90;
    const hourAngle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5 - 90;

    // Format timer display (break duration)
    const timerMinutes = Math.floor(breakDuration / 60).toString().padStart(2, "0");
    const timerSeconds = (breakDuration % 60).toString().padStart(2, "0");

    const reasonOptions = [
        { value: "", label: "Select Reason" },
        { value: "prayer", label: "Prayer" },
        { value: "lunch", label: "Lunch" },
        { value: "breakfast", label: "Break Fast" },
        { value: "general", label: "General" },
        { value: "emergency", label: "Emergency" }
    ];

    const handleStartBreak = () => {
        if (!selectedReason) {
            setShowPopup(true);
            return;
        }

        if (isBreakActive) {
            // End break
            setIsBreakActive(false);
            setBreakStartTime(null);
            setBreakDuration(0);
            setSelectedReason("");
        } else {
            // Start break
            setIsBreakActive(true);
            setBreakStartTime(new Date());
            setBreakDuration(0);
        }
    };

    return (
        <div className="rounded-xl shadow-lg border p-5 h-full flex flex-col" style={{
            backgroundColor: 'var(--bg-color)',
            borderColor: 'var(--border-color)'
        }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold gradient-text">Break Time</h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            disabled={isBreakActive}
                            className="border rounded font-bold px-2 py-2 pr-8 text-xs gradient-text appearance-none"
                            style={{
                                borderColor: 'var(--accent-color)',
                                backgroundColor: 'var(--bg-color)',
                                opacity: isBreakActive ? 0.5 : 1
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
                        onClick={handleStartBreak}
                        className="gradient-bg text-white px-3 py-2 rounded text-xs font-medium flex items-center gap-1 transition-all duration-200"
                        style={{
                            backgroundColor: isBreakActive ? 'var(--error-color)' : undefined
                        }}
                    >
                        <img src="/assets/clock.svg" alt={isBreakActive ? 'End Break' : 'Start Break'} className="w-4 h-4" />
                        {isBreakActive ? 'End Break' : 'Start Break'}
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div
                className="w-full h-px mb-2"
                style={{ backgroundColor: 'var(--divider-color)' }}
            ></div>

            {/* Clock Section */}
            <div className="flex flex-col items-center justify-center mt-2 mb-6" style={{ height: '100px', minHeight: '100px', maxHeight: '100px' }}>
                {/* Analog Clock */}
                <div className="relative mb-1">
                    <svg width="38" height="38">
                        {/* Clock face */}
                        <circle
                            cx="19"
                            cy="19"
                            r="17"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            fillOpacity="0.1"
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="1.2"
                        />

                        {/* Hour markers */}
                        {[...Array(12)].map((_, i) => {
                            const angle = i * 30 - 90;
                            const x1 = 19 + 11 * Math.cos((angle * Math.PI) / 180);
                            const y1 = 19 + 11 * Math.sin((angle * Math.PI) / 180);
                            const x2 = 19 + 14 * Math.cos((angle * Math.PI) / 180);
                            const y2 = 19 + 14 * Math.sin((angle * Math.PI) / 180);

                            return <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                                strokeWidth="1"
                            />;
                        })}

                        {/* Hour hand */}
                        <line
                            x1="19"
                            y1="19"
                            x2={19 + 6 * Math.cos((hourAngle * Math.PI) / 180)}
                            y2={19 + 6 * Math.sin((hourAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                        />

                        {/* Minute hand */}
                        <line
                            x1="19"
                            y1="19"
                            x2={19 + 8.5 * Math.cos((minuteAngle * Math.PI) / 180)}
                            y2={19 + 8.5 * Math.sin((minuteAngle * Math.PI) / 180)}
                            stroke={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />

                        {/* Second hand */}
                        <line
                            x1="19"
                            y1="19"
                            x2={19 + 10 * Math.cos((secondAngle * Math.PI) / 180)}
                            y2={19 + 10 * Math.sin((secondAngle * Math.PI) / 180)}
                            stroke="var(--accent-hover)"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                        />

                        {/* Center dot */}
                        <circle
                            cx="19"
                            cy="19"
                            r="1.2"
                            fill={isBreakActive ? "var(--error-color)" : "var(--accent-color)"}
                        />
                    </svg>
                </div>

                {/* Timer Display */}
                <div className="flex items-center space-x-2 px-2 py-0.5 rounded-lg" style={{
                    background: isBreakActive ? 'linear-gradient(135deg, var(--error-color), #dc2626)' : 'var(--hover-color)',
                    boxShadow: isBreakActive ? '0 2px 8px rgba(239, 68, 68, 0.2)' : '0 2px 8px rgba(21, 145, 155, 0.15)'
                }}>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-sm tracking-wider p-0 m-0" style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerMinutes}
                        </div>
                        <div className="text-[10px] tracking-widest opacity-80 uppercase p-0 m-0" style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>MIN</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="digital-numbers text-sm tracking-wider p-0 m-0" style={{ color: 'var(--text-color)', lineHeight: '1' }}>
                            {timerSeconds}
                        </div>
                        <div className="text-[10px] tracking-widest opacity-80 uppercase p-0 m-0" style={{ color: 'var(--sub-text-color2)', lineHeight: '1' }}>SEC</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div
                className="w-full h-px mb-2"
                style={{ backgroundColor: 'var(--divider-color)' }}
            ></div>

            {/* Summary Boxes */}
            <div className="flex gap-4 mt-4">
                <div className="flex-1 rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--container-color)' }}>
                    <div className="text-lg font-bold  mb-1" style={{ color: 'var(--text-color)' }}>15m</div>
                    <div className="text-xs" style={{ color: 'var(--sub-text-color)' }}>Break Time</div>
                </div>
                <div className="flex-1  rounded-lg p-3 text-center" style={{ backgroundColor: 'var(--container-color)' }}>
                    <div className="text-lg font-bold  mb-1" style={{ color: 'var(--text-color)' }}>8m</div>
                    <div className="text-xs" style={{ color: 'var(--sub-text-color)' }}>Remaining</div>
                </div>
            </div>

            {/* Custom Popup */}
            <CustomPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title="Break Reason Required"
                message="Please select a break reason first!"
                type="warning"
            />
        </div>
    );
};

export default BreakTime;
