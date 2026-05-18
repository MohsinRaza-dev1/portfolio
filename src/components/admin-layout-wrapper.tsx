"use client"

import { useAdmin } from '@/contexts/admin-context'
import { usePathname } from 'next/navigation'
import { ModernSidebar } from '@/components/modern-sidebar'
import { Navbar } from '@/components/navbar'
import { ModernLayoutWrapper } from '@/components/modern-layout-wrapper'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const { isAdmin } = useAdmin()
  const pathname = usePathname()
  
  // Check if current path is admin-related
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Hide sidebar and navbar when in admin panel (including login page)
  const shouldHideSidebar = isAdminRoute
  
  if (shouldHideSidebar) {
    // Return full-screen layout for admin panel
    return (
      <main className="min-h-screen bg-background w-full">
        {children}
      </main>
    )
  }
  
  // Return normal layout with sidebar and navbar
  return (
    <>
      <ModernSidebar />
      <Navbar />
      <ModernLayoutWrapper>
        {children}
      </ModernLayoutWrapper>
    </>
  )
}
