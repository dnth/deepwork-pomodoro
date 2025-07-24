"use client"

import { useReducer, useEffect, useCallback, useRef } from "react"
import { useSettings } from "./use-settings"
import { useLocalStorage } from "./use-local-storage"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

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
    timeLeft: settings.pomodoroDuration * 60,
    isRunning: false,
    currentMode: "pomodoro" as TimerMode,
  })

  const getDuration = useCallback(
    (mode: TimerMode) => {
      switch (mode) {
        case "pomodoro":
          return settings.pomodoroDuration * 60
        case "shortBreak":
          return settings.shortBreakDuration * 60
        case "longBreak":
          return settings.longBreakDuration * 60
        default:
          return settings.pomodoroDuration * 60
      }
    },
    [settings],
  )

  // Update timer when settings change (but not when paused)
  useEffect(() => {
    const duration = getDuration(state.currentMode)
    if (!state.isRunning && state.timeLeft === duration) {
      dispatch({ type: "RESET", duration })
    }
  }, [settings, state.currentMode, getDuration])

  // Initialize timer duration when mode changes
  useEffect(() => {
    const duration = getDuration(state.currentMode)
    if (state.timeLeft !== duration && !state.isRunning) {
      dispatch({ type: "RESET", duration })
    }
  }, [state.currentMode, getDuration])

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

  // Handle timer completion
  useEffect(() => {
    if (state.timeLeft === 0 && state.isRunning) {
      dispatch({ type: "COMPLETE" })
      
      if (state.currentMode === "pomodoro") {
        setCompletedToday((prev) => prev + 1)
      }
      
      // Notification
      if (settings.notifications && typeof window !== 'undefined' && Notification.permission === "granted") {
        const message = state.currentMode === 'pomodoro' 
          ? "Time for a break!" 
          : "Break time is over!"
        new Notification("Deep Work", { body: message, icon: "/favicon.ico" })
      }

      // Auto start breaks
      if (settings.autoStartBreaks) {
        const newCompletedCount = state.currentMode === "pomodoro" ? completedToday + 1 : completedToday
        const nextMode = state.currentMode === "pomodoro" 
          ? (newCompletedCount % 4 === 0 ? "longBreak" : "shortBreak") 
          : "pomodoro"
        
        setTimeout(() => {
          const duration = getDuration(nextMode)
          dispatch({ type: "SET_MODE", mode: nextMode, duration })
          dispatch({ type: "START" })
        }, 1000)
      }
    }
  }, [state.timeLeft, state.isRunning, state.currentMode, settings, completedToday, setCompletedToday, getDuration])

  return {
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    currentMode: state.currentMode,
    completedToday,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  }
}
