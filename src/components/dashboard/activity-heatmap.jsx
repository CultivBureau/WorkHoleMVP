"use client"
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ActivityHeatmap({ 
  dashboardData, 
  isLoading, 
  error, 
  selectedMonth, 
  onMonthChange 
}) {
  const { t } = useTranslation();
  const [hoveredDay, setHoveredDay] = useState(null);
  const [calendarWeeks, setCalendarWeeks] = useState([]);

  // Use heatChart from API response
  const heatChart = dashboardData?.heatChart || {};
  const weeks = heatChart?.weeks || [];

  // Debug logging
  useEffect(() => {
    console.log("Dashboard Data:", dashboardData);
    console.log("Heat Chart:", heatChart);
    console.log("Weeks:", weeks);
    console.log("Selected Month:", selectedMonth);
  }, [dashboardData, heatChart, weeks, selectedMonth]);

  // Month names for the header
  const monthNames = t("dashboard.activityHeatmap.months", {
    returnObjects: true,
    defaultValue: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  });

  // Week day names - Monday to Sunday
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // YOUR APP'S COLOR PALETTE - Using CSS Variables
  const getActivityColor = (activeHours) => {
    if (activeHours === 0) return "var(--border-color)"; // No work - border color
    if (activeHours <= 2) return "var(--hover-color)"; // Light work - hover color
    if (activeHours <= 4) return "var(--accent-hover)"; // Moderate work - accent hover
    if (activeHours <= 6) return "var(--accent-color)"; // Good work - main accent
    if (activeHours <= 8) return "var(--gradient-start)"; // High productivity - gradient start
    return "var(--gradient-end)"; // Excellent productivity - gradient end
  };

  // Get level description for tooltip
  const getWorkLevel = (activeHours) => {
    if (activeHours === 0) return "No work";
    if (activeHours <= 2) return "Light work";
    if (activeHours <= 4) return "Moderate work";
    if (activeHours <= 6) return "Good work";
    if (activeHours <= 8) return "High productivity";
    return "Excellent productivity";
  };

  // Use backend data directly if available, otherwise generate fallback
  const memoizedCalendarWeeks = useMemo(() => {
    if (weeks && weeks.length > 0) {
      console.log("Using backend weeks data:", weeks);
      return weeks;
    } else {
      console.log("Generating fallback calendar for month:", selectedMonth);
      // Fallback: generate basic calendar
      const currentYear = new Date().getFullYear();
      const firstDay = new Date(currentYear, selectedMonth - 1, 1);
      const lastDay = new Date(currentYear, selectedMonth, 0);
      
      // Find first Monday
      let weekStart = new Date(firstDay);
      while (weekStart.getDay() !== 1) {
        weekStart.setDate(weekStart.getDate() - 1);
      }

      const fallbackWeeks = [];
      let currentWeekStart = new Date(weekStart);

      for (let weekNumber = 1; weekNumber <= 4; weekNumber++) {
        const weekDays = [];
        for (let dayNum = 0; dayNum < 7; dayNum++) {
          const currentDay = new Date(currentWeekStart);
          currentDay.setDate(currentWeekStart.getDate() + dayNum);
          const isCurrentMonth = currentDay.getMonth() === selectedMonth - 1;
          
          weekDays.push({
            date: currentDay.toISOString().split('T')[0],
            workHours: 0, // No data
            isCurrentMonth,
            dayOfMonth: currentDay.getDate(),
            dayOfWeek: dayNum,
          });
        }
        
        fallbackWeeks.push({
          weekNumber,
          days: weekDays,
        });
        
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
      
      return fallbackWeeks;
    }
  }, [weeks, selectedMonth]);

  // Update calendar weeks when memoized value changes
  useEffect(() => {
    setCalendarWeeks(memoizedCalendarWeeks);
  }, [memoizedCalendarWeeks]);

  // Navigation handlers
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      onMonthChange(12);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      onMonthChange(1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
             style={{ borderBottomColor: "var(--accent-color)" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-8" 
           style={{ color: "var(--error-color)" }}>
        Error loading activity heatmap
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-lg shadow-sm border overflow-x-auto p-4 relative"
      style={{
        background: "var(--bg-color)",
        borderColor: "var(--border-color)"
      }}
    >
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold gradient-text">
          Active Work Hours
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md transition-colors"
            style={{ 
              color: "var(--text-color)",
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--hover-color)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-sm font-medium px-3 py-1 rounded-md min-w-[100px] text-center" 
                style={{ 
                  color: "var(--text-color)", 
                  backgroundColor: "var(--container-color)"
                }}>
            {monthNames[selectedMonth - 1]} {heatChart?.year || new Date().getFullYear()}
          </span>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md transition-colors"
            style={{ 
              color: "var(--text-color)",
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--hover-color)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* FIXED TABLE LAYOUT - NO WHITESPACE */}
      <div className="w-full overflow-hidden">
        <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th className="w-16 text-left"></th>
              {weekDays.map((day, idx) => (
                <th 
                  key={idx} 
                  className="text-sm font-semibold text-center py-2 px-1"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarWeeks.map((week) => (
              <tr key={week.weekNumber}>
                <td 
                  className="text-sm font-medium text-right pr-3 py-1"
                  style={{ color: "var(--sub-text-color)" }}
                >
                  W{week.weekNumber}
                </td>
                {week.days.map((day, dayIdx) => (
                  <td key={`${week.weekNumber}-${dayIdx}`} className="p-1">
                    <div className="flex justify-center">
                      <div
                        className="relative w-40 h-7 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm"
                        style={{
                          backgroundColor: day.isCurrentMonth 
                            ? getActivityColor(day.workHours)
                            : "var(--container-color)",
                          opacity: day.isCurrentMonth ? 1 : 0.4,
                          color: day.workHours > 4 ? "white" : "var(--text-color)",
                          textShadow: day.workHours > 4 ? "0 0 2px rgba(0,0,0,0.7)" : "none",
                          border: hoveredDay === `${week.weekNumber}-${dayIdx}` 
                            ? "2px solid var(--accent-color)" 
                            : "1px solid var(--border-color)",
                          transform: hoveredDay === `${week.weekNumber}-${dayIdx}` ? "scale(1.05)" : "scale(1)",
                          zIndex: hoveredDay === `${week.weekNumber}-${dayIdx}` ? 50 : "auto",
                        }}
                        onMouseEnter={() => setHoveredDay(`${week.weekNumber}-${dayIdx}`)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {day.dayOfMonth}
                        {hoveredDay === `${week.weekNumber}-${dayIdx}` && day.isCurrentMonth && (
                          <div
                            className="absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-xl pointer-events-none"
                            style={{
                              backgroundColor: "var(--text-color)",
                              color: "var(--bg-color)",
                              top: "-30px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              whiteSpace: "nowrap",
                              border: `1px solid var(--border-color)`
                            }}
                          >
                            <div className="text-center">
                              <div className="font-semibold">{day.workHours}h active work</div>
                              <div className="text-xs opacity-75">{getWorkLevel(day.workHours)}</div>
                              <div className="text-xs opacity-75">{day.date}</div>
                            </div>
                            <div
                              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                              style={{
                                borderLeft: "6px solid transparent",
                                borderRight: "6px solid transparent",
                                borderTop: "6px solid var(--text-color)"
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Legend with YOUR APP'S COLORS */}
      <div className="flex items-center justify-between mt-6 pt-4" 
           style={{ borderTop: `1px solid var(--border-color)` }}>
        <div className="text-sm" style={{ color: "var(--sub-text-color)" }}>
          Active work hours (work time minus breaks)
        </div>
        
        <div className="flex items-center gap-3 text-sm" style={{ color: "var(--sub-text-color)" }}>
          <span>Less</span>
          <div className="flex gap-1">
            {[
              { hours: 0, label: "0h" },
              { hours: 2, label: "2h" },
              { hours: 4, label: "4h" },
              { hours: 6, label: "6h" },
              { hours: 8, label: "8h+" }
            ].map((level) => (
              <div key={level.hours} className="flex flex-col items-center">
                <div
                  className="w-4 h-4 rounded cursor-pointer transition-transform hover:scale-125"
                  style={{ 
                    backgroundColor: getActivityColor(level.hours),
                    border: `1px solid var(--border-color)`
                  }}
                  title={`${level.label} - ${getWorkLevel(level.hours)}`}
                />
                <span className="text-xs mt-1" style={{ color: "var(--sub-text-color)" }}>
                  {level.label}
                </span>
              </div>
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
