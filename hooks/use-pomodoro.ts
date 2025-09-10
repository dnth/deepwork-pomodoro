"use client"

import { useReducer, useEffect, useCallback, useRef } from "react"
import { useSettings } from "./use-settings"
import { useLocalStorage } from "./use-local-storage"

type TimerMode = "deep" | "focus" | "quick"

interface TimerState {
  timeLeft: number
  isRunning: boolean
  currentMode: TimerMode
}

type TimerAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESET"; duration: number }
  | { type: "TICK" }
  | { type: "COMPLETE" }
  | { type: "SET_MODE"; mode: TimerMode; duration: number }

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case "START":
      return { ...state, isRunning: true }
    case "PAUSE":
      return { ...state, isRunning: false }
    case "RESET":
      return { ...state, timeLeft: action.duration, isRunning: false }
    case "TICK":
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) }
    case "COMPLETE":
      return { ...state, isRunning: false, timeLeft: 0 }
    case "SET_MODE":
      return {
        ...state,
        currentMode: action.mode,
        timeLeft: action.duration,
        isRunning: false,
      }
    default:
      return state
  }
}

export function usePomodoro() {
  const { settings } = useSettings()
  const [completedToday, setCompletedToday] = useLocalStorage("pomodoro-completed-today", 0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const [state, dispatch] = useReducer(timerReducer, {
    timeLeft: 25 * 60, // Default to 25 minutes initially
    isRunning: false,
    currentMode: "focus" as TimerMode,
  })

  const getDuration = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case "deep":
          return settings.deepDuration * 60
        case "focus":
          return settings.focusDuration * 60
        case "quick":
          return settings.quickDuration * 60
        default:
          return settings.focusDuration * 60
      }
    },
    [settings],
  )

  // Update timer when settings change (but not when paused)
  useEffect(() => {
    const duration = getDuration(state.currentMode)
    if (!state.isRunning && state.timeLeft !== duration) {
      dispatch({ type: "RESET", duration })
    }
  }, [settings, getDuration, state.isRunning, state.currentMode]) // Removed state.timeLeft to prevent running every second

  const setMode = useCallback(
    (mode: TimerMode) => {
      const duration = getDuration(mode)
      dispatch({ type: "SET_MODE", mode, duration })
    },
    [getDuration],
  )


  const startTimer = useCallback(() => {
    if (state.timeLeft === 0) {
      const duration = getDuration(state.currentMode)
      dispatch({ type: "RESET", duration })
    }
    dispatch({ type: "START" })
  }, [state.timeLeft, state.currentMode, getDuration])

  const pauseTimer = useCallback(() => {
    dispatch({ type: "PAUSE" })
  }, [])

  const resetTimer = useCallback(() => {
    const duration = getDuration(state.currentMode)
    dispatch({ type: "RESET", duration })
  }, [state.currentMode, getDuration])

  const resetCompletedToday = useCallback(() => {
    setCompletedToday(0)
  }, [setCompletedToday])

  // Allow setting a custom remaining time without changing mode
  const resetTimerTo = useCallback((seconds: number) => {
    const safe = Math.max(0, Math.floor(seconds))
    dispatch({ type: "RESET", duration: safe })
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])


  // Timer countdown effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [state.isRunning])

  // Update browser tab title with timer (debounced)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const modeLabel = state.currentMode === "deep" ? "Deep Focus" :
                        state.currentMode === "focus" ? "Focus" : "Quick Break"
      const timeDisplay = formatTime(state.timeLeft)
      const statusIcon = state.isRunning ? "⏰" : "⏸️"

      // Debounce title updates to every 5 seconds when running, or immediate when paused/stopped
      const shouldUpdateImmediately = !state.isRunning || state.timeLeft % 5 === 0

      if (shouldUpdateImmediately) {
        document.title = `${statusIcon} ${timeDisplay} - ${modeLabel} | Deep Work`
      }
    }
  }, [state.timeLeft, state.isRunning, state.currentMode, formatTime])

  // Handle timer completion
  const prevTimeLeftRef = useRef(state.timeLeft)
  useEffect(() => {
    const prevTimeLeft = prevTimeLeftRef.current
    prevTimeLeftRef.current = state.timeLeft

    // Only trigger completion logic when transitioning from > 0 to 0
    if (prevTimeLeft > 0 && state.timeLeft === 0 && state.isRunning) {
      dispatch({ type: "COMPLETE" })

      if (state.currentMode === "deep" || state.currentMode === "focus") {
        setCompletedToday((prev) => prev + 1)
      }

      // Notification
      if (settings.notifications && typeof window !== 'undefined' && Notification.permission === "granted") {
        const message = (state.currentMode === 'deep' || state.currentMode === 'focus')
          ? "Time for a quick break!"
          : "Break time is over!"
        new Notification("Deep Work", { body: message, icon: "/favicon.ico" })
      }

      // Auto start breaks - simplified: after deep/focus, start quick
      if (settings.autoStartBreaks && (state.currentMode === "deep" || state.currentMode === "focus")) {
        setTimeout(() => {
          const duration = getDuration("quick")
          dispatch({ type: "SET_MODE", mode: "quick", duration })
          dispatch({ type: "START" })
        }, 1000)
      }
    }
  }, [state.timeLeft, state.isRunning, state.currentMode, settings, setCompletedToday, getDuration])

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    currentMode: state.currentMode,
    completedToday,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    resetTimerTo,
    resetCompletedToday,
    formatTime,
  }
}
