"use client"

import { useState } from "react"
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

const WorkHoursCharts = () => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  // Filter state for week/month
  const [filter, setFilter] = useState("week")
  const { data, isLoading } = useGetDashboardQuery({ filter })

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
        backgroundColor: chartData.map((item) =>
          item.hours === Math.max(...chartData.map((d) => d.hours))
            ? "#75C8CF"
            : "#C0E8EC"
        ),
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
          color: "#666",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#E0E0E0",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: "#333",
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
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      style={{ direction: isAr ? "rtl" : "ltr" }}
    >
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t("mainContent.workHours")}
        </h2>
        <div className="relative flex items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full px-4 py-2 pr-8 text-sm font-medium appearance-none focus:outline-none bg-[#E6F4F4] text-gray-700 hover:bg-[#D1EDED] transition-all duration-200"
            style={{
              minWidth: 120,
              border: "none",
              direction: isAr ? "rtl" : "ltr",
            }}
          >
            {(isAr ? [...filterOptions].reverse() : filterOptions).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute ${isAr ? "left-3" : "right-3"} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700`}
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