"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Edit3 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTheme } from "@/hooks/use-theme"

export function DailyQuote() {
  const [quote, setQuote] = useLocalStorage("daily-quote", "Focus on progress, not perfection.")
  const { theme } = useTheme()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuote(e.target.value)
  }

  return (
    <div
      className={`${theme.cardBg} backdrop-blur-sm ${theme.cardBorder} border rounded-2xl p-8 shadow-2xl group ${theme.cardHover} transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl`}>
          <Edit3 className={`w-6 h-6 text-green-400`} />
        </div>

        <div className="flex-1">
          <label className={`block text-sm font-medium ${theme.textMuted} mb-2`}>Daily Quote / Motto</label>
          <Input
            value={quote}
            onChange={handleChange}
            placeholder="Enter your daily quote or motto..."
            className={`bg-transparent border-none text-xl ${theme.textPrimary} placeholder:text-slate-400 p-0 h-auto font-medium italic focus-visible:ring-0 focus-visible:ring-offset-0`}
          />
        </div>
      </div>

      <div className={`mt-4 text-xs ${theme.textMuted}`}>
        Your personal motivation for today - updates automatically as you type
      </div>
    </div>
  )
}
