# Interview360 - Implementation Guide

This document provides a comprehensive guide for setting up, running, and extending the Interview360 platform.

## Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your backend URL
# BACKEND_URL=http://localhost:8000

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
pnpm build
pnpm start
```

## Architecture Overview

### Frontend Structure

```
Interview360 (Frontend)
├── Landing Page (Home)
├── Interview Flow
│   ├── Setup (Role + Question Count Selection)
│   ├── Session (Question Answering)
│   └── Evaluation (Results Display)
├── Resume Analyzer
└── API Integration Layer
```

### Data Flow

```
User Input → Frontend Component → API Route → Backend Service → Response → Display
```

## Component Details

### Landing Page Components

**Navigation.tsx**
- Fixed header with smooth scroll to sections
- "Start Now" CTA button
- Responsive mobile menu (hidden by default on mobile)

**Hero.tsx**
- Large headline with gradient background elements
- Dual CTA buttons (primary and secondary)
- Statistics section (1000+ questions, 10k+ users, 98% success)

**Features.tsx**
- 6-card grid showing platform capabilities
- Emoji icons for visual appeal
- Responsive to 2 columns on mobile, 3 on desktop

**HowItWorks.tsx**
- 4-step process visualization
- Circular step numbers
- Connecting lines between steps (desktop only)

**Testimonials.tsx**
- 3-card testimonial section
- User avatars with initials
- 5-star ratings
- Success stories

**FAQ.tsx**
- Expandable accordion items
- Click to expand/collapse
- Only one item open at a time by default

**Footer.tsx**
- Company info section
- Links to main sections
- Social media links
- Copyright notice

### Interview Flow Components

**InterviewSetup.tsx**
- Role selection cards (AI/ML, Frontend)
- Question count slider (3-15)
- Form validation
- API call to `/api/generate_questions`

**InterviewSession.tsx**
- Current question display
- Large textarea for answers
- Progress bar
- Question navigation buttons
- Question overview grid
- Session time tracking
- API call to `/api/evaluate_answers` on submit

**Evaluation.tsx**
- Circular score display with color coding
- Overall feedback text
- Detailed scores breakdown
- Expandable question reviews
- Next action buttons

### Resume Components

**ResumeScorer.tsx**
- Drag-and-drop upload area
- File type validation (PDF only)
- File preview display
- Results display with:
  - Overall score
  - Section scores with progress bars
  - Strengths (green boxes)
  - Areas to improve (yellow boxes)
  - Missing sections (red boxes)
  - Numbered recommendations (blue boxes)

## API Integration

### Backend Communication Pattern

The frontend uses a proxy pattern through Next.js API routes for security:

```
Frontend Component
    ↓
Next.js API Route (/app/api/...)
    ↓
Backend Service
    ↓
Response back through API route
    ↓
Frontend receives and displays
```

### API Endpoints Reference

#### 1. Generate Questions

**Route:** `POST /api/generate_questions`

**Frontend Call:**
```typescript
const response = await fetch('/api/generate_questions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'aiml' | 'frontend',
    num_questions: 5,
  }),
})
const data = await response.json()
```

**Expected Backend Response:**
```json
{
  "questions": [
    { "id": 1, "question": "Explain overfitting..." },
    { "id": 2, "question": "What is TensorFlow..." }
  ]
}
```

#### 2. Evaluate Answers

**Route:** `POST /api/evaluate_answers`

**Frontend Call:**
```typescript
const response = await fetch('/api/evaluate_answers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'aiml',
    questions: ['Question 1', 'Question 2'],
    answers: ['User answer 1', 'User answer 2'],
    time_taken: 600, // seconds
  }),
})
const data = await response.json()
```

**Expected Backend Response:**
```json
{
  "overall_score": 78,
  "feedback": "Good overall performance with strong technical knowledge...",
  "detailed_scores": {
    "technical_knowledge": 80,
    "problem_solving": 75,
    "communication": 78,
    "code_quality": 75
  },
  "question_reviews": [
    {
      "question": "Explain overfitting...",
      "answer": "User's answer...",
      "score": 80,
      "feedback": "Excellent explanation with clear examples..."
    }
  ]
}
```

#### 3. Analyze Resume

**Route:** `POST /api/analyze_resume` (multipart/form-data)

**Frontend Call:**
```typescript
const formData = new FormData()
formData.append('file', resumePdfFile)

