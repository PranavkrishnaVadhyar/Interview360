'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

type Role = 'aiml' | 'frontend'

export function InterviewSetup() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [questionCount, setQuestionCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const roles: { id: Role; title: string; description: string }[] = [
    {
      id: 'aiml',
      title: 'AI/ML Engineer',
      description: 'Questions focused on machine learning, deep learning, and AI concepts',
    },
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'Questions about React, JavaScript, CSS, and modern web development',
    },
  ]

  const handleStartInterview = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    try {
      // Call backend to generate questions
      const response = await fetch('/api/generate_questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          num_questions: questionCount,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate questions')
      
      const data = await response.json()
      
      // Navigate to interview page with questions
      router.push(
        `/interview/session?role=${selectedRole}&questions=${encodeURIComponent(JSON.stringify(data.questions))}`
      )
    } catch (error) {
      console.error('Error generating questions:', error)
      alert('Failed to generate questions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Start Your Interview</h1>
          <p className="text-lg text-muted-foreground">Choose your role and practice with realistic interview questions</p>
        </div>

        {/* Role Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Select Your Role</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 bg-card'
                }`}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{role.title}</h3>
                <p className="text-muted-foreground text-sm">{role.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Number of Questions</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="range"
                min="3"
                max="15"
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="w-16 text-center">
                <span className="text-3xl font-bold text-primary">{questionCount}</span>
                <p className="text-xs text-muted-foreground mt-1">questions</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended for beginners: 5 questions • For advanced: 10+ questions
            </p>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 text-foreground border border-border rounded-lg hover:bg-muted transition-colors font-semibold"
          >
            Back
          </button>
          <Button
            onClick={handleStartInterview}
            disabled={!selectedRole || isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            size="lg"
          >
            {isLoading ? 'Generating Questions...' : 'Start Interview'}
          </Button>
        </div>
      </div>
    </div>
  )
}
