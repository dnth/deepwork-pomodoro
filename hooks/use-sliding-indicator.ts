import { useState, useEffect, useCallback, useRef } from 'react'

export function useSlidingIndicator<T extends string>(
  selectedValue: T,
  containerRef: React.RefObject<HTMLElement | null>,
  isMounted: boolean
) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '0px' })
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const updateIndicator = useCallback(() => {
    try {
      if (!containerRef.current || !isMounted) return

      const container = containerRef.current
      const activeElement = container.querySelector('[data-state="on"], [aria-pressed="true"]') as HTMLElement

      if (!activeElement) {
        console.warn('useSlidingIndicator: No active tab element found')
        return
      }

      const containerRect = container.getBoundingClientRect()
      const elementRect = activeElement.getBoundingClientRect()

      // Validate measurements
      if (containerRect.width === 0 || elementRect.width === 0) {
        console.warn('useSlidingIndicator: Invalid element dimensions')
        return
      }

      setIndicatorStyle({
        left: `${Math.max(0, elementRect.left - containerRect.left)}px`,
        width: `${elementRect.width}px`
      })
    } catch (error) {
      console.error('useSlidingIndicator: Error updating indicator:', error)
    }
  }, [isMounted])

  // Update on selection change
  useEffect(() => {
    updateIndicator()
  }, [selectedValue, updateIndicator])

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current || !isMounted) return

    const observer = new ResizeObserver(() => {
      clearTimeout(updateTimeoutRef.current)
      updateTimeoutRef.current = setTimeout(updateIndicator, 16)
    })

    observer.observe(containerRef.current)

    return () => {
      clearTimeout(updateTimeoutRef.current)
      observer.disconnect()
    }
  }, [isMounted, updateIndicator])

  return indicatorStyle
}