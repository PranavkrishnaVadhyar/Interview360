'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MagicRings } from '@/components/magic-rings'

interface Question {
  id: number
  question: string
}

export function InterviewSession() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const role = searchParams.get('role') || 'frontend'

  useEffect(() => {
    const questionsParam = searchParams.get('questions')
    if (questionsParam) {
      try {
        const parsedQuestions = JSON.parse(decodeURIComponent(questionsParam))
        setQuestions(parsedQuestions)
        setAnswers(new Array(parsedQuestions.length).fill(''))
      } catch (error) {
        console.error('Error parsing questions:', error)
      }
    }
  }, [searchParams])

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <MagicRings size={60} />
        <p className="text-muted-foreground">Generating your interview...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleSaveAnswer = () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = currentAnswer
    setAnswers(newAnswers)

    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer(newAnswers[currentQuestionIndex + 1] || '')
    }
  }

  const handleSubmit = async () => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = currentAnswer
    setAnswers(newAnswers)

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/evaluate_answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          questions: questions.map(q => q.question),
          answers: newAnswers,
          time_taken: Math.floor((Date.now() - startTime) / 1000),
        }),
      })

      if (!response.ok) throw new Error('Failed to evaluate answers')
      
      const data = await response.json()
      
      // Navigate to evaluation page
      router.push(
        `/interview/evaluation?evaluation=${encodeURIComponent(JSON.stringify(data))}`
      )
    } catch (error) {
      console.error('Error submitting answers:', error)
      alert('Failed to submit answers. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            {currentQuestion.question}
          </h3>
          <p className="text-muted-foreground text-sm">
            Think about your answer carefully. You can take as much time as you need.
          </p>
        </div>

        {/* Answer Textarea */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Your Answer
          </label>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here... Explain your approach, reasoning, and any relevant code or examples."
            className="w-full h-64 p-4 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Min: 50 characters • Current: {currentAnswer.length}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              setCurrentAnswer(answers[Math.max(0, currentQuestionIndex - 1)])
            }}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <Button
              onClick={handleSaveAnswer}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              Next Question
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Interview'}
            </Button>
          )}

          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit? Your answers will be lost.')) {
                router.push('/interview')
              }
            }}
            className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-destructive/10 transition-colors font-semibold"
          >
            Exit
          </button>
        </div>

        {/* Question List */}
        <div className="mt-12 pt-8 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">Question Overview</h4>
          <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index)
                  setCurrentAnswer(answers[index] || '')
                }}
                className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers[index]
                    ? 'bg-primary/20 text-primary'
                    : 'bg-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
