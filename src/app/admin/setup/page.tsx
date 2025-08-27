'use client'

import { useEffect, useState } from 'react'
import Typography from '@/components/Typography'
import Button from '@/components/Button'

export default function AdminSetupPage() {
  const [envStatus, setEnvStatus] = useState<{
    projectId: boolean
    dataset: boolean  
    token: boolean
  }>({
    projectId: false,
    dataset: false,
    token: false
  })

  useEffect(() => {
    setEnvStatus({
      projectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: !!process.env.SANITY_API_TOKEN
    })
  }, [])

  const allConfigured = envStatus.projectId && envStatus.dataset && envStatus.token

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Typography variant="h1" className="mb-4">
            📸 CMS Setup Status
          </Typography>
          <Typography variant="p" className="text-neutral-600 dark:text-neutral-400">
            Your user-friendly content management system is ready to configure
          </Typography>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-lg border-2 ${
            envStatus.projectId 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">
                {envStatus.projectId ? '✅' : '❌'}
              </div>
              <Typography variant="h3" className="mb-2">
                Project ID
              </Typography>
              <Typography variant="small" className="text-neutral-600">
                {envStatus.projectId ? 'Configured' : 'Missing'}
              </Typography>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            envStatus.dataset 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">
                {envStatus.dataset ? '✅' : '❌'}
              </div>
              <Typography variant="h3" className="mb-2">
                Dataset
              </Typography>
              <Typography variant="small" className="text-neutral-600">
                {envStatus.dataset ? 'Configured' : 'Missing'}
              </Typography>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 ${
            envStatus.token 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">
                {envStatus.token ? '✅' : '❌'}
              </div>
              <Typography variant="h3" className="mb-2">
                API Token
              </Typography>
              <Typography variant="small" className="text-neutral-600">
                {envStatus.token ? 'Configured' : 'Missing'}
              </Typography>
            </div>
          </div>
        </div>

        {allConfigured ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <Typography variant="h2" className="mb-4 text-green-800">
              Your CMS is Ready!
            </Typography>
            <Typography variant="p" className="mb-6 text-green-700">
              All configuration is complete. You can now access your content management system.
            </Typography>
            <Button href="/admin" variant="dark" className="mr-4">
              Open CMS Admin
            </Button>
            <Button href="/" variant="light">
              View Website
            </Button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <Typography variant="h2" className="mb-6 text-blue-800">
              🚀 Quick Setup Guide
            </Typography>
            
            <div className="space-y-6 text-left">
              <div>
                <Typography variant="h3" className="mb-2 text-blue-700">
                  Step 1: Create Sanity Account
                </Typography>
                <Typography variant="p" className="text-blue-600">
                  1. Go to <a href="https://sanity.io" target="_blank" rel="noopener noreferrer" className="underline">sanity.io</a> and create a free account<br/>
                  2. Create a new project<br/>
                  3. Choose "Production" dataset<br/>
                  4. Copy your Project ID
                </Typography>
              </div>

              <div>
                <Typography variant="h3" className="mb-2 text-blue-700">
                  Step 2: Get API Token
                </Typography>
                <Typography variant="p" className="text-blue-600">
                  1. In your Sanity dashboard → API → Tokens<br/>
                  2. Create new token<br/>
                  3. Choose "Editor" permissions<br/>
                  4. Copy the token
                </Typography>
              </div>

              <div>
                <Typography variant="h3" className="mb-2 text-blue-700">
                  Step 3: Add Environment Variables
                </Typography>
                <Typography variant="p" className="text-blue-600 mb-4">
                  Create or update your .env.local file with:
                </Typography>
                <div className="bg-neutral-100 p-4 rounded font-mono text-sm">
                  NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here<br/>
                  NEXT_PUBLIC_SANITY_DATASET=production<br/>
                  SANITY_API_TOKEN=your_token_here
                </div>
              </div>

              <div>
                <Typography variant="h3" className="mb-2 text-blue-700">
                  Step 4: Restart Server
                </Typography>
                <Typography variant="p" className="text-blue-600">
                  Stop your development server (Ctrl+C) and run <code className="bg-neutral-100 px-2 py-1 rounded">npm run dev</code> again
                </Typography>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button 
                href="https://sanity.io" 
                target="_blank"
                variant="dark" 
                className="mr-4"
              >
                Create Sanity Account
              </Button>
              <Button 
                href="/admin/setup" 
                variant="light"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🏠</div>
            <Typography variant="h3" className="mb-2">
              Homepage Management
            </Typography>
            <Typography variant="p" className="text-neutral-600">
              Edit hero section, mission statement, and category showcase
            </Typography>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">👨‍💼</div>
            <Typography variant="h3" className="mb-2">
              About Page Editor
            </Typography>
            <Typography variant="p" className="text-neutral-600">
              Update your story, skills, and photography approach
            </Typography>
          </div>

          <div className="text-center p-6">
            <div className="text-4xl mb-4">⚙️</div>
            <Typography variant="h3" className="mb-2">
              Site Settings
            </Typography>
            <Typography variant="p" className="text-neutral-600">
              Manage contact info, social media, and global settings
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
