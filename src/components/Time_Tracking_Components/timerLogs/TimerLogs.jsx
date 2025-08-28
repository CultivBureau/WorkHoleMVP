import { useState, useEffect } from "react"
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

  // Theme reactivity for tag colors
  const getTagColors = () => {
    const theme = document.documentElement.getAttribute("data-theme") || "light"
    const isDark = theme === "dark"
    return {
      tagBg: isDark ? "#232b32" : "#F5F5F5",
      tagText: isDark ? "#E6F4F4" : "var(--text-color)",
    }
  }

  const [tagColors, setTagColors] = useState(getTagColors())

  useEffect(() => {
    const updateColors = () => setTagColors(getTagColors())
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    updateColors()
    return () => observer.disconnect()
  }, [])

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
          <Eye className="w-5 h-5" style={{ color: "var(--sub-text-color)" }} />
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
            className={`grid grid-cols-3 gap-4 items-center py-3 ${idx !== mockLogs.length - 1 ? "border-b border-[var(--divider-color)]" : ""
              }`}
          >
            <div className="text-[var(--sub-text-color)] text-sm">{log.time}</div>
            <div className="text-[var(--text-color)] text-sm font-medium">
              {localizeMin(log.duration)}
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-lg text-xs"
                style={{
                  background: tagColors.tagBg,
                  color: tagColors.tagText,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
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
