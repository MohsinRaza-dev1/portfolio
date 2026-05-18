"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, User, Shield, Clock, Send } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'admin'
  message: string
  timestamp: string
  sessionId: string
  email?: string
  isPublic?: boolean
}

interface ConversationHistoryProps {
  userEmail?: string
  showPublicMessages?: boolean
}

export function ConversationHistory({ userEmail, showPublicMessages = true }: ConversationHistoryProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversationHistory = async () => {
      try {
        setLoading(true)
        const url = userEmail 
          ? `/api/chat/conversation?email=${encodeURIComponent(userEmail)}`
          : '/api/chat/public-messages'
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversation history')
        }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error('Error fetching conversation history:', error)
        setError('Unable to load conversation history')
      } finally {
        setLoading(false)
      }
    }

    fetchConversationHistory()
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

  if (loading) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Loading conversation history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-red-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No conversation history found</p>
          <p className="text-xs mt-2">
            {userEmail ? 'Start a conversation to see messages here' : 'Enter your email to see your conversation history'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <MessageCircle className="text-primary" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {userEmail ? 'Your Conversation History' : 'Public Messages'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {userEmail 
            ? 'Complete conversation between you and admin' 
            : 'Recent public messages and announcements'
          }
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'admin' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  {/* Public Message Badge */}
                  {message.isPublic && (
                    <div className="mb-1">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        Public Message
                      </span>
                    </div>
                  )}
                  
                  <div className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : message.isPublic
                      ? 'bg-blue-50 border border-blue-200 text-blue-900'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs">
                        {message.sender === 'user' ? 'You' : 'Admin'}
                      </span>
                      {message.isPublic && (
                        <span className="text-xs opacity-75">📢</span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 px-1 text-xs text-muted-foreground ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock size={10} />
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.sender === 'user' && (
                      <User size={10} className="ml-1" />
                    )}
                    {message.email && message.sender === 'user' && (
                      <span className="ml-1">({message.email})</span>
                    )}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing {messages.length} message{messages.length !== 1 ? 's' : ''}
        </p>
        {showPublicMessages && (
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <Send size={10} />
            Send New Message
          </button>
        )}
      </div>
    </div>
  )
}
