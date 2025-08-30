"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useGetDashboardQuery } from "../../../services/apis/AtteandanceApi"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const filterOptions = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
]

// Use the same bar color for both light and dark mode, but get from CSS variable for live theme update
const getCssVar = (name, fallback) => {
  if (typeof window === "undefined") return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(name)?.trim() || fallback
}

const WorkHoursCharts = () => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  // Filter state for week/month
  const [filter, setFilter] = useState("week")
  const { data, isLoading } = useGetDashboardQuery({ filter })

  // Theme reactivity: update chart colors when theme changes
  const [chartColors, setChartColors] = useState({
    chartBarColor: getCssVar('--chart-bar', '#5EC6C6'),
    chartLabelColor: getCssVar('--chart-label', '#B0B0B0'),
    chartGridColor: getCssVar('--chart-grid', '#E0FFFD'),
    chartBg: getCssVar('--chart-bg', '#fff'),
    chartBorder: getCssVar('--chart-border', '#E0FFFD'),
  })

  useEffect(() => {
    const updateColors = () => {
      setChartColors({
        chartBarColor: getCssVar('--chart-bar', '#5EC6C6'),
        chartLabelColor: getCssVar('--chart-label', '#B0B0B0'),
        chartGridColor: getCssVar('--chart-grid', '#E0FFFD'),
        chartBg: getCssVar('--chart-bg', '#fff'),
        chartBorder: getCssVar('--chart-border', '#E0FFFD'),
      })
    }

    // Listen for theme changes (class or attribute changes on <html> or <body>)
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] })

    // Also update on mount
    updateColors()

    return () => observer.disconnect()
  }, [])

  // استخدم workHoursChart مباشرة من الريسبونس
  const workHoursChart = data?.workHoursChart || []

  // عرف chartData ليكون نفس workHoursChart
  const chartData = workHoursChart
  const dayLabels = chartData.map((item) => item.label)

  // Calculate maximum hours for scale
  const maxHours = Math.max(8, ...chartData.map((d) => d.hours))

  // Chart.js data configuration
  const chartJsData = {
    labels: dayLabels,
    datasets: [
      {
        label: t("mainContent.workHours"),
        data: chartData.map((item) => item.hours),
        backgroundColor: chartColors.chartBarColor,
        borderRadius: 16,
        barThickness: 32,
      },
    ],
  }

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}h`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.ceil(maxHours),
        ticks: {
          stepSize: Math.ceil(maxHours / 4),
          color: chartColors.chartLabelColor,
          font: {
            size: 12,
          },
        },
        grid: {
          color: chartColors.chartGridColor,
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: chartColors.chartLabelColor,
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div
      className="rounded-2xl p-6 shadow-lg border"
      style={{
        direction: isAr ? "rtl" : "ltr",
        background: chartColors.chartBg,
        borderColor: chartColors.chartBorder,
      }}
    >
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-color)" }}>
          {t("mainContent.workHours")}
        </h2>
        <div className="relative flex items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full px-5 py-2 pr-10 text-sm font-semibold appearance-none focus:outline-none transition-all duration-200 hover:scale-105"
            style={{
              minWidth: 120,
              background: chartColors.chartBarColor,
              color: "#222",
              border: "none",
              direction: isAr ? "rtl" : "ltr"
            }}
          >
            {(isAr ? [...filterOptions].reverse() : filterOptions).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 transform -translate-y-1/2 w-4 h-4`}
            style={{ color: "#222" }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-600">Loading...</span>
          </div>
        ) : (
          <Bar data={chartJsData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}

export default WorkHoursCharts