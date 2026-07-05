'use client'

import { motion } from 'framer-motion'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

export function ShinyText({ text, disabled = false, speed = 0.8, className = '' }: ShinyTextProps) {
  const shinnyAnimationDuration = speed

  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="relative inline-block"
        style={{
          background: 'linear-gradient(90deg, currentColor 0%, currentColor 40%, rgba(255,255,255,.1) 50%, currentColor 60%, currentColor 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <motion.div
          animate={!disabled ? { backgroundPosition: ['0% center', '200% center'] } : {}}
          transition={{
            duration: shinnyAnimationDuration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,.8) 50%, transparent 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            position: 'absolute',
            left: 0,
            top: 0,
            pointerEvents: 'none',
          }}
        >
          {text}
        </motion.div>
        <span className="relative">{text}</span>
      </div>
    </motion.div>
  )
}
