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
  updatedAt?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => Promise<void>
  updateNotification: (id: number, updates: Partial<Omit<Notification, 'id' | 'time'>>) => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  clearAllNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const mergeReadStates = (serverNotifications: Notification[], stored: Notification[]) => {
    const storedMap = new Map<number, boolean>(stored.map(n => [n.id, n.read]))
    return serverNotifications.map(notification => ({
      ...notification,
      read: storedMap.has(notification.id) ? storedMap.get(notification.id)! : notification.read ?? false,
      time: notification.time || 'Just now'
    }))
  }

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      const storedNotifications = localStorage.getItem('notifications')
      const parsedStored = storedNotifications ? JSON.parse(storedNotifications) : []
      const merged = mergeReadStates(data.notifications || [], parsedStored)
      setNotifications(merged)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        const updatedNotifications = JSON.parse(e.newValue || '[]')
        setNotifications(updatedNotifications)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const addNotification = async (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      })

      if (!response.ok) {
        throw new Error('Failed to create notification')
      }

      const data = await response.json()
      if (data.notification) {
        setNotifications(prev => [data.notification, ...prev])
      }
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }

  const updateNotification = async (id: number, updates: Partial<Omit<Notification, 'id' | 'time'>>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates })
      })

      if (!response.ok) {
        throw new Error('Failed to update notification')
      }

      const data = await response.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

      const data = await response.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      } else {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(notif => notif.id === id ? { ...notif, read: true } : notif))

    try {
      await updateNotification(id, { read: true })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))

    try {
      await Promise.all(
        notifications.filter(notif => !notif.read).map(notif => updateNotification(notif.id, { read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
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
