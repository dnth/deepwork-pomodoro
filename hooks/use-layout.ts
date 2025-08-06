"use client"

import { useEffect, useMemo, useState } from "react"
import { useIsMobile } from "./use-mobile"

export type LayoutMode = "horizontal" | "vertical"

const STORAGE_KEY = "deepwork-layout-preference"

/**
 * useLayout
 * Manages layout mode with persistence and mobile override.
 * - Persists user choice in localStorage
 * - Forces vertical on mobile (max-width: 768px)
 * - Provides effectiveLayout that respects mobile override
 */
export function useLayout() {
  const isMobile = useIsMobile()
  const [preferredLayout, setPreferredLayout] = useState<LayoutMode>("horizontal")
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LayoutMode | null
      if (saved === "horizontal" || saved === "vertical") {
        setPreferredLayout(saved)
      }
    } catch {
      // ignore read errors
    } finally {
      setHydrated(true)
    }
  }, [])

  // Persist when preferredLayout changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preferredLayout)
    } catch {
      // ignore write errors
    }
  }, [preferredLayout])

  // Effective layout respects mobile override
  const effectiveLayout: LayoutMode = useMemo(() => {
    if (isMobile) return "vertical"
    return preferredLayout
  }, [isMobile, preferredLayout])

  const toggleLayout = () => {
    setPreferredLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"))
  }

  return {
    hydrated,
    isMobile,
    preferredLayout,
    effectiveLayout,
    setPreferredLayout,
    toggleLayout,
  }
}