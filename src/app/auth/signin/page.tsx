'use client'
import { signIn } from 'next-auth/react'
import { Rocket, Linkedin } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-sm w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to ScheduleLaunch</h1>
        <p className="text-slate-400 text-sm mb-8">Sign in to start your GSA MAS application.</p>

        <button
          onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold transition-colors"
        >
          <Linkedin className="w-5 h-5" />
          Continue with LinkedIn
        </button>

        <p className="text-xs text-slate-600 mt-6">Free to start · No credit card required</p>
      </div>
    </div>
  )
}
