'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check system preference or localStorage
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDark(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="relative w-10 h-10 p-0 hover:bg-muted"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg
          className="w-5 h-5 text-foreground"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 18C8.68 18 6 15.31 6 12s2.68-6 6-6 6 2.68 6 6-2.68 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM13 2h-2v3h2V2zm0 15h-2v3h2v-3zM5 11H2v2h3v-2zm15 0h-3v2h3v-2zM5.64 5.64L3.51 3.51 1.86 5.15l2.13 2.13 1.65-1.65zm12.72 12.72l-2.13-2.13-1.65 1.65 2.13 2.13 1.65-1.65zM5.64 18.36l-1.65 1.65 2.13 2.13 1.65-1.65-2.13-2.13zm12.72-12.72l-1.65-1.65-2.13 2.13 1.65 1.65 2.13-2.13z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-foreground"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </Button>
  )
}
