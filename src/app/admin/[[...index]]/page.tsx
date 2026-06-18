'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [hasConnection, setHasConnection] = useState(false)

  useEffect(() => {
    fetch('/api/cms-health')
      .then((res) => res.json())
      .then((data) => setHasConnection(!!data.ok))
      .catch(() => setHasConnection(false))
      .finally(() => setIsLoading(false))
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
          <p className="text-neutral-600">Connecting to Contentful</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-neutral-900">Content Manager</h1>
              <p className="text-sm text-neutral-500">Portfolio CMS</p>
            </div>
          </div>

          {/* Right: User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900">
                {session?.user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-neutral-500">
                {session?.user?.email}
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-neutral-300"></div>

            {/* Quick Actions */}
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md hover:bg-neutral-100 transition-colors"
            >
              View Website
            </a>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-600 hover:text-error-600 px-3 py-2 rounded-md hover:bg-error-50 transition-colors border border-neutral-300 hover:border-error-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Status Indicator */}
        <div className="mb-8 p-4 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${hasConnection ? 'bg-success-500' : 'bg-warning-500'}`}></div>
            <span className="text-sm text-neutral-600">
              {hasConnection ? 'Connected to Contentful' : 'Contentful not configured - using fallback content'}
            </span>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Homepage Card */}
          <a 
            href="https://app.contentful.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-neutral-200 p-6 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-lg font-medium mb-2">Homepage</h3>
            <p className="text-neutral-600 text-sm">Edit hero section, mission statement, and featured work.</p>
          </a>

          {/* About Page Card */}
          <a 
            href="https://app.contentful.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-neutral-200 p-6 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="text-3xl mb-4">👤</div>
            <h3 className="text-lg font-medium mb-2">About Page</h3>
            <p className="text-neutral-600 text-sm">Update your story, skills, and approach principles.</p>
          </a>

          {/* Gallery Card */}
          <a 
            href="https://app.contentful.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-neutral-200 p-6 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-lg font-medium mb-2">Gallery</h3>
            <p className="text-neutral-600 text-sm">Manage photo collections and categories.</p>
          </a>

          {/* Site Settings Card */}
          <a 
            href="https://app.contentful.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-neutral-200 p-6 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="text-3xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium mb-2">Site Settings</h3>
            <p className="text-neutral-600 text-sm">Update contact info, social links, and SEO.</p>
          </a>

          {/* Media Library Card */}
          <a 
            href="https://app.contentful.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-neutral-200 p-6 rounded-lg hover:shadow-md transition-all duration-300"
          >
            <div className="text-3xl mb-4">🖼️</div>
            <h3 className="text-lg font-medium mb-2">Media Library</h3>
            <p className="text-neutral-600 text-sm">Manage all uploaded images and assets.</p>
          </a>
        </div>

        {/* Contentful CTA */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-2 border-primary-500 p-12 text-center hover:shadow-lg transition-all duration-300 rounded-lg">
            <div className="text-5xl mb-6">📝</div>
            <h3 className="text-2xl font-light mb-6">Open Contentful Dashboard</h3>
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Edit your content directly in Contentful's powerful content management interface.
            </p>
            <a
              href="https://app.contentful.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-base transition-all duration-300 font-medium tracking-wide rounded-md"
            >
              OPEN CONTENTFUL
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
