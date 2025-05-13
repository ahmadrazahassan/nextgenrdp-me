"use client"

import { useState, useCallback } from "react"
import confetti from "canvas-confetti"

type ConfettiOptions = {
  particleCount?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  scalar?: number
  ticks?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  shapes?: string[]
  zIndex?: number
}

export function useConfetti() {
  const [isActive, setIsActive] = useState(false)

  const fireConfetti = useCallback((options: ConfettiOptions = {}) => {
    setIsActive(true)
    
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    }

    confetti({
      ...defaults,
      ...options
    })

    // Set inactive after animation completes
    setTimeout(() => {
      setIsActive(false)
    }, 2000)
  }, [])

  const fireSchoolPride = useCallback(() => {
    const end = Date.now() + 1500

    const colors = ['#ff0000', '#00ff00', '#0000ff']

    ;(function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
    
    setIsActive(true)
    setTimeout(() => setIsActive(false), 1500)
  }, [])

  const fireCelebration = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval)
        setIsActive(false)
        return
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    setIsActive(true)
  }, [])

  return {
    isActive,
    fireConfetti,
    fireSchoolPride,
    fireCelebration
  }
}