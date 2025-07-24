"use client"

import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TodoList } from "@/components/todo-list"
import { YoutubePlaylist } from "@/components/youtube-playlist"
import { SettingsModal } from "@/components/settings-modal"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { DailyQuote } from "@/components/daily-quote"
import { useTheme } from "next-themes"

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const { theme, setTheme } = useTheme()
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background-from via-theme-background-via to-theme-background-to">

      {/* Compact Header with App Name, Time, and Theme Toggle */}
      <header className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Left: App Name */}
          <h1 className="text-xl sm:text-2xl font-bold text-theme-text-primary">Deep Work</h1>
          
          {/* Center: Time and Date */}
          <div className="text-center">
            <div className="text-theme-text-primary text-lg sm:text-xl font-light tracking-wide">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-theme-text-secondary text-xs sm:text-sm -mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          {/* Right: Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-theme-text-secondary hover:text-theme-text-primary hover:bg-white/10 rounded-lg"
          >
            {mounted && (theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            ))}
            Theme
          </Button>
        </div>
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
              <PomodoroTimer onSettingsClick={() => setShowSettings(true)} />
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
    </div>
  )
}
