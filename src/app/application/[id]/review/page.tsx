'use client'
import { useParams } from 'next/navigation'
import AppNav from '@/components/AppNav'
import { Brain } from 'lucide-react'

export default function ReviewPage() {
  const params = useParams()
  const appId = params.id as string

  return (
    <div className="min-h-screen">
      <AppNav appId={appId} activeTab="review" />
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
