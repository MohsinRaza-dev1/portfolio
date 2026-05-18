"use client"

import { useState, useCallback } from 'react'

export interface PortalError {
  message: string
  code?: string
  details?: any
}

export function usePortalError() {
  const [error, setError] = useState<PortalError | null>(null)
  const [isRecovering, setIsRecovering] = useState(false)

  const setPortalError = useCallback((error: PortalError | Error | string) => {
    if (typeof error === 'string') {
      setError({ message: error })
    } else if (error instanceof Error) {
      setError({ 
        message: error.message, 
        code: error.name,
        details: error.stack 
      })
    } else {
      setError(error)
    }
  }, [])

  const clearPortalError = useCallback(() => {
    setError(null)
    setIsRecovering(false)
  }, [])

  const recoverFromError = useCallback(async (recoveryAction?: () => Promise<void>) => {
    setIsRecovering(true)
    try {
      if (recoveryAction) {
        await recoveryAction()
      }
      setError(null)
    } catch (recoveryError) {
      setPortalError(recoveryError as Error)
    } finally {
      setIsRecovering(false)
    }
  }, [setPortalError])

  return {
    error,
    hasError: !!error,
    isRecovering,
    setPortalError,
    clearPortalError,
    recoverFromError
  }
}
