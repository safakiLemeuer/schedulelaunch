'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/useAuth'
import { Rocket, ArrowLeft, Plus } from 'lucide-react'

export default function LaborCategoriesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const appId = params.id as string

  useEffect(() => { if (!loading && !user) router.push('/') }, [loading, user, router])
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>

  const navItems = [
    { label: 'Checklist', href: `/application/${appId}/checklist` },
    { label: 'Narratives', href: `/application/${appId}/narratives` },
    { label: 'Labor Categories', href: `/application/${appId}/labor-categories`, active: true },
    { label: 'AI Review', href: `/application/${appId}/review` },
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Labor Categories</h1>
            <p className="text-slate-400 text-sm">Define labor categories for each SIN.</p>
          </div>
          <button className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
        </div>
        <div className="card text-center py-16">
          <p className="text-slate-400 mb-4">No labor categories defined yet.</p>
          <p className="text-slate-500 text-sm max-w-md mx-auto">518210C categories MUST have &quot;cloud&quot; in the title and description.</p>
        </div>
      </main>
    </div>
  )
}
