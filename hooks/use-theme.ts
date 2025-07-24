"use client"

import { useState, useEffect } from "react"

export type ThemePalette = "forest" | "midnight"

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

  useEffect(() => {
    // Apply theme class to document
    const themeClass = `theme-${currentTheme}`
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, '')
      .trim() + ` ${themeClass}`
  }, [currentTheme])

  const toggleTheme = () => {
    const newTheme = currentTheme === "forest" ? "midnight" : "forest"
    setCurrentTheme(newTheme)
    try {
      localStorage.setItem("theme-palette", JSON.stringify(newTheme))
    } catch (error) {
      console.error("Error saving theme to localStorage:", error)
    }
  }

  return {
    currentTheme,
    toggleTheme,
  }
}