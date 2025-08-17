"use client"
import { useTranslation } from "react-i18next";

export default function ActivityHeatmap() {
  const { t } = useTranslation();

  // Generate heatmap data (52 weeks * 7 days = 364 days)
  const generateHeatmapData = () => {
    const data = []
    for (let week = 0; week < 52; week++) {
      for (let day = 0; day < 7; day++) {
        // Random activity level (0-4)
        const activity = Math.floor(Math.random() * 5)
        data.push(activity)
      }
    }
    return data
  }

  const heatmapData = generateHeatmapData()

  // Use GitHub-like colors
  const getActivityColor = (level) => {
    const colors = [
      "#ECFDFC",
      "#CBFBF9",
      "#97DBD9",
      "#09B2A9"
    ]
    return { backgroundColor: colors[level] || colors[0] }
  }

  // Add translated week days
  const weekDays = t("dashboard.activityHeatmap.weekDays", {
    returnObjects: true,
    defaultValue: ["sat", "sun", "mon", "tue", "wed", "thu", "fri"],
  });

  return (
    <div
      className="w-full bg-white rounded-lg shadow-sm border border-gray-100"
      style={{
        padding: "24px 20px 16px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Month Labels */}
      <div
        className="grid grid-cols-12 text-xs ml-10 text-gray-400 mb-3"
        style={{
          fontSize: "11px",
          fontWeight: "500",
          marginLeft: "20px",
        }}
      >
        {t("dashboard.activityHeatmap.months", { returnObjects: true }).map((month, index) => (
          <span key={index} className="text-left">
            {month}
          </span>
        ))}
      </div>

      {/* Days Labels + Heatmap Grid */}
      <div className="flex items-start" style={{ gap: "8px" }}>
        {/* Days of week labels */}
        <div
          className="flex flex-col px-6 text-xs text-gray-400"
          style={{
            fontSize: "9px",
            fontWeight: "500",
            height: "105px",
            justifyContent: "space-around",
            width: "12px",
            flexShrink: 0,
          }}
        >
          {weekDays.map((day, idx) => (
            <span key={idx}>{day}</span>
          ))}
        </div>

        {/* Heatmap Grid Container */}
        <div className="flex-1">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(52, 1fr)",
              gridTemplateRows: "repeat(7, 1fr)",
              gap: "2px",
              height: "105px",
              width: "100%",
            }}
          >
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                style={{
                  ...getActivityColor(day),
                  borderRadius: "2px",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
                className="hover:ring-2 hover:ring-gray-300 hover:ring-opacity-50"
                title={`${day} contributions`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
        <p className="text-xs text-gray-500 order-2 sm:order-1">
          {t("dashboard.activityHeatmap.eachSquareRepresents")}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 order-1 sm:order-2 justify-end">
          <span>{t("dashboard.activityHeatmap.less")}</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((level) => (
              <div
                key={level}
                style={{
                  ...getActivityColor(level),
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
          <span>{t("dashboard.activityHeatmap.more")}</span>
        </div>
      </div>
    </div>
  )
}
