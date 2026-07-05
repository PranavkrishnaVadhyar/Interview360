import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, questions, answers, time_taken } = body

    if (!role || !questions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: role, questions, and answers' },
        { status: 400 }
      )
    }

    if (questions.length !== answers.length) {
      return NextResponse.json(
        { error: 'Number of questions and answers must match' },
        { status: 400 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/evaluate_answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        questions,
        answers,
        time_taken: time_taken || 0,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in evaluate_answers:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate answers' },
      { status: 500 }
    )
  }
}
