'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedCounter } from '@/components/animated-counter'
import { MagicRings } from '@/components/magic-rings'

interface EvaluationData {
  overall_score: number
  feedback: string
  detailed_scores: {
    technical_knowledge: number
    problem_solving: number
    communication: number
    code_quality?: number
  }
  question_reviews: Array<{
    question: string
    answer: string
    score: number
    feedback: string
  }>
}

export function Evaluation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null)

  useEffect(() => {
    const evaluationParam = searchParams.get('evaluation')
    if (evaluationParam) {
      try {
        const parsedEvaluation = JSON.parse(decodeURIComponent(evaluationParam))
        setEvaluation(parsedEvaluation)
      } catch (error) {
        console.error('Error parsing evaluation:', error)
      }
    }
  }, [searchParams])

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <MagicRings size={60} />
        <p className="text-muted-foreground">Evaluating your responses...</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Interview Results</h1>
          <p className="text-lg text-muted-foreground">Here&apos;s your detailed evaluation and feedback</p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <p className="text-muted-foreground text-lg mb-4">Overall Score</p>
            <motion.div
              className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center ${getScoreBgColor(evaluation.overall_score)}`}
              animate={{ boxShadow: ['0 0 0px rgba(79, 124, 255, 0)', '0 0 30px rgba(79, 124, 255, 0.3)', '0 0 0px rgba(79, 124, 255, 0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className={`text-6xl font-bold ${getScoreColor(evaluation.overall_score)}`}>
                <AnimatedCounter value={evaluation.overall_score} duration={1.5} suffix="%" />
              </span>
            </motion.div>
            <motion.p
              className="text-foreground text-lg font-semibold mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {evaluation.overall_score >= 80 && 'Excellent Performance! 🎉'}
              {evaluation.overall_score >= 60 && evaluation.overall_score < 80 && 'Good Job! Keep Practicing 💪'}
              {evaluation.overall_score < 60 && 'Keep Practicing! 📚'}
            </motion.p>
          </div>
        </motion.div>

        {/* General Feedback */}
        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Overall Feedback</h2>
          <p className="text-foreground leading-relaxed">{evaluation.feedback}</p>
        </div>

        {/* Detailed Scores */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Detailed Scores</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(evaluation.detailed_scores).map(([key, value]) => (
              <div key={key} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </h3>
                  <span className={`text-xl font-bold ${getScoreColor(value)}`}>{value}%</span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Reviews */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Question-by-Question Review</h2>
          <div className="space-y-4">
            {evaluation.question_reviews.map((review, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{review.question}</h3>
                    <p className="text-sm text-muted-foreground">Score: {review.score}%</p>
                  </div>
                  <div className={`flex items-center gap-4`}>
                    <span className={`text-lg font-bold ${getScoreColor(review.score)}`}>
                      {review.score}%
                    </span>
                    <span className={`text-primary transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </div>
                </button>

                {expandedIndex === index && (
                  <div className="px-6 py-6 border-t border-border bg-muted/50 space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2">Your Answer:</h4>
                      <p className="text-foreground text-sm bg-background rounded p-3 border border-border">
                        {review.answer}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2">Feedback:</h4>
                      <p className="text-foreground text-sm">{review.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push('/interview')}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            size="lg"
          >
            Practice Another Interview
          </Button>
          <button
            onClick={() => router.push('/resume-score')}
            className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-semibold"
          >
            Analyze My Resume
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
