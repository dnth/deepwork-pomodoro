"use client"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Play, Pause, RotateCcw } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useSettings } from "@/hooks/use-settings"
import { useSlidingIndicator } from "@/hooks/use-sliding-indicator"
import { FocusRing } from "@/components/focus-ring"
import { taskTagConfig } from "@/hooks/use-todos"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type Preset = "deep" | "focus" | "quick"

const presetConfig = {
  deep: { label: "Deep", minutes: 50 },
  focus: { label: "Focus", minutes: 25 },
  quick: { label: "Quick", minutes: 5 },
} as const satisfies Record<Preset, { label: string; minutes: number }>

// Presets now map directly to modes

const ACCENT_COLOR = 'hsl(var(--theme-accent))'

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
    resetTimerTo,
    resetCompletedToday,
    formatTime,
  } = usePomodoro()

  // Track the selected preset locally (default to "focus")
  const [selectedPreset, setSelectedPreset] = useState<Preset>("focus")

  const [isMounted, setIsMounted] = useState(false)
  const taskTypeSelectorRef = useRef<HTMLDivElement>(null)
  const indicatorStyle = useSlidingIndicator(selectedPreset, taskTypeSelectorRef, isMounted)

  // On mount: if not running, default to "focus" and sync underlying mode; do not reset if already running
  useEffect(() => {
    if (!isRunning) {
      setSelectedPreset("focus")
      setMode("focus")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])


  // Total duration in seconds based on selected preset
  const totalDurationSec = useMemo(
    () => presetConfig[selectedPreset].minutes * 60,
    [selectedPreset]
  )

  const timerTitle = useMemo(() => "Pomodoro Timer", [])

  const progressPercentage = useMemo(() => {
    const total = totalDurationSec
    return total > 0 ? ((total - timeLeft) / total) * 100 : 0
  }, [totalDurationSec, timeLeft])

  // Handle preset button clicks
  const handleSelectPreset = (preset: Preset) => {
    setSelectedPreset(preset)
    setMode(preset)
  }

  const presets: { key: Preset; label: string; emoji: string }[] = [
    { key: "deep", label: presetConfig.deep.label, emoji: taskTagConfig.deep.symbol },
    { key: "focus", label: presetConfig.focus.label, emoji: taskTagConfig.focus.symbol },
    { key: "quick", label: presetConfig.quick.label, emoji: taskTagConfig.quick.symbol },
  ]

  return (
    <div className="w-full card-premium-glass rounded-xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-theme-text-primary">{timerTitle}</h2>
        </div>
        
        {/* Stats */}
        <div className="text-right">
          <div className="text-theme-text-secondary">
            <span className="text-theme-text-primary font-semibold text-base sm:text-lg">{completedToday}</span>
            <span className="ml-1 text-theme-text-secondary text-xs sm:text-sm">completed today</span>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="bg-theme-input-bg/50 rounded-lg p-1 mb-6 relative" ref={taskTypeSelectorRef}>
        {/* Sliding indicator */}
        <div
          className="absolute top-0 rounded-md transition-all duration-300 ease-in-out z-0 shadow-lg"
          style={{
            backgroundColor: ACCENT_COLOR,
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            height: '100%'
          }}
        />
        <ToggleGroup
          type="single"
          value={selectedPreset}
          onValueChange={(v) => v && handleSelectPreset(v as Preset)}
          className="flex flex-row gap-1 relative z-10"
          aria-label="Pomodoro preset"
        >
          {presets.map((p) => (
            <ToggleGroupItem
              key={p.key}
              value={p.key}
              className="flex-1 rounded-md p-3 relative z-10 data-[state=on]:text-theme-text-primary data-[state=on]:shadow-lg text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40"
              style={selectedPreset === p.key ? { backgroundColor: ACCENT_COLOR } : {}}
              aria-label={`${p.label} ${presetConfig[p.key as Preset].minutes} minutes`}
            >
              {p.emoji} {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-8">
        {/* Enhanced Timer Display */}
        <div className="relative mb-8">
          {/* Timer container */}
          <div className="relative bg-gradient-to-br from-theme-card-bg/80 to-theme-card-bg/40 backdrop-blur-xl border border-theme-card-border/50 rounded-xl p-8 shadow-2xl overflow-hidden">
            {/* Timer digits */}
            <div className="font-black text-theme-text-primary font-mono tracking-tight leading-none mb-2 sm:mb-3
                            w-full max-w-full whitespace-nowrap overflow-hidden"
                 style={{ fontSize: "clamp(2.5rem, 12vw, 6.5rem)" }}>
              {formatTime(timeLeft)}
            </div>
            
            {/* Timer status indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-theme-progress' : 'bg-theme-text-muted'}`} style={{ animation: 'none' }}></div>
              <span className="text-xs sm:text-base font-medium text-theme-text-secondary uppercase tracking-wider">
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            
            {/* Progress percentage */}
            <div className="text-xs sm:text-sm font-medium text-theme-text-muted uppercase tracking-wider">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>

        {/* Progress Ring - Enhanced or Classic */}
        <div className="flex justify-center mb-6">
          {settings.enhancedVisualization ? (
            <FocusRing
              timeLeft={timeLeft}
              totalDuration={totalDurationSec}
              isRunning={isRunning}
              currentMode={currentMode}
              size={144}
              className=""
            />
          ) : (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
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
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progressPercentage / 100)}`}
                  className="text-theme-progress drop-shadow-lg"
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 8px hsl(var(--theme-progress)/0.5))"
                />
              </svg>
              
              {/* Center indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-4 h-4 rounded-full ${isRunning ? 'bg-theme-progress' : 'bg-theme-text-muted'}`} style={{ animation: 'none' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          size="lg"
          className="hover:bg-theme-accent-hover text-theme-text-primary px-6 py-3 rounded-lg shadow-lg"
          style={{ backgroundColor: '#0d9488' }}
        >
          {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={() => {
            resetTimer()
            resetCompletedToday()
          }}
          variant="outline"
          size="lg"
          className="border-theme-input-border text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40 px-4 py-3 rounded-lg bg-transparent"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
              </div>
              <div className="divider-gradient-secondary"></div>
            </div>
          )
        }
