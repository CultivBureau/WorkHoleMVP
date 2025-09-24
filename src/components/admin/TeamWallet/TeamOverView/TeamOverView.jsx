import React, { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Only one departments and departmentData definition!
const departments = [
  "Design Department",
  "Development Department",
  "Marketing Department"
]
const departmentData = {
  "Design Department": {
    best: [
      { team: "UX Team", amount: "$0", description: "This team has no penalties or warnings" },
      { team: "Product Team", amount: "$0", description: "Excellent compliance record" },
      { team: "Research Team", amount: "$50", description: "Minor warnings only" }
    ],
    attention: [
      { team: "Branding Team", amount: "$8,000", description: "High penalties recorded this month" },
      { team: "Ui Team", amount: "$7,500", description: "High penalties recorded this month" },
      { team: "Motion Graphics", amount: "$12,000", description: "Critical attention required" }
    ]
  },
  "Development Department": {
    best: [
      { team: "Backend Team", amount: "$0", description: "No penalties or warnings" },
      { team: "DevOps Team", amount: "$0", description: "Excellent compliance record" }
    ],
    attention: [
      { team: "Frontend Team", amount: "$6,000", description: "High penalties recorded this month" },
      { team: "API Team", amount: "$5,500", description: "High penalties recorded this month" }
    ]
  },
  "Marketing Department": {
    best: [
      { team: "Content Team", amount: "$0", description: "No penalties or warnings" },
      { team: "Social Team", amount: "$0", description: "Excellent compliance record" }
    ],
    attention: [
      { team: "Ads Team", amount: "$9,000", description: "High penalties recorded this month" },
      { team: "SEO Team", amount: "$4,500", description: "High penalties recorded this month" }
    ]
  }
}

const TeamOverView = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [activeFilter, setActiveFilter] = useState("Annual")
  const [hoveredBar, setHoveredBar] = useState(null)
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showBestPopup, setShowBestPopup] = useState(false);
  const [showAttentionPopup, setShowAttentionPopup] = useState(false);

  const KeyInsights = [
    {
      status: "Best Performing",
      department: "Development",
      desc: "Highest average KPI this period",
      efficiency: "90%",
    },
    { 
      status: "Needs Attention", 
      department: "Sales", 
      desc: "Below average KPI this period", 
      efficiency: "60%" 
    },
  ]
  
  // Dynamic data structure with different periods
  const chartData = {
    Monthly: [
      { name: "UX TEAM", value: 12000 },
      { name: "UI TEAM", value: 6500 },
      { name: "BRANDING TEAM", value: 18000 },
      { name: "GRAPHIC TEAM", value: 14500 },
      { name: "DESIGN", value: 3800 },
      { name: "MOTION GRAPHICS", value: 32000 },
      { name: "DESIGN TEAM", value: 19500 },
    ],
    Quarter: [
      { name: "UX TEAM", value: 22000 },
      { name: "UI TEAM", value: 7800 },
      { name: "BRANDING TEAM", value: 22000 },
      { name: "GRAPHIC TEAM", value: 16200 },
      { name: "DESIGN", value: 4500 },
      { name: "MOTION GRAPHICS", value: 38500 },
      { name: "DESIGN TEAM", value: 23000 },
    ],
    Annual: [
      { name: "UX TEAM", value: 30000 },
      { name: "UI TEAM", value: 8500 },
      { name: "BRANDING TEAM", value: 25000 },
      { name: "GRAPHIC TEAM", value: 17500 },
      { name: "DESIGN", value: 5000 },
      { name: "MOTION GRAPHICS", value: 45433 },
      { name: "DESIGN TEAM", value: 25500 },
    ]
  }

  // Get current data based on active filter
  const currentData = chartData[activeFilter] || chartData.Annual
  
  // Find the team with highest value for highlighting
  const maxValue = Math.max(...currentData.map(item => item.value))

  // Calculate dynamic max for Y-axis
  const dynamicMax = Math.ceil(maxValue / 10000) * 10000 + 10000

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d")
    if (!ctx) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Single color for all bars
    const barColor = "#D10909"

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: currentData.map((item) => item.name),
        datasets: [
          {
            data: currentData.map((item) => item.value),
            backgroundColor: barColor, // Single color for all bars
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 2,
            borderSkipped: false,
            barThickness: 10,
            maxBarThickness: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 400,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: (context) => {
              const tooltip = context.tooltip
              let tooltipEl = document.getElementById("penalty-tooltip")

              if (!tooltipEl) {
                tooltipEl = document.createElement("div")
                tooltipEl.id = "penalty-tooltip"
                document.body.appendChild(tooltipEl)
              }

              if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = "0"
                return
              }

              if (tooltip.body) {
                const dataIndex = tooltip.dataPoints[0].dataIndex
                const value = currentData[dataIndex].value
                const teamName = currentData[dataIndex].name

                const innerHtml = `
                  <div style="
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: 12px;
                    padding: 12px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 13px;
                    color: #374151;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    border: 1px solid rgba(209, 9, 9, 0.1);
                    backdrop-filter: blur(10px);
                    max-width: 200px;
                  ">
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      margin-bottom: 4px;
                    ">
                      <div style="
                        width: 12px;
                        height: 12px;
                        background: #D10909;
                        border-radius: 50%;
                        flex-shrink: 0;
                      "></div>
                      <span style="font-weight: 600; color: #1F2937;">${teamName}</span>
                    </div>
                    <div style="
                      font-size: 16px;
                      font-weight: 700;
                      color: #D10909;
                    ">
                      $${value.toLocaleString()}
                    </div>
                    <div style="
                      font-size: 11px;
                      color: #6B7280;
                    ">
                      Total penalties (${activeFilter})
                    </div>
                  </div>
                `

                tooltipEl.innerHTML = innerHtml
              }

              const position = context.chart.canvas.getBoundingClientRect()
              tooltipEl.style.opacity = "1"
              tooltipEl.style.position = "absolute"
              tooltipEl.style.left = position.left + window.pageXOffset + tooltip.caretX - 100 + "px"
              tooltipEl.style.top = position.top + window.pageYOffset + tooltip.caretY - 80 + "px"
              tooltipEl.style.pointerEvents = "none"
              tooltipEl.style.zIndex = "1000"
              tooltipEl.style.transition = "all 0.2s ease"
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
                size: 9,
                family: "system-ui, -apple-system, sans-serif",
                weight: "500",
              },
              maxRotation: 45, // Diagonal labels for responsiveness
              minRotation: 45,
              padding: 4,
              autoSkip: false,
              display: true,
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: dynamicMax,
            grid: {
              color: "#F3F4F6",
              borderDash: [3, 3],
              drawOnChartArea: true,
              drawTicks: false,
            },
            ticks: {
              color: "#6B7280",
              font: {
                size: 11,
                family: "system-ui, -apple-system, sans-serif",
                weight: "400",
              },
              callback: (value) => {
                if (value >= 1000) {
                  return value / 1000 + "k"
                }
                return value
              },
              stepSize: 10000,
              padding: 12,
            },
            border: {
              display: false,
            },
          },
        },
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 25, // Less bottom padding for less white space
            left: 20,
          },
        },
        elements: {
          bar: {
            borderRadius: 6,
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
  }, [activeFilter, currentData, maxValue, dynamicMax])

  const filters = ["Monthly", "Quarter", "Annual"]

  return (
    <div className='w-full h-max flex flex-col xl:flex-row bg-gray-50 gap-2 xl:gap-0'>
      {/* Chart Section */}
      <div className='w-full xl:w-[65%] h-full bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-2xl xl:rounded-l-2xl xl:rounded-r-none '>
        <div className="w-full h-full">
          {/* Header */}
          <div className="mb-4 lg:mb-6">
            {/* Title and Filter Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-1">
                <h2 className="text-sm lg:text-[14px] font-bold text-[var(--text-color)] text-start mb-2">Team Penalties Overview</h2>
                <p className="text-[8px] lg:text-[9px] text-[var(--sub-text-color)] text-start">Shows total penalties for each team in this department</p>
              </div>
              
              {/* Filter Buttons */}
              <div className="inline-flex bg-[var(--container-color)] rounded-xl p-1 shrink-0">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeFilter === filter
                        ? "bg-[#5CBCC9] text-white shadow-sm"
                        : "text-[var(--sub-text-color)] hover:text-[var(--text-color)] hover:bg-[var(--container-color)]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full h-[280px] sm:h-[300px] lg:h-[320px] xl:h-[320px] relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Right Section - Responsive Department Details */}
      <div className="w-full xl:w-[35%] h-auto xl:h-[452px] pt-3 xl:pt-6 flex flex-col justify-start items-center bg-white p-3 gap-2 rounded-2xl xl:rounded-r-2xl xl:rounded-l-none">
        {/* Department Dropdown */}
        <div className="relative w-full mb-2">
          <button
            onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
            className="w-full h-8 sm:h-10 lg:h-8 px-2 lg:px-3 bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-[22px] text-teal-600 flex justify-center items-center gap-2 font-semibold shadow-sm text-xs"
          >
            <div className="w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <span className="text-xs font-bold flex-1 text-left truncate">{selectedDepartment}</span>
            <svg className={`w-3 h-3 text-teal-500 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {showDepartmentDropdown && (
            <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDepartment(dept)
                    setShowDepartmentDropdown(false)
                  }}
                  className="w-full px-2 py-2 text-left text-xs text-[var(--sub-text-color)] hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Best Compliance Team Section */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-full h-8 sm:h-10 lg:h-[40px] bg-gradient-to-r from-gray-50 to-gray-100 rounded-[22px] flex items-center gap-2 px-2 border border-gray-200 text-xs"
              disabled
            >
              <img src="/assets/AdminTeamWallet/best.svg" alt="" className="w-4 h-4" />
              <span className="text-xs font-semibold text-teal-500 flex-1 text-left">Best Compliance Team</span>
            </button>
            <button
              onClick={() => setShowBestPopup(true)}
              className="text-[10px] text-teal-500 px-1 py-0.5 mt-2 rounded hover:bg-teal-50 border border-teal-100"
            >
              View All
            </button>
          </div>
          {/* Show only one team */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="w-full bg-white rounded-[22px] p-2 border border-gray-200 flex items-center gap-2">
              <div className="w-auto p-2 h-8 bg-teal-50 flex justify-center items-center rounded-lg">
                <span className="text-xs font-bold text-teal-600">{departmentData[selectedDepartment].best[0].amount}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-xs mb-0.5 truncate">{departmentData[selectedDepartment].best[0].team}</h4>
                <p className="text-gray-500 text-[9px] line-clamp-2">{departmentData[selectedDepartment].best[0].description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Needs Attention Section */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col items-center gap-1">
            <button
              className="w-full h-8 sm:h-10 lg:h-[40px] bg-gradient-to-r from-gray-50 to-gray-100 rounded-[22px] flex items-center gap-2 px-2 border border-gray-200 text-xs"
              disabled
            >
              <img src="/assets/AdminTeamWallet/need.svg" alt="" className="w-4 h-4" />
              <span className="text-xs font-semibold text-[var(--sub-text-color)] flex-1 text-left">Needs Attention</span>
            </button>
            <button
              onClick={() => setShowAttentionPopup(true)}
              className="text-[10px] text-red-500 px-1 py-0.5 mt-2 rounded hover:bg-red-50 border border-red-100"
            >
              View All
            </button>
          </div>
          {/* Show two teams */}
          <div className="flex flex-col gap-1 mt-1">
            {departmentData[selectedDepartment].attention.slice(0, 2).map((item, idx) => (
              <div key={idx} className="w-full bg-white rounded-xl p-2 border border-gray-200 flex items-center gap-2">
                <div className="w-auto p-2 h-8 bg-red-50 flex justify-center items-center rounded-lg">
                  <span className="text-xs font-bold text-red-600">{item.amount}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-xs mb-0.5 truncate">{item.team}</h4>
                  <p className="text-gray-500 text-[9px] line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popup for Best Compliance Team */}
        {showBestPopup && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-teal-600">All Best Compliance Teams</h3>
                <button onClick={() => setShowBestPopup(false)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
              </div>
              <div className="flex flex-col gap-2">
                {departmentData[selectedDepartment].best.map((item, idx) => (
                  <div key={idx} className="w-full bg-white rounded-xl p-2 border border-gray-200 flex items-center gap-2">
                    <div className="w-auto p-2 h-8 bg-teal-50 flex justify-center items-center rounded-lg">
                      <span className="text-xs font-bold text-teal-600">{item.amount}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-xs mb-0.5">{item.team}</h4>
                      <p className="text-gray-500 text-[9px]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Popup for Needs Attention */}
        {showAttentionPopup && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-red-600">All Needs Attention Teams</h3>
                <button onClick={() => setShowAttentionPopup(false)} className="text-gray-400 hover:text-gray-700 text-lg">&times;</button>
              </div>
              <div className="flex flex-col gap-2">
                {departmentData[selectedDepartment].attention.map((item, idx) => (
                  <div key={idx} className="w-full bg-white rounded-xl p-2 border border-gray-200 flex items-center gap-2">
                    <div className="w-auto p-2 h-8 bg-red-50 flex justify-center items-center rounded-lg">
                      <span className="text-xs font-bold text-red-600">{item.amount}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-xs mb-0.5">{item.team}</h4>
                      <p className="text-gray-500 text-[9px]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeamOverView
