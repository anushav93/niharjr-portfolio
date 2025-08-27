'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Don't show website navigation for admin routes
  const isAdminRoute = pathname?.startsWith('/admin')
  
  if (isAdminRoute) {
    // Admin routes get clean layout without website navigation
    return <>{children}</>
  }
  
  // Regular website routes get full navigation
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
