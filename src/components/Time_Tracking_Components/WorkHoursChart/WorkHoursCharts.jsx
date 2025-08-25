"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"

const WorkHoursCharts = () => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  const workHoursData = {
    lastWeek: [7.2, 7.8, 8.5, 6.9, 6.2],
    thisWeek: [6.5, 8.2, 7.9, 8.1, 7.3],
    lastMonth: [7.0, 7.5, 8.0, 7.2, 6.8],
  }

  const filterOptions = [
    { value: "lastWeek", label: t("breakStats.period.lastWeek") },
    { value: "thisWeek", label: t("breakStats.period.thisWeek") },
    { value: "lastMonth", label: t("breakStats.period.lastMonth") },
  ]

  // Days labels from translation file
  const dayLabels = [
    t("navbar.days.0"),
    t("navbar.days.1"),
    t("navbar.days.2"),
    t("navbar.days.3"),
    t("navbar.days.4"),
  ]

  const maxHours = 8
  const [selectedPeriod, setSelectedPeriod] = useState("lastWeek")
  const data = workHoursData[selectedPeriod]

  return (
    <div
      className="bg-[var(--bg-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]"
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-normal" style={{ color: "var(--text-color)" }}>
          {t("mainContent.workHours")}
        </h2>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-teal-100 border-none rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-black cursor-pointer outline-none"
            style={{
              backgroundColor: "var(--hover-color)",
              color: "var(--text-color)",
              direction: isAr ? "rtl" : "ltr",
            }}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-[var(--sub-text-color)] pr-4">
          <span>8</span>
          <span>6</span>
          <span>4</span>
          <span>2</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-8 right-0 top-0 h-full flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px bg-[var(--divider-color)] w-full" style={{ opacity: i === 0 ? 0 : 1 }} />
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end justify-between px-4">
          {data.map((hours, index) => {
            const height = (hours / maxHours) * 100
            const isHighest = hours === Math.max(...data)

            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-16">
                {/* Bar */}
                <div
                  className={`w-6 rounded-full mb-4 transition-all duration-300 ${
                    isHighest ? "bg-[var(--accent-color)]" : "bg-[var(--hover-color)]"
                  }`}
                  style={{ height: `${height}%` }}
                />

                {/* Day label */}
                <span className="text-sm font-medium" style={{ color: "var(--text-color)" }}>
                  {dayLabels[index]}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WorkHoursCharts
