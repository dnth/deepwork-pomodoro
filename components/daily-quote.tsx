"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Edit3 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function DailyQuote() {
  const [quote, setQuote] = useLocalStorage("daily-quote", "Focus on progress, not perfection.")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuote(e.target.value)
  }

  return (
    <div
      className="bg-theme-card-bg/30 backdrop-blur-sm border-theme-card-border/30 border rounded-2xl p-8 shadow-2xl group hover:bg-theme-card-bg/40 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-theme-task-bg/20 rounded-xl">
          <Edit3 className="w-6 h-6 text-theme-task-text" />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-theme-text-muted mb-2">Daily Quote / Motto</label>
          <Input
            value={quote}
            onChange={handleChange}
            placeholder="Enter your daily quote or motto..."
            className="bg-transparent border-none text-5xl text-theme-text-primary placeholder:text-theme-text-muted p-0 h-auto font-medium italic focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

    </div>
  )
}
