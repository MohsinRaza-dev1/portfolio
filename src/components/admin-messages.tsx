"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Clock, MessageCircle, User } from 'lucide-react'

interface AdminMessage {
  id: string
  sender: 'admin'
  message: string
  timestamp: string
  sessionId: string
  userEmail?: string
}

interface AdminMessagesProps {
  userEmail?: string
}

export function AdminMessages({ userEmail }: AdminMessagesProps) {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdminMessages = async () => {
      if (!userEmail) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/chat/admin-messages?email=${encodeURIComponent(userEmail)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin messages')
        }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error('Error fetching admin messages:', error)
        setError('Unable to load admin messages')
      } finally {
        setLoading(false)
      }
    }

    fetchAdminMessages()
  }, [userEmail])

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timestamp
    }
  }

  if (!userEmail) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Enter your email to see admin responses</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Loading admin messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-red-500">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No admin messages found</p>
          <p className="text-xs mt-2">Admin responses will appear here once available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Shield className="text-primary" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">Admin Responses</h3>
        <p className="text-muted-foreground text-sm">
          Messages from admin regarding your inquiries
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="bg-secondary border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-primary">Admin</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{message.message}</p>
                </div>
                
                {message.userEmail && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <User size={10} />
                    <span>Response to: {message.userEmail}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Showing {messages.length} admin message{messages.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
