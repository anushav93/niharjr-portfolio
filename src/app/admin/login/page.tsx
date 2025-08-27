'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check if there's an error from the callback
  const authError = searchParams?.get('error')

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await signIn('google', {
        callbackUrl: '/admin',
        redirect: true
      })
    } catch (error) {
      setError('An error occurred during sign-in. Please try again.')
      setLoading(false)
    }
  }

  // Display error messages
  useEffect(() => {
    if (authError) {
      if (authError === 'AccessDenied') {
        setError('Access denied. You are not authorized to access this CMS. Please contact the administrator.')
      } else if (authError === 'OAuthCallback') {
        setError('Authentication failed. Please try again.')
      } else {
        setError('An authentication error occurred. Please try again.')
      }
    }
  }, [authError])

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-md mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-light tracking-tight mb-4">Admin Access</h1>
          <p className="text-neutral-600">
            Sign in with your Google account to access the content management system
          </p>
        </div>

        {/* Google Sign In */}
        <div className="border-2 border-neutral-900 p-8">
          <div className="text-center space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border-2 border-neutral-900 text-neutral-900 px-8 py-4 hover:bg-neutral-50 transition-colors disabled:opacity-50 text-sm uppercase tracking-wide flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-900"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-neutral-500">
                Only authorized Sanity project members can access this CMS
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <a 
            href="/"
            className="text-neutral-600 hover:text-neutral-900 text-sm uppercase tracking-wide"
          >
            ← Back to Website
          </a>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-md mx-auto px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-light tracking-tight mb-4">Admin Access</h1>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
