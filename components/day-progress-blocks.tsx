"use client"

import { useState, useEffect } from "react"

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

  return (
    <div className="w-full mb-4">
      {/* Work Hours Configuration */}
      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex items-center gap-2">
          <label className="text-theme-text-secondary text-sm">Start:</label>
          <select 
            value={workStartHour}
            onChange={(e) => setWorkStartHour(Number(e.target.value))}
            className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-theme-text text-sm"
          >
            {hourOptions.map(hour => (
              <option key={hour} value={hour}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-theme-text-secondary text-sm">End:</label>
          <select 
            value={workEndHour}
            onChange={(e) => setWorkEndHour(Number(e.target.value))}
            className="px-2 py-1 bg-theme-surface border border-theme-border rounded text-theme-text text-sm"
          >
            {hourOptions.map(hour => (
              <option key={hour} value={hour}>
                {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* HP Bar Container */}
      <div className="relative bg-red-900/20 border-2 border-red-700/40 rounded-lg overflow-hidden h-6 shadow-inner">
        {/* HP Bar Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out"
          style={{ width: `${100 - progressPercentage}%` }}
        />
        
        {/* HP Bar Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        
        {/* HP Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-3 text-white font-bold text-xs drop-shadow-lg">
          <span>
            {isAfterWork ? "DAY COMPLETE" : 
             currentHour < workStartHour ? "DAY ENERGY" :
             `${hoursLeft}H ${60 - currentMinutes}M LEFT`}
          </span>
          <span>{Math.round(100 - progressPercentage)}%</span>
        </div>
        
        {/* Segmented Lines (like Pokemon HP bar) */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: 6 }, (_, i) => (
            <div 
              key={i} 
              className="flex-1 border-r border-black/20 last:border-r-0" 
            />
          ))}
        </div>
      </div>
      
      {/* Status Text */}
      <div className="text-center mt-2">
        <div className="text-theme-text-secondary text-sm">
          {getStatusText()}
        </div>
      </div>
    </div>
  )
}