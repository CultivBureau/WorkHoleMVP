"use client"
import { useTranslation } from "react-i18next";

export default function ActivityHeatmap({ dashboardData, isLoading, error }) {
  const { t } = useTranslation();

  // Use heatChart from API response
  const heatChart = dashboardData?.heatChart || [];

  // Flatten heatChart to array of days (for grid)
  const flatHeatmapData = [];
  heatChart.forEach(monthObj => {
    flatHeatmapData.push(...monthObj.days);
  });

  // Use GitHub-like colors
  const getActivityColor = (level) => {
    const colors = [
      "#ECFDFC",
      "#CBFBF9",
      "#97DBD9",
      "#09B2A9"
    ];
    return { backgroundColor: colors[Math.min(Math.floor(level), 3)] || colors[0] };
  };

  // Add translated week days
  const weekDays = t("dashboard.activityHeatmap.weekDays", {
    returnObjects: true,
    defaultValue: ["sat", "sun", "mon", "tue", "wed", "thu", "fri"],
  });

  if (isLoading) {
    return <div className="w-full flex justify-center items-center py-4 sm:py-8">Loading...</div>;
  }
  if (error) {
    return <div className="w-full flex justify-center items-center py-4 sm:py-8 text-red-500">Error loading activity heatmap</div>;
  }

  // Calculate number of weeks (columns) and days (rows)
  const totalDays = flatHeatmapData.length;
  const weeks = Math.ceil(totalDays / 7);

  return (
    <div
      className="w-full rounded-lg shadow-sm border border-gray-100 overflow-x-auto p-3 sm:p-4 lg:p-6"
      style={{
        background: "var(--container-bg)",
        padding: "16px 12px 12px 12px",
        boxSizing: "border-box",
      }}
    >
      {/* Container for entire heatmap */}
      <div className="flex flex-col min-w-[320px]">
        {/* Month Labels */}
        <div className="flex items-start mb-2 sm:mb-3" style={{ gap: "6px" }}>
          {/* Empty space to align with weekdays column */}
          <div className="w-4 sm:w-5 flex-shrink-0"></div>
          {/* Month Labels - aligned with grid */}
          <div
            className="text-gray-400 text-[9px] sm:text-[10px] lg:text-xs"
            style={{
              fontSize: "10px",
              fontWeight: "500",
              display: "grid",
              gridTemplateColumns: `repeat(${weeks}, 1fr)`,
              gap: "1px",
              height: "14px",
              flex: 1,
            }}
          >
            {/* Show month at start of each month */}
            {heatChart.map((monthObj, idx) => (
              <div key={monthObj.month} className="text-left" style={{ gridColumn: `${idx * Math.ceil(monthObj.days.length / 7) + 1}` }}>
                <span className="hidden sm:inline">
                  {t("dashboard.activityHeatmap.months", { returnObjects: true })[monthObj.month - 1]}
                </span>
                <span className="sm:hidden">
                  {t("dashboard.activityHeatmap.months", { returnObjects: true })[monthObj.month - 1]?.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Days Labels + Heatmap Grid */}
        <div className="flex items-start" style={{ gap: "6px" }}>
          {/* Days of week labels - aligned with heatmap rows */}
          <div
            className="text-gray-400 ml-1 sm:ml-2 text-[7px] sm:text-[8px] lg:text-[9px] h-16 sm:h-20 lg:h-24 w-3 sm:w-4 lg:w-5"
            style={{
              fontSize: "8px",
              fontWeight: "500",
              display: "grid",
              gridTemplateRows: "repeat(7, 1fr)",
              gap: "1px",
              height: "84px",
              width: "16px",
              flexShrink: 0,
            }}
          >
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className="flex items-center"
                style={{
                  gridRow: `${idx + 1}`,
                  height: "100%",
                  textAlign: "right",
                  paddingRight: "2px"
                }}
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Heatmap Grid Container */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${weeks}, 1fr)`,
              gridTemplateRows: "repeat(7, 1fr)",
              gap: "1px",
              height: "84px",
              flex: 1,
            }}
            // Responsive grid sizing
            className="h-16 sm:h-20 lg:h-24"
          >
            {flatHeatmapData.map((day, idx) => (
              <div
                key={idx}
                style={{
                  ...getActivityColor(day),
                  borderRadius: "1px",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  minWidth: "8px",
                  minHeight: "8px",
                }}
                className="hover:ring-1 hover:ring-gray-300 hover:ring-opacity-50 sm:hover:ring-2 rounded-sm sm:rounded"
                title={`${day} hours`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 gap-2">
        <p className="text-[10px] sm:text-xs text-gray-500 order-2 sm:order-1">
          {t("dashboard.activityHeatmap.eachSquareRepresents")}
        </p>
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 order-1 sm:order-2 justify-end">
          <span>{t("dashboard.activityHeatmap.less")}</span>
          <div className="flex gap-0.5 sm:gap-1">
            {[0, 1, 2, 3].map((level) => (
              <div
                key={level}
                style={{
                  ...getActivityColor(level),
                  width: "8px",
                  height: "8px",
                  borderRadius: "1px",
                }}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm"
              />
            ))}
          </div>
          <span>{t("dashboard.activityHeatmap.more")}</span>
        </div>
      </div>
    </div>
  )
}
