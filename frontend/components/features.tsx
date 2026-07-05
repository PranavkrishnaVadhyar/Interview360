'use client'

import { motion } from 'framer-motion'
import { SpotlightCard } from '@/components/spotlight-card'

export function Features() {
  const features = [
    {
      title: 'AI-Powered Questions',
      description: 'Get interview questions generated specifically for your chosen role, updated with the latest industry trends.',
      icon: '✨',
    },
    {
      title: 'Real-Time Feedback',
      description: 'Receive instant, detailed feedback on your answers with insights on how to improve your responses.',
      icon: '💡',
    },
    {
      title: 'Multiple Roles',
      description: 'Practice for different positions including AI/ML, Frontend, Backend, and more technical interviews.',
      icon: '🎯',
    },
    {
      title: 'Performance Analytics',
      description: 'Track your progress with comprehensive metrics and detailed performance reports after each session.',
      icon: '📊',
    },
    {
      title: 'Resume Analysis',
      description: 'Get professional resume scoring and actionable suggestions to improve your application materials.',
      icon: '📄',
    },
    {
      title: 'Interview Simulation',
      description: 'Experience realistic interview conditions with customizable question counts and difficulty levels.',
      icon: '🎬',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Everything you need to ace your technical interviews</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <SpotlightCard className="bg-card p-6 h-full">
                <motion.div className="text-4xl mb-4" animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, delay: index * 0.2, repeat: Infinity }}>
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
