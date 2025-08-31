import React, { useState } from 'react'
import { useTranslation } from "react-i18next"

const TimerPopUp = ({
  timer,
  taskName,
  setTaskName,
  duration,
  setDuration,
  onSetTaskNameAndStart,
  onPause,
  onResume,
  onComplete,
  onCancel,
  onClose,
  isLoading = {} 
}) => {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === "rtl"
  const [note, setNote] = useState("")
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [actionType, setActionType] = useState("")

  const handleActionWithNote = (action) => {
    setActionType(action)
    setShowNoteInput(true)
  }

  const executeAction = async () => {
    try {
      if (actionType === 'complete') {
        await onComplete(note)
      } else if (actionType === 'cancel') {
        await onCancel(note)
      }
      setShowNoteInput(false)
      setNote("")
      onClose()
    } catch (error) {
      console.error(`Failed to ${actionType} timer:`, error)
    }
  }

  const handlePause = async () => {
    await onPause()
    onClose()
  }

  const handleResume = async () => {
    await onResume()
    onClose()
  }

  // If timer not started, show task name input
  if (!timer?.id) {
    return (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 w-[380px] max-w-[90vw]">
          <h3 className="text-xl font-bold text-[#15919B] text-center mb-2">
            {t("timer.startNewTimer") || "Start New Timer"}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("mainContent.taskName") || "Task Name"}
            </label>
            <input
              type="text"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:border-[#15919B] focus:outline-none"
              placeholder={t("mainContent.taskPlaceholder") || "Enter your task"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("timer.duration") || "Duration"}
            </label>
            <input
              type="number"
              min={1}
              max={240}
              value={duration}
              onChange={e => setDuration(Math.max(1, Math.min(240, Number(e.target.value))))}
              className="w-full border rounded-lg px-3 py-2 focus:border-[#15919B] focus:outline-none"
              placeholder={t("timer.durationPlaceholder") || "Minutes"}
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#09D1C7] to-[#15919B] text-white font-semibold hover:shadow-lg transition-all duration-300"
            onClick={() => onSetTaskNameAndStart(taskName)}
            disabled={isLoading.start}
          >
            {isLoading.start ? (t("mainContent.starting") || "Starting...") : (t("mainContent.startNow") || "Start")}
          </button>
          <button
            className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300 mt-2"
            onClick={onClose}
          >
            {t("timer.close") || "Close"}
          </button>
        </div>
      </div>
    )
  }

  if (showNoteInput) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        <div 
          className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 w-[380px] max-w-[90vw]"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          <h3 className="text-xl font-bold text-[#15919B] text-center">
            {actionType === 'complete' ? t("timer.completeTimer") : t("timer.cancelTimer")}
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t("timer.task")}:</p>
            <p className="font-semibold text-[#15919B]">{timer.tag}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("timer.addNote")} ({t("timer.optional")})
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 h-20 resize-none focus:border-[#15919B] focus:outline-none"
              placeholder={t("timer.notePlaceholder")}
            />
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
              onClick={() => {
                setShowNoteInput(false)
                setNote("")
                setActionType("")
              }}
              disabled={isLoading[actionType]}
            >
              {t("timer.back")}
            </button>
            <button
              className={`flex-1 py-3 rounded-lg text-white font-semibold transition-all duration-300 disabled:opacity-50 ${
                actionType === 'complete' 
                  ? 'bg-gradient-to-r from-[#09D1C7] to-[#15919B] hover:shadow-lg' 
                  : 'bg-gradient-to-r from-red-400 to-red-600 hover:shadow-lg'
              }`}
              onClick={executeAction}
              disabled={isLoading[actionType]}
            >
              {isLoading[actionType] 
                ? t("timer.processing") 
                : actionType === 'complete' 
                  ? t("timer.complete") 
                  : t("timer.cancel")
              }
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-xl p-6 shadow-2xl flex flex-col gap-4 w-[380px] max-w-[90vw]"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#15919B] mb-2">
            {t("timer.timerControl")}
          </h3>
          <div className="bg-gradient-to-r from-[#CDFFFC] to-[#E0FFFE] p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{t("timer.currentTask")}:</p>
            <p className="font-semibold text-[#15919B] text-lg">{timer.tag}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t("timer.status")}: 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                timer.status === 'running' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {timer.status === 'running' ? t("timer.running") : t("timer.paused")}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {timer.status === 'running' ? (
            <button
              className="py-3 px-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              onClick={handlePause}
              disabled={isLoading.pause}
            >
              {isLoading.pause ? t("timer.pausing") : t("timer.pause")}
            </button>
          ) : (
            <button
              className="py-3 px-4 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              onClick={handleResume}
              disabled={isLoading.resume}
            >
              {isLoading.resume ? t("timer.resuming") : t("timer.resume")}
            </button>
          )}

          <button
            className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#09D1C7] to-[#15919B] text-white font-semibold hover:shadow-lg transition-all duration-300"
            onClick={() => handleActionWithNote('complete')}
          >
            {t("timer.complete")}
          </button>
        </div>

        <button
          className="w-full py-3 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold hover:shadow-lg transition-all duration-300"
          onClick={() => handleActionWithNote('cancel')}
        >
          {t("timer.cancel")}
        </button>

        {/* Close button */}
        <button
          className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
          onClick={onClose}
        >
          {t("timer.close")}
        </button>
      </div>
    </div>
  )
}

export default TimerPopUp