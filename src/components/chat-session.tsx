"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, User, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface ChatMessage {
  id: string
  sender: 'user' | 'admin'
  message: string
  timestamp: string
}

interface ChatSessionProps {
  sessionId?: string
  isOpen?: boolean
  onToggle?: () => void
  embedded?: boolean
}

export function ChatSession({ sessionId: propSessionId, isOpen = false, onToggle, embedded = false }: ChatSessionProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(propSessionId || '')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate session ID if not provided
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      setSessionId(newSessionId)
    }
  }, [sessionId])

  // Load messages when session ID changes
  useEffect(() => {
    if (sessionId) {
      loadMessages()
    }
  }, [sessionId])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/chat?sessionId=${sessionId}`)
      const data = await response.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !sessionId) return

    const messageToSend = newMessage.trim()
    setNewMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          sender: 'user',
          message: messageToSend
        })
      })

      const data = await response.json()
      if (data.success) {
        setMessages(data.allMessages)
        
        // Simulate admin response after a delay
        setTimeout(() => {
          simulateAdminResponse(messageToSend)
        }, 1000 + Math.random() * 2000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const simulateAdminResponse = (userMessage: string) => {
    const responses = [
      "Thank you for your inquiry. I'll review your message and respond within 24 hours.",
      "I appreciate you reaching out. I'll get back to you with a detailed response soon.",
      "Your message has been received. I'll address your questions as soon as possible.",
      "Thank you for contacting me. I'll review your request and respond promptly.",
      "I've received your message and will respond during business hours."
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        sender: 'admin',
        message: randomResponse
      })
    }).then(response => response.json())
      .then(data => {
        if (data.success) {
          setMessages(data.allMessages)
        }
      })
      .catch(error => console.error('Error sending admin response:', error))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const clearChat = async () => {
    if (!sessionId) return
    
    try {
      await fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' })
      setMessages([])
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="bg-background border border-border rounded-lg shadow-xl h-full flex flex-col"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <MessageCircle className="text-primary" size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Professional Support</h3>
            <p className="text-xs text-muted-foreground">Business hours: 9AM-6PM EST</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: 'calc(100% - 140px)' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-primary opacity-50" />
              </div>
              <p className="text-sm">How can I help you today?</p>
              <p className="text-xs mt-2">Please type your message below</p>
            </div>
            ) : (
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
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield size={16} className="text-primary" />
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-border bg-secondary/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isTyping}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                {isTyping ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={14} />
                    Send
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Responses within 24 business hours
            </p>
          </form>
    </motion.div>
  )
}
