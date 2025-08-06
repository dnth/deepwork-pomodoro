"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Edit3 } from "lucide-react"

export function DayProgressBar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workStartHour, setWorkStartHour] = useLocalStorage("work-start-hour", 10)
  const [workEndHour, setWorkEndHour] = useLocalStorage("work-end-hour", 17)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])
  // Ensure end is always after start within the same day.
  // Switch to 30-minute granularity for both start and end selections.
  // Persist values as minutes since midnight in localStorage for precision.
  const DEFAULT_WORK_DURATION_MIN = 8 * 60

  // Migrate old hour-based keys (if any) into minute-based ones once.
  // We reuse the same keys to avoid losing user settings.
  const ensureMinutes = (val: number) => {
    // If value looks like hours (0..23), convert to minutes.
    return val <= 23 ? val * 60 : val
  }

  // Re-wire local storage to minute-based values while preserving existing values.
  // We still read from same keys but convert on the fly.
  const [workStartRaw, setWorkStartRaw] = useLocalStorage("work-start-hour", 10) // may be hours or minutes
  const [workEndRaw, setWorkEndRaw] = useLocalStorage("work-end-hour", 17) // may be hours or minutes

  const workStartMin = ensureMinutes(workStartRaw)
  const workEndMin = ensureMinutes(workEndRaw)

  const adjustedEndMin =
    workEndMin <= workStartMin
      ? Math.min(23 * 60 + 59, workStartMin + DEFAULT_WORK_DURATION_MIN)
      : workEndMin

  const totalWorkMinutes = Math.max(0, adjustedEndMin - workStartMin)

  // Current time in minutes
  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  // Calculate progress with minute precision
  const currentTimeInMinutes = currentHour * 60 + currentMinutes
  const workStartInMinutes = workStartMin
  const workEndInMinutes = adjustedEndMin
  
  const isWorkDay = currentTimeInMinutes >= workStartInMinutes && currentTimeInMinutes < workEndInMinutes
  const totalMinutesCompleted = Math.max(0, Math.min(currentTimeInMinutes - workStartInMinutes, totalWorkMinutes))
  const totalMinutesInDay = Math.max(1, totalWorkMinutes)
  const progressPercentage = Math.min(100, (totalMinutesCompleted / totalMinutesInDay) * 100)

  const totalMinutesLeft = Math.max(0, workEndInMinutes - currentTimeInMinutes)
  const hoursLeft = Math.floor(totalMinutesLeft / 60)
  const minutesLeft = totalMinutesLeft % 60
  const isAfterWork = currentTimeInMinutes >= workEndInMinutes

  // Calculate remaining percentage and color with gradual transition
  const remainingPercentage = 100 - progressPercentage
  const getBarStyle = () => {
    const percentage = remainingPercentage / 100
    
    if (percentage > 0.8) {
      // Pure green
      return { background: 'linear-gradient(to right, #4ade80, #22c55e)' }
    } else if (percentage > 0.6) {
      // Green to yellow-green
      const greenMix = (percentage - 0.6) / 0.2
      return { 
        background: `linear-gradient(to right, 
          rgb(${Math.round(74 + (255 - 74) * (1 - greenMix))}, ${Math.round(222 + (255 - 222) * (1 - greenMix))}, ${Math.round(128 * greenMix)}), 
          rgb(${Math.round(34 + (255 - 34) * (1 - greenMix))}, ${Math.round(197 + (255 - 197) * (1 - greenMix))}, ${Math.round(94 * greenMix)}))` 
      }
    } else if (percentage > 0.4) {
      // Yellow-green to yellow
      const yellowMix = (percentage - 0.4) / 0.2
      return { 
        background: `linear-gradient(to right, 
          rgb(255, ${Math.round(255 - (255 - 222) * (1 - yellowMix))}, ${Math.round(128 * yellowMix)}), 
          rgb(255, ${Math.round(255 - (255 - 197) * (1 - yellowMix))}, ${Math.round(94 * yellowMix)}))` 
      }
    } else if (percentage > 0.2) {
      // Yellow to orange
      const orangeMix = (percentage - 0.2) / 0.2
      return { 
        background: `linear-gradient(to right, 
          rgb(255, ${Math.round(222 - (222 - 165) * (1 - orangeMix))}, ${Math.round(128 * orangeMix)}), 
          rgb(255, ${Math.round(197 - (197 - 149) * (1 - orangeMix))}, ${Math.round(94 * orangeMix)}))` 
      }
    } else {
      // Orange to red
      const redMix = percentage / 0.2
      return { 
        background: `linear-gradient(to right, 
          rgb(255, ${Math.round(165 * redMix)}, ${Math.round(165 * redMix)}), 
          rgb(255, ${Math.round(149 * redMix)}, ${Math.round(149 * redMix)}))` 
      }
    }
  }


  // Build 30-minute options: 0, 30, 60, 90, ... , 23*60, 23*60+30
  const minuteOptions = Array.from({ length: 48 }, (_, i) => i * 30)

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    const ampm = h === 0 ? "12AM" : h < 12 ? `${h}AM` : h === 12 ? "12PM" : `${h - 12}PM`
    const mm = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`
    // Insert minutes into the am/pm display
    if (m === 0) return ampm
    // Convert like "1PM" -> "1:30PM"
    const match = ampm.match(/^(\d+)(AM|PM)$/)
    if (match) {
      return `${match[1]}:${m.toString().padStart(2, "0")}${match[2]}`
    }
    return ampm
  }

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

  const setWorkStartMin = (mins: number) => {
    // Persist as minutes; keep original key for backward compatibility
    setWorkStartRaw(mins)
  }
  const setWorkEndMin = (mins: number) => {
    setWorkEndRaw(mins)
  }

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    const incomingMin = Number(value)

    if (type === 'start') {
      // If moving start to or past the current adjusted end, bump end to start + default, clamped.
      if (incomingMin >= adjustedEndMin) {
        const nextEnd = clamp(incomingMin + DEFAULT_WORK_DURATION_MIN, incomingMin + 30, 23 * 60 + 59)
        setWorkStartMin(incomingMin)
        setWorkEndMin(nextEnd)
      } else {
        setWorkStartMin(incomingMin)
      }
    } else {
      // If choosing an end at/before start, auto-adjust to start + default, clamped.
      if (incomingMin <= workStartMin) {
        const nextEnd = clamp(workStartMin + DEFAULT_WORK_DURATION_MIN, workStartMin + 30, 23 * 60 + 59)
        setWorkEndMin(nextEnd)
      } else {
        setWorkEndMin(incomingMin)
      }
    }
  }

  return (
    <div className="w-full">

      {/* Progress Bar */}
      <div className="mb-2 relative">
        <div className="relative bg-theme-progress-bg border-2 border-theme-progress-bg rounded-lg overflow-hidden h-8 shadow-inner cursor-pointer group">
          {/* Subtle pulse animation on first load to indicate interactivity */}
          <div className="absolute inset-0 animate-pulse opacity-20 bg-white/10 rounded-lg pointer-events-none" />
          {/* HP Bar Fill */}
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${100 - progressPercentage}%`,
              ...getBarStyle()
            }}
          />
          
          {/* HP Bar Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          
          {/* HP Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-2 text-white font-bold text-xs drop-shadow-lg pointer-events-none">
            <span>
              {isAfterWork ? "SPRINT COMPLETE" : 
               currentTimeInMinutes < workStartInMinutes ? `WORK STARTS IN ${Math.floor((workStartInMinutes - currentTimeInMinutes) / 60)}H ${(workStartInMinutes - currentTimeInMinutes) % 60}M` :
               `${hoursLeft}H ${minutesLeft}M LEFT`}
            </span>
          </div>
          
          {/* Start Time Dropdown */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10">
            <Select value={workStartMin.toString()} onValueChange={(value) => handleTimeChange('start', value)}>
              <SelectTrigger className="w-24 h-6 text-xs bg-black/60 hover:bg-black/70 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map(mins => (
                  // Allow starting at any 30-min increment; we auto-adjust end when needed
                  <SelectItem key={mins} value={mins.toString()}>
                    {formatTime(mins)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* End Time Dropdown */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 z-10">
            <Select value={workEndMin.toString()} onValueChange={(value) => handleTimeChange('end', value)}>
              <SelectTrigger className="w-24 h-6 text-xs bg-black/60 hover:bg-black/70 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map(mins => (
                  <SelectItem key={mins} value={mins.toString()} disabled={mins <= workStartMin}>
                    {formatTime(mins)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Segmented Lines - 30 minute sections */}
          <div className="absolute inset-0 flex pointer-events-none">
            {Array.from({ length: Math.max(0, Math.floor(totalWorkMinutes / 30)) }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-black/20 last:border-r-0"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}