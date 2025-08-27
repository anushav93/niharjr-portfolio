'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { client, urlFor } from '@/lib/sanity'
import Typography from '@/components/Typography'
import Button from '@/components/Button'
import AuthGuard from '@/components/AuthGuard'
import Toast from '@/components/Toast'

interface ContentData {
  homepage?: any
  aboutPage?: any
  siteSettings?: any
}

export default function SimpleEditorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [content, setContent] = useState<ContentData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('homepage')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [homepage, aboutPage, siteSettings] = await Promise.all([
          client.fetch('*[_type == "homepage"][0]'),
          client.fetch('*[_type == "aboutPage"][0]'),
          client.fetch('*[_type == "siteSettings"][0]')
        ])
        
        setContent({ homepage, aboutPage, siteSettings })
      } catch (error) {
        console.error('Failed to fetch content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  const saveHomepage = async () => {
    setIsSaving(true)
    setSaveStatus({ type: null, message: '' })
    
    try {
      const doc = {
        _id: 'homepage',
        _type: 'homepage',
        ...content.homepage
      }
      
      await client.createOrReplace(doc)
      setSaveStatus({ type: 'success', message: 'Homepage saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    } catch (error) {
      console.error('Homepage save failed:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save homepage. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const saveAboutPage = async () => {
    setIsSaving(true)
    setSaveStatus({ type: null, message: '' })
    
    try {
      const doc = {
        _id: 'aboutPage',
        _type: 'aboutPage',
        ...content.aboutPage
      }
      
      await client.createOrReplace(doc)
      setSaveStatus({ type: 'success', message: 'About page saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    } catch (error) {
      console.error('About page save failed:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save about page. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const saveSiteSettings = async () => {
    setIsSaving(true)
    setSaveStatus({ type: null, message: '' })
    
    try {
      const doc = {
        _id: 'siteSettings',
        _type: 'siteSettings',
        ...content.siteSettings
      }
      
      await client.createOrReplace(doc)
      setSaveStatus({ type: 'success', message: 'Site settings saved successfully!' })
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000)
    } catch (error) {
      console.error('Site settings save failed:', error)
      setSaveStatus({ type: 'error', message: 'Failed to save site settings. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    })
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

  // If not authenticated, show loading (middleware will redirect)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Loading Content...</h1>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-3">
         
            <div>
            <img src="/logo.svg" alt="Logo" className=" h-10" />
              <p className="text-sm text-gray-500">Content Management</p>
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
              href="/admin" 
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </a>

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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="border-b border-neutral-900 py-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h1" fontWeight="light" className="mb-2">
                Portfolio Editor
              </Typography>
              <Typography variant="p" className="text-neutral-600">
                Edit your website content with a clean, photography-focused interface
              </Typography>
            </div>
           
          </div>
        </div>



        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-300 mb-8">
          {['homepage', 'about', 'siteSettings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-neutral-900 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'homepage' && 'Homepage'}
              {tab === 'about' && 'About Page'}
              {tab === 'siteSettings' && 'Site Settings'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Homepage Tab */}
          {activeTab === 'homepage' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="border-b border-neutral-900 pb-16 mb-16">
                <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                  Hero Section
                </Typography>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Hero Tagline
                    </label>
                    <input
                      type="text"
                      value={content.homepage?.hero?.tagline || 'VISUAL STORYTELLER'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            hero: {
                              ...prev.homepage?.hero,
                              tagline: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="VISUAL STORYTELLER"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={content.homepage?.hero?.title || 'NIHAR J REDDY'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            hero: {
                              ...prev.homepage?.hero,
                              title: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="NIHAR J REDDY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Hero Description
                    </label>
                    <textarea
                      value={content.homepage?.hero?.description || 'Capturing authentic moments and creating compelling narratives through the lens'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            hero: {
                              ...prev.homepage?.hero,
                              description: e.target.value
                            }
                          }
                        }))
                      }}
                      rows={3}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none"
                      placeholder="Capturing authentic moments and creating compelling narratives through the lens"
                    />
                  </div>
                  
                  {/* Hero Images */}
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Hero Images (6 images)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-xs text-neutral-500">
                            Image {index + 1}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="border-b border-neutral-900 pb-16 mb-16">
                <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                  Mission Statement
                </Typography>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Mission Title
                    </label>
                    <input
                      type="text"
                      value={content.homepage?.missionStatement?.title || 'Every Frame Tells a Story'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            missionStatement: {
                              ...prev.homepage?.missionStatement,
                              title: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="Every Frame Tells a Story"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Mission Description
                    </label>
                    <textarea
                      value={content.homepage?.missionStatement?.description || 'Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity.'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          homepage: {
                            ...prev.homepage,
                            missionStatement: {
                              ...prev.homepage?.missionStatement,
                              description: e.target.value
                            }
                          }
                        }))
                      }}
                      rows={4}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none"
                      placeholder="Through my lens, I capture the extraordinary in the ordinary, creating visual narratives that resonate with emotion and authenticity."
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="border-b border-neutral-900 pb-16 mb-16">
                <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                  Photography Categories
                </Typography>
                <div className="space-y-8">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-6">
                      <Typography variant="h3" className="mb-4 text-lg">
                        Category {index + 1}
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-2">
                            Label
                          </label>
                          <input
                            type="text"
                            value={content.homepage?.categories?.[index]?.label || ''}
                            onChange={(e) => {
                              setContent(prev => {
                                const currentCategories = prev.homepage?.categories || [];
                                const updatedCategories = [...currentCategories];
                                updatedCategories[index] = {
                                  ...updatedCategories[index],
                                  label: e.target.value
                                };
                                return {
                                  ...prev,
                                  homepage: {
                                    ...prev.homepage,
                                    categories: updatedCategories
                                  }
                                };
                              });
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none bg-transparent text-sm"
                            placeholder="e.g., NATURE"
                          />
                        </div>
                        <div>
                          <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            value={content.homepage?.categories?.[index]?.title || ''}
                            onChange={(e) => {
                              setContent(prev => {
                                const currentCategories = prev.homepage?.categories || [];
                                const updatedCategories = [...currentCategories];
                                updatedCategories[index] = {
                                  ...updatedCategories[index],
                                  title: e.target.value
                                };
                                return {
                                  ...prev,
                                  homepage: {
                                    ...prev.homepage,
                                    categories: updatedCategories
                                  }
                                };
                              });
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none bg-transparent text-sm"
                            placeholder="e.g., Landscapes"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-2">
                          Description
                        </label>
                        <textarea
                          value={content.homepage?.categories?.[index]?.description || ''}
                          onChange={(e) => {
                            setContent(prev => {
                              const currentCategories = prev.homepage?.categories || [];
                              const updatedCategories = [...currentCategories];
                              updatedCategories[index] = {
                                ...updatedCategories[index],
                                description: e.target.value
                              };
                              return {
                                ...prev,
                                homepage: {
                                  ...prev.homepage,
                                  categories: updatedCategories
                                }
                              };
                            });
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none bg-transparent text-sm resize-none"
                          placeholder="Describe this category..."
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-2">
                          Gallery Filter
                        </label>
                        <input
                          type="text"
                          value={content.homepage?.categories?.[index]?.galleryFilter || ''}
                          onChange={(e) => {
                            setContent(prev => {
                              const currentCategories = prev.homepage?.categories || [];
                              const updatedCategories = [...currentCategories];
                              updatedCategories[index] = {
                                ...updatedCategories[index],
                                galleryFilter: e.target.value
                              };
                              return {
                                ...prev,
                                homepage: {
                                  ...prev.homepage,
                                  categories: updatedCategories
                                }
                              };
                            });
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded focus:border-neutral-900 focus:outline-none bg-transparent text-sm"
                          placeholder="e.g., Nature+and+the+Landscapes"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Work */}
              <div className="pb-16">
                <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                  Featured Work Section
                </Typography>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Section Title
                    </label>
                                                <input
                              type="text"
                              value={content.homepage?.featuredWork?.sectionTitle || 'Latest Captures'}
                              onChange={(e) => {
                                setContent(prev => ({
                                  ...prev,
                                  homepage: {
                                    ...prev.homepage,
                                    featuredWork: {
                                      ...prev.homepage?.featuredWork,
                                      sectionTitle: e.target.value
                                    }
                                  }
                                }))
                              }}
                              className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                              placeholder="Latest Captures"
                            />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Section Description
                    </label>
                                                <textarea
                              value={content.homepage?.featuredWork?.sectionDescription || 'A curated selection of my most recent work, showcasing diverse styles and subjects.'}
                              onChange={(e) => {
                                setContent(prev => ({
                                  ...prev,
                                  homepage: {
                                    ...prev.homepage,
                                    featuredWork: {
                                      ...prev.homepage?.featuredWork,
                                      sectionDescription: e.target.value
                                    }
                                  }
                                }))
                              }}
                              rows={3}
                              className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none"
                              placeholder="A curated selection of my most recent work, showcasing diverse styles and subjects."
                            />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Button Text
                    </label>
                                                <input
                              type="text"
                              value={content.homepage?.featuredWork?.buttonText || 'View All Work'}
                              onChange={(e) => {
                                setContent(prev => ({
                                  ...prev,
                                  homepage: {
                                    ...prev.homepage,
                                    featuredWork: {
                                      ...prev.homepage?.featuredWork,
                                      buttonText: e.target.value
                                    }
                                  }
                                }))
                              }}
                              className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                              placeholder="View All Work"
                            />
                  </div>
                  
                  {/* Featured Work Images */}
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Featured Work Images (6 images)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                          <label className="block text-xs text-neutral-500">
                            Image {index + 1}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-8 border-t border-neutral-900">
                <button
                  onClick={saveHomepage}
                  disabled={isSaving}
                  className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm uppercase tracking-wide rounded-md"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Homepage'}
                </button>
              </div>
            </div>
          )}

          {/* About Page Tab */}
          {activeTab === 'about' && (
            <div className="space-y-12">
              <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                About Page Content
              </Typography>
              
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="border-b border-neutral-900 pb-16 mb-16">
                  <Typography variant="h3" fontWeight="light" className="mb-6 uppercase tracking-widest">
                    Hero Section
                  </Typography>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Hero Title
                      </label>
                      <input
                        type="text"
                        value={content.aboutPage?.hero?.title || 'Nihar J Reddy'}
                        onChange={(e) => {
                          setContent(prev => ({
                            ...prev,
                            aboutPage: {
                              ...prev.aboutPage,
                              hero: {
                                ...prev.aboutPage?.hero,
                                title: e.target.value
                              }
                            }
                          }))
                        }}
                        className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                        placeholder="Nihar J Reddy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Hero Subtitle
                      </label>
                      <input
                        type="text"
                        value={content.aboutPage?.hero?.subtitle || 'Visual storyteller, photographer, and creative director'}
                        onChange={(e) => {
                          setContent(prev => ({
                            ...prev,
                            aboutPage: {
                              ...prev.aboutPage,
                              hero: {
                                ...prev.aboutPage?.hero,
                                subtitle: e.target.value
                              }
                            }
                          }))
                        }}
                        className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                        placeholder="Visual storyteller, photographer, and creative director"
                      />
                    </div>
                  </div>
                </div>

                {/* Story Section */}
                <div className="border-b border-neutral-900 pb-16 mb-16">
                  <Typography variant="h3" fontWeight="light" className="mb-6 uppercase tracking-widest">
                    Story Section
                  </Typography>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        value={content.aboutPage?.story?.yearsExperience || 5}
                        onChange={(e) => {
                          setContent(prev => ({
                            ...prev,
                            aboutPage: {
                              ...prev.aboutPage,
                              story: {
                                ...prev.aboutPage?.story,
                                yearsExperience: parseInt(e.target.value) || 0
                              }
                            }
                          }))
                        }}
                        className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={content.aboutPage?.story?.mainTitle || 'Creating Visual Narratives'}
                        onChange={(e) => {
                          setContent(prev => ({
                            ...prev,
                            aboutPage: {
                              ...prev.aboutPage,
                              story: {
                                ...prev.aboutPage?.story,
                                mainTitle: e.target.value
                              }
                            }
                          }))
                        }}
                        className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                        placeholder="Creating Visual Narratives"
                      />
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Story Paragraphs
                      </label>
                      {content.aboutPage?.story?.storyParagraphs?.map((paragraph: string, index: number) => (
                        <textarea
                          key={index}
                          value={paragraph}
                          onChange={(e) => {
                            setContent(prev => ({
                              ...prev,
                              aboutPage: {
                                ...prev.aboutPage,
                                story: {
                                  ...prev.aboutPage?.story,
                                  storyParagraphs: prev.aboutPage?.story?.storyParagraphs?.map((p: string, i: number) => 
                                    i === index ? e.target.value : p
                                  ) || []
                                }
                              }
                            }))
                          }}
                          rows={3}
                          className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none mb-4"
                          placeholder={`Paragraph ${index + 1}`}
                        />
                      )) || (
                        <textarea
                          value=""
                          rows={3}
                          className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none"
                          placeholder="Add your story paragraphs here..."
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {content.aboutPage?.story?.skills?.map((skill: string, index: number) => (
                          <input
                            key={index}
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              setContent(prev => ({
                                ...prev,
                                aboutPage: {
                                  ...prev.aboutPage,
                                  story: {
                                    ...prev.aboutPage?.story,
                                    skills: prev.aboutPage?.story?.skills?.map((s: string, i: number) => 
                                      i === index ? e.target.value : s
                                    ) || []
                                  }
                                }
                              }))
                            }}
                            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:border-neutral-900 focus:outline-none"
                            placeholder="Skill"
                          />
                        )) || (
                          <input
                            type="text"
                            value=""
                            className="px-3 py-2 border border-neutral-300 rounded-md text-sm focus:border-neutral-900 focus:outline-none"
                            placeholder="Add skills here..."
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portrait Image */}
                <div>
                  <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                    Portrait Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-8 border-t border-neutral-900">
                <button
                  onClick={saveAboutPage}
                  disabled={isSaving}
                  className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm uppercase tracking-wide rounded-md"
                >
                  {isSaving ? 'Saving Changes...' : 'Save About Page'}
                </button>
              </div>
            </div>
          )}

          {/* Site Settings Tab */}
          {activeTab === 'siteSettings' && (
            <div className="space-y-12">
              <Typography variant="h2" fontWeight="light" className="mb-8 uppercase tracking-widest">
                Site Settings
              </Typography>

              {/* Contact Information */}
              <div className="border-b border-neutral-900 pb-16 mb-16">
                <h3 className="text-xl font-light mb-8 uppercase tracking-widest">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={content.siteSettings?.contact?.email || 'nihar@niharjreddy.com'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            contact: {
                              ...prev.siteSettings?.contact,
                              email: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="nihar@niharjreddy.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={content.siteSettings?.contact?.phone || '+1 (555) 123-4567'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            contact: {
                              ...prev.siteSettings?.contact,
                              phone: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings?.contact?.location || 'San Francisco, CA'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            contact: {
                              ...prev.siteSettings?.contact,
                              location: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.contact?.website || 'https://niharjreddy.com'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            contact: {
                              ...prev.siteSettings?.contact,
                              website: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://niharjreddy.com"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="border-b border-neutral-900 pb-16 mb-16">
                <h3 className="text-xl font-light mb-8 uppercase tracking-widest">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.instagram || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              instagram: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Twitter/X URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.twitter || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              twitter: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.linkedin || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              linkedin: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.facebook || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              facebook: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Behance URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.behance || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              behance: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://behance.net/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={content.siteSettings?.socialMedia?.youtube || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            socialMedia: {
                              ...prev.siteSettings?.socialMedia,
                              youtube: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
              </div>

              {/* Footer & SEO */}
              <div className="mb-16">
                <h3 className="text-xl font-light mb-8 uppercase tracking-widest">Footer & SEO</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings?.footer?.copyrightText || '© Nihar J Reddy Photography. All rights reserved.'}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            footer: {
                              ...prev.siteSettings?.footer,
                              copyrightText: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="© Nihar J Reddy Photography. All rights reserved."
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      SEO Keywords (separate with commas)
                    </label>
                    <textarea
                      value={content.siteSettings?.seo?.keywords?.join(', ') || 'photography, photographer, portraits, wedding photography, event photography, landscape photography'}
                      onChange={(e) => {
                        const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            seo: {
                              ...prev.siteSettings?.seo,
                              keywords: keywords
                            }
                          }
                        }))
                      }}
                      rows={3}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light resize-none"
                      placeholder="photography, photographer, portraits, wedding photography"
                    />
                  </div>
                  <div>
                    <label className="block text-sm uppercase tracking-wide text-neutral-600 mb-3">
                      Google Analytics ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings?.seo?.googleAnalyticsId || ''}
                      onChange={(e) => {
                        setContent(prev => ({
                          ...prev,
                          siteSettings: {
                            ...prev.siteSettings,
                            seo: {
                              ...prev.siteSettings?.seo,
                              googleAnalyticsId: e.target.value
                            }
                          }
                        }))
                      }}
                      className="w-full px-0 py-3 border-0 border-b border-neutral-300 focus:border-neutral-900 focus:outline-none bg-transparent text-lg font-light"
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-8 border-t border-neutral-900">
                <button
                  onClick={saveSiteSettings}
                  disabled={isSaving}
                  className="bg-neutral-900 text-white px-8 py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm uppercase tracking-wide rounded-md"
                >
                  {isSaving ? 'Saving Changes...' : 'Save Site Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Toast Notification */}
      <Toast
        message={saveStatus.message}
        type={saveStatus.type || 'success'}
        isVisible={!!saveStatus.type}
        onClose={() => setSaveStatus({ type: null, message: '' })}
      />
    </div>
    </AuthGuard>
  )
}
