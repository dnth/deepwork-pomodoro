"use client"

import { useMemo } from "react"

interface FocusRingProps {
  timeLeft: number
  totalDuration: number
  isRunning: boolean
  currentMode: "deep" | "focus" | "quick"
  size?: number
  className?: string
}

export function FocusRing({
  timeLeft,
  totalDuration,
  isRunning,
  currentMode,
  size = 144,
  className = ""
}: FocusRingProps) {
  const radius = 54
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth * 0.5
  const circumference = normalizedRadius * 2 * Math.PI

  // Memoize expensive calculations
  const calculations = useMemo(() => {
    const progress = ((totalDuration - timeLeft) / totalDuration) * 100
    const isOvertime = timeLeft === 0 && isRunning

    // Calculate milestone segments (5-minute chunks for deep/focus)
    const milestoneCount = (currentMode === "deep" || currentMode === "focus") ? 5 : Math.ceil(totalDuration / 300) // 5 minutes = 300 seconds
    const segmentDuration = totalDuration / milestoneCount
    const completedSegments = Math.floor((totalDuration - timeLeft) / segmentDuration)
    const currentSegmentProgress = ((totalDuration - timeLeft) % segmentDuration) / segmentDuration

    return {
      progress,
      isOvertime,
      milestoneCount,
      segmentDuration,
      completedSegments,
      currentSegmentProgress
    }
  }, [totalDuration, timeLeft, isRunning, currentMode])

  const { progress, isOvertime, milestoneCount, segmentDuration, completedSegments, currentSegmentProgress } = calculations

  // Memoize visual state and classes
  const visualStateAndClasses = useMemo(() => {
    const getVisualState = () => {
      if (isOvertime) return "overtime"
      if (currentMode === "deep" || currentMode === "focus") return "focus"
      return "break"
    }

    const visualState = getVisualState()

    const getStateClasses = () => {
      switch (visualState) {
        case "focus":
          return {
            ring: "text-theme-accent",
            glow: "",
            background: "text-theme-card-border"
          }
        case "break":
          return {
            ring: "text-theme-progress",
            glow: "",
            background: "text-theme-card-border"
          }
        case "overtime":
          return {
            ring: "text-destructive",
            glow: "",
            background: "text-theme-card-border"
          }
        default:
          return {
            ring: "text-theme-progress",
            glow: "",
            background: "text-theme-progress-bg"
          }
      }
    }

    return {
      visualState,
      stateClasses: getStateClasses()
    }
  }, [isOvertime, currentMode, isRunning])

  const { visualState, stateClasses } = visualStateAndClasses

  // Generate milestone tick marks
  const milestoneMarkers = useMemo(() => {
    const markers = []
    for (let i = 0; i < milestoneCount; i++) {
      const angle = (i / milestoneCount) * 360 - 90 // Start from top
      const x1 = 60 + (radius - 15) * Math.cos(angle * Math.PI / 180)
      const y1 = 60 + (radius - 15) * Math.sin(angle * Math.PI / 180)
      const x2 = 60 + (radius - 8) * Math.cos(angle * Math.PI / 180)
      const y2 = 60 + (radius - 8) * Math.sin(angle * Math.PI / 180)
      
      markers.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="2"
          className="text-theme-text-muted opacity-60"
        />
      )
    }
    return markers
  }, [milestoneCount, radius])

  // Generate progress arc - optimized to single element
  const progressArc = useMemo(() => {
    const totalProgress = (completedSegments * (circumference / milestoneCount)) + (currentSegmentProgress * (circumference / milestoneCount))
    const isCurrentSegment = completedSegments < milestoneCount

    return (
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={`${totalProgress} ${circumference - totalProgress}`}
        strokeDashoffset="0"
        className={stateClasses.ring}
        strokeLinecap="round"
        style={{
          opacity: isCurrentSegment ? 0.8 : 1
        }}
      />
    )
  }, [milestoneCount, completedSegments, currentSegmentProgress, stateClasses.ring, circumference, normalizedRadius, strokeWidth])

  const progressPercentage = Math.round(progress)
  const stateDescription = useMemo(() => ({
    focus: `Focus session ${progressPercentage}% complete`,
    break: `Break time ${progressPercentage}% complete`,
    overtime: `Session overtime, ${Math.abs(timeLeft)} seconds over`
  }), [progressPercentage, timeLeft])

  // Type assertion for visualState to ensure proper indexing
  const typedVisualState = visualState as keyof typeof stateDescription

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, animation: 'none' }}
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={stateDescription[typedVisualState]}
      aria-describedby={`focus-ring-${typedVisualState}`}
    >
      {/* Screen reader description */}
      <div 
        id={`focus-ring-${visualState}`} 
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {stateDescription[typedVisualState]}.
        {completedSegments > 0 && `Completed ${completedSegments} of ${milestoneCount} milestone segments.`}
        {isRunning ? 'Timer is running.' : 'Timer is paused.'}
      </div>

      {/* Background glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-md scale-110 opacity-40 ${
          visualState === 'focus' ? 'bg-theme-accent/20' :
          visualState === 'break' ? 'bg-theme-progress/20' : 'bg-destructive/20'
        }`}
        style={{ animation: 'none' }}
        aria-hidden="true"
      ></div>
      
      <svg
        className="relative transform -rotate-90"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        aria-hidden="true"
        style={{ animation: 'none' }}
      >
        {/* Background ring */}
        <circle
          cx="60"
          cy="60"
          r={normalizedRadius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={stateClasses.background}
        />
        
        {/* Milestone markers */}
        {milestoneMarkers}
        
        {/* Progress arc */}
        {progressArc}
        
        {/* Overtime indicator */}
        {isOvertime && (
          <circle
            cx="60"
            cy="60"
            r={normalizedRadius + 5}
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-red-500 opacity-80"
            strokeDasharray="10 5"
          />
        )}
      </svg>
      
      {/* Center indicator */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'none' }} aria-hidden="true">
        <div className={`w-4 h-4 rounded-full ${
          isRunning
            ? `${visualState === 'focus' ? 'bg-theme-accent' :
                visualState === 'break' ? 'bg-theme-progress' : 'bg-destructive'}`
            : 'bg-theme-text-muted'
        }`}></div>
      </div>

    </div>
  )
}