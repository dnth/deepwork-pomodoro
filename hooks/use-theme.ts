"use client"

import { useState, useEffect } from "react"

export type ThemePalette = "forest" | "midnight"

interface ThemeColors {
  name: string
  background: string
  backgroundGradient: string
  cardBg: string
  cardBorder: string
  cardHover: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accent: string
  accentHover: string
  progress: string
  progressBg: string
  inputBg: string
  inputBorder: string
}

const themes: Record<ThemePalette, ThemeColors> = {
  forest: {
    name: "Forest Focus",
    background: "from-slate-900 via-slate-800 to-slate-700", // #0f172a to #1e293b gradient
    backgroundGradient: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700",
    cardBg: "bg-slate-600/30", // #475569 with opacity
    cardBorder: "border-slate-500/30",
    cardHover: "hover:bg-slate-600/40",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400", // #64748b
    accent: "bg-green-500", // #22c55e
    accentHover: "hover:bg-green-600", // #16a34a
    progress: "bg-amber-500", // #f59e0b
    progressBg: "bg-slate-600",
    inputBg: "bg-slate-700/50",
    inputBorder: "border-slate-500",
  },
  midnight: {
    name: "Midnight Productivity",
    background: "from-slate-900 via-blue-950 to-blue-900", // Deep navy theme
    backgroundGradient: "bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900",
    cardBg: "bg-blue-900/30", // More blue tint
    cardBorder: "border-blue-700/30",
    cardHover: "hover:bg-blue-900/40",
    textPrimary: "text-blue-50", // Slightly blue tinted white
    textSecondary: "text-blue-200",
    textMuted: "text-blue-300",
    accent: "bg-cyan-500", // More distinct from green
    accentHover: "hover:bg-cyan-600",
    progress: "bg-cyan-400",
    progressBg: "bg-blue-800",
    inputBg: "bg-blue-900/50",
    inputBorder: "border-blue-600",
  },
}

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>("forest")

  useEffect(() => {
    // Load from localStorage on client side
    try {
      const saved = localStorage.getItem("theme-palette")
      if (saved) {
        setCurrentTheme(JSON.parse(saved) as ThemePalette)
      }
    } catch (error) {
      console.error("Error loading theme from localStorage:", error)
    }
  }, [])

  const theme = themes[currentTheme]
  console.log("useTheme hook rendered - currentTheme:", currentTheme, "theme:", theme.name)

  const toggleTheme = () => {
    const newTheme = currentTheme === "forest" ? "midnight" : "forest"
    console.log("Toggling theme from", currentTheme, "to", newTheme)
    console.log("Current theme object:", theme)
    console.log("New theme object:", themes[newTheme])
    
    setCurrentTheme(newTheme)
    try {
      localStorage.setItem("theme-palette", JSON.stringify(newTheme))
    } catch (error) {
      console.error("Error saving theme to localStorage:", error)
    }
  }

  return {
    currentTheme,
    theme,
    toggleTheme,
    themes,
  }
}
