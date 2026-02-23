'use client'
import { useRouter } from 'next/navigation'
import { Rocket, ArrowLeft } from 'lucide-react'

export default function AppNav({ appId, activeTab, title }: { appId: string; activeTab: string; title?: string }) {
  const router = useRouter()
  const tabs = [
    { label: 'Checklist', key: 'checklist' },
    { label: 'Narratives', key: 'narratives' },
    { label: 'Labor Categories', key: 'labor-categories' },
    { label: 'AI Review', key: 'review' },
  ]

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-16 flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center"><Rocket className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-white text-sm">{title || 'ScheduleLaunch'}</span>
        </div>
        <div className="flex gap-1 pb-3">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => router.push(`/application/${appId}/${tab.key}`)}
              className={tab.key === activeTab ? 'nav-link-active' : 'nav-link'}>{tab.label}</button>
          ))}
        </div>
      </div>
    </header>
  )
}
