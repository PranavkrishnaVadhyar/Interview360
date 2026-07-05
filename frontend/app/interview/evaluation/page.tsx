'use client'

import { Suspense } from 'react'
import { Evaluation } from '@/components/evaluation'
import { MagicRings } from '@/components/magic-rings'

function EvaluationFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <MagicRings size={60} />
      <p className="text-muted-foreground">Loading evaluation...</p>
    </div>
  )
}

export default function EvaluationPage() {
  return (
    <Suspense fallback={<EvaluationFallback />}>
      <Evaluation />
    </Suspense>
  )
}
