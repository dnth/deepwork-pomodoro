"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useSettings } from "@/hooks/use-settings"


export function PomodoroTimer() {
  const { settings } = useSettings()
  const {
    timeLeft,
    isRunning,
    currentMode,
    completedToday,
    setMode,
    startTimer,
    pauseTimer,
    resetTimer,
    resetCompletedToday,
    formatTime,
  } = usePomodoro()

  const modes = [
    { key: "pomodoro", label: "Pomodoro" },
    { key: "shortBreak", label: "Short break" },
    { key: "longBreak", label: "Long break" },
  ] as const

  const getTimerTitle = () => {
    return currentMode === "pomodoro" ? "Pomodoro" : currentMode === "shortBreak" ? "Short Break" : "Long Break"
  }

  const getProgressPercentage = () => {
    const totalDuration = currentMode === "pomodoro" 
      ? settings.pomodoroDuration * 60 
      : currentMode === "shortBreak" 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }


  return (
    <div className="w-full bg-theme-card-bg/30 backdrop-blur-sm border border-theme-card-border/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-theme-text-primary">{getTimerTitle()}</h2>
        </div>
        
        {/* Stats */}
        <div className="text-right">
          <div className="text-theme-text-secondary">
            <span className="text-theme-text-primary font-semibold text-sm sm:text-base">{completedToday}</span>
            <span className="ml-1 text-theme-text-secondary text-xs sm:text-sm">completed today</span>
          </div>
        </div>
      </div>


      {/* Mode Tabs */}
      <div className="flex bg-theme-input-bg/50 rounded-xl p-1 mb-6 sm:mb-8">
        {modes.map((mode) => (
          <Button
            key={mode.key}
            variant="ghost"
            onClick={() => setMode(mode.key)}
            className={`flex-1 rounded-lg p-2 sm:p-3 transition-all duration-200 ${
              currentMode === mode.key
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
        {/* Enhanced Timer Display */}
        <div className="relative mb-6 sm:mb-8">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-theme-accent/20 via-theme-progress/20 to-theme-accent/20 rounded-3xl blur-3xl scale-110 opacity-60 animate-pulse"></div>
          
          {/* Timer container */}
          <div className="relative bg-gradient-to-br from-theme-card-bg/80 to-theme-card-bg/40 backdrop-blur-xl border border-theme-card-border/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            {/* Timer digits */}
            <div className="text-5xl sm:text-7xl lg:text-9xl font-black text-theme-text-primary font-mono tracking-wider leading-none mb-2 sm:mb-3">
              {formatTime(timeLeft)}
            </div>
            
            {/* Timer status indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-theme-progress animate-pulse' : 'bg-theme-text-muted'}`}></div>
              <span className="text-sm sm:text-base font-medium text-theme-text-secondary uppercase tracking-wider">
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            
            {/* Progress percentage */}
            <div className="text-xs sm:text-sm font-medium text-theme-text-muted uppercase tracking-wider">
              {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>
        </div>

        {/* Enhanced Progress Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 mx-auto mb-4 sm:mb-6">
          {/* Ring background glow */}
          <div className="absolute inset-0 bg-theme-progress/20 rounded-full blur-lg scale-110"></div>
          
          <svg className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transform -rotate-90 drop-shadow-lg" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-theme-progress-bg/50"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}`}
              className="text-theme-progress transition-all duration-1000 ease-linear drop-shadow-lg"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px hsl(var(--theme-progress)/0.5))"
            />
          </svg>
          
          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-theme-progress animate-ping' : 'bg-theme-text-muted'}`}></div>
          </div>
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
          onClick={() => {
            resetTimer()
            resetCompletedToday()
          }}
          variant="outline"
          size="lg"
          className="border-theme-input-border text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-transparent"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Reset
        </Button>
      </div>

    </div>
  )
}
