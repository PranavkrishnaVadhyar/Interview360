# Interview360 - AI-Powered Interview Preparation Platform

Interview360 is a comprehensive interview simulation and preparation platform designed to help technical professionals practice and master their interview skills. The platform uses AI to generate realistic interview questions, evaluate responses, and provide detailed feedback.

## Features

- **AI-Powered Question Generation**: Generate realistic interview questions tailored to your chosen role (AI/ML Engineer, Frontend Developer, etc.)
- **Interview Simulation**: Practice in a realistic interview environment with progress tracking and answer management
- **Intelligent Evaluation**: Receive AI-powered feedback on your answers with detailed scoring across multiple dimensions
- **Resume Analysis**: Upload and analyze your resume with actionable improvement suggestions
- **Performance Tracking**: View detailed metrics and improvement areas after each interview session
- **Multiple Interview Roles**: Currently supports AI/ML and Frontend positions, with more roles coming soon

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend Integration**: RESTful APIs for question generation, answer evaluation, and resume analysis
- **Design System**: Custom Tailwind theme with blue/purple color scheme
- **Components**: Reusable React components with shadcn/ui patterns

## Project Structure

```
.
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Global styles and design tokens
│   ├── interview/
│   │   ├── page.tsx            # Interview setup page
│   │   ├── session/
│   │   │   └── page.tsx        # Interview session (questions & answers)
│   │   └── evaluation/
│   │       └── page.tsx        # Results and evaluation page
│   ├── resume-score/
│   │   └── page.tsx            # Resume analyzer page
│   └── api/
│       ├── generate_questions/  # API route for question generation
│       ├── evaluate_answers/    # API route for answer evaluation
│       └── analyze_resume/      # API route for resume analysis
├── components/
│   ├── navigation.tsx          # Navigation header
│   ├── hero.tsx               # Hero section
│   ├── features.tsx           # Features grid
│   ├── how-it-works.tsx       # Process explanation
│   ├── testimonials.tsx       # User testimonials
│   ├── faq.tsx                # FAQ accordion
│   ├── footer.tsx             # Footer
│   ├── interview-setup.tsx    # Interview role/question selection
│   ├── interview-session.tsx  # Question answering interface
│   ├── evaluation.tsx         # Results display
│   ├── resume-scorer.tsx      # Resume upload & analysis
│   └── ui/                    # shadcn/ui components
└── public/                     # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (package manager)
- Backend service running (see Backend Setup below)

### Installation

1. **Clone and Install**:
```bash
git clone <repository-url>
cd interview360
pnpm install
```

2. **Environment Setup**:
Create a `.env.local` file:
```env
BACKEND_URL=http://localhost:8000
```

3. **Run Development Server**:
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## API Integration

The frontend communicates with a backend service through three main endpoints:

### 1. Generate Questions
**POST** `/generate_questions`

Request:
```json
{
  "role": "aiml" | "frontend",
  "num_questions": 3-15
}
```

Response:
```json
{
  "questions": [
    {
      "id": 1,
      "question": "Explain the concept of overfitting in machine learning..."
    }
  ]
}
```

### 2. Evaluate Answers
**POST** `/evaluate_answers`

Request:
```json
{
  "role": "aiml" | "frontend",
  "questions": ["Question 1", "Question 2"],
  "answers": ["User answer 1", "User answer 2"],
  "time_taken": 600
}
```

Response:
```json
{
  "overall_score": 78,
  "feedback": "Good overall performance...",
  "detailed_scores": {
    "technical_knowledge": 80,
    "problem_solving": 75,
    "communication": 78
  },
  "question_reviews": [
    {
      "question": "...",
      "answer": "...",
      "score": 80,
      "feedback": "..."
    }
  ]
}
```

### 3. Analyze Resume
**POST** `/analyze_resume` (multipart/form-data)

Request: PDF file upload

Response:
```json
{
  "overall_score": 82,
  "file_name": "resume.pdf",
  "analysis": {
    "strengths": ["Well-structured", "Clear achievements"],
    "improvements": ["Add metrics", "Improve summary"],
    "missing_sections": ["Certifications"]
  },
  "section_scores": {
    "format": 85,
    "content": 80,
    "ats_optimization": 79
  },
  "recommendations": ["Add quantifiable metrics...", "Improve action verbs..."]
}
```

## Design System

### Color Palette
- **Primary**: Blue (#4F7CFF / oklch(0.518 0.238 264))
- **Secondary**: Purple accent (#7C5CFC / oklch(0.625 0.191 256))
- **Background**: Light neutral (#f8f8ff)
- **Foreground**: Dark text (#1a1a2e)

### Typography
- **Headings**: Inter (system font)
- **Body**: Inter (system font)
- **Font Scale**: 5xl (hero), 4xl (sections), 2xl (cards), 1xl (body)

### Spacing & Border Radius
- **Spacing**: 4px base unit (p-4, gap-4, etc.)
- **Border Radius**: 12px (0.75rem) for standard components
- **Animations**: 250ms ease transitions

## Building & Deployment

### Production Build
```bash
pnpm build
pnpm start
```

### Vercel Deployment
```bash
vercel deploy
```

For environment variables on Vercel, set `BACKEND_URL` in project settings.

## Features in Detail

### Landing Page
- Navigation header with smooth scrolling
- Hero section with compelling headline and CTA
- Features grid showcasing platform capabilities
- "How It Works" process explanation
- Testimonials from successful users
- FAQ accordion for common questions
- Footer with links and information

### Interview Flow
1. **Setup**: Select role and number of questions
2. **Session**: Answer questions one-by-one with progress tracking
3. **Evaluation**: View scores, detailed feedback, and individual question reviews

### Resume Analyzer
- Drag-and-drop or click-to-browse file upload
- AI-powered PDF analysis
- Section-by-section scoring
- Detailed improvement suggestions
- ATS optimization recommendations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lighthouse Targets**: 
  - LCP: < 2.5s
  - CLS: < 0.1
  - FID/INP: < 200ms
- **Bundle Size**: ~60KB JS (gzipped)
- **Time to Interactive**: < 3s on 4G

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact support@interview360.io

## Roadmap

- [ ] More interview roles (Backend, Data Science, Product)
- [ ] Video interview recording and playback
- [ ] Peer-to-peer mock interviews
- [ ] Interview progress analytics
- [ ] Mobile app
- [ ] Slack/Teams integration
- [ ] Custom question sets
- [ ] Interview transcript analysis

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Feather Icons](https://feathericons.com/)