const response = await fetch('/api/analyze_resume', {
  method: 'POST',
  body: formData,
})
const data = await response.json()
```

**Expected Backend Response:**
```json
{
  "overall_score": 82,
  "file_name": "resume.pdf",
  "analysis": {
    "strengths": [
      "Well-structured with clear sections",
      "Strong action verbs used"
    ],
    "improvements": [
      "Add more quantifiable metrics",
      "Improve the professional summary"
    ],
    "missing_sections": [
      "Certifications",
      "Languages"
    ]
  },
  "section_scores": {
    "format": 85,
    "content": 80,
    "ats_optimization": 79
  },
  "recommendations": [
    "Add specific metrics and numbers to quantify achievements",
    "Use stronger action verbs to describe accomplishments"
  ]
}
```

## State Management

The application uses React hooks for state management:

- **useState**: For component-level state (selected role, current answer, etc.)
- **useSearchParams**: For reading URL parameters (questions, evaluation data)
- **useRouter**: For navigation between pages

Example in InterviewSetup.tsx:
```typescript
const [selectedRole, setSelectedRole] = useState<Role | null>(null)
const [questionCount, setQuestionCount] = useState(5)
const router = useRouter()
```

## Styling & Design System

### Tailwind CSS Configuration

The design system uses Tailwind v4 with custom theme tokens in `globals.css`:

**Color Tokens:**
```css
--color-primary: oklch(0.518 0.238 264) /* Blue #4F7CFF */
--color-secondary: oklch(0.625 0.191 256) /* Purple accent */
--color-background: oklch(0.985 0.005 0) /* Light bg */
--color-foreground: oklch(0.165 0.004 250) /* Dark text */
```

**Border Radius:**
```css
--radius: 0.75rem /* 12px for standard components */
--radius-md: calc(var(--radius) * 0.8) /* 9.6px */
--radius-lg: var(--radius) /* 12px */
```

### Responsive Breakpoints

- **Mobile**: 0-640px (default)
- **Tablet**: 641-1024px (`md:`)
- **Desktop**: 1025-1280px (`lg:`)
- **Large**: 1281px+ (`xl:`)

## Performance Optimization

### Code Splitting

Each page and component is automatically code-split by Next.js, reducing initial bundle size.

### Image Optimization

- No images currently used (could use Next.js Image component if needed)
- Uses emoji for icons instead of image files

### Caching Strategy

- API responses are not cached (real-time evaluation needed)
- Static assets cached by browser
- Build-time optimization with Turbopack (Next.js 16 default)

## Testing Locally

### Test Interview Flow

1. Navigate to `http://localhost:3000`
2. Click "Start Now"
3. Select a role and question count
4. Click "Start Interview"
5. Answer 1-2 questions (test mode)
6. Click "Submit Interview"
7. View evaluation results

### Test Resume Analyzer

1. Navigate to `http://localhost:3000/resume-score`
2. Upload a test PDF file
3. View analysis results

### Test Navigation

1. On landing page, click section links (Features, How It Works, etc.)
2. Verify smooth scroll to sections
3. Test "Back" buttons on forms

## Extending the Platform

### Adding a New Role

1. **Update InterviewSetup.tsx**:
```typescript
const roles = [
  // ... existing roles
  {
    id: 'backend',
    title: 'Backend Developer',
    description: 'Questions about Node.js, databases, APIs...',
  },
]
```

2. **Backend should support** the new role in `/generate_questions`

### Adding More Questions

The number of questions can be adjusted in InterviewSetup.tsx slider:
```typescript
<input
  type="range"
  min="3"
  max="15"  // Change this value
  value={questionCount}
  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
/>
```

### Adding Features to Evaluation

Edit the Evaluation.tsx component to display additional metrics:

```typescript
const evaluation = {
  // ... existing fields
  additional_metrics: {
    // Add new metrics here
  }
}
```

## Troubleshooting

### Backend Connection Issues

If you see "Failed to generate questions":

1. Verify `BACKEND_URL` in `.env.local`
2. Ensure backend service is running
3. Check CORS settings on backend
4. Verify API endpoint paths match

### Form Validation Not Working

Check that form components have proper `onChange` handlers and state updates.

### Styles Not Applying

1. Clear `.next` build cache: `rm -rf .next`
2. Rebuild: `pnpm build`
3. Restart dev server: `pnpm dev`

### TypeScript Errors

Run type checking:
```bash
pnpm tsc --noEmit
```

## Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variable `BACKEND_URL`
4. Deploy!

### Docker Deployment

Create Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Variables for Production

Set these on your hosting platform:
- `BACKEND_URL`: Your production backend URL
- `NODE_ENV`: Set to `production`

## Monitoring & Analytics

To add analytics later:

1. Add provider (Google Analytics, Sentry, etc.)
2. Set environment variables
3. Import and initialize in `app/layout.tsx`

Example:
```typescript
if (process.env.NODE_ENV === 'production') {
  // Initialize analytics
}
```

## Contributing Guidelines

1. Create feature branches from `main`
2. Keep components small and focused
3. Use TypeScript for type safety
4. Add comments for complex logic
5. Test locally before pushing
6. Create pull requests for review

## Support & Questions

For questions about the implementation, refer to:
- Component comments
- README.md for architecture
- API documentation above

---

**Last Updated**: 2026
**Version**: 1.0.0
