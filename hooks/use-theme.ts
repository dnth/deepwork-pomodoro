"use client"

import { useLocalStorage } from "./use-local-storage"

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
    background: "from-slate-900 via-blue-950 to-slate-800", // Deep navy theme
    backgroundGradient: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800",
    cardBg: "bg-slate-700/30", // #1e293b with opacity
    cardBorder: "border-slate-600/30",
    cardHover: "hover:bg-slate-700/40",
    textPrimary: "text-slate-50", // #f8fafc
    textSecondary: "text-slate-200",
    textMuted: "text-slate-400",
    accent: "bg-teal-500", // #14b8a6
    accentHover: "hover:bg-teal-600",
    progress: "bg-teal-400",
    progressBg: "bg-slate-600",
    inputBg: "bg-slate-800/50",
    inputBorder: "border-slate-500",
  },
}

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useLocalStorage<ThemePalette>("theme-palette", "forest")

  const theme = themes[currentTheme]

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "forest" ? "midnight" : "forest")
  }

  return {
    currentTheme,
    theme,
    toggleTheme,
    themes,
  }
}
