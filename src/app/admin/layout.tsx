"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AdminNavbar } from '@/components/admin-navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('admin-token')
      const user = localStorage.getItem('admin-user')
      setIsAuthenticated(!!token && !!user)
    }
    
    checkAuth()
    
    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Don't show navbar on login page or when not authenticated
  const shouldShowNavbar = mounted && isAuthenticated && pathname !== '/admin/login'

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {shouldShowNavbar && <AdminNavbar />}
      <main className={shouldShowNavbar ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  )
}
