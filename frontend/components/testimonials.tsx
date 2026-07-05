'use client'

export function Testimonials() {
  const testimonials = [
    {
      quote: 'Interview360 helped me prepare for my Amazon interview. The AI feedback was incredibly helpful and I got the offer!',
      author: 'Sarah Chen',
      title: 'Software Engineer at Amazon',
      avatar: 'SC',
    },
    {
      quote: 'The realistic interview simulations gave me the confidence I needed. Highly recommend this platform!',
      author: 'Mike Johnson',
      title: 'ML Engineer at Google',
      avatar: 'MJ',
    },
    {
      quote: 'Practice sessions were game-changing. The feedback on my technical explanations was spot on and helped me improve significantly.',
      author: 'Emily Rodriguez',
      title: 'Frontend Engineer at Vercel',
      avatar: 'ER',
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fadeInUp">Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fadeInUp animate-stagger-1" style={{ animationDelay: '0.1s' }}>
            Join thousands of engineers who landed their dream jobs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 animate-scaleIn"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
              <p className="text-foreground italic">"{testimonial.quote}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary text-lg animate-float" style={{ animationDelay: `${i * 0.1}s` }}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
