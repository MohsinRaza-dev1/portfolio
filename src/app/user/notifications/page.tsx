'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Info, X, Users } from 'lucide-react'
import { useNotifications } from '@/contexts/notification-context'

export default function UserNotifications() {
  const { 
    notifications, 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    unreadCount 
  } = useNotifications()

  console.log('UserNotifications - Current notifications:', notifications)
  console.log('UserNotifications - Unread count:', unreadCount)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">No notifications</h2>
          <p className="text-muted-foreground">You don't have any notifications at the moment.</p>
          <p className="text-sm text-muted-foreground">
            Check back later for any new updates or announcements.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-indigo-100">Stay updated with your latest notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Your Notifications ({notifications.length})
          </h2>
          
          {/* Clear All Button */}
          {notifications.length > 0 && (
            <div className="mb-4">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={clearAllNotifications}
                className="w-full px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Clear All Notifications
              </motion.button>
            </div>
          )}

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-card rounded-lg border p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  notification.read ? '' : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                }`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bell className="w-4 h-4" />
                        {notification.createdAt && (
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      {notification.targetUsers && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {notification.targetUsers === 'all' ? 'All Users' : notification.targetUsers}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
