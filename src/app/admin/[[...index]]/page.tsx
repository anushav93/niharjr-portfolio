'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { client } from '@/lib/sanity'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [hasConnection, setHasConnection] = useState(false)

  useEffect(() => {
    // Test Sanity connection
    const testConnection = async () => {
      try {
        console.log('Testing Sanity connection...')
        console.log('Client created successfully')
        
        // Try a simple query first
        const result = await client.fetch('*[_type == "siteSettings"][0]')
        console.log('Connection successful, result:', result)
        setHasConnection(true)
      } catch (error) {
        console.error('Sanity connection failed:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          name: error instanceof Error ? error.name : 'Unknown error type'
        })
        setHasConnection(false)
      } finally {
        setIsLoading(false)
      }
    }

    testConnection()
  }, [])

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    })
  }

  // If not authenticated, show loading
  if (status === "loading") {
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

  // If not authenticated, show authentication required message
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-24">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-light mb-2">Authentication Required</h1>
          <p className="text-neutral-600 mb-6">You need to sign in to access the CMS</p>
          <a 
            href="/admin/login"
            className="inline-block bg-neutral-900 text-white px-6 py-3 rounded hover:bg-neutral-800 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Loading CMS...</h1>
          <p className="text-gray-600">Connecting to your content management system</p>
        </div>
      </div>
    )
  }

  if (!hasConnection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Connection Failed</h1>
          <p className="text-gray-600 mb-6">
            Unable to connect to Sanity. Please check your credentials.
          </p>
          <a 
            href="/admin/setup"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors mr-4"
          >
            Check Setup
          </a>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-gray-200 text-black px-6 py-3 rounded hover:bg-gray-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">Content Manager</h1>
              <p className="text-sm text-gray-500">Portfolio CMS</p>
            </div>
          </div>

          {/* Right: User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">
                {session?.user?.email}
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300"></div>

            {/* Quick Actions */}
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              View Website
            </a>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors border border-gray-300 hover:border-red-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
       
        {/* Main CMS Option */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white border-2 border-neutral-900 p-12 text-center hover:shadow-lg transition-all duration-300 rounded-lg">
            <div className="text-5xl mb-6">✏️</div>
            <h3 className="text-2xl font-light mb-6">Portfolio Editor</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Edit your homepage hero section, featured work, about page content, and site settings with a clean, photography-focused interface.
            </p>
            <a
              href="/admin/editor"
              className="inline-block bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-base transition-all duration-300 font-medium tracking-wide rounded-md"
            >
              OPEN EDITOR
            </a>
          </div>
        </div>

      </main>
    </div>
  )
}
