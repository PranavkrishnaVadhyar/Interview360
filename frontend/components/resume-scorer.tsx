'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ResumeScoreResult {
  overall_score: number
  file_name: string
  analysis: {
    strengths: string[]
    improvements: string[]
    missing_sections: string[]
  }
  section_scores: {
    [key: string]: number
  }
  recommendations: string[]
}

export function ResumeScorer() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ResumeScoreResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf'))) {
      setFile(droppedFile)
    } else {
      alert('Please drop a PDF file')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze_resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to analyze resume')

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error analyzing resume:', error)
      alert('Failed to analyze resume. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
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

  if (result) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Resume Analysis Results</h1>
            <p className="text-lg text-muted-foreground">Here&apos;s your detailed resume score and recommendations</p>
          </div>

          {/* Overall Score */}
          <div className="mb-12">
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">Resume Score</p>
              <div className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center ${getScoreBgColor(result.overall_score)}`}>
                <span className={`text-6xl font-bold ${getScoreColor(result.overall_score)}`}>
                  {result.overall_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Section Scores</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(result.section_scores).map(([section, score]) => (
                <div key={section} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground capitalize">{section}</h3>
                    <span className={`text-xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          {result.analysis.strengths.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-green-600">✓</span> Your Strengths
              </h2>
              <ul className="space-y-3">
                {result.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <span className="text-green-600 font-bold mt-1">•</span>
                    <span className="text-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {result.analysis.improvements.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-yellow-600">⚠</span> Areas for Improvement
              </h2>
              <ul className="space-y-3">
                {result.analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <span className="text-yellow-600 font-bold mt-1">•</span>
                    <span className="text-foreground">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Sections */}
          {result.analysis.missing_sections.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-red-600">✕</span> Missing Sections
              </h2>
              <ul className="space-y-3">
                {result.analysis.missing_sections.map((section, index) => (
                  <li key={index} className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span className="text-foreground">{section}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">💡</span> Recommendations
              </h2>
              <ol className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3 bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <span className="text-primary font-bold min-w-6">{index + 1}.</span>
                    <span className="text-foreground">{rec}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setResult(null)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
              size="lg"
            >
              Analyze Another Resume
            </Button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Resume Analyzer</h1>
          <p className="text-lg text-muted-foreground">
            Get instant feedback on your resume with our AI-powered analyzer
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">
              Drag and drop your resume here
            </p>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Selected File */}
        {file && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 5.414L15.414 9A2 2 0 0116 11.586V14a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex-1 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors font-semibold"
          >
            Back
          </button>
          <Button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            size="lg"
          >
            {isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
          </Button>
        </div>

        {/* Info */}
        <div className="mt-12 bg-muted rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-3">What We Analyze:</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>✓ Professional formatting and structure</li>
            <li>✓ Content quality and relevance</li>
            <li>✓ Skills and experience presentation</li>
            <li>✓ Keywords and ATS optimization</li>
            <li>✓ Missing important sections</li>
            <li>✓ Overall professionalism</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
