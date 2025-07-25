"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"

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
  const totalWorkHours = workEndHour - workStartHour
  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  // Calculate progress with minute precision
  const currentTimeInMinutes = currentHour * 60 + currentMinutes
  const workStartInMinutes = workStartHour * 60
  const workEndInMinutes = workEndHour * 60
  
  const isWorkDay = currentTimeInMinutes >= workStartInMinutes && currentTimeInMinutes < workEndInMinutes
  const totalMinutesCompleted = Math.max(0, Math.min(currentTimeInMinutes - workStartInMinutes, totalWorkHours * 60))
  const totalMinutesInDay = totalWorkHours * 60
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


  const hourOptions = Array.from({ length: 24 }, (_, i) => i)

  const formatHour = (hour: number) => {
    return hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour - 12}PM` : `${hour}AM`
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-semibold text-theme-text-primary">Time left</h3>
      </div>
      
      {/* Compact Progress Bar with Integrated Time Controls */}
      <div className="flex items-center gap-2 mb-2">
        <Select value={workStartHour.toString()} onValueChange={(value) => setWorkStartHour(Number(value))}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map(hour => (
              <SelectItem key={hour} value={hour.toString()} disabled={hour >= workEndHour}>
                {formatHour(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* HP Bar Container */}
        <div className="flex-1 relative bg-red-900/20 border-2 border-red-700/40 rounded-lg overflow-hidden h-8 shadow-inner">
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
          <div className="absolute inset-0 flex items-center justify-center px-2 text-white font-bold text-xs drop-shadow-lg">
            <span>
              {isAfterWork ? "DAY COMPLETE" : 
               currentTimeInMinutes < workStartInMinutes ? `WORK STARTS IN ${Math.floor((workStartInMinutes - currentTimeInMinutes) / 60)}H ${(workStartInMinutes - currentTimeInMinutes) % 60}M` :
               `${hoursLeft}H ${minutesLeft}M LEFT`}
            </span>
          </div>
          
          {/* Segmented Lines - 30 minute sections */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: totalWorkHours * 2 }, (_, i) => (
              <div 
                key={i} 
                className="flex-1 border-r border-black/20 last:border-r-0" 
              />
            ))}
          </div>
        </div>
        
        <Select value={workEndHour.toString()} onValueChange={(value) => setWorkEndHour(Number(value))}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map(hour => (
              <SelectItem key={hour} value={hour.toString()} disabled={hour <= workStartHour}>
                {formatHour(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}