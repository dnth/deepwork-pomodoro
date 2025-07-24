"use client"

import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TodoList } from "@/components/todo-list"
import { YoutubePlaylist } from "@/components/youtube-playlist"
import { SettingsModal } from "@/components/settings-modal"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState } from "react"
import { DailyQuote } from "@/components/daily-quote"
import { useTheme } from "next-themes"

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background-from via-theme-background-via to-theme-background-to">

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <div className="flex-1" />
        <h1 className="text-xl sm:text-2xl font-bold text-theme-text-primary">Deep Work</h1>
        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-theme-text-secondary hover:text-theme-text-primary hover:bg-white/10 rounded-lg"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 mr-2" />
            ) : (
              <Moon className="w-4 h-4 mr-2" />
            )}
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
