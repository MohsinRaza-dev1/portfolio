"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/contexts/admin-context'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAdmin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  // Show loading state or redirect if not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
