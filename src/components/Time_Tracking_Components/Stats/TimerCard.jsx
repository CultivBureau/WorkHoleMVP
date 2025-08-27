import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"
import { useStartTimerMutation, useGetCurrentTimerQuery } from "../../../services/apis/TimerApi"

const TimerCard = () => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [tag, setTag] = useState("")
  const [timerStarted, setTimerStarted] = useState(false)
  const [startTimer, { isLoading }] = useStartTimerMutation()
  const { data: currentTimer, refetch } = useGetCurrentTimerQuery(undefined, { skip: !timerStarted })

  // Countdown effect
  useEffect(() => {
    let interval
    if (timerStarted && currentTimer) {
      interval = setInterval(() => {
        refetch()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerStarted, currentTimer, refetch])

  // Update timer UI from backend
  useEffect(() => {
    if (currentTimer && timerStarted) {
      setMinutes(currentTimer.remainingMinutes)
      setSeconds(0)
      if (currentTimer.remainingMinutes <= 0) {
        setTimerStarted(false)
      }
    }
  }, [currentTimer, timerStarted])

  const formatTime = (time) => time.toString().padStart(2, '0')

  // Start timer handler
  const handleStartTimer = async () => {
    if (!tag || minutes < 1) return
    await startTimer({ tag, duration: minutes }).unwrap()
    setShowPopup(false)
    setTimerStarted(true)
    refetch()
  }

  // Responsive UI
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
          onClick={() => !timerStarted && setMinutes(Math.max(1, minutes - 1))}
          disabled={timerStarted}
          className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] hover:from-[#15919B] hover:to-[#09D1C7] transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center pb-1 font-bold text-lg'
        >
          −
        </button>
        <span className='w-[30%] text-center text-[25px] font-bold bg-gradient-to-r from-[#09D1C7] to-[#15919B] bg-clip-text text-transparent tracking-wider'>
          {formatTime(minutes)}:{formatTime(seconds)}
        </span>
        <button 
          onClick={() => !timerStarted && setMinutes(Math.min(240, minutes + 1))}
          disabled={timerStarted}
          className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] hover:from-[#15919B] hover:to-[#09D1C7] transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center pb-1  font-bold text-lg'
        >
          +
        </button>
      </div>
      <div className='w-full h-[50px] flex justify-center items-center'>
        <button
          className='w-[85%] h-[40px] rounded-full flex justify-center items-center bg-gradient-to-r from-[#CDFFFC] to-[#E0FFFE] hover:from-[#B8F5F2] hover:to-[#CDFFFC] text-[17px] font-semibold text-[#15919B] transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-[#15919B]/10'
          onClick={() => setShowPopup(true)}
          disabled={timerStarted}
        >
          {timerStarted ? t("mainContent.timerRunning") : t("mainContent.startTimer")}
        </button>
      </div>

      {/* Popup for tag input */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4 w-[320px]">
            <label className="font-semibold text-[#15919B]">{t("mainContent.taskName")}</label>
            <input
              type="text"
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="border rounded px-3 py-2"
              placeholder={t("mainContent.taskPlaceholder")}
            />
            <button
              className="w-full py-2 rounded bg-gradient-to-r from-[#09D1C7] to-[#15919B] text-white font-bold"
              onClick={handleStartTimer}
              disabled={isLoading || !tag}
            >
              {isLoading ? t("mainContent.starting") : t("mainContent.startNow")}
            </button>
            <button
              className="w-full py-2 rounded bg-gray-200 text-[#15919B] font-bold mt-2"
              onClick={() => setShowPopup(false)}
            >
              {t("mainContent.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimerCard
