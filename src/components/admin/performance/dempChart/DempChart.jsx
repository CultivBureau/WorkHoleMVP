"use client"

import { useEffect, useRef } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend)

const DempChart = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const DepartmentData = [
    { department: "Development", efficiency: 90 },
    { department: "Business", efficiency: 80 },
    { department: "Sales", efficiency: 75 },
    { department: "Marketing", efficiency: 85 },
    { department: "HR", efficiency: 80 },
    { department: "Finance", efficiency: 70 },
    { department: "Support", efficiency: 60 },
    { department: "IT", efficiency: 75 },
    { department: "Admin", efficiency: 80 },
    { department: "R&D", efficiency: 90 },
    { department: "Logistics", efficiency: 70 },
    { department: "Operations", efficiency: 80 },
  ]
  const KeyInsights = [
    {
      status: "Best Performing",
      department: "Development",
      desc: "Highest average KPI this period",
      efficiency: "90%",
    },

    { status: "Needs Attention", department: "Sales", desc: "Below average KPI this period", efficiency: "60%" },
  ]

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d")
    if (!ctx) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const rootStyles = getComputedStyle(document.documentElement)
    const chartBarColor = rootStyles.getPropertyValue("--accent-color").trim() || "#15919B"
    const chartBgColor = rootStyles.getPropertyValue("--bg-color").trim() || "#fff"
    const chartGridColor = rootStyles.getPropertyValue("--border-color").trim() || "#E0FFFD"
    const chartLabelColor = rootStyles.getPropertyValue("--sub-text-color").trim() || "#6b7280"

    chartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: DepartmentData.map((item) => item.department.toUpperCase()),
        datasets: [
          {
            data: DepartmentData.map((item) => item.efficiency),
            backgroundColor: chartBarColor,
            borderColor: chartBarColor,
            borderWidth: 0,
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 8,
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
            backgroundColor: chartBgColor,
            titleColor: "#333",
            bodyColor: "#333",
            borderColor: chartGridColor,
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => context[0].label,
              label: (context) => `${context.parsed.y}% efficiency`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: chartLabelColor,
              font: {
                size: 10,
                family: "Poppins",
                weight: "400",
              },
              maxRotation: 45,
              minRotation: 45,
              padding: 8,
              align: "center",
              autoSkip: false,
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: chartGridColor,
              borderDash: [2, 2],
            },
            ticks: {
              color: chartLabelColor,
              font: {
                size: 12,
                family: "Poppins",
              },
              callback: (value) => value + "%",
              stepSize: 20,
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
            bottom: 30,
            left: 20,
          },
        },
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="w-full h-max pb-5 flex bg-white gap-6">
      <div className="w-[70%] h-full bg-white p-6 rounded-lg border border-gray-100">
        <div className="mb-6 text-start">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Department KPI Overview users</h2>
              <p className="text-sm text-gray-500">Average KPI score per department</p>
            </div>
            <div className="flex gap-1 bg-gray-50 rounded-lg p-1">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md">
                Quarter
              </button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md">
                Semester
              </button>
              <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md font-medium">Annual</button>
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      <div className="w-[30%] h-full flex flex-col justify-start rounded-2xl shadow-lg border border-gray-100 items-center bg-white p-6 gap-6">
        <div className="w-full flex justify-center items-center">
          <button className="w-full h-12 px-4 bg-teal-50 rounded-full text-teal-600 flex justify-center items-center gap-3 font-medium hover:bg-teal-100 transition-colors">
           <img src="/assets/AdminPerformance/btn.svg" alt="" />
            <span className="text-sm">All Department</span>
      
          </button>
        </div>

        <div className="w-full flex flex-col justify-start items-start gap-4">
          <div className="w-full flex justify-between items-center">
            <div className="flex justify-center items-center gap-1 text-start">
              <div className="w-[50%] h-max flex flex-col justify-center items-start text-start">
                <h3 className="text-[15px] font-semibold text-start text-teal-600">Key Insights</h3>
                <span className="text-gray-500 text-[9px]">Quick highlights of team and department performance</span>
              </div>
              <div className="w-[50%] h-max flex justify-center items-center">
                <img src="/assets/AdminPerformance/key.svg" alt="Insights" />
              </div>
            </div>
          </div>

          {/* Render KeyInsights dynamically */}
          {KeyInsights.map((item, idx) => (
            <div key={idx} className="w-full flex flex-col gap-3">
              <button className="w-full h-10 bg-gray-50 rounded-full flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors">
                {/* You can change the icon based on status if you want */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {item.status === "Best Performing" ? (
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <span className="text-sm font-medium">{item.status}</span>
              </button>

              <div className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex justify-center items-center">
                  <span className="text-lg font-bold text-teal-600">{item.efficiency}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.department}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DempChart
