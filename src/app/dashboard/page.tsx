'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Rocket, LogOut, Plus, FileCheck, Brain, BarChart3,
  ChevronRight, Clock, CheckCircle, AlertTriangle, XCircle
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetch('/api/applications')
        .then((r) => r.json())
        .then((data) => {
          setApplications(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  const createApplication = async () => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: '' }),
    })
    const app = await res.json()
    router.push(`/application/${app.id}/checklist`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading dashboard...</div>
      </div>
    )
  }

  if (!session) return null

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    NOT_STARTED: { icon: Clock, color: 'text-slate-400', label: 'Not Started' },
    IN_PROGRESS: { icon: BarChart3, color: 'text-blue-400', label: 'In Progress' },
    UNDER_REVIEW: { icon: Brain, color: 'text-orange-400', label: 'Under Review' },
    READY_TO_SUBMIT: { icon: CheckCircle, color: 'text-green-400', label: 'Ready to Submit' },
    SUBMITTED: { icon: FileCheck, color: 'text-emerald-400', label: 'Submitted' },
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">ScheduleLaunch</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">{session.user?.name}</div>
              <div className="text-xs text-slate-500">{session.user?.email}</div>
            </div>
            {session.user?.image && (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-slate-500 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{session.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-slate-400">Manage your GSA MAS applications and track your readiness.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="card py-4 px-5">
            <div className="text-2xl font-bold text-white">{applications.length}</div>
            <div className="text-xs text-slate-500 font-medium">Applications</div>
          </div>
          <div className="card py-4 px-5">
            <div className="text-2xl font-bold text-blue-400">
              {applications.filter((a) => a.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">In Progress</div>
          </div>
          <div className="card py-4 px-5">
            <div className="text-2xl font-bold text-green-400">
              {applications.filter((a) => a.status === 'READY_TO_SUBMIT').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Ready</div>
          </div>
          <div className="card py-4 px-5">
            <div className="text-2xl font-bold text-orange-400">
              {applications.reduce((max, a) => Math.max(max, a.readinessScore || 0), 0) || '—'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Best Score</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Your Applications</h2>
          <button onClick={createApplication} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="card text-center py-16">
            <Rocket className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No applications yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Start your first GSA MAS application. We&apos;ll guide you through every step
              from prerequisites to submission.
            </p>
            <button onClick={createApplication} className="btn-accent inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Start Your First Application
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const sc = statusConfig[app.status] || statusConfig.NOT_STARTED
              const StatusIcon = sc.icon
              return (
                <div
                  key={app.id}
                  onClick={() => router.push(`/application/${app.id}/checklist`)}
                  className="card flex items-center justify-between cursor-pointer hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-5 h-5 ${sc.color}`} />
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {app.companyName || 'Untitled Application'}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                        <span className={sc.color}>{sc.label}</span>
                        <span>·</span>
                        <span>{app.sins?.length || 0} SINs selected</span>
                        <span>·</span>
                        <span>Updated {new Date(app.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {app.readinessScore != null && (
                      <div className={`text-2xl font-bold ${
                        app.readinessScore >= 85 ? 'text-green-400' :
                        app.readinessScore >= 70 ? 'text-yellow-400' :
                        app.readinessScore >= 50 ? 'text-orange-400' : 'text-red-400'
                      }`}>
                        {app.readinessScore}
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Quick Guide */}
        <div className="mt-12 card bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-blue-500/10">
          <h3 className="text-lg font-bold text-white mb-4">GSA MAS Quick Guide</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">What is GSA MAS?</h4>
              <p className="text-slate-400 leading-relaxed">
                The GSA Multiple Award Schedule (MAS) is a long-term government contract that allows you to sell your IT services directly to federal agencies. Once awarded, agencies can buy from you without a new competitive process.
              </p>
            </div>
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">Why It Matters</h4>
              <p className="text-slate-400 leading-relaxed">
                GSA Schedule holders get access to $50B+ in annual government IT spending. It&apos;s the #1 procurement vehicle for federal agencies and dramatically reduces the sales cycle for government contracts.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
