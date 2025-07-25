"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DayProgressBar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [workStartHour, setWorkStartHour] = useState(10)
  const [workEndHour, setWorkEndHour] = useState(17)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])
  const totalWorkHours = workEndHour - workStartHour
  const currentHour = currentTime.getHours()
  const currentMinutes = currentTime.getMinutes()

  // Calculate progress
  const isWorkDay = currentHour >= workStartHour && currentHour < workEndHour
  const hoursCompleted = Math.max(0, Math.min(currentHour - workStartHour, totalWorkHours))
  const minutesInCurrentHour = isWorkDay && currentHour < workEndHour ? currentMinutes : 0
  const totalMinutesCompleted = hoursCompleted * 60 + minutesInCurrentHour
  const totalMinutesInDay = totalWorkHours * 60
  const progressPercentage = Math.min(100, (totalMinutesCompleted / totalMinutesInDay) * 100)

  const hoursLeft = Math.max(0, workEndHour - currentHour)
  const isAfterWork = currentHour >= workEndHour

  const getStatusText = () => {
    if (isAfterWork) return ""
    if (currentHour < workStartHour) return `Work starts in ${workStartHour - currentHour} hours`
    return `${hoursLeft} hours left today`
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => i)

  const formatHour = (hour: number) => {
    return hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour - 12}PM` : `${hour}AM`
  }

  return (
    <div className="w-full">
      {/* Compact Progress Bar with Integrated Time Controls */}
      <div className="flex items-center gap-2 mb-2">
        <Select value={workStartHour.toString()} onValueChange={(value) => setWorkStartHour(Number(value))}>
          <SelectTrigger className="w-20 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {hourOptions.map(hour => (
              <SelectItem key={hour} value={hour.toString()}>
                {formatHour(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* HP Bar Container */}
        <div className="flex-1 relative bg-red-900/20 border-2 border-red-700/40 rounded-lg overflow-hidden h-8 shadow-inner">
          {/* HP Bar Fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out"
            style={{ width: `${100 - progressPercentage}%` }}
          />
          
          {/* HP Bar Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          
          {/* HP Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center px-2 text-white font-bold text-xs drop-shadow-lg">
            <span>
              {isAfterWork ? "DAY COMPLETE" : 
               currentHour < workStartHour ? "DAY ENERGY" :
               `${hoursLeft}H ${60 - currentMinutes}M LEFT`}
            </span>
          </div>
          
          {/* Segmented Lines */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 6 }, (_, i) => (
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
              <SelectItem key={hour} value={hour.toString()}>
                {formatHour(hour)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Compact Status */}
      {getStatusText() && (
        <div className="text-center">
          <div className="text-theme-text-secondary text-xs">
            {getStatusText()}
          </div>
        </div>
      )}
    </div>
  )
}