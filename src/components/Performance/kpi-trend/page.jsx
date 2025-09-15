import React from 'react'
import { Calendar } from 'lucide-react'
import { useLang } from '../../../contexts/LangContext'
import { useTheme } from '../../../contexts/ThemeContext'
import { useTranslation } from "react-i18next";

const KpiTrend = () => {
    const { isRtl } = useLang();
    const { theme } = useTheme();
    const { t } = useTranslation();

    // Sample data for demonstration
    const data = [
        { month: 'Jan', points: 75 },
        { month: 'Feb', points: 82 },
        { month: 'Mar', points: 78 },
        { month: 'Apr', points: 85 },
        { month: 'May', points: 80 },
        { month: 'Jun', points: 86 },
        { month: 'Jul', points: 83 },
        { month: 'Aug', points: 79 },
        { month: 'Sep', points: 81 },
        { month: 'Oct', points: 56 },
        { month: 'Nov', points: 84 },
        { month: 'Dec', points: 88 }
    ];

    // Calculate metrics
    const highestScore = Math.max(...data.map(item => item.points));
    const highestScoreMonth = data.find(item => item.points === highestScore);
    
    const lowestScore = Math.min(...data.map(item => item.points));
    const lowestScoreMonth = data.find(item => item.points === lowestScore);
    
    // Calculate change from previous month (assuming current month is the last one)
    const currentMonth = data[data.length - 1];
    const previousMonth = data[data.length - 2];
    const changeFromPreviousMonth = currentMonth.points - previousMonth.points;

    const cards = [
        {
            id: 1,
            percentage: highestScore,
            month: highestScoreMonth.month,
            title: isRtl ? 'أعلى نقاط هذه الفترة' : 'Your highest score this period',
            bgColor: '#E0F7FA',
            textColor: '#15919B',
            progressColor: '#15919B',
            progressWidth: (highestScore / 100) * 100
        },
        {
            id: 2,
            percentage: lowestScore,
            month: lowestScoreMonth.month,
            title: isRtl ? 'أقل نقاط هذه الفترة' : 'lowest score this period',
            bgColor: '#FFEBEE',
            textColor: '#D32F2F',
            progressColor: '#D32F2F',
            progressWidth: (lowestScore / 100) * 100
        },
        {
            id: 3,
            percentage: Math.abs(changeFromPreviousMonth),
            month: 'vs Last Month',
            title: isRtl ? 'التغيير من الشهر السابق' : 'Change from previous month',
            bgColor: '#E8EAF6',
            textColor: '#3F51B5',
            progressColor: '#3F51B5',
            progressWidth: (Math.abs(changeFromPreviousMonth) / 100) * 100
        }
    ];

    return (
        <div className='w-full h-max pb-5 pt-5 gap-4 flex flex-col justify-center items-center'>
            <div className='w-[100%] h-[240px] bg-green-500 flex justify-center items-center'>

            </div>
            <div className='w-[100%] h-max shadow-2xl rounded-[10px] flex justify-center gap-4 p-2'>
                {cards.map((card) => (
                    <div key={card.id} className='w-[30%] h-[80px] bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[6px] p-2 flex items-center gap-2'>
                        {/* Left side - Percentage box */}
                        <div 
                            className='w-[50px] h-[50px] rounded-[8px] flex items-center justify-center flex-shrink-0'
                            style={{ backgroundColor: card.bgColor }}
                        >
                            <span 
                                className='text-[14px] font-bold'
                                style={{ color: card.textColor }}
                            >
                                {card.percentage}%
                            </span>
                        </div>

                        {/* Right side - Content */}
                        <div className='flex-1 h-full flex flex-col justify-between py-1'>
                            <div className='flex items-center gap-1 mb-1'>
                                <Calendar 
                                    size={14} 
                                    style={{ color: card.textColor }}
                                />
                                <span 
                                    className='text-[14px] text-start font-bold'
                                    style={{ color: card.textColor }}
                                >
                                    {card.month}
                                </span>
                            </div>
                            
                            <p className='text-[10px] text-start text-[var(--sub-text-color)] font-normal leading-tight mb-2'>
                                {card.title}
                            </p>

                            {/* Progress bar */}
                            <div className='w-full h-[6px] bg-[#E0E0E0] rounded-[3px] overflow-hidden'>
                                <div 
                                    className='h-full rounded-[3px] transition-all duration-300'
                                    style={{ 
                                        backgroundColor: card.progressColor,
                                        width: `${card.progressWidth}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KpiTrend;