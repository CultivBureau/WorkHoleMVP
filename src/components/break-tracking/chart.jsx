import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

// Dummy data for demo
const periodData = {
  lastWeek: [
    { type: "Prayer", time: 35 },
    { type: "Lunch", time: 50 },
    { type: "Break Fast", time: 42 },
    { type: "General", time: 25 },
    { type: "Emergency", time: 15 }
  ],
  thisWeek: [
    { type: "Prayer", time: 28 },
    { type: "Lunch", time: 45 },
    { type: "Break Fast", time: 38 },
    { type: "General", time: 22 },
    { type: "Emergency", time: 12 }
  ],
  lastMonth: [
    { type: "Prayer", time: 3.5 }, // Changed to hours for last month
    { type: "Lunch", time: 5.5 },
    { type: "Break Fast", time: 4.2 },
    { type: "General", time: 2.0 },
    { type: "Emergency", time: 1.8 }
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
  const isArabic = i18n.language === "ar";
  const textAlign = isArabic ? "text-right" : "text-left";
  const options = isArabic ? [...periodOptions].reverse() : periodOptions;

  // Dynamic Y-axis configuration based on selected period
  const getYAxisConfig = () => {
    if (selectedPeriod === "lastMonth") {
      return {
        labels: [6, 5, 4, 3, 2, 1, 0],
        maxValue: 6,
        unit: isArabic ? "س" : "h" // Hours
      };
    } else {
      return {
        labels: [60, 50, 40, 30, 20, 10, 0],
        maxValue: 60,
        unit: isArabic ? "د" : "m" // Minutes
      };
    }
  };

  const yAxisConfig = getYAxisConfig();

  return (
    <div
      className="rounded-2xl p-6 border shadow-sm"
      style={{
        background: "var(--containr-bg)",
        borderColor: "var(--chart-border)",
        minHeight: "400px"
      }}
    >
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
        {isArabic ? (
          <>
            <div className="relative flex items-center">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-full px-6 py-2 text-sm font-semibold appearance-none focus:outline-none"
                style={{
                  minWidth: 150,
                  paddingLeft: isArabic ? "45px" : "24px",
                  paddingRight: isArabic ? "24px" : "45px",
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
                className="rounded-full px-6 py-2 text-sm font-semibold appearance-none focus:outline-none"
                style={{
                  minWidth: 150,
                  paddingRight: "45px",
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
      <div className="relative h-72">
        {/* Y-axis labels */}
        <div
          className={`absolute ${isArabic ? 'right-0' : 'left-0'} top-0 h-full flex flex-col justify-between text-xs font-medium`}
          style={{
            height: "100%",
            color: "var(--chart-label)",
            direction: isArabic ? "rtl" : "ltr"
          }}
        >
          {yAxisConfig.labels.map((label) => (
            <span key={label} className={isArabic ? "text-right" : "text-left"}>
              {label}{yAxisConfig.unit}
            </span>
          ))}
        </div>

        {/* Grid lines */}
        <div className={`absolute ${isArabic ? 'right-12' : 'left-12'} ${isArabic ? 'left-0' : 'right-0'} top-0 h-full`}>
          {yAxisConfig.labels.slice(0, -1).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px"
              style={{
                top: `${(i / (yAxisConfig.labels.length - 1)) * 100}%`,
                background: "var(--chart-grid)"
              }}
            />
          ))}
          {/* Dashed line at top */}
          <div
            className="absolute w-full h-px border-t-2 border-dashed"
            style={{
              top: "0%",
              borderColor: "var(--chart-dashed)"
            }}
          />
        </div>

        {/* Bars */}
        <div className={`absolute ${isArabic ? 'right-12' : 'left-12'} ${isArabic ? 'left-0' : 'right-0'} top-0 h-full flex items-end justify-between px-4`}>
          {(isArabic ? [...breakData].reverse() : breakData).map((breakItem, index) => {
            const height = (breakItem.time / yAxisConfig.maxValue) * 100;
            const isHighest = breakItem.time === Math.max(...breakData.map(b => b.time));
            const breakTypeKey = breakTypeKeys[breakItem.type] || breakItem.type;
            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-20">
                <div
                  className="w-12 rounded-t-xl transition-all duration-300"
                  style={{
                    height: `${height}%`,
                    background: isHighest ? "var(--chart-bar-highlight)" : "var(--chart-bar)",
                    boxShadow: "0 2px 8px 0 rgba(178,241,234,0.15)"
                  }}
                />
                <span
                  className="text-xs mt-3 text-center font-medium"
                  style={{
                    color: "var(--sub-text-color)",
                    direction: isArabic ? "rtl" : "ltr"
                  }}
                >
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
