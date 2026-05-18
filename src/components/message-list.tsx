"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, User, Shield, Clock, Reply, Send, Trash2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface Reply {
  id: string
  message: string
  timestamp: string
  sender: 'admin' | 'user'
}

interface Message {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  replies?: Reply[]
}

export function MessageList() {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [language])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages?lang=${language}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setError('Unable to load messages')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return

    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          reply: replyText,
          sender: 'admin'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add reply')
      }

      const data = await response.json()
      
      // Update the message with the new reply
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? data.message : msg
      ))

      setReplyText('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error adding reply:', error)
      alert(t('messages.replyError'))
    }
  }

  const handleDelete = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message permanently?')) {
      try {
        const response = await fetch(`/api/messages?messageId=${messageId}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete message')
        }

        // Remove the message from the list
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        
        alert('Message deleted permanently')
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('Failed to delete message. Please try again.')
      }
    }
  }

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
          <p className="text-sm">{t('messages.loading')}</p>
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
          <p className="text-sm">{t('messages.noMessages')}</p>
          <p className="text-xs mt-2">{t('messages.noMessagesDesc')}</p>
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
        <h3 className="text-xl font-bold mb-2">{t('messages.title')}</h3>
        <p className="text-muted-foreground text-sm">
          {t('messages.description')}
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-background border border-border rounded-lg p-4"
            >
              {/* Original Message */}
              <div className="flex gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{message.name}</span>
                    <span className="text-xs text-muted-foreground">({message.email})</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock size={10} />
                      <span>{formatTimestamp(message.timestamp)}</span>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{message.message}</p>
                </div>
              </div>

              {/* Replies */}
              {message.replies && message.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {message.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2">
                      <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        {reply.sender === 'admin' ? (
                          <Shield size={12} className="text-primary" />
                        ) : (
                          <User size={12} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs">
                            {reply.sender === 'admin' ? t('messages.admin') : t('messages.you')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{reply.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="ml-11 mt-3">
                {replyingTo === message.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t('messages.typeReply')}
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleReply(message.id)}
                    />
                    <button
                      onClick={() => handleReply(message.id)}
                      className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1 text-sm"
                    >
                      <Send size={14} />
                      {t('messages.sendReply')}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText('')
                      }}
                      className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
                    >
                      {t('messages.cancel')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(message.id)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Reply size={12} />
                    {t('messages.reply')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          {messages.length === 1 ? 'Showing 1 message' : `Showing ${messages.length} messages`}
        </p>
      </div>
    </div>
  )
}
