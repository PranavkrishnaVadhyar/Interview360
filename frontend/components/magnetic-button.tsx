'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function MagneticButton({ children, onClick, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    // Calculate distance and apply strength falloff
    const distance = Math.sqrt(x * x + y * y)
    const maxDistance = 100
    const strength = Math.max(1 - distance / maxDistance, 0)

    setPosition({
      x: x * strength * 0.3,
      y: y * strength * 0.3,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.button
        animate={position}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        onClick={onClick}
        className={className}
      >
        {children}
      </motion.button>
    </div>
  )
}
