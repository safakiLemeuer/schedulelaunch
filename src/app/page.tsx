'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { Rocket, Shield, FileCheck, Brain, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { user, loading, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoggingIn(true)
    setError('')
    const success = await login(email, name)
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Login failed. Please try again.')
    }
    setLoggingIn(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>
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
          <a href="#get-started" className="btn-primary text-sm py-2 px-5">Get Started</a>
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
        </div>
      </section>

      {/* Login Form */}
      <section id="get-started" className="max-w-md mx-auto px-6 py-12">
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-2 text-center">Get Started Free</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Enter your email to create an account or sign in.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={!email || loggingIn}
              className="w-full btn-accent py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingIn ? 'Signing in...' : 'Continue →'}
            </button>
          </form>

          <p className="text-xs text-slate-600 text-center mt-4">No password required · Free to start</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: FileCheck, title: 'Step-by-Step Checklist', description: 'Every requirement for your GSA MAS application, organized into a guided workflow. Never miss a step.' },
            { icon: Brain, title: 'AI Contracting Officer Review', description: 'Paste your narratives and get scored like a real CO would. Find deal-breakers before GSA does.' },
            { icon: Shield, title: 'Built by Federal Experts', description: 'Created by contractors who\'ve been through the process. Real experience, not theoretical guides.' },
          ].map((feature, i) => (
            <div key={i} className="card group hover:border-slate-600 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
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
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-slate-400">ScheduleLaunch</span>
            <span className="text-xs text-slate-600">by BHT Solutions</span>
          </div>
          <p className="text-xs text-slate-600">AI-assisted guidance only. Not legal or procurement advice.</p>
        </div>
      </footer>
    </div>
  )
}
