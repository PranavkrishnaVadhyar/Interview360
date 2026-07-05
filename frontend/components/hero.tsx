'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ShinyText } from '@/components/shiny-text'
import { MagneticButton } from '@/components/magnetic-button'
import { FloatingElements } from '@/components/floating-elements'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FloatingElements className="-z-10" />

      <motion.div className="max-w-4xl mx-auto text-center" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Master Technical Interviews with
            <br />
            <ShinyText text="AI-Powered Practice" className="text-5xl sm:text-6xl" />
          </h1>
        </motion.div>

        <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
          Interview360 provides realistic interview simulations, intelligent feedback, and comprehensive performance analytics to help you land your dream job.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/interview">
            <MagneticButton>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 transition-all hover:shadow-lg">
                Start Your Free Interview
              </Button>
            </MagneticButton>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="border-border hover:bg-muted px-8 transition-all">
              Learn More
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-4 sm:gap-8">
          {[
            { number: '1000+', label: 'Questions Available' },
            { number: '10k+', label: 'Users Practicing' },
            { number: '98%', label: 'Success Rate' },
          ].map((stat, index) => (
            <motion.div key={index} className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.25 }}>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
