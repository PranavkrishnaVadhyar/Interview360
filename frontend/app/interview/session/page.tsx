'use client'

import { Suspense } from 'react'
import { InterviewSession } from '@/components/interview-session'
import { MagicRings } from '@/components/magic-rings'

function SessionFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <MagicRings size={60} />
      <p className="text-muted-foreground">Loading interview...</p>
    </div>
  )
}

export default function SessionPage() {
  return (
    <Suspense fallback={<SessionFallback />}>
      <InterviewSession />
    </Suspense>
  )
}
