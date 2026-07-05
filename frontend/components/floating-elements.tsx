'use client'

import { motion } from 'framer-motion'

interface FloatingElementsProps {
  className?: string
}

export function FloatingElements({ className = '' }: FloatingElementsProps) {
  const elements = [
    { size: 100, duration: 6, delay: 0, top: '10%', right: '10%' },
    { size: 150, duration: 8, delay: 1, top: '30%', left: '5%' },
    { size: 80, duration: 7, delay: 2, bottom: '10%', right: '15%' },
    { size: 120, duration: 9, delay: 3, bottom: '20%', left: '10%' },
  ]

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ pointerEvents: 'none' }}>
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-3xl"
          style={{
            width: element.size,
            height: element.size,
            top: element.top,
            right: element.right,
            left: element.left,
            bottom: element.bottom,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
