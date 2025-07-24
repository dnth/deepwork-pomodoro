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

  const setMode = useCallback(
    (mode: TimerMode) => {
      setCurrentMode(mode)
      setTimeLeft(getDuration(mode))
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

      // Update all state at once
      setCurrentMode("task")
      setCurrentTask(task)
      setTimeLeft(duration)
      setIsRunning(true)
    },
    [getDuration],
  )

  const startTimer = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    if (currentMode === "task" && currentTask) {
      setTimeLeft(getDuration("task", currentTask.tag))
    } else {
      setTimeLeft(getDuration(currentMode))
    }
    setIsRunning(false)
  }, [currentMode, currentTask, getDuration])

  const stopTaskTimer = useCallback(() => {
    setCurrentMode("pomodoro")
    setCurrentTask(null)
    setTimeLeft(getDuration("pomodoro"))
    setIsRunning(false)
  }, [getDuration])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false)

      if (currentMode === "pomodoro" || currentMode === "task") {
        setCompletedToday((prev) => prev + 1)
      }

      // Show notification
      if (settings.notifications && "Notification" in window) {
        const message =
          currentMode === "task" && currentTask
            ? `Task "${currentTask.text}" completed!`
            : currentMode === "pomodoro"
              ? "Time for a break!"
              : "Break time is over!"

        if (Notification.permission === "granted") {
          new Notification("Deep Work", {
            body: message,
            icon: "/favicon.ico",
          })
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Deep Work", {
                body: message,
                icon: "/favicon.ico",
              })
            }
          })
        }
      }

      // Auto-start next session if enabled and not a task timer
      if (settings.autoStartBreaks && currentMode !== "task") {
        const newCompletedCount = currentMode === "pomodoro" ? completedToday + 1 : completedToday
        const nextMode =
          currentMode === "pomodoro" ? (newCompletedCount % 4 === 0 ? "longBreak" : "shortBreak") : "pomodoro"

        setTimeout(() => {
          setMode(nextMode)
          setIsRunning(true)
        }, 1000)
      } else if (currentMode === "task") {
        // Task completed, return to pomodoro mode
        setTimeout(() => {
          stopTaskTimer()
        }, 1000)
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [
    isRunning,
    timeLeft,
    currentMode,
    currentTask,
    settings,
    completedToday,
    setCompletedToday,
    setMode,
    stopTaskTimer,
  ])

  // Update timer when settings change (but not when in task mode or running)
  useEffect(() => {
    if (!isRunning && currentMode !== "task") {
      setTimeLeft(getDuration(currentMode))
    }
  }, [settings.pomodoroDuration, settings.shortBreakDuration, settings.longBreakDuration, currentMode, getDuration, isRunning])


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
