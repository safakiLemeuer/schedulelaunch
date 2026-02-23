'use client'
import { useParams } from 'next/navigation'
import AppNav from '@/components/AppNav'
import { Plus } from 'lucide-react'

export default function LaborCategoriesPage() {
  const params = useParams()
  const appId = params.id as string

  return (
    <div className="min-h-screen">
      <AppNav appId={appId} activeTab="labor-categories" />
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
