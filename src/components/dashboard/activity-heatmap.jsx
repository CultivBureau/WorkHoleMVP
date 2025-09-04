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

  // Month names for the header
  const monthNames = t("dashboard.activityHeatmap.months", {
    returnObjects: true,
    defaultValue: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  });

  // Week day names - detect user's locale
  const getLocalizedWeekDays = () => {
    const locale = navigator.language || 'en-US';
    const baseDate = new Date(2023, 0, 2); // Monday, January 2, 2023
    const weekDays = [];
    
    // Get the first day of week for user's locale
    const firstDayOfWeek = new Intl.Locale(locale).weekInfo?.firstDay || 1; // 1 = Monday, 7 = Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      weekDays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
    }
    
    return weekDays;
  };

  const weekDays = getLocalizedWeekDays();

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

  // Create a data map from backend data
  const createDataMap = (backendWeeks) => {
    const dataMap = new Map();
    
    if (backendWeeks && backendWeeks.length > 0) {
      backendWeeks.forEach(week => {
        if (week.days && week.days.length > 0) {
          week.days.forEach(day => {
            if (day.date) {
              dataMap.set(day.date, {
                workHours: day.workHours || 0,
                isCurrentMonth: day.isCurrentMonth
              });
            }
          });
        }
      });
    }
    
    return dataMap;
  };

  // Generate dynamic calendar layout based on real calendar
  const generateCalendarWeeks = (year, month, backendWeeks) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const locale = navigator.language || 'en-US';
    
    // Create data map from backend
    const dataMap = createDataMap(backendWeeks);
    
    // Get first day of week for user's locale (0 = Sunday, 1 = Monday)
    const firstDayOfWeek = new Intl.Locale(locale).weekInfo?.firstDay === 7 ? 0 : 1;
    
    // Find the first day of the calendar grid
    let calendarStart = new Date(firstDay);
    while (calendarStart.getDay() !== firstDayOfWeek) {
      calendarStart.setDate(calendarStart.getDate() - 1);
    }

    const weeks = [];
    let currentDate = new Date(calendarStart);
    let weekNumber = 1;

    // Generate weeks until we've covered the entire month
    while (weekNumber <= 6) { // Max 6 weeks to cover any month
      const week = {
        weekNumber,
        days: []
      };

      // Generate 7 days for this week
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const isCurrentMonth = currentDate.getMonth() === month - 1;
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Get work hours from backend data map
        const dayData = dataMap.get(dateStr);
        const workHours = dayData?.workHours || 0;

        week.days.push({
          date: dateStr,
          dayOfMonth: currentDate.getDate(),
          isCurrentMonth,
          workHours,
          dayOfWeek
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
      weekNumber++;

      // Stop if we've passed the month and have at least 4 weeks
      if (currentDate > lastDay && weekNumber > 4) {
        break;
      }
    }

    return weeks;
  };

  // MEMOIZE calendar weeks to prevent infinite loops
  const memoizedCalendarWeeks = useMemo(() => {
    if (heatChart?.year && heatChart?.month && weeks.length > 0) {
      return generateCalendarWeeks(heatChart.year, heatChart.month, weeks);
    } else if (selectedMonth) {
      // Fallback to current year if no data
      const currentYear = new Date().getFullYear();
      return generateCalendarWeeks(currentYear, selectedMonth, []);
    }
    return [];
  }, [heatChart?.year, heatChart?.month, selectedMonth, weeks.length]); // Only depend on stable values

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
                        className="relative w-40 h-7 rounded-lg  cursor-pointer transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm"
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
