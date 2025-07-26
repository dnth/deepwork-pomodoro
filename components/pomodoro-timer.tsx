"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, X, Clock } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useSettings } from "@/hooks/use-settings"
import { taskTagConfig } from "@/hooks/use-todos"

interface PomodoroTimerProps {}

export function PomodoroTimer() {
  const { settings } = useSettings()
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

    const totalDuration = currentMode === "pomodoro" 
      ? settings.pomodoroDuration * 60 
      : currentMode === "shortBreak" 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }

  const isTaskMode = currentMode === "task"
  const hasCurrentTask = currentTask !== null

  return (
    <div className="w-full bg-theme-card-bg/30 backdrop-blur-sm border border-theme-card-border/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-theme-text-primary">{getTimerTitle()}</h2>
          {isTaskMode && (
            <span className="text-xs bg-theme-task-accent text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium">TASK MODE</span>
          )}
        </div>
        
        {/* Stats */}
        <div className="text-right">
          <div className="text-theme-text-secondary">
            <span className="text-theme-text-primary font-semibold text-sm sm:text-base">{completedToday}</span>
            <span className="ml-1 text-theme-text-secondary text-xs sm:text-sm">completed today</span>
          </div>
        </div>
      </div>

      {/* Current Task Display - Always show when in task mode */}
      {isTaskMode && hasCurrentTask && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-theme-task-bg/10 border border-theme-task-border/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Clock className="w-4 h-4 text-theme-task-text" />
                <span className="font-medium text-theme-text-primary">Working on:</span>
              </div>
              <p className="text-theme-text-primary font-medium text-lg mb-2 sm:mb-3">{currentTask.text}</p>
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
              className="text-theme-text-muted hover:text-red-400 hover:bg-red-500/10 p-2"
              title="Stop task timer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="flex bg-theme-input-bg/50 rounded-xl p-1 mb-6 sm:mb-8">
        {modes.map((mode) => (
          <Button
            key={mode.key}
            variant="ghost"
            onClick={() => setMode(mode.key)}
            className={`flex-1 rounded-lg p-2 sm:p-3 transition-all duration-200 ${
              currentMode === mode.key && !isTaskMode
                ? "bg-theme-accent text-theme-text-primary shadow-lg"
                : "text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40"
            }`}
          >
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-theme-text-primary mb-3 sm:mb-4 font-mono tracking-tight">
          {formatTime(timeLeft)}
        </div>

        {/* Progress Ring */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6">
          <svg className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-theme-progress-bg"
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
              className={`${isTaskMode ? "text-theme-task-text" : "text-theme-progress"} transition-all duration-1000 ease-linear`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          size="lg"
          className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 text-sm sm:text-base"
        >
          {isRunning ? <Pause className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" /> : <Play className="w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={resetTimer}
          variant="outline"
          size="lg"
          className="border-theme-input-border text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-transparent"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

    </div>
  )
}
