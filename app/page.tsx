"use client"

import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TodoList } from "@/components/todo-list"
import { YoutubePlaylist } from "@/components/youtube-playlist"
import { SettingsModal } from "@/components/settings-modal"
import { DayProgressBar } from "@/components/day-progress-blocks"
import { Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { DailyQuote } from "@/components/daily-quote"

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Only show theme toggle after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background-from via-theme-background-via to-theme-background-to">

      {/* Compact Header with App Name, Time, and Progress Bar */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          {/* Left: App Name */}
          <h1 className="text-xl sm:text-2xl font-bold text-theme-text-primary">Deep Work</h1>
          
          {/* Center: Current Time */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Time Display */}
              <span className="text-xl sm:text-2xl lg:text-3xl font-light text-theme-text-primary font-mono tracking-wider">
                {mounted ? currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
                }) : '--:--'}
              </span>
              
              {/* Date Display */}
              <span className="text-theme-text-secondary text-xs sm:text-sm uppercase tracking-widest">
                {mounted ? currentTime.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                }) : '--- --- --'}
              </span>
            </div>
          </div>
          
          {/* Right: Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="text-theme-text-secondary hover:text-theme-text-primary hover:bg-white/10 rounded-lg p-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        {/* Compact Day Progress HP Bar */}
        <DayProgressBar />
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        {/* Daily Quote Section */}
        <div className="grid gap-4 sm:gap-6">
          {/* Daily Quote */}
          <div>
            <DailyQuote />
          </div>


          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Pomodoro Timer - Left Column */}
            <div className="w-full">
              <PomodoroTimer />
            </div>

            {/* Todo List - Right Column */}
            <div className="w-full">
              <TodoList />
            </div>
          </div>

          {/* YouTube Playlist Section - Bottom */}
          <div>
            <YoutubePlaylist />
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* Footer */}
      <footer className="relative z-10 p-4 sm:p-6">
        <div className="text-center text-theme-text-secondary text-sm">
          Made by{' '}
          <a 
            href="https://dicksonneoh.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-theme-text-primary hover:underline"
          >
            Dickson Neoh
          </a>
          {' • '}
          <a 
            href="https://www.buymeacoffee.com/dicksonneoh" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-theme-text-primary hover:underline"
          >
            Buy me a coffee
          </a>
        </div>
      </footer>
    </div>
  )
}
