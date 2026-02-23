'use client'
import { useSearchParams } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const params = useSearchParams()
  const error = params.get('error')

  const messages: Record<string, string> = {
    OAuthCallback: 'LinkedIn sign-in failed. Please try again.',
    OAuthSignin: 'Could not connect to LinkedIn. Please try again.',
    Default: 'An authentication error occurred.',
  }

  return <p className="text-slate-400 text-sm mb-6">{messages[error || ''] || messages.Default}</p>
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-sm w-full text-center">
        <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Sign In Error</h1>
        <Suspense fallback={<p className="text-slate-400 text-sm mb-6">Loading...</p>}>
          <ErrorContent />
        </Suspense>
        <Link href="/auth/signin" className="btn-primary inline-block">Try Again</Link>
      </div>
    </div>
  )
}
