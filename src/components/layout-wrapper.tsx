"use client"

import { useSidebar } from './basic-sidebar'
import { useEffect, useState } from 'react'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <main 
      className="pt-16 transition-all duration-300 ease-in-out" 
      style={{ 
        marginLeft: isMobile ? '0px' : `${sidebarWidth}px`
      }}
    >
      {children}
    </main>
  )
}
