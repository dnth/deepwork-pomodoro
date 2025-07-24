"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Settings, X, Clock } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useTheme } from "@/hooks/use-theme"
import { taskTagConfig } from "@/hooks/use-todos"

interface PomodoroTimerProps {
  onSettingsClick: () => void
}

export function PomodoroTimer({ onSettingsClick }: PomodoroTimerProps) {
  const {
    timeLeft,
    isRunning,
    currentMode,
    currentTask,
    completedToday,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTaskTimer,
    formatTime,
  } = usePomodoro()
  const { theme } = useTheme()

  const modes = [
    { key: "pomodoro", label: "Pomodoro" },
    { key: "shortBreak", label: "Short break" },
    { key: "longBreak", label: "Long break" },
  ] as const

  const getTimerTitle = () => {
    if (currentMode === "task" && currentTask) {
      const tagConfig = taskTagConfig[currentTask.tag]
      return `${tagConfig.label} Task`
    }
    return currentMode === "pomodoro" ? "Pomodoro" : currentMode === "shortBreak" ? "Short Break" : "Long Break"
  }

  const getProgressPercentage = () => {
    if (currentMode === "task" && currentTask) {
      const totalDuration = taskTagConfig[currentTask.tag].duration * 60
      return ((totalDuration - timeLeft) / totalDuration) * 100
    }

    const totalDuration = currentMode === "pomodoro" ? 25 * 60 : currentMode === "shortBreak" ? 5 * 60 : 15 * 60
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }

  const isTaskMode = currentMode === "task"
  const hasCurrentTask = currentTask !== null

  return (
    <div className={`${theme.cardBg} backdrop-blur-sm border ${theme.cardBorder} rounded-2xl p-8 shadow-2xl`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>{getTimerTitle()}</h2>
          {isTaskMode && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">TASK MODE</span>
          )}
        </div>
        <Button
          onClick={onSettingsClick}
          variant="ghost"
          size="sm"
          className={`${theme.textMuted} hover:${theme.textPrimary} hover:bg-gray-700/50 rounded-lg`}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Current Task Display - Always show when in task mode */}
      {isTaskMode && hasCurrentTask && (
        <div className={`mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className={`font-medium ${theme.textPrimary}`}>Working on:</span>
              </div>
              <p className={`${theme.textPrimary} font-medium text-lg mb-2`}>{currentTask.text}</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${taskTagConfig[currentTask.tag].color}`} />
                <span className={`text-sm ${taskTagConfig[currentTask.tag].textColor} font-medium`}>
                  {taskTagConfig[currentTask.tag].label} ({taskTagConfig[currentTask.tag].duration} minutes)
                </span>
              </div>
            </div>
            <Button
              onClick={stopTaskTimer}
              variant="ghost"
              size="sm"
              className={`${theme.textMuted} hover:text-red-400 hover:bg-red-500/10 p-2`}
              title="Stop task timer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className={`flex ${theme.inputBg} rounded-xl p-1 mb-8`}>
        {modes.map((mode) => (
          <Button
            key={mode.key}
            variant="ghost"
            onClick={() => setMode(mode.key)}
            className={`flex-1 rounded-lg transition-all duration-200 ${
              currentMode === mode.key && !isTaskMode
                ? `${theme.accent} ${theme.textPrimary} shadow-lg`
                : `${theme.textSecondary} hover:${theme.textPrimary} hover:bg-gray-700/50`
            }`}
          >
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        <div className={`text-8xl font-bold ${theme.textPrimary} mb-4 font-mono tracking-tight`}>
          {formatTime(timeLeft)}
        </div>

        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className={`${theme.progressBg}`}
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}`}
              className={`${isTaskMode ? "text-green-400" : theme.progress} transition-all duration-1000 ease-linear`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          size="lg"
          className={`${theme.accent} ${theme.accentHover} ${theme.textPrimary} px-8 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105`}
        >
          {isRunning ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className={`${theme.inputBorder} ${theme.textSecondary} hover:${theme.textPrimary} hover:bg-gray-700/50 px-6 py-3 rounded-xl bg-transparent`}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center">
        <div className={theme.textSecondary}>
          <span className={`text-2xl font-bold ${theme.textPrimary}`}>{completedToday}</span>
          <span className="ml-2">completed today</span>
        </div>
      </div>
    </div>
  )
}
