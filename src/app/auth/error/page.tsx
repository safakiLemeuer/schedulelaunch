'use client'

import Link from 'next/link'
import { Rocket, AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-slate-400 mb-6">
          Something went wrong during sign-in. This usually means the OAuth configuration needs to be checked.
        </p>
        <Link href="/auth/signin" className="btn-primary inline-block">
          Try Again
        </Link>
      </div>
    </div>
  )
}
