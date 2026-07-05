'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export function AnimatedCounter({ value, duration = 2, suffix = '', className = '' }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let frameCount = 0
    const frameTarget = 60
    const increment = value / frameTarget

    const timer = setInterval(() => {
      frameCount++
      setDisplayValue(Math.min(Math.round(frameCount * increment), value))

      if (frameCount >= frameTarget) {
        clearInterval(timer)
        setDisplayValue(value)
      }
    }, (duration * 1000) / frameTarget)

    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue}
      {suffix}
    </motion.span>
  )
}
