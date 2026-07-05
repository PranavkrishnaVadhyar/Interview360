'use client'

import { motion } from 'framer-motion'

interface MagicRingsProps {
  size?: number
  className?: string
}

export function MagicRings({ size = 40, className = '' }: MagicRingsProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute border-2 border-transparent border-t-primary rounded-full"
          style={{
            width: size - index * 10,
            height: size - index * 10,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 2 - index * 0.3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
