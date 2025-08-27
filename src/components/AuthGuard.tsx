'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h1 className="text-2xl font-light mb-2">Loading...</h1>
          <p className="text-neutral-600">Checking authentication</p>
        </div>
      </div>
    )
  }

  // Show fallback or redirect if not authenticated
  if (status === 'unauthenticated') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-white py-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h1 className="text-2xl font-light mb-2">Redirecting...</h1>
          <p className="text-neutral-600">Taking you to login page</p>
        </div>
      </div>
    )
  }

  // User is authenticated, show children
  return <>{children}</>
}
