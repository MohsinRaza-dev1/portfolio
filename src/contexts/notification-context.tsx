"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Notification {
  id: number
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  time: string
  read: boolean
  targetUsers?: string
  status?: string
  createdAt?: string
  createdBy?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void
  updateNotification: (id: number, updates: Partial<Omit<Notification, 'id' | 'time'>>) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  clearAllNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    console.log('💾 Saving notifications to localStorage:', notifications)
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])
  
  // Initial save on mount to ensure persistence
  useEffect(() => {
    if (notifications.length > 0) {
      console.log('� Initial save of notifications to localStorage')
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [])
  
  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        console.log('🔄 Storage changed, reloading notifications...')
        const updatedNotifications = JSON.parse(e.newValue || '[]')
        setNotifications(updatedNotifications)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Debug: Log notification state on mount
  useEffect(() => {
    console.log('NotificationProvider mounted, current notifications:', notifications)
  }, [notifications])

  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    console.log('Adding notification to context:', notification)
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: 'Just now',
      read: false
    }
    console.log('New notification created:', newNotification)
    setNotifications(prev => {
      console.log('Previous notifications:', prev)
      const updated = [newNotification, ...prev]
      console.log('Updated notifications:', updated)
      return updated
    })
  }

  const updateNotification = (id: number, updates: Partial<Omit<Notification, 'id' | 'time'>>) => {
    console.log('Updating notification:', id, updates)
    setNotifications(prev => {
      console.log('Current notifications before update:', prev)
      console.log('Looking for notification with ID:', id)
      console.log('Available notification IDs:', prev.map(n => n.id))
      
      const updated = prev.map(notif => {
        console.log('Comparing:', notif.id, 'with', id, '=>', notif.id === id)
        if (notif.id === id) {
          console.log('Found notification to update, applying updates:', updates)
          return { ...notif, ...updates, time: 'Just now' }
        }
        return notif
      })
      
      console.log('Notifications after update:', updated)
      return updated
    })
  }

  const markAsRead = (id: number) => {
    console.log('📖 Marking notification as read:', id)
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
      console.log('📝 Updated notifications after markAsRead:', updated)
      return updated
    })
  }

  const markAllAsRead = () => {
    console.log('📖 Marking all notifications as read')
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }))
      console.log('📝 Updated notifications after markAllAsRead:', updated)
      return updated
    })
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      updateNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
