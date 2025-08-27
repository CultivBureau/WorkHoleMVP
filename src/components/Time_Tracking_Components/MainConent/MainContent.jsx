import { Clock, ClipboardList, Coffee, BarChart3 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGetDashboardQuery } from "../../../services/apis/AtteandanceApi"

const MainContent = () => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"
  const { data, isLoading, error } = useGetDashboardQuery({})

  // fallback لو البيانات مش موجودة
  const stats = data || {
    dailyShift: "0h 0m",
    thisWeek: "0h 0m",
    breaksTaken: "0h 0m",
    breaksCount: 0,
    totalOvertime: "0h 0m",
    currentStatus: "Clocked Out",
    activeWorkTime: "0h 0m",
    todayProgress: "0h 0m / 8h",
    efficiency: 0,
    completedShift: 0,
    remainingTime: "0h 0m",
    mostProductiveDay: { day: "-", time: "0h 0m" },
  }

  // حساب النسبة المئوية للتقدم اليومي
  const todayProgressPercent = (() => {
    const [worked, total] = stats.todayProgress?.split("/") || ["0h 0m", "8h"]
    const workedMinutes = parseInt(worked) * 60 + parseInt(worked.split(" ")[1]?.replace("m", "") || "0")
    const totalMinutes = parseInt(total) * 60 + parseInt(total.split(" ")[1]?.replace("m", "") || "0")
    return totalMinutes ? Math.min(100, Math.round((workedMinutes / totalMinutes) * 100)) : 0
  })()

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
              <div className={`w-2 h-2 rounded-full ${stats.currentStatus === "Clocked In" ? "bg-green-500" : "bg-red-500"}`}></div>
            </div>
            <h3 className="text-xl font-semibold" style={{ color: "var(--text-color)" }}>
              {stats.currentStatus === "Clocked In" ? t("mainContent.clockedIn") : t("mainContent.notClockedIn")}
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
            <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>{stats.activeWorkTime}</h3>
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
                <span className="text-sm" style={{ color: "var(--sub-text-color)" }}>{stats.todayProgress}</span>
              </div>
              <div className="w-full bg-[var(--divider-color)] rounded-full h-2">
                <div className="bg-[var(--accent-color)] h-2 rounded-full transition-all duration-500" style={{ width: `${todayProgressPercent}%` }}></div>
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
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>{stats.breaksCount}</h3>
              <span className="text-[var(--sub-text-color)] text-sm">{t("mainContent.break")}</span>
            </div>
            <div
              className="w-1/2 h-full rounded-2xl p-4 flex flex-col justify-center items-center border"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>{stats.efficiency ? `${stats.efficiency}%` : "0%"}</h3>
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
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>{stats.completedShift ? `${stats.completedShift}%` : "0%"}</h3>
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
              <h3 className="text-3xl font-bold" style={{ color: "var(--text-color)" }}>{stats.remainingTime}</h3>
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
                {stats.mostProductiveDay?.day || t("mainContent.tuesday")}
              </span>
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>{stats.mostProductiveDay?.time || "0h 0m"}</h3>
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
              <h3 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>{stats.thisWeek}</h3>
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
