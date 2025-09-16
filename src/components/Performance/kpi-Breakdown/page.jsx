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
                hoverBackgroundColor: data.map(item => item.color + 'CC'),
                borderWidth: 0,
                hoverBorderWidth: 3,
                hoverBorderColor: '#ffffff',
                cutout: '65%',
                hoverOffset: 10,
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
                position: 'average',
                yAlign: 'center',    // <-- aligns tooltip vertically to the bar
                xAlign: 'center', 
                yAlign: 'bottom',
  
            }
        },


    };

    const totalTasks = 120;

    return (
        <div className='w-full h-full min-h-[400px] lg:min-h-[450px] xl:min-h-[495px] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[22px] p-2 sm:p-3 lg:p-4 flex flex-col gap-2 sm:gap-3 lg:gap-4 shadow-sm'>
            {/* Header */}
            <div className='w-full flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3'>
                <div className='flex-1 text-start'>
                    <h1 className='text-[11px] sm:text-[12px] lg:text-[14px] font-semibold text-[var(--text-color)] mb-1'>
                        My KPI Breakdown
                    </h1>
                    <p className='text-[8px] sm:text-[9px] lg:text-[10px] text-[var(--sub-text-color)] font-normal'>
                        See how your score is distributed across criteria
                    </p>
                </div>
                <div className='flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 border border-[var(--border-color)] rounded-lg cursor-pointer hover:bg-[var(--hover-color)] transition-colors self-start sm:self-auto'>
                    <span className='text-[9px] sm:text-[10px] lg:text-[12px] text-[var(--sub-text-color)] whitespace-nowrap'>
                        Over Year
                    </span>
                    <ChevronDown size={10} className='sm:size-[12px] lg:size-[14px] text-[var(--sub-text-color)]' />
                </div>
            </div>

            {/* Chart Container */}
            <div className='flex-1 flex justify-center items-center relative min-h-[120px] sm:min-h-[150px] lg:min-h-[180px]'>
                <div className='w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] xl:w-[180px] xl:h-[180px] relative'>
                    <Doughnut data={chartData} options={chartOptions} />
                    {/* Center text overlay */}
                    <div className='absolute inset-0 flex flex-col justify-center items-center pointer-events-none'>
                        <div className='text-center'>
                            <div className='text-[16px] sm:text-[18px] lg:text-[20px] xl:text-[24px] font-bold text-[var(--text-color)]'>
                                {totalTasks}
                            </div>
                            <div className='text-[7px] sm:text-[8px] lg:text-[9px] xl:text-[10px] text-[var(--sub-text-color)] font-normal z-0'>
                                Total Tasks
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className='w-full flex flex-col gap-1 sm:gap-2 lg:gap-3 mt-1 sm:mt-2'>
                {data.map((item) => (
                    <div key={item.id} className='flex items-center justify-between px-1 sm:px-2'>
                        <div className='flex items-center gap-1 sm:gap-2 lg:gap-3'>
                            {/* Color indicator */}
                            <div 
                                className='w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] lg:w-[10px] lg:h-[10px] rounded-full flex-shrink-0' 
                                style={{ backgroundColor: item.color }}
                            />
                            {/* Title */}
                            <span className='text-[10px] sm:text-[11px] lg:text-[13px] font-medium text-[var(--text-color)]'>
                                {item.title}
                            </span>
                        </div>
                        {/* Percentage */}
                        <span className='text-[9px] sm:text-[10px] lg:text-[11px] text-[var(--sub-text-color)] font-normal'>
                            {item.percentage}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KpiBreakdown;