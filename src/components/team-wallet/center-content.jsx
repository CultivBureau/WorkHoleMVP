import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CenterContent = () => {
    const { t, i18n } = useTranslation();
    const direction = i18n.language === "ar" ? "rtl" : "ltr";
    const textAlign = i18n.language === "ar" ? "text-right" : "text-left";

    // State for dropdowns
    const [teamPeriod, setTeamPeriod] = useState("Over Year");
    const [deductionsPeriod, setDeductionsPeriod] = useState("Over Year");
    const [bonusesPeriod, setBonusesPeriod] = useState("Over Year");

    // Sample data for different periods
    const teamDataMonth = [
        { name: "SARAH", value: 40 },
        { name: "ROBERT", value: 15 },
        { name: "EMMA", value: 10 },
        { name: "TYLER", value: 5 },
    ];
    const teamDataYear = [
        { name: "SARAH", value: 60 },
        { name: "ROBERT", value: 25 },
        { name: "EMMA", value: 20 },
        { name: "TYLER", value: 15 },
    ];
    const getTeamData = () => teamPeriod === "Over Year" ? teamDataYear : teamDataMonth;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4 mb-4" dir={direction}>
            {/* Team Deductions Breakdown */}
            <div
                className="lg:col-span-3 rounded-xl p-3 border h-72 flex flex-col"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)'
                }}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className={`${textAlign} flex-1`}>
                        <h4
                            className={`text-xs font-semibold ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            {t("walletCharts.teamDeductions.header")}
                        </h4>
                        <p
                            className={`text-xs mt-1 ${textAlign}`}
                            style={{ color: 'var(--sub-text-color)' }}
                        >
                            {t("walletCharts.teamDeductions.subtitle")}
                        </p>
                    </div>
                    <select
                        value={teamPeriod}
                        onChange={(e) => setTeamPeriod(e.target.value)}
                        className="text-xs border rounded px-2 py-1 ml-2 min-w-[90px]"
                        style={{
                            backgroundColor: 'var(--bg-color)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--sub-text-color)'
                        }}
                    >
                        <option>{t("walletCharts.period.year")}</option>
                        <option>{t("walletCharts.period.month")}</option>
                    </select>
                </div>
                {/* Chart takes remaining space */}
                <div className="flex-1 flex flex-col" dir="ltr">
                    {/* Bar Chart */}
                    <div className="flex items-end flex-1 relative min-h-0">
                        {/* Y-axis */}
                        <div
                            className="flex flex-col justify-between h-full text-xs mr-2 w-8 py-1"
                            style={{ color: 'var(--sub-text-color)' }}
                        >
                            <span>100%</span>
                            <span>80%</span>
                            <span>60%</span>
                            <span>40%</span>
                            <span>20%</span>
                            <span>0</span>
                        </div>
                        {/* Bars */}
                        <div
                            className="flex items-end justify-between flex-1 h-full border-l border-b px-2"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            {getTeamData().map((item, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 max-w-[50px]">
                                    <div
                                        className="bg-red-500 w-6 rounded-t mx-auto"
                                        style={{ height: `${(item.value / 100) * 100}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* X-axis labels */}
                    <div
                        className="flex justify-between text-xs mt-1 ml-10"
                        style={{ color: 'var(--sub-text-color)' }}
                    >
                        {getTeamData().map((item, index) => (
                            <span key={index} className="flex-1 text-center max-w-[50px]">{item.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Deductions Breakdown */}
            <div
                className="lg:col-span-2 rounded-xl p-3 border h-72 flex flex-col"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)'
                }}
            >
                {/* Header - 25% */}
                <div className="h-1/4 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <h3
                            className={`text-xs font-semibold flex-1 ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            {t("walletCharts.deductions.header")}
                        </h3>
                        <select
                            value={deductionsPeriod}
                            onChange={(e) => setDeductionsPeriod(e.target.value)}
                            className="text-xs border rounded px-1 py-1 w-16 ml-2"
                            style={{
                                backgroundColor: 'var(--bg-color)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--sub-text-color)'
                            }}
                        >
                            <option>{t("walletCharts.period.year")}</option>
                            <option>{t("walletCharts.period.month")}</option>
                        </select>
                    </div>
                    <p
                        className={`text-xs ${textAlign}`}
                        style={{ color: 'var(--sub-text-color)' }}
                    >
                        {t("walletCharts.deductions.subtitle")}
                    </p>
                </div>
                {/* Donut Chart - 50% */}
                <div className="h-1/2 flex justify-center items-center">
                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background circle */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--border-color)" strokeWidth="12" />
                            {/* Red segment (60%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#dc2626" strokeWidth="12"
                                strokeDasharray="169.6 282.7" strokeDashoffset="0" />
                            {/* Dark gray segment (20%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#374151" strokeWidth="12"
                                strokeDasharray="56.5 282.7" strokeDashoffset="-169.6" />
                            {/* Light gray segment (20%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#9ca3af" strokeWidth="12"
                                strokeDasharray="56.5 282.7" strokeDashoffset="-226.1" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className="text-lg font-bold"
                                style={{ color: 'var(--text-color)' }}
                            >
                                120
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: 'var(--sub-text-color)' }}
                            >
                                {t("walletCharts.totalTasks")}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Legend - 25% */}
                <div className="h-1/4 flex flex-col justify-center space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.deductions.legend.lateArrivals")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            60%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-700 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.deductions.legend.missedDeadline")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            20%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.deductions.legend.absences")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            20%
                        </span>
                    </div>
                </div>
            </div>

            {/* Bonuses Breakdown */}
            <div
                className="lg:col-span-2 rounded-xl p-3 border h-72 flex flex-col"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)'
                }}
            >
                {/* Header - 25% */}
                <div className="h-1/4 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <h3
                            className={`text-xs font-semibold flex-1 ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            {t("walletCharts.bonuses.header")}
                        </h3>
                        <select
                            value={bonusesPeriod}
                            onChange={(e) => setBonusesPeriod(e.target.value)}
                            className="text-xs border rounded px-1 py-1 w-16 ml-2"
                            style={{
                                backgroundColor: 'var(--bg-color)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--sub-text-color)'
                            }}
                        >
                            <option>{t("walletCharts.period.year")}</option>
                            <option>{t("walletCharts.period.month")}</option>
                        </select>
                    </div>
                    <p
                        className={`text-xs ${textAlign}`}
                        style={{ color: 'var(--sub-text-color)' }}
                    >
                        {t("walletCharts.bonuses.subtitle")}
                    </p>
                </div>
                {/* Donut Chart - 50% */}
                <div className="h-1/2 flex justify-center items-center">
                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background circle */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--border-color)" strokeWidth="12" />
                            {/* Teal segment (60%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#0d9488" strokeWidth="12"
                                strokeDasharray="169.6 282.7" strokeDashoffset="0" />
                            {/* Light teal segment (20%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#5eead4" strokeWidth="12"
                                strokeDasharray="56.5 282.7" strokeDashoffset="-169.6" />
                            {/* Light blue segment (20%) */}
                            <circle cx="60" cy="60" r="45" fill="transparent" stroke="#67e8f9" strokeWidth="12"
                                strokeDasharray="56.5 282.7" strokeDashoffset="-226.1" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className="text-lg font-bold"
                                style={{ color: 'var(--text-color)' }}
                            >
                                120
                            </span>
                            <span
                                className="text-xs"
                                style={{ color: 'var(--sub-text-color)' }}
                            >
                                {t("walletCharts.totalTasks")}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Legend - 25% */}
                <div className="h-1/4 flex flex-col justify-center space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-teal-600 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.bonuses.legend.tasks")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            60%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-teal-300 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.bonuses.legend.kpi")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            20%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-cyan-300 rounded-full mr-1"></div>
                            <span
                                className={`text-xs ${textAlign}`}
                                style={{ color: 'var(--text-color)' }}
                            >
                                {t("walletCharts.bonuses.legend.attendance")}
                            </span>
                        </div>
                        <span
                            className={`text-xs ${textAlign}`}
                            style={{ color: 'var(--text-color)' }}
                        >
                            20%
                        </span>
                    </div>
                </div>
            </div>

            {/* Team */}
            <div
                className="lg:col-span-3 rounded-xl p-3 border h-72"
                style={{
                    backgroundColor: 'var(--bg-color)',
                    borderColor: 'var(--border-color)'
                }}
            >
                <div className="flex justify-between items-center mb-3">
                    <h3
                        className={`text-xs font-semibold ${textAlign}`}
                        style={{ color: 'var(--text-color)' }}
                    >
                        {t("walletCharts.team.header")}
                    </h3>
                    <span
                        className={`text-xs cursor-pointer ${textAlign}`}
                        style={{ color: 'var(--primary-color)' }}
                    >
                        {t("walletCharts.team.viewAll")} (5)
                    </span>
                </div>
                {/* Team members list */}
                <div className="space-y-2">
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img
                                    src={`https://i.pravatar.cc/40?img=${index + 1}`}
                                    alt={t("profile.profile")}
                                    className="w-7 h-7 rounded-full mr-2"
                                />
                                <div>
                                    <p
                                        className={`text-xs font-semibold ${textAlign}`}
                                        style={{ color: 'var(--text-color)' }}
                                    >
                                        {t("navbar.profileName")}
                                    </p>
                                    <p
                                        className={`text-xs ${textAlign}`}
                                        style={{ color: 'var(--sub-text-color)' }}
                                    >
                                        {t("navbar.role")}
                                    </p>
                                </div>
                            </div>
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                style={{ color: 'var(--sub-text-color)' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CenterContent;