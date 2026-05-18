"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, User, Shield, Mail, Clock } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'admin'
  message: string
  timestamp: string
  email?: string
}

interface ChatHistoryProps {
  userEmail?: string
}

export function ChatHistory({ userEmail }: ChatHistoryProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userEmail) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await fetch(`/api/chat/history?email=${encodeURIComponent(userEmail)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat history')
        }

        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error('Error fetching chat history:', error)
        setError('Unable to load chat history')
      } finally {
        setLoading(false)
      }
    }

    fetchChatHistory()
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
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Enter your email in the contact form to view your chat history</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6">
        <div className="text-center text-muted-foreground">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm">Loading chat history...</p>
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
          <p className="text-sm">No chat history found for {userEmail}</p>
          <p className="text-xs mt-2">Start a conversation to see your messages here</p>
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
        <h3 className="text-xl font-bold mb-2">Chat History</h3>
        <p className="text-muted-foreground text-sm">
          Conversation history for {userEmail}
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
                
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-1 text-xs text-muted-foreground ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock size={10} />
                    <span>{formatTimestamp(message.timestamp)}</span>
                    {message.sender === 'user' && (
                      <User size={10} className="ml-1" />
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

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Showing {messages.length} message{messages.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
