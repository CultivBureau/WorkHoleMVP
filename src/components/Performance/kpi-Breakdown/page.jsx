import React, { useState } from 'react'
import { useLang } from '../../../contexts/LangContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useTranslation } from "react-i18next";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChevronDown } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const KpiBreakdown = () => {
    const { isRtl } = useLang();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [selectedPeriod, setSelectedPeriod] = useState('Over Year');

    const data = [
        {
            id: 1,
            title: isRtl ? 'المهام' : 'Tasks',
            percentage: 70,
            color: '#15919B',
            description: isRtl ? 'المهام المكتملة بنجاح' : 'Successfully completed tasks'
        },
        {
            id: 2,
            title: isRtl ? 'العمل الجماعي' : 'Teamwork',
            percentage: 15,
            color: '#81F5EE',
            description: isRtl ? 'التعاون مع الفريق' : 'Team collaboration efforts'
        },
        {
            id: 3,
            title: isRtl ? 'المهام المتأخرة' : 'Task overdue',
            percentage: 15,
            color: '#D4D4D4',
            description: isRtl ? 'المهام غير المكتملة' : 'Incomplete or delayed tasks'
        }
    ];

    const chartData = {
        labels: data.map(item => item.title),
        datasets: [
            {
                data: data.map(item => item.percentage),
                backgroundColor: data.map(item => item.color),
                hoverBackgroundColor: data.map(item => item.color + 'CC'), // Add transparency on hover
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff',
                cutout: '65%',
                hoverOffset: 10, // Move segment outward on hover
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                titleColor: theme === 'dark' ? '#f9fafb' : '#1f2937',
                bodyColor: theme === 'dark' ? '#f9fafb' : '#1f2937',
                borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 10,
                position: 'average', // Position tooltip at average position
                yAlign: 'bottom', // Always show tooltip below the chart segment
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.parsed}%`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 0,
                hoverBorderWidth: 2,
                hoverBorderColor: '#ffffff',
            }
        },
        onHover: (event, activeElements) => {
            event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        }
    };

    const totalTasks = 120;

    return (
        <div className='w-[254px] h-max min-h-[378px] pb-5 pt-5 rounded-[22px] border border-[var(--border-color)] flex flex-col justify-center items-center gap-5 pl-2 pr-2 '>
          {/* header */}
              <div className='w-full h-max flex justify-center items-center '>
                    <div className='w-[70%] h-max flex flex-col justify-center items-center'>
                            <h1 className='w-full h-max text-[13px] text-start text-[var(--text-color)] font-bold'>My KPI Breakdown</h1>
                            <h2 className='w-full h-max text-[10px] text-start text-[var(--sub-text-color)] font-normal'>See how your score is distributed across criteria</h2>
                    </div>
                        <div className='w-[30%] h-max flex justify-center items- pb-7'>
                                <button className='w-[100%] h-[22px] text-[8px] rounded-[9px] bg-[#D4D4D4] border border-[var(--border-color)] flex justify-center items-center shadow-2xl  text-[var(--sub-text-color)] font-medium'>Over Year</button>
                        </div>
              </div>
              {/* chart */}
              <div className='w-full h-max relative'>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Doughnut data={chartData} options={chartOptions} />
                </div>
                {/* Center text overlay */}
                <div 
                    className='absolute inset-0 flex flex-col justify-center items-center pointer-events-none'
                    style={{ zIndex: 0 }}
                >
                    <div className='text-center pointer-events-none'>
                        <div className='text-[24px] font-bold text-[var(--text-color)]'>{totalTasks}</div>
                        <div className='text-[10px] text-[var(--sub-text-color)] font-normal'>Total Tasks</div>
                    </div>
                </div>
              </div>
              <div className='w-full flex justify-center  flex-col items-center h-max gap-2'>
                {data.map((item) => (
                  <div key={item.id} className='w-full h-max flex justify-center items-center'>
                     <div className='w-full h-max flex justify-center items-center pl-3 pr-3 gap-3'>
                        {/* color of chart */}
                        <div className='w-[10px] h-[7px] rounded-[12px]' style={{ backgroundColor: item.color }}></div>
                        {/* title of chart */}
                        <h2 className='w-full h-max text-[13px] flex justify-between items-center text-[var(--text-color)] font-bold'>{item.title} <span className='text-[10px] text-[var(--sub-text-color)] font-normal'>{item.percentage}%</span></h2>

                     </div>
                  </div>
                ))}
              </div>
        </div>
    );
};

export default KpiBreakdown;