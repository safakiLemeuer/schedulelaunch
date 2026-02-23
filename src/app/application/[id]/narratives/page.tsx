'use client'
import { useParams } from 'next/navigation'
import AppNav from '@/components/AppNav'

export default function NarrativesPage() {
  const params = useParams()
  const appId = params.id as string

  return (
    <div className="min-h-screen">
      <AppNav appId={appId} activeTab="narratives" />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">Narratives</h1>
        <p className="text-slate-400 mb-8">Write your eOffer narratives here. Each field has a 10,000 character limit.</p>
        {['Factor 1: Corporate Experience', 'Factor 3: Quality Control', 'Factor 4: Project — 54151S #1', 'Factor 4: Project — 54151S #2', 'Factor 4: Project — 518210C #1', 'Factor 4: Project — 518210C #2'].map((label, i) => (
          <div key={i} className="card mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm">{label}</h3>
              <span className="text-xs text-slate-500">0 / 10,000 characters</span>
            </div>
            <textarea className="textarea-field" rows={8} placeholder={`Paste or write your ${label} narrative...`} />
          </div>
        ))}
        <div className="flex justify-end mt-6"><button className="btn-primary">Save All Narratives</button></div>
      </main>
    </div>
  )
}
