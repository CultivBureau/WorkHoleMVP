import { Eye } from "lucide-react"
import { useTranslation } from "react-i18next"

const mockLogs = [
  {
    id: "1",
    time: "09:30 AM",
    duration: "00:30 min",
    tag: "Will help the team spec",
  },
  {
    id: "2",
    time: "09:30 AM",
    duration: "00:30 min",
    tag: "Will help the team spec",
  },
  {
    id: "3",
    time: "09:30 AM",
    duration: "00:30 min",
    tag: "Will help the team spec",
  },
]

export function TimeFocusLogs() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  // Helper to localize "min" to "دقيقة"
  const localizeMin = (duration) => {
    if (isAr) {
      return duration.replace("min", "دقيقة")
    }
    return duration
  }

  return (
    <div
      className="bg-[var(--bg-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]"
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal" style={{ color: "var(--text-color)" }}>
          {t("timerLogs.title")}
        </h1>
        <button className="flex items-center gap-2 text-[var(--accent-color)] border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-2 rounded-xl font-medium text-sm transition-colors hover:bg-[var(--hover-color)]">
          <Eye className="w-5 h-5" />
          {t("timerLogs.viewLogs")}
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-3 border-b border-[var(--divider-color)]">
        <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.time")}</div>
        <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.duration")}</div>
        <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.tag")}</div>
      </div>

      {/* Log Entries */}
      <div className="space-y-4">
        {mockLogs.map((log, idx) => (
          <div
            key={log.id}
            className={`grid grid-cols-3 gap-4 items-center py-3 ${
              idx !== mockLogs.length - 1 ? "border-b border-[var(--divider-color)]" : ""
            }`}
          >
            <div className="text-[var(--sub-text-color)] text-sm">{log.time}</div>
            <div className="text-[var(--text-color)] text-sm font-medium">
              {localizeMin(log.duration)}
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#F5F5F5] px-3 py-1 rounded-lg text-xs" style={{ color: "var(--text-color)" }}>
                {isAr ? "سيساعد الفريق في المواصفات" : log.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeFocusLogs
