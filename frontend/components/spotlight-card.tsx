'use client'

import { motion, MouseEvent } from 'framer-motion'
import { useState } from 'react'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(79, 124, 255, 0.1)',
}: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-border ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      {/* Spotlight effect */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          opacity: isHovering ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: isHovering
            ? `radial-gradient(circle 200px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
            : 'none',
        }}
      />

      {/* Border glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovering ? '0 0 20px rgba(79, 124, 255, 0.3)' : '0 0 0px rgba(79, 124, 255, 0)',
        }}
        transition={{ duration: 0.25 }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
