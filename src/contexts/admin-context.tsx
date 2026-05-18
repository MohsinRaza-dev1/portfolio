"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
  adminUser: { id: string; username: string } | null
  setAdminUser: (user: { id: string; username: string } | null) => void
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<{ id: string; username: string } | null>(null)

  useEffect(() => {
    // Check if admin is logged in on mount
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        setIsAdmin(true)
        setAdminUser(parsedUser)
      } catch (error) {
        console.error('Error parsing admin user:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  const logout = () => {
    setIsAdmin(false)
    setAdminUser(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin/login'
  }

  return (
    <AdminContext.Provider value={{
      isAdmin,
      setIsAdmin,
      adminUser,
      setAdminUser,
      logout
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
