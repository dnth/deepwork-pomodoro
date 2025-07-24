"use client"

import { useState, useEffect, useCallback } from "react"
import { useSettings } from "./use-settings"
import { useLocalStorage } from "./use-local-storage"
import type { Todo, TaskTag } from "./use-todos"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak" | "task"

export function usePomodoro() {
  const { settings } = useSettings()
  const [completedToday, setCompletedToday] = useLocalStorage("pomodoro-completed-today", 0)
  const [currentMode, setCurrentMode] = useState<TimerMode>("pomodoro")
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [currentTask, setCurrentTask] = useState<Todo | null>(null)

  const getDuration = useCallback(
    (mode: TimerMode, taskTag?: TaskTag) => {
      switch (mode) {
        case "pomodoro":
          return settings.pomodoroDuration * 60
        case "shortBreak":
          return settings.shortBreakDuration * 60
        case "longBreak":
          return settings.longBreakDuration * 60
        case "task":
          if (taskTag === "quick") return 10 * 60
          if (taskTag === "focus") return 25 * 60
          if (taskTag === "deep") return 50 * 60
          return 25 * 60
        default:
          return settings.pomodoroDuration * 60
      }
    },
    [settings],
  )

  // Update timer when settings change
  useEffect(() => {
    if (!isRunning) {
      const duration = getDuration(currentMode, currentTask?.tag)
      setTimeLeft(duration)
    }
  }, [settings, currentMode, currentTask, isRunning, getDuration])

  const setMode = useCallback(
    (mode: TimerMode) => {
      setCurrentMode(mode)
      const duration = getDuration(mode)
      setTimeLeft(duration)
      setIsRunning(false)
      if (mode !== "task") {
        setCurrentTask(null)
      }
    },
    [getDuration],
  )

  const startTaskTimer = useCallback(
    (task: Todo) => {
      const duration = getDuration("task", task.tag)
      setCurrentMode("task")
      setCurrentTask(task)
      setTimeLeft(duration)
      setIsRunning(true)
    },
    [getDuration],
  )

  const startTimer = useCallback(() => {
    if (timeLeft === 0) {
      const duration = getDuration(currentMode, currentTask?.tag)
      setTimeLeft(duration)
    }
    setIsRunning(true)
  }, [timeLeft, currentMode, currentTask, getDuration])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    const duration = getDuration(currentMode, currentTask?.tag)
    setTimeLeft(duration)
    setIsRunning(false)
  }, [currentMode, currentTask, getDuration])

  const stopTaskTimer = useCallback(() => {
    const duration = getDuration("pomodoro")
    setCurrentMode("pomodoro")
    setCurrentTask(null)
    setTimeLeft(duration)
    setIsRunning(false)
  }, [getDuration])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false)
            
            if (currentMode === "pomodoro" || currentMode === "task") {
              setCompletedToday((prev) => prev + 1)
            }
            
            // Notification
            if (settings.notifications && typeof window !== 'undefined' && Notification.permission === "granted") {
              const message = currentMode === 'task' && currentTask ? `Task "${currentTask.text}" completed!` : currentMode === 'pomodoro' ? "Time for a break!" : "Break time is over!"
              new Notification("Deep Work", { body: message, icon: "/favicon.ico" })
            }

            // Auto start breaks/tasks
            if (settings.autoStartBreaks && currentMode !== "task") {
              const newCompletedCount = currentMode === "pomodoro" ? completedToday + 1 : completedToday
              const nextMode =
                currentMode === "pomodoro" ? (newCompletedCount % 4 === 0 ? "longBreak" : "shortBreak") : "pomodoro"
              
              setMode(nextMode)
              // We need to start the timer again for the next session
              setTimeout(() => setIsRunning(true), 1000)

            } else if (currentMode === "task") {
              stopTaskTimer()
            }

            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [
    isRunning,
    settings,
    currentMode,
    currentTask,
    completedToday,
    setCompletedToday,
    getDuration,
    setMode,
    stopTaskTimer
  ])

  return {
    timeLeft,
    isRunning,
    currentMode,
    currentTask,
    completedToday,
    setMode,
    startTaskTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTaskTimer,
    formatTime,
  }
}
