"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Plus, Send, Users, CheckCircle, AlertCircle, Info, X, Trash2, Edit } from 'lucide-react'
import { useNotifications } from '@/contexts/notification-context'
import { AdminAuthGuard } from '@/components/admin-auth-guard'

interface AdminNotification {
  id: number
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  targetUsers: string
  status: string
  createdAt: string
  createdBy: string
  updatedAt?: string
}

export default function AdminNotifications() {
  return (
    <AdminAuthGuard>
      <AdminNotificationsContent />
    </AdminAuthGuard>
  )
}

function AdminNotificationsContent() {
  const { notifications, addNotification, deleteNotification, updateNotification } = useNotifications()
  // Use shared notifications instead of local state to ensure persistence
  const adminNotifications = notifications.map(notif => ({
    ...notif,
    targetUsers: notif.targetUsers || 'all',
    status: 'active',
    createdBy: notif.createdBy || 'Admin'
  }))

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingNotification, setEditingNotification] = useState<AdminNotification | null>(null)
  const [formData, setFormData] = useState({
    type: 'info' as 'success' | 'info' | 'warning' | 'error',
    title: '',
    message: '',
    targetUsers: 'all',
    scheduledTime: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingNotification) {
      // Update existing notification in shared context
      updateNotification(editingNotification.id, {
        type: formData.type,
        title: formData.title,
        message: formData.message
      })
      
      setEditingNotification(null)
    } else {
      // Create new notification
      const newNotification = {
        id: Date.now(),
        ...formData,
        status: formData.scheduledTime ? 'scheduled' : 'active',
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      }
      // Add directly to shared context
      
      // Add to shared notifications for users
      console.log('Adding notification to shared context:', {
        type: formData.type,
        title: formData.title,
        message: formData.message
      })
      addNotification({
        type: formData.type,
        title: formData.title,
        message: formData.message
      })
      console.log('Notification added to shared context')
    }
    
    setFormData({
      type: 'info',
      title: '',
      message: '',
      targetUsers: 'all',
      scheduledTime: ''
    })
    setShowCreateForm(false)
  }

  const handleEdit = (notification: any) => {
    setEditingNotification(notification)
    setFormData({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      targetUsers: notification.targetUsers || 'all',
      scheduledTime: ''
    })
    setShowCreateForm(true)
  }

  const handleDelete = (id: number) => {
    // Remove from shared context
    deleteNotification(id)
  }

  const handleStatusToggle = (id: number) => {
    console.log('Toggling status for notification ID:', id)
    console.log('Current adminNotifications:', adminNotifications)
    
    // Find the current notification to determine its current status
    const currentNotification = adminNotifications.find(notif => notif.id === id)
    console.log('Found notification:', currentNotification)
    
    if (currentNotification) {
      // Toggle between active and inactive status
      const currentStatus = currentNotification.status || 'active'
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      console.log('Current status:', currentStatus, 'New status:', newStatus)
      
      updateNotification(id, { status: newStatus })
      console.log('Status toggle completed')
    } else {
      console.log('Notification not found with ID:', id)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">Notification Management</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Notification
            </button>
          </div>
          <p className="text-muted-foreground mt-2">
            Create and manage notifications for all users
          </p>
        </motion.div>

        {/* Create/Edit Notification Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingNotification ? 'Edit Notification' : 'Create New Notification'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingNotification(null)
                    setFormData({
                      type: 'info',
                      title: '',
                      message: '',
                      targetUsers: 'all',
                      scheduledTime: ''
                    })
                  }}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Notification Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'success' | 'info' | 'warning' | 'error' }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Users</label>
                    <select
                      value={formData.targetUsers}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetUsers: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="new">New Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to send immediately
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {editingNotification ? 'Update Notification' : 'Send Notification'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingNotification(null)
                      setFormData({
                        type: 'info',
                        title: '',
                        message: '',
                        targetUsers: 'all',
                        scheduledTime: ''
                      })
                    }}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">All Notifications</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {adminNotifications.length} notifications total
              </p>
            </div>

            {adminNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">Create your first notification to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {adminNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              notification.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : notification.status === 'scheduled'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {notification.targetUsers === 'all' ? 'All Users' : notification.targetUsers || 'All Users'}
                            </div>
                            <span>Created: {new Date(notification.createdAt || '').toLocaleDateString()}</span>
                            <span>By: {notification.createdBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusToggle(notification.id)}
                          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                            notification.status === 'active'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800'
                              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                          }`}
                        >
                          {notification.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(notification)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
