'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What roles can I practice for?',
      answer: 'Interview360 currently supports practice for AI/ML Engineer and Frontend Developer positions. We are continuously adding more roles based on user feedback.',
    },
    {
      question: 'How many questions can I practice per session?',
      answer: 'You can choose between 3 to 15 questions per interview session. Start with fewer questions to get comfortable, then increase as you practice.',
    },
    {
      question: 'Is the feedback really AI-powered?',
      answer: 'Yes! Our platform uses advanced AI models to evaluate your answers, provide constructive feedback, and score your performance based on industry standards.',
    },
    {
      question: 'Can I use Interview360 for free?',
      answer: 'Interview360 is currently available as a free beta platform. You can access all features and practice unlimited interviews at no cost.',
    },
    {
      question: 'What happens to my interview data?',
      answer: 'Your interview data is stored securely and used only to provide you with personalized insights and progress tracking. We never share your data with third parties.',
    },
    {
      question: 'How can I improve my interview skills?',
      answer: 'Regular practice with Interview360, reviewing the AI feedback carefully, and implementing the suggested improvements are key to success.',
    },
  ]

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fadeInUp">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground animate-fadeInUp animate-stagger-1" style={{ animationDelay: '0.1s' }}>
            Everything you need to know about Interview360
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ boxShadow: '0 10px 30px rgba(79, 124, 255, 0.1)' }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              >
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                <motion.span
                  className="text-primary"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="px-6 py-4 border-t border-border bg-muted/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-foreground">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
