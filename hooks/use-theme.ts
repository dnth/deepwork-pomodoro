"use client"

import { useState, useEffect } from "react"

export type ThemePalette = "forest" | "midnight"

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>("midnight")

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
    
    // Remove existing theme classes
    document.documentElement.classList.remove('theme-forest', 'theme-midnight')
    
    // Add new theme class
    document.documentElement.classList.add(themeClass)
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