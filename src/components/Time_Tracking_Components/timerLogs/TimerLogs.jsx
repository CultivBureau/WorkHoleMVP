import { Eye } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGetTimerLogsQuery } from "../../../services/apis/TimerApi"
import React, { useState, useEffect } from "react"

export function TimeFocusLogs({ refreshTrigger }) {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"
  const { data: logs = [], isLoading, refetch } = useGetTimerLogsQuery()
  const [showModal, setShowModal] = useState(false)

  // Refetch logs when refreshTrigger changes (pass a value from parent after timer actions)
  useEffect(() => {
    refetch()
  }, [refreshTrigger, showModal])

  const localizeMin = (duration) => (isAr ? duration.replace("min", "دقيقة") : duration)

  // Format duration from seconds/minutes
  const formatDuration = (timer) => {
    if (timer.actualDurationSeconds)
      return `${String(Math.floor(timer.actualDurationSeconds / 60)).padStart(2, "0")}:${String(
        timer.actualDurationSeconds % 60
      ).padStart(2, "0")} min`
    if (timer.actualDuration) return `${String(timer.actualDuration).padStart(2, "0")}:00 min`
    return `${String(timer.duration).padStart(2, "0")}:00 min`
  }

  // Format time
  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Main logs (show only 3)
  const mainLogs = logs.slice(0, 3)

  return (
    <>
      <div
        className="bg-[var(--bg-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]"
        style={{ direction: isAr ? "rtl" : "ltr" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal" style={{ color: "var(--text-color)" }}>
            {t("timerLogs.title")}
          </h1>
          <button
            className="flex items-center gap-2 text-[var(--accent-color)] border border-[var(--border-color)] bg-[var(--bg-color)] px-4 py-2 rounded-xl font-medium text-sm transition-colors hover:bg-[var(--hover-color)]"
            onClick={() => setShowModal(true)}
          >
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
          {(isLoading ? [] : mainLogs).map((log, idx) => (
            <div
              key={log._id}
              className={`grid grid-cols-3 gap-4 items-center py-3 ${
                idx !== mainLogs.length - 1 ? "border-b border-[var(--divider-color)]" : ""
              }`}
            >
              <div className="text-[var(--sub-text-color)] text-sm">{formatTime(log.startTime)}</div>
              <div className="text-[var(--text-color)] text-sm font-medium">
                {localizeMin(formatDuration(log))}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#F5F5F5] px-3 py-1 rounded-lg text-xs" style={{ color: "var(--text-color)" }}>
                  {log.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[var(--bg-color)] bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{t("timerLogs.title")}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 font-bold text-lg"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4 pb-3 border-b border-[var(--divider-color)]">
              <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.time")}</div>
              <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.duration")}</div>
              <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.tag")}</div>
              <div className="text-[var(--sub-text-color)] text-sm font-medium">{t("timerLogs.status") || "Status"}</div>
            </div>
            <div className="space-y-4">
              {(isLoading ? [] : logs).map((log, idx) => (
                <div
                  key={log._id}
                  className={`grid grid-cols-4 gap-4 items-center py-3 ${
                    idx !== logs.length - 1 ? "border-b border-[var(--divider-color)]" : ""
                  }`}
                >
                  <div className="text-[var(--sub-text-color)] text-sm">{formatTime(log.startTime)}</div>
                  <div className="text-[var(--text-color)] text-sm font-medium">
                    {localizeMin(formatDuration(log))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#F5F5F5] px-3 py-1 rounded-lg text-xs" style={{ color: "var(--text-color)" }}>
                      {log.tag}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    {log.status === "completed"
                      ? t("timerLogs.completed") || "Completed"
                      : log.status === "cancelled"
                      ? t("timerLogs.cancelled") || "Cancelled"
                      : log.status === "paused"
                      ? t("timerLogs.paused") || "Paused"
                      : log.status === "running"
                      ? t("timerLogs.running") || "Running"
                      : log.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TimeFocusLogs
