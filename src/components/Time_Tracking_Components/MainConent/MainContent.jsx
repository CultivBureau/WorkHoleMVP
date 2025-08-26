import { Clock, ClipboardList, Coffee, BarChart3 } from "lucide-react"
import { useTranslation } from "react-i18next"

const MainContent = () => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  return (
    <div
      className="w-full h-max flex flex-col justify-center items-center"
      style={{
        backgroundColor: "var(--bg-color)",
        direction: isAr ? "rtl" : "ltr",
      }}
    >
      <div className="w-full h-max pb-5 flex flex-col gap-4 justify-center items-center">
        {/* First Row - Current Status & Active Work Time */}
        <div className="w-full h-[105px] flex gap-2 justify-center items-center">
          <div
            className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-between border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.currentStatus")}</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
              {t("mainContent.notClockedIn")}
            </h3>
          </div>
          <div
            className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-between border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.activeWorkTime")}</span>
            <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>0h 0m</h3>
          </div>
        </div>

        {/* Second Row - Today's Progress & Break/Efficiency */}
        <div className="w-full h-[105px] flex gap-2 justify-center items-center">
          <div
            className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-between border"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          >
            <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.todaysProgress")}</span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  {t("mainContent.workHours")}
                </span>
                <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>0h 0m / 8h</span>
              </div>
              <div className="w-full bg-[var(--divider-color)] rounded-full h-2">
                <div className="bg-[var(--accent-color)] h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full flex gap-2 justify-center items-center">
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>0</h3>
              <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.break")}</span>
            </div>
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>92%</h3>
              <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.efficiency")}</span>
            </div>
          </div>
        </div>

        {/* Third Row - Complete/Remaining & Most Productive/Focus Time */}
        <div className="w-full h-[105px] flex gap-2 justify-center items-center">
          <div className="w-1/2 h-full flex gap-2 justify-center items-center">
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>0%</h3>
              <span className="text-[var(--sub-text-color)] text-sm text-center leading-tight">
                {t("mainContent.complete")}
              </span>
            </div>
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>8h 0m</h3>
              <span className="text-[var(--sub-text-color)] text-sm text-center leading-tight">
                {t("mainContent.remaining")}
              </span>
            </div>
          </div>
          <div className="w-1/2 h-full flex gap-2 justify-center items-center">
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[var(--sub-text-color)] text-xs mb-1 text-center leading-tight">
                {t("mainContent.tuesday")}
              </span>
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>7h 45m</h3>
              <span className="text-[var(--sub-text-color)] text-xs text-center leading-tight">
                {t("mainContent.mostProductiveDay")}
              </span>
            </div>
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <span className="text-[var(--sub-text-color)] text-xs mb-1 text-center leading-tight">
                {t("mainContent.thisWeek")}
              </span>
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>1h 8m</h3>
              <span className="text-[var(--sub-text-color)] text-xs text-center leading-tight">
                {t("mainContent.focusTime")}
              </span>
            </div>
          </div>
        </div>

        {/* Start Your Day Button */}
        <div className="w-full h-max pb-2 pt-2 flex justify-center items-center">
          <button
            className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-3"
            style={{
              background: `linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)`,
            }}
          >
            <Clock className="w-6 h-6" />
            {t("mainContent.startYourDay")}
          </button>
        </div>
      </div>

      {/* Bottom Cards - Attendance Logs & Break Tracking */}
      <div className="w-full h-max flex gap-5 justify-center items-center">
        <div
          className="w-1/2 h-full rounded-[17px] p-6 shadow-lg flex flex-col items-center gap-4 border"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-[var(--accent-color)]" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>
              {t("mainContent.attendanceLogs")}
            </h3>
            <p className="text-[var(--sub-text-color)] text-sm mb-4">
              {t("mainContent.attendanceLogsDesc")}
            </p>
          </div>
          <button
            className="w-full text-white text-[14px] font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)`,
            }}
          >
            <BarChart3 className="w-5 h-5" />
            {t("mainContent.viewAttendanceLogs")}
          </button>
        </div>
        <div
          className="w-1/2 h-full rounded-[17px] shadow-lg p-6 flex flex-col items-center gap-4 border"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
            <Coffee className="w-8 h-8 text-[var(--accent-color)]" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-color)" }}>
              {t("mainContent.breakTracking")}
            </h3>
            <p className="text-[var(--sub-text-color)] text-sm mb-4">
              {t("mainContent.breakTrackingDesc")}
            </p>
          </div>
          <button
            className="w-full text-white text-[14px] font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%)`,
            }}
          >
            <BarChart3 className="w-5 h-5" />
            {t("mainContent.viewBreakLogs")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainContent
