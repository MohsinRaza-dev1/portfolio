"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) {
      return
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
          }),
        })
      } catch (error) {
        // Silently fail to not affect user experience
        console.error('Analytics tracking failed:', error)
      }
    }

    // Track immediately
    trackPageView()

    // Track page visibility changes (for time on page)
    let startTime = Date.now()
    let isVisible = true

    const handleVisibilityChange = () => {
      if (document.hidden && isVisible) {
        // Page became hidden, track time spent
        const timeSpent = Date.now() - startTime
        isVisible = false
        
        // Send time on page data (could be enhanced later)
        console.log(`Time on page: ${timeSpent}ms`)
      } else if (!document.hidden && !isVisible) {
        // Page became visible again
        startTime = Date.now()
        isVisible = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])

  return null
}
