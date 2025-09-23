import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DempChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
    { department: "Operations", efficiency: 80 }
  ];

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Get CSS variables for dynamic colors
    const rootStyles = getComputedStyle(document.documentElement);
    const chartBarColor = rootStyles.getPropertyValue('--accent-color').trim() || '#15919B';
    const chartBgColor = rootStyles.getPropertyValue('--bg-color').trim() || '#fff';
    const chartGridColor = rootStyles.getPropertyValue('--border-color').trim() || '#E0FFFD';
    const chartLabelColor = rootStyles.getPropertyValue('--sub-text-color').trim() || '#6b7280';

    chartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: DepartmentData.map(item => item.department.toUpperCase()),
        datasets: [{
          data: DepartmentData.map(item => item.efficiency),
          backgroundColor: chartBarColor,
          borderColor: chartBarColor,
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: chartBgColor,
            titleColor: '#333',
            bodyColor: '#333',
            borderColor: chartGridColor,
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return `${context.parsed.y}% efficiency`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: chartLabelColor,
              font: {
                size: 10,
                family: 'Poppins',
                weight: '400'
              },
              maxRotation: 0,
              minRotation: 0,
              padding: 8,
              align: 'center'
            },
            border: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: chartGridColor,
              borderDash: [2, 2]
            },
            ticks: {
              color: chartLabelColor,
              font: {
                size: 12,
                family: 'Poppins'
              },
              callback: function(value) {
                return value + '%';
              },
              stepSize: 20
            },
            border: {
              display: false
            }
          }
        },
        layout: {
          padding: {
            top: 20,
            right: 20,
            bottom: 30,
            left: 20
          }
        },
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-[500px] flex bg-[var(--bg-color)]">
      <div className="w-[70%] h-full bg-[var(--chart-bg)] p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-color)] mb-1">
                Department KPI Overview users
              </h2>
              <p className="text-sm text-[var(--sub-text-color)]">
                Average KPI score per department
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-[var(--sub-text-color)] hover:text-[var(--text-color)] transition-colors">
                Quarter
              </button>
              <button className="px-4 py-2 text-sm text-[var(--sub-text-color)] hover:text-[var(--text-color)] transition-colors">
                Semester
              </button>
              <button className="px-4 py-2 text-sm bg-[var(--accent-color)] text-white rounded-lg">
                Annual
              </button>
            </div>
          </div>
        </div>
        
        


        {/* Chart Container */}
        <div className="h-[calc(100%-120px)]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      
      <div className="w-[30%] h-full bg-[var(--container-color)] rounded-lg ml-4">
        {/* Right sidebar content */}
      </div>
    </div>
  );
};

export default DempChart;