'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import {
  Rocket, ArrowLeft, CheckCircle, Circle,
  FileCheck, Brain, DollarSign, Settings, ClipboardCheck, ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react'
import { GSA_CHECKLIST, CHECKLIST_CATEGORIES } from '@/lib/checklist-data'

export default function ChecklistPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const appId = params.id as string

  const [application, setApplication] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(CHECKLIST_CATEGORIES.map(c => [c, true]))
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!loading && !user) router.push('/') }, [loading, user, router])

  useEffect(() => {
    if (user && appId) {
      fetch('/api/applications').then(r => r.json()).then(apps => {
        const app = (Array.isArray(apps) ? apps : []).find((a: any) => a.id === appId)
        if (app) { setApplication(app); setCheckedItems(app.checklistData || {}) }
      })
    }
  }, [user, appId])

  const toggleItem = async (itemId: string) => {
    const updated = { ...checkedItems, [itemId]: !checkedItems[itemId] }
    setCheckedItems(updated)
    setSaving(true)
    await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: appId, checklistData: updated }),
    })
    setSaving(false)
  }

  if (loading || !application) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-slate-400">Loading...</div></div>
  }

  const totalItems = GSA_CHECKLIST.filter(i => i.required).length
  const completedItems = GSA_CHECKLIST.filter(i => i.required && checkedItems[i.id]).length
  const progressPct = Math.round((completedItems / totalItems) * 100)

  const categoryIcons: Record<string, any> = {
    Prerequisites: Settings, 'SIN Selection': ClipboardCheck, 'Technical Proposal': FileCheck,
    Pricing: DollarSign, Administrative: ClipboardCheck, 'Final Review': Brain,
  }

  const navItems = [
    { label: 'Checklist', href: `/application/${appId}/checklist`, active: true },
    { label: 'Narratives', href: `/application/${appId}/narratives` },
    { label: 'Labor Categories', href: `/application/${appId}/labor-categories` },
    { label: 'AI Review', href: `/application/${appId}/review` },
  ]

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center"><Rocket className="w-4 h-4 text-white" /></div>
              <div>
                <div className="font-bold text-white text-sm">{application.companyName || 'GSA MAS Application'}</div>
                <div className="text-xs text-slate-500">{progressPct}% complete</div>
              </div>
            </div>
            <div className="text-sm text-slate-500">{saving ? 'Saving...' : 'Auto-saved'}</div>
          </div>
          <div className="flex gap-1 pb-3 overflow-x-auto">
            {navItems.map(item => (
              <button key={item.label} onClick={() => router.push(item.href)} className={item.active ? 'nav-link-active' : 'nav-link'}>{item.label}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white">Application Readiness</h2>
            <span className="text-sm font-semibold text-slate-400">{completedItems} / {totalItems} required</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${progressPct}%`,
              background: progressPct >= 90 ? '#16a34a' : progressPct >= 60 ? '#ca8a04' : progressPct >= 30 ? '#ea580c' : '#dc2626',
            }} />
          </div>
        </div>

        <div className="space-y-4">
          {CHECKLIST_CATEGORIES.map(category => {
            const items = GSA_CHECKLIST.filter(i => i.category === category)
            const catCompleted = items.filter(i => checkedItems[i.id]).length
            const isExpanded = expandedCategories[category]
            const CatIcon = categoryIcons[category] || FileCheck

            return (
              <div key={category} className="card p-0 overflow-hidden">
                <button onClick={() => setExpandedCategories(p => ({ ...p, [category]: !p[category] }))}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-700/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <CatIcon className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="font-bold text-white">{category}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{catCompleted}/{items.length} complete</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(catCompleted / items.length) * 100}%` }} />
                    </div>
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-700/50">
                    {items.map(item => {
                      const isChecked = checkedItems[item.id]
                      return (
                        <div key={item.id} className={`flex items-start gap-4 p-5 border-b border-slate-700/30 last:border-0 hover:bg-slate-700/10 ${isChecked ? 'opacity-75' : ''}`}>
                          <button onClick={() => toggleItem(item.id)} className="mt-0.5 flex-shrink-0">
                            {isChecked ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-slate-600 hover:text-blue-400" />}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-white'}`}>{item.label}</span>
                              {item.required && !isChecked && <span className="badge-danger text-[10px]">Required</span>}
                              {item.estimatedMinutes && !isChecked && <span className="text-[10px] text-slate-600">~{item.estimatedMinutes}min</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                            {item.helpUrl && (
                              <a href={item.helpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-1.5">
                                <ExternalLink className="w-3 h-3" /> Reference Link
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
