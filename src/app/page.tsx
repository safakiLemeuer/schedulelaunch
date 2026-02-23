'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Rocket, Shield, FileCheck, Brain, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ScheduleLaunch</span>
          </div>
          <button
            onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
            className="btn-primary text-sm py-2 px-5"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Powered by AI · Built by Federal Contractors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            From Zero to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              GSA Schedule
            </span>
            <br />in 30 Days
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop paying consultants thousands for what should take weeks.
            ScheduleLaunch guides you through every step of your GSA MAS
            application — with AI that reviews your work like a real Contracting Officer.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-xl shadow-white/5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })}
              className="flex items-center gap-3 px-8 py-4 bg-[#0A66C2] text-white font-bold rounded-xl hover:bg-[#004182] transition-all shadow-xl shadow-blue-900/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-4">Free to start · No credit card required</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileCheck,
              title: 'Step-by-Step Checklist',
              description: 'Every requirement for your GSA MAS application, organized into a guided workflow. Never miss a step.',
              color: 'blue',
            },
            {
              icon: Brain,
              title: 'AI Contracting Officer Review',
              description: 'Paste your narratives and get scored like a real CO would review them. Find deal-breakers before GSA does.',
              color: 'orange',
            },
            {
              icon: Shield,
              title: 'Built by Federal Experts',
              description: 'Created by contractors who\'ve been through the process. Real experience, not theoretical guides.',
              color: 'green',
            },
          ].map((feature, i) => (
            <div key={i} className="card group hover:border-slate-600 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-${feature.color === 'blue' ? 'blue' : feature.color === 'orange' ? 'orange' : 'green'}-500/10 flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 text-${feature.color === 'blue' ? 'blue' : feature.color === 'orange' ? 'orange' : 'green'}-400`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Sign Up', desc: 'Create your account with Google or LinkedIn in seconds.' },
            { step: '02', title: 'Enter Company Info', desc: 'Tell us about your business, certifications, and services.' },
            { step: '03', title: 'Write & Review', desc: 'Draft narratives with guided templates. AI reviews every word.' },
            { step: '04', title: 'Submit with Confidence', desc: 'Complete your checklist and submit to eOffer knowing you\'re ready.' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-slate-800 mb-3">{item.step}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Sound Familiar?</h2>
        <p className="text-slate-400 text-center mb-12">These are the exact problems ScheduleLaunch was built to solve.</p>
        <div className="space-y-4">
          {[
            'Paid a consultant thousands and got nothing usable',
            'Application rejected because of a solicitation revision mismatch',
            'Spent weeks on narratives with no idea if they\'re good enough',
            'Don\'t know which SINs or labor categories to propose',
            'Overwhelmed by the 200+ page solicitation document',
            'No idea what a Contracting Officer actually looks for',
          ].map((pain, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <span className="text-red-400 mt-0.5">✗</span>
              <span className="text-slate-300 text-sm">{pain}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
            className="btn-accent text-lg py-4 px-10 inline-flex items-center gap-2"
          >
            Launch Your GSA Application <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-slate-400">ScheduleLaunch</span>
            <span className="text-xs text-slate-600">by BHT Solutions</span>
          </div>
          <p className="text-xs text-slate-600 text-center">
            AI-assisted guidance only. Not legal or procurement advice. Always verify against the current GSA MAS solicitation.
          </p>
        </div>
      </footer>
    </div>
  )
}
