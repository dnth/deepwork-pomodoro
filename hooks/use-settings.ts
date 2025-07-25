"use client"

import { useLocalStorage } from "./use-local-storage"

interface Settings {
  pomodoroDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  autoStartBreaks: boolean
  notifications: boolean
  soundAlerts: boolean
}

const defaultSettings: Settings = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  notifications: true,
  soundAlerts: true,
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>("pomodoro-settings", defaultSettings)

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    // Clear all local user data
    localStorage.removeItem("daily-quote")
    localStorage.removeItem("theme-palette") 
    localStorage.removeItem("pomodoro-todos")
    localStorage.removeItem("pomodoro-completed-today")
  }

  return {
    settings,
    updateSettings,
    resetSettings,
  }
}
