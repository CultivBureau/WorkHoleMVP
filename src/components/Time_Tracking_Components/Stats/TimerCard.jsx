import React, { useState } from 'react'
import { useTranslation } from "react-i18next"

const TimerCard = () => {
    const { t, i18n } = useTranslation()
    const isRtl = i18n.dir() === "rtl"
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(30)

    const decreaseTime = () => {
        if (seconds > 0) {
            setSeconds(seconds - 1)
        } else if (minutes > 0) {
            setMinutes(minutes - 1)
            setSeconds(59)
        }
    }

    const increaseTime = () => {
        if (seconds < 59) {
            setSeconds(seconds + 1)
        } else {
            setMinutes(minutes + 1)
            setSeconds(0)
        }
    }

    const formatTime = (time) => {
        return time.toString().padStart(2, '0')
    }

    return (
        <div
            className={`w-full h-max min-h-[140px] flex flex-col justify-between p-2 rounded-2xl border hover:shadow-xl transition-all duration-300 ${isRtl ? 'text-right' : 'text-left'}`}
            style={{
                backgroundColor: 'var(--bg-color)',
                borderColor: 'var(--border-color)',
                direction: isRtl ? 'rtl' : 'ltr',
            }}
        >
            <h1 className='w-full h-max text-start pl-2 text-[16px] font-semibold text-[#777D86] tracking-wide'>
                {t("mainContent.timerFocus")}
            </h1>
            
            {/* min and time and plus  */}
            <div className='w-full h-max flex justify-center gap-8 items-center'>
                <button 
                    onClick={decreaseTime}
                    className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] hover:from-[#15919B] hover:to-[#09D1C7] transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center pb-1 font-bold text-lg'
                >
                    −
                </button>
                <span className='w-[30%] text-center text-[25px] font-bold bg-gradient-to-r from-[#09D1C7] to-[#15919B] bg-clip-text text-transparent tracking-wider'>
                    {formatTime(minutes)}:{formatTime(seconds)}
                </span>
                <button 
                    onClick={increaseTime}
                    className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] hover:from-[#15919B] hover:to-[#09D1C7] transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center pb-1  font-bold text-lg'
                >
                    +
                </button>
            </div>
            
            <div className='w-full h-[50px] flex justify-center items-center'>
                <button className='w-[85%] h-[40px] rounded-full flex justify-center items-center bg-gradient-to-r from-[#CDFFFC] to-[#E0FFFE] hover:from-[#B8F5F2] hover:to-[#CDFFFC] text-[17px] font-semibold text-[#15919B] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-[#15919B]/10'>
                    {t("mainContent.startTimer")}
                </button>
            </div>
        </div>
    )
}

export default TimerCard
