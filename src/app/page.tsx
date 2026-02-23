'use client'

import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { Rocket, Shield, FileCheck, Brain, Linkedin } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-slate-800/50 backdrop-blur-md bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ScheduleLaunch</span>
          </div>
          <button onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })} className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
            <Linkedin className="w-4 h-4" /> Sign In
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Powered by AI · Built by Federal Contractors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            From Zero to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">GSA Schedule</span>
            <br />in 30 Days
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop paying consultants thousands for what should take weeks.
            ScheduleLaunch guides you through every step of your GSA MAS
            application — with AI that reviews your work like a real Contracting Officer.
          </p>
          <button onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })}
            className="inline-flex items-center gap-3 py-4 px-8 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold text-lg transition-colors">
            <Linkedin className="w-5 h-5" /> Get Started with LinkedIn
          </button>
          <p className="text-xs text-slate-600 mt-4">Free to start · No credit card required</p>
        </div>
      </section>

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
