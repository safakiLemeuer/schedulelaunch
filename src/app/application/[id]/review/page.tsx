'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { Rocket, ArrowLeft, Brain } from 'lucide-react'

export default function ReviewPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const appId = params.id as string

  useEffect(() => { if (!loading && !user) router.push('/') }, [loading, user, router])
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>

  const navItems = [
    { label: 'Checklist', href: `/application/${appId}/checklist` },
    { label: 'Narratives', href: `/application/${appId}/narratives` },
    { label: 'Labor Categories', href: `/application/${appId}/labor-categories` },
    { label: 'AI Review', href: `/application/${appId}/review`, active: true },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-16 flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center"><Rocket className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-white text-sm">ScheduleLaunch</span>
          </div>
          <div className="flex gap-1 pb-3">
            {navItems.map(item => (<button key={item.label} onClick={() => router.push(item.href)} className={item.active ? 'nav-link-active' : 'nav-link'}>{item.label}</button>))}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">AI Contracting Officer Review</h1>
        <p className="text-slate-400 mb-8">Submit your narratives for AI-powered analysis against GSA evaluation criteria.</p>
        <div className="card text-center py-16">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Ready to Review?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">Complete your narratives and labor categories first. The AI will score each section and identify deal-breakers.</p>
          <button className="btn-accent inline-flex items-center gap-2"><Brain className="w-4 h-4" /> Run AI Review</button>
        </div>
      </main>
    </div>
  )
}
