import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

// Dummy data for demo
const periodData = {
  lastWeek: [
    { type: "Prayer", time: 20 },
    { type: "Lunch", time: 30 },
    { type: "Break Fast", time: 22 },
    { type: "General", time: 15 },
    { type: "Emergency", time: 10 }
  ],
  thisWeek: [
    { type: "Prayer", time: 18 },
    { type: "Lunch", time: 28 },
    { type: "Break Fast", time: 20 },
    { type: "General", time: 13 },
    { type: "Emergency", time: 8 }
  ],
  lastMonth: [
    { type: "Prayer", time: 15 },
    { type: "Lunch", time: 25 },
    { type: "Break Fast", time: 18 },
    { type: "General", time: 12 },
    { type: "Emergency", time: 7 }
  ]
};

const breakTypeKeys = {
  "Prayer": "breakTime.reasons.prayer",
  "Lunch": "breakTime.reasons.lunch",
  "Break Fast": "breakTime.reasons.breakfast",
  "General": "breakTime.reasons.personal",
  "Emergency": "breakTime.reasons.emergency"
};

const periodOptions = [
  { value: "lastWeek", label: "breakStats.period.lastWeek" },
  { value: "thisWeek", label: "breakStats.period.thisWeek" },
  { value: "lastMonth", label: "breakStats.period.lastMonth" }
];

const BreakTypeChart = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState("lastWeek");

  const breakData = periodData[selectedPeriod];
  const maxTime = 30;
  const isArabic = i18n.language === "ar";
  const textAlign = isArabic ? "text-right" : "text-left";
  const options = isArabic ? [...periodOptions].reverse() : periodOptions;

  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{
        background: "var(--chart-bg)",
        borderColor: "var(--chart-border)"
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
        {isArabic ? (
          <>

            <div className="relative flex items-center">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-full px-5 py-2 pr-10 text-sm font-semibold appearance-none focus:outline-none"
                style={{
                  minWidth: 120,
                  background: "var(--chart-bar)",
                  color: "var(--text-color)",
                  border: "none",
                  direction: "rtl"
                }}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--sub-text-color)" }}
              />
            </div>
            <div className={textAlign}>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                {t("breakStats.mostUsedBreak")}
              </h3>
              <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                {t("breakStats.timeTakenToday")}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className={textAlign}>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-color)" }}>
                {t("breakStats.mostUsedBreak")}
              </h3>
              <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
                {t("breakStats.timeTakenToday")}
              </p>
            </div>
            <div className="relative flex items-center">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-full px-5 py-2 pr-10 text-sm font-semibold appearance-none focus:outline-none"
                style={{
                  minWidth: 120,
                  background: "var(--chart-bar)",
                  color: "var(--text-color)",
                  border: "none",
                  direction: "ltr"
                }}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--sub-text-color)" }}
              />
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div
          className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs font-medium"
          style={{ height: "100%", color: "var(--chart-label)" }}
        >
          <span>30m</span>
          <span>20m</span>
          <span>10m</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 h-full">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-full h-px"
              style={{
                top: `${(i / 3) * 100}%`,
                background: "var(--chart-grid)"
              }}
            />
          ))}
          {/* Dashed line at 30m */}
          <div
            className="absolute w-full h-px border-t-2 border-dashed"
            style={{
              top: "0%",
              borderColor: "var(--chart-dashed)"
            }}
          />
        </div>

        {/* Bars */}
        <div className="absolute left-10 right-0 top-0 h-full flex items-end justify-between px-4">
          {(isArabic ? [...breakData].reverse() : breakData).map((breakItem, index) => {
            const height = (breakItem.time / maxTime) * 100;
            const isHighest = breakItem.time === Math.max(...breakData.map(b => b.time));
            const breakTypeKey = breakTypeKeys[breakItem.type] || breakItem.type;
            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-20">
                <div
                  className="w-10 rounded-t-xl transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    background: isHighest ? "var(--chart-bar-highlight)" : "var(--chart-bar)",
                    boxShadow: "0 2px 8px 0 rgba(178,241,234,0.15)"
                  }}
                />
                <span className="text-xs mt-2 text-center font-medium" style={{ color: "var(--sub-text-color)" }}>
                  {t(breakTypeKey)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BreakTypeChart;
