"use client"

import { PomodoroTimer } from "@/components/pomodoro-timer"
import { TodoList } from "@/components/todo-list"
import { YoutubePlaylist } from "@/components/youtube-playlist"
import { SettingsModal } from "@/components/settings-modal"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { useState } from "react"
import { DailyQuote } from "@/components/daily-quote"
import { useTheme } from "@/hooks/use-theme"

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const { toggleTheme, currentTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-background-from via-theme-background-via to-theme-background-to">

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex-1" />
        <h1 className="text-2xl font-bold text-theme-text-primary">Deep Work</h1>
        <div className="flex-1 flex justify-end items-center gap-3">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-theme-text-secondary hover:text-theme-text-primary hover:bg-white/10 rounded-lg"
          >
            <Palette className="w-4 h-4 mr-2" />
            Theme
          </Button>
        </div>
      </header>

      {/* Daily Quote Section */}
      <div className="relative z-10 container mx-auto px-6 mb-6">
        <DailyQuote />
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 pb-6">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pomodoro Timer - Left Column */}
          <div className="space-y-6">
            <PomodoroTimer onSettingsClick={() => setShowSettings(true)} />
          </div>

          {/* Todo List - Right Column */}
          <div className="space-y-6">
            <TodoList />
          </div>
        </div>

        {/* YouTube Playlist Section - Bottom */}
        <YoutubePlaylist />
      </main>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
