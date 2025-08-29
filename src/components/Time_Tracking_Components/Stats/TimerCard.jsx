import React, { useState, useEffect, useRef } from 'react'
import TimerPopUp from "../timerPopUp/TimerPopUp"
import {
  useStartTimerMutation,
  useGetCurrentTimerQuery,
  usePauseTimerMutation,
  useResumeTimerMutation,
  useCompleteTimerMutation,
  useCancelTimerMutation,
} from "../../../services/apis/TimerApi"

const LOCAL_KEY = "workhole_timer"

const TimerCard = () => {
  const [showControlPopup, setShowControlPopup] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [duration, setDuration] = useState(25)
  const [localStopwatch, setLocalStopwatch] = useState(null)
  const [currentTime, setCurrentTime] = useState(0) // Current elapsed seconds
  const intervalRef = useRef(null)

  // RTK Query hooks with auto-refresh
  const { data: timerData, refetch } = useGetCurrentTimerQuery(undefined, {
    pollingInterval: 60000, // Sync with backend every 60 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  
  const [startTimer, { isLoading: isStarting }] = useStartTimerMutation()
  const [pauseTimer, { isLoading: isPausing }] = usePauseTimerMutation()
  const [resumeTimer, { isLoading: isResuming }] = useResumeTimerMutation()
  const [completeTimer, { isLoading: isCompleting }] = useCompleteTimerMutation()
  const [cancelTimer, { isLoading: isCancelling }] = useCancelTimerMutation()

  // Load saved timer data on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      try {
        const obj = JSON.parse(saved)
        setDuration(obj.duration || 25)
      } catch {
        localStorage.removeItem(LOCAL_KEY)
      }
    }
  }, [])

  // Start timer
  const handleSetTaskNameAndStart = async (name) => {
    if (!name.trim()) return alert("Task name required")
    
    try {
      const response = await startTimer({ tag: name, duration }).unwrap()
      
      // Create local stopwatch object
      const stopwatchObj = {
        id: response.timer.id,
        startTime: Date.now(),
        tag: response.timer.tag,
        duration: response.timer.duration,
        backendStartTime: new Date(response.timer.startTime).getTime(),
        totalPaused: 0,
      }
      
      localStorage.setItem(LOCAL_KEY, JSON.stringify(stopwatchObj))
      setLocalStopwatch(stopwatchObj)
      setCurrentTime(0)
      setShowControlPopup(false)
      await refetch()
    } catch (error) {
      console.error('Failed to start timer:', error)
      alert('Failed to start timer. Please try again.')
    }
  }

  // Timer controls
  const clearLocalTimer = () => {
    localStorage.removeItem(LOCAL_KEY)
    setLocalStopwatch(null)
    setCurrentTime(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handlePause = async () => {
    if (timerData?.timer?.id) {
      try {
        await pauseTimer(timerData.timer.id).unwrap()
        clearLocalTimer()
        await refetch()
      } catch (error) {
        console.error('Failed to pause timer:', error)
        alert('Failed to pause timer')
      }
    }
  }

  const handleResume = async () => {
    if (timerData?.timer?.id) {
      try {
        await resumeTimer(timerData.timer.id).unwrap()
        
        // Restart local stopwatch from current backend time
        const stopwatchObj = {
          id: timerData.timer.id,
          startTime: Date.now() - (timerData.timer.elapsedSeconds * 1000),
          tag: timerData.timer.tag,
          duration: timerData.timer.duration,
          backendStartTime: new Date(timerData.timer.startTime).getTime(),
          totalPaused: timerData.timer.totalPaused || 0,
        }
        
        localStorage.setItem(LOCAL_KEY, JSON.stringify(stopwatchObj))
        setLocalStopwatch(stopwatchObj)
        await refetch()
      } catch (error) {
        console.error('Failed to resume timer:', error)
        alert('Failed to resume timer')
      }
    }
  }

  const handleComplete = async (note) => {
    if (timerData?.timer?.id) {
      try {
        await completeTimer({ id: timerData.timer.id, note: note || '' }).unwrap()
        clearLocalTimer()
        await refetch()
      } catch (error) {
        console.error('Failed to complete timer:', error)
        alert('Failed to complete timer')
      }
    }
  }

  const handleCancel = async (note) => {
    if (timerData?.timer?.id) {
      try {
        await cancelTimer({ id: timerData.timer.id, note: note || '' }).unwrap()
        clearLocalTimer()
        await refetch()
      } catch (error) {
        console.error('Failed to cancel timer:', error)
        alert('Failed to cancel timer')
      }
    }
  }

  // Real-time stopwatch logic - counts UP every second
  useEffect(() => {
    if (localStopwatch && timerData?.isRunning && timerData?.timer?.status === 'running') {
      const updateStopwatch = () => {
        const elapsed = Math.floor((Date.now() - localStopwatch.startTime) / 1000)
        setCurrentTime(elapsed)
        
        // Auto-complete if duration is set and reached (optional)
        if (localStopwatch.duration > 0 && elapsed >= localStopwatch.duration * 60) {
          handleComplete('Auto-completed - duration reached')
        }
      }

      // Initial update
      updateStopwatch()
      
      // Update every second for real-time counting
      intervalRef.current = setInterval(updateStopwatch, 1000)
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [localStopwatch, timerData])

  // Sync local stopwatch with backend timer when needed
  useEffect(() => {
    if (timerData?.isRunning && timerData?.timer?.status === 'running') {
      // If backend has running timer but no local stopwatch, create one
      if (!localStopwatch) {
        const stopwatchObj = {
          id: timerData.timer.id,
          startTime: Date.now() - (timerData.timer.elapsedSeconds * 1000),
          tag: timerData.timer.tag,
          duration: timerData.timer.duration,
          backendStartTime: new Date(timerData.timer.startTime).getTime(),
          totalPaused: timerData.timer.totalPaused || 0,
        }
        localStorage.setItem(LOCAL_KEY, JSON.stringify(stopwatchObj))
        setLocalStopwatch(stopwatchObj)
        setCurrentTime(timerData.timer.elapsedSeconds)
      }
    } else if (!timerData?.isRunning || timerData?.timer?.status !== 'running') {
      // If backend timer is not running, clear local stopwatch
      if (localStopwatch) {
        clearLocalTimer()
      }
    }
  }, [timerData])

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate display time
  const getDisplayTime = () => {
    if (timerData?.isRunning && timerData?.timer) {
      if (timerData.timer.status === 'running' && localStopwatch) {
        // Show real-time counting stopwatch
        return formatTime(currentTime)
      } else {
        // Paused - show backend elapsed time
        return formatTime(timerData.timer.elapsedSeconds || 0)
      }
    } else {
      // No timer running - show duration or 00:00
      if (duration > 0) {
        return `${duration.toString().padStart(2, '0')}:00`
      }
      return '00:00'
    }
  }

  const isTimerRunning = timerData?.isRunning && timerData?.timer?.status === 'running'
  const isTimerPaused = timerData?.isRunning && timerData?.timer?.status === 'paused'
  const hasActiveTimer = timerData?.isRunning && timerData?.timer

  return (
    <>
      <div
        className={`w-full min-h-[140px] flex flex-col justify-between p-2 rounded-2xl border hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
          hasActiveTimer ? 'cursor-pointer border-[#09D1C7] shadow-lg' : 'cursor-default border-gray-200'
        } ${isTimerRunning ? 'bg-gradient-to-br from-[#CDFFFC]/30 to-[#E0FFFE]/30' : ''}`}
        onClick={() => hasActiveTimer ? setShowControlPopup(true) : null}
        title={hasActiveTimer ? 'Click to control timer' : 'Start the timer to enable controls'}
      >
        {/* Status indicators */}


        <div className="flex justify-between items-center">
          <h1 className='text-[16px] font-semibold text-[#777D86] tracking-wide'>
            {hasActiveTimer ? 'Active Timer' : 'Focus Timer'}
          </h1>
          {hasActiveTimer && (
            <div className="flex flex-col items-end">
 
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isTimerRunning 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isTimerRunning ? 'Running' : 'Paused'}
              </span>
            </div>
          )}
        </div>

        <div className='w-full h-max flex justify-center gap-8 items-center'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              !hasActiveTimer && setDuration(Math.max(0, duration - 5))
            }}
            disabled={hasActiveTimer}
            className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform'
          >
            −
          </button>
          
          <div className="flex flex-col items-center">
            <span className={`text-center text-[28px] font-bold bg-gradient-to-r from-[#09D1C7] to-[#15919B] bg-clip-text text-transparent tracking-wider font-mono ${
              isTimerRunning ? 'animate-pulse' : ''
            }`}>
              {getDisplayTime()}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              !hasActiveTimer && setDuration(Math.min(240, duration + 5))
            }}
            disabled={hasActiveTimer}
            className='w-[28px] h-[28px] text-white rounded-full bg-gradient-to-br from-[#09D1C7] to-[#15919B] font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform'
          >
            +
          </button>
        </div>

        <div className='w-full h-[50px] flex justify-center items-center'>
          <button
            className={`w-[85%] h-[40px] rounded-full flex justify-center items-center text-[17px] font-semibold transition-all duration-300 hover:scale-105 ${
              hasActiveTimer
                ? 'bg-gradient-to-r from-[#09D1C7] to-[#15919B] text-white hover:shadow-lg'
                : 'bg-gradient-to-r from-[#CDFFFC] to-[#E0FFFE] text-[#15919B] hover:from-[#09D1C7] hover:to-[#15919B] hover:text-white'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              setShowControlPopup(true)
            }}
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : hasActiveTimer ? 'Control Timer' : 'Start Timer'}
          </button>
        </div>

        {/* Progress bar for active timer with duration */}
        {hasActiveTimer && duration > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-[#09D1C7] to-[#15919B] transition-all duration-1000"
              style={{ 
                width: `${Math.min(100, Math.max(0, (currentTime / (duration * 60)) * 100))}%` 
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Timer Popup */}
      {showControlPopup && (
        <TimerPopUp
          timer={timerData?.timer || { tag: taskName, status: null }}
          taskName={taskName}
          setTaskName={setTaskName}
          duration={duration}
          setDuration={setDuration}
          onSetTaskNameAndStart={handleSetTaskNameAndStart}
          onPause={handlePause}
          onResume={handleResume}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onClose={() => setShowControlPopup(false)}
          isLoading={{
            pause: isPausing,
            resume: isResuming,
            complete: isCompleting,
            cancel: isCancelling,
            start: isStarting,
          }}
        />
      )}
    </>
  )
}

export default TimerCard
