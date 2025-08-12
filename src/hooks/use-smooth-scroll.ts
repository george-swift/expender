'use client'

import { useCallback } from 'react'
import { animate } from 'motion'

export function useSmoothScroll() {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId.replace('#', ''))
    if (!element) return

    const elementPosition = element.offsetTop
    const startPosition = window.pageYOffset

    animate(startPosition, elementPosition, {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: value => {
        window.scrollTo(0, value)
      }
    })
  }, [])

  return { scrollToElement }
}
