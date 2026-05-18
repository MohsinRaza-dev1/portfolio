"use client"

import React, { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { PortalErrorBoundary } from './portal-error-boundary'
import { usePortalError } from '@/hooks/use-portal-error'

interface PortalWrapperProps {
  children: React.ReactNode
  container?: HTMLElement | null
  fallback?: React.ReactNode
  onError?: (error: Error) => void
}

export function PortalWrapper({ 
  children, 
  container, 
  fallback,
  onError 
}: PortalWrapperProps) {
  const { error, setPortalError, clearPortalError } = usePortalError()

  const handleError = useCallback((error: Error) => {
    setPortalError(error)
    onError?.(error)
  }, [setPortalError, onError])

  if (error) {
    return fallback || (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-background border border-border rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Portal Error</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {error.message}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={clearPortalError}
              className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const portalContainer = container || document.body

  if (!portalContainer) {
    return fallback || (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="bg-background border border-border rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Portal Unavailable</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Portal container is not available. Please refresh the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return createPortal(
    <PortalErrorBoundary fallback={fallback}>
      {children}
    </PortalErrorBoundary>,
    portalContainer
  )
}

// Hook for safe portal creation
export function useSafePortal() {
  const { setPortalError } = usePortalError()

  const createSafePortal = useCallback((children: React.ReactNode, container?: HTMLElement | null) => {
    try {
      const portalContainer = container || document.body
      if (!portalContainer) {
        setPortalError('Portal container not available')
        return null
      }
      return createPortal(children, portalContainer)
    } catch (error) {
      setPortalError(error as Error)
      return null
    }
  }, [setPortalError])

  return { createSafePortal }
}
