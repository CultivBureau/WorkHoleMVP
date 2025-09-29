"use client"
import { useEffect, useRef, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useTranslation } from "react-i18next"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const TopTeamChart = () => {
  const { t } = useTranslation()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [activeFilter, setActiveFilter] = useState(t("adminTeamWallet.periods.annual"))

  // Sample data matching your teams
  const data = [
    {
      name: "UX TEAM",
      value: 17000,
      date: "2024-01-01",
    },
    {
      name: "UI TEAM",
      value: 8500,
      date: "2024-01-01",
    },
    {
      name: "BRANDING TEAM",
      value: 45433,
      date: "2024-01-01",
    },
    {
      name: "GRAPHIC TEAM",
      value: 18200,
      date: "2024-01-01",
    },
  ]

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d")
    if (!ctx) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const accentColor = "#5CBCC9" // Teal color from image
    const lightAccentColor = "#B8E6EA" // Light teal for other bars
    const textColor = "#374151"
    const subTextColor = "#9CA3AF"
    const borderColor = "#E5E7EB"

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: data.map((item) => item.name),
        datasets: [
          {
            data: data.map((item) => item.value),
            backgroundColor: data.map((item, index) => {
              return item.name === "BRANDING TEAM" ? accentColor : lightAccentColor
            }),
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 10, // Exact 10px width as requested
            maxBarThickness: 10,
            categoryPercentage: 0.6, // Reduce spacing between categories
            barPercentage: 1.0, // Full width within category
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false, // Disable default tooltip
            external: (context) => {
              const tooltip = context.tooltip
              let tooltipEl = document.getElementById("chartjs-tooltip")

              if (!tooltipEl) {
                tooltipEl = document.createElement("div")
                tooltipEl.id = "chartjs-tooltip"
                tooltipEl.innerHTML = "<div></div>"
                document.body.appendChild(tooltipEl)
              }

              if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = "0"
                return
              }

              if (tooltip.body) {
                const dataIndex = tooltip.dataPoints[0].dataIndex
                const value = data[dataIndex].value

                const innerHtml = `
                  <div style="
                    background: #F7FAFC;
                    border-radius: 20px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  ">
                    <div style="
                      width: 16px;
                      height: 16px;
                      background: #5CBCC9;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    ${value.toLocaleString()}
                  </div>
                `

                tooltipEl.innerHTML = innerHtml
              }

              const position = context.chart.canvas.getBoundingClientRect()
              tooltipEl.style.opacity = "1"
              tooltipEl.style.position = "absolute"
              tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX - 40 + "px"
              tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY - 40 + "px"
              tooltipEl.style.pointerEvents = "none"
              tooltipEl.style.zIndex = "1000"
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#6B7280",
              font: {
                size: 11,
                family: "system-ui, -apple-system, sans-serif",
                weight: "500",
              },
              maxRotation: 45,
              minRotation: 45,
              padding: 5, // Reduced padding
              autoSkip: false,
              maxTicksLimit: 4,
              display: true,
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 50000,
            grid: {
              color: "#E5E7EB",
              borderDash: [2, 2],
            },
            ticks: {
              color: subTextColor,
              font: {
                size: 11,
                family: "system-ui, -apple-system, sans-serif",
              },
              callback: (value) => {
                if (value >= 1000) {
                  return value / 1000 + "k"
                }
                return value
              },
              stepSize: 10000,
              padding: 10,
            },
            border: {
              display: false,
            },
          },
        },
        layout: {
          padding: {
            top: 15,
            right: 15,
            bottom: 15, 
            left: 15,
          },
        },
        elements: {
          bar: {
            borderRadius: 4,
            borderSkipped: false,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length > 0 ? "pointer" : "default"
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [activeFilter, t])

  const filters = [t("adminTeamWallet.periods.monthly"), t("adminTeamWallet.periods.quarter"), t("adminTeamWallet.periods.annual")]

  return (
    <div className="w-full h-[460px] bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        {/* Filter Buttons */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-[#5CBCC9] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Title and Description */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t("adminTeamWallet.topChart.title")}</h2>
          <p className="text-sm text-gray-500">{t("adminTeamWallet.topChart.description")}</p>
        </div>
      </div>

      {/* Chart Container - Takes remaining space */}
      <div className="flex-1 relative min-h-0">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default TopTeamChart
