import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useGetBreakDashboardQuery } from "../../services/apis/BreakApi";

// Types translation keys
const breakTypeKeys = {
  "Prayer": "breakTime.reasons.Prayer",
  "Toilet": "breakTime.reasons.Toilet",
  "smooking": "breakTime.reasons.smooking",
  "hmam": "breakTime.reasons.hmam",
  "drink": "breakTime.reasons.drink",
  "sleep": "breakTime.reasons.sleep"
};

// Filter options (week, month فقط)
const filterOptions = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" }
];

// لون موحد لكل البارات
const unifiedColor = "#75C8CF";

const BreakTypeChart = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState("week");
  const { data: dashboard, isLoading } = useGetBreakDashboardQuery({ filter });

  // Dynamic breakTypeUsage from backend
  const breakData = dashboard?.breakTypeUsage || [];
  const timeValues = breakData.map(b => parseInt(b.total.replace(" min", "")) || 0);
  const maxTime = Math.max(...timeValues, 10);

  const isArabic = i18n.language === "ar";
  const options = isArabic ? [...filterOptions].reverse() : filterOptions;

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
      className="rounded-2xl p-6 border shadow-lg transition-all duration-300 hover:shadow-xl backdrop-blur-sm"
      style={{
        background: "linear-gradient(135deg, var(--chart-bg), rgba(255,255,255,0.02))",
        borderColor: "var(--chart-border)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}
    >
      {/* Header + Filter */}
      <div className={`flex items-center justify-between mb-6 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
        <div>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-color)" }}>
            Break Type Usage
          </h3>
          <p className="text-xs" style={{ color: "var(--sub-text-color)" }}>
            Total time spent by break type
          </p>
        </div>
        <div className="relative flex items-center">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="rounded-full px-5 py-2 pr-10 text-sm font-semibold appearance-none focus:outline-none transition-all duration-200 hover:scale-105"
            style={{
              minWidth: 120,
              background: unifiedColor,
              color: "#fff",
              border: "none",
              direction: isArabic ? "rtl" : "ltr"
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute ${isArabic ? "left-4" : "right-4"} top-1/2 transform -translate-y-1/2 w-4 h-4`}
            style={{ color: "#fff" }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-72">
        {/* Y-axis labels */}
        <div
          className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs font-semibold"
          style={{ height: "100%", color: "var(--chart-label)" }}
        >
          <span>{maxTime}m</span>
          <span>{Math.floor(maxTime * 2 / 3)}m</span>
          <span>{Math.floor(maxTime / 3)}m</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 h-full">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute w-full h-px"
              style={{
                top: `${(i / 3) * 100}%`,
                background: "var(--chart-grid)",
                opacity: 0.4
              }}
            />
          ))}
          <div
            className="absolute w-full h-px border-t-2 border-dashed"
            style={{
              top: "0%",
              borderColor: "var(--chart-dashed)",
              opacity: 0.6
            }}
          />
        </div>

        {/* Bars */}
        <div className={`absolute ${isArabic ? 'right-12' : 'left-12'} ${isArabic ? 'left-0' : 'right-0'} top-0 h-full flex items-end justify-between px-4`}>
          {(isArabic ? [...breakData].reverse() : breakData).map((breakItem, index) => {
            const time = parseInt(breakItem.total.replace(" min", "")) || 0;
            const count = breakItem.count || 0;
            const height = maxTime > 0 ? (time / maxTime) * 100 : 0;
            const breakTypeKey = breakTypeKeys[breakItem.type] || breakItem.type;

            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-20 group">
                <div className="relative">
                  <div
                    className="w-10 rounded-t-xl transition-all duration-300 hover:scale-110 cursor-pointer group-hover:shadow-lg"
                    style={{
                      height: `${Math.max(height, 2)}px`,
                      minHeight: "2px",
                      maxHeight: "192px",
                      background: unifiedColor,
                      boxShadow: "0 4px 15px rgba(117,200,207,0.3)"
                    }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
                    <div className="bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-lg">
                      <div className="font-semibold">{t(breakTypeKey, breakItem.type)}</div>
                      <div>Count: {count}</div>
                      <div>Total: {breakItem.total}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                </div>
                <span className="text-xs mt-2 text-center font-semibold transition-all duration-200 group-hover:scale-105 group-hover:text-opacity-80"
                      style={{ color: "var(--sub-text-color)" }}>
                  {t(breakTypeKey, breakItem.type)}
                </span>
                <span className="text-[10px] mt-1 text-center font-medium opacity-70 transition-all duration-200 group-hover:opacity-100"
                      style={{ color: "var(--sub-text-color2)" }}>
                  ({count}x)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Legend/Summary */}
      <div className="mt-4 pt-4 border-t border-opacity-20" style={{ borderColor: "var(--chart-border)" }}>
        <div className="flex justify-between items-center text-xs" style={{ color: "var(--sub-text-color)" }}>
          <span className="font-medium">
            Total Types: {breakData.length}
          </span>
          <span className="font-medium">
            Total Time: {timeValues.reduce((sum, time) => sum + time, 0)}m
          </span>
          <span className="font-medium">
            Most Used: {breakData.reduce((a, b) => (parseInt(a.total) > parseInt(b.total) ? a : b), breakData[0])?.type || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BreakTypeChart;
