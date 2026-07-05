'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-bold text-primary mb-4">Interview360</h3>
            <p className="text-muted-foreground text-sm">Master your technical interviews with AI-powered practice and feedback.</p>
          </div>
          
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors text-sm">Features</Link></li>
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">How It Works</Link></li>
              <li><Link href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors text-sm">Testimonials</Link></li>
            </ul>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <p className="text-muted-foreground text-sm">&copy; {currentYear} Interview360. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">LinkedIn</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
