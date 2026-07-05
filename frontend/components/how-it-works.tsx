'use client'

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Select Your Role',
      description: 'Choose the position you want to prepare for - AI/ML Engineer, Frontend Developer, or other technical roles.',
    },
    {
      number: '2',
      title: 'Set Question Count',
      description: 'Decide how many questions you want to answer in your practice session (3-15 questions).',
    },
    {
      number: '3',
      title: 'Answer Questions',
      description: 'Answer interview questions in a realistic environment with time tracking and progress visualization.',
    },
    {
      number: '4',
      title: 'Get Evaluation',
      description: 'Receive AI-powered feedback on your answers with detailed scores and improvement suggestions.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fadeInUp">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fadeInUp animate-stagger-1" style={{ animationDelay: '0.1s' }}>
            Get started in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-scaleIn" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-primary/30 to-transparent -z-10"></div>
              )}

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold mb-4 hover:shadow-lg hover:shadow-primary/50 transition-all">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground text-center mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
