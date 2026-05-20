"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Calendar, Trash2, Reply, ArrowLeft } from 'lucide-react'
import { AdminAuthGuard } from '@/components/admin-auth-guard'
import Link from 'next/link'

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  reply?: string
  repliedAt?: string
  createdAt: string
  updatedAt: string
  source: 'contact' | 'question'
  read?: boolean
  replies?: {
    id: string
    message: string
    timestamp: string
    sender: 'admin' | 'user'
  }[]
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      // Fetch both contact messages and question messages
      const [contactResponse, messagesResponse] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/messages')
      ])
      
      const contactData = await contactResponse.json()
      const messagesData = await messagesResponse.json()
      
      // Combine both types of messages
      const combinedMessages: ContactMessage[] = []
      
      // Add contact messages (database)
      if (Array.isArray(contactData)) {
        contactData.forEach((msg: any) => {
          combinedMessages.push({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            message: msg.message,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            reply: msg.reply,
            repliedAt: msg.repliedAt,
            source: 'contact',
            read: msg.read || false
          })
        })
      }

      // Add JSON chat/question messages
      if (messagesData?.messages && Array.isArray(messagesData.messages)) {
        messagesData.messages.forEach((msg: any) => {
          combinedMessages.push({
            id: msg.id,
            name: msg.name,
            email: msg.email,
            message: msg.message,
            createdAt: msg.timestamp,
            updatedAt: msg.timestamp,
            source: 'question',
            replies: Array.isArray(msg.replies)
              ? msg.replies.map((reply: any) => ({
                  id: reply.id,
                  message: reply.message,
                  timestamp: reply.timestamp,
                  sender: reply.sender
                }))
              : []
          })
        })
      }
      
      combinedMessages.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt).getTime()
        return dateB - dateA
      })
      
      console.log('📨 Fetched messages:', combinedMessages)
      console.log('📊 Contact messages count:', Array.isArray(contactData) ? contactData.length : 0)
      console.log('📊 Question messages count:', messagesData?.messages?.length || 0)
      
      setMessages(combinedMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Find the message to get details
    const message = messages.find(msg => msg.id === id)
    const messageName = message?.name || 'Unknown'
    
    if (confirm(`Are you sure you want to permanently delete this message from ${messageName}?`)) {
      try {
        if (message?.source === 'contact') {
          // Delete from database
          await fetch(`/api/contact/${id}`, { method: 'DELETE' })
        } else if (message?.source === 'question') {
          // Delete from JSON file
          await fetch(`/api/messages?messageId=${id}`, { method: 'DELETE' })
        }
        
        await fetchMessages()
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
        
        // Dispatch custom event to update navbar count
        console.log('🗑️ Message deleted, updating navbar count...')
        window.dispatchEvent(new CustomEvent('messageRead'))
        
        alert('Message deleted permanently from both admin and user sides')
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('Failed to delete message. Please try again.')
      }
    }
  }

  const handleDeleteAllMessages = async () => {
    if (confirm('Are you sure you want to delete ALL messages permanently? This action cannot be undone.')) {
      try {
        console.log('🗑️ Deleting all messages...')
        
        // Delete all contact messages from database
        const contactMessages = messages.filter(msg => msg.source === 'contact')
        console.log('Contact messages to delete:', contactMessages)
        for (const message of contactMessages) {
          console.log('Deleting contact message:', message.id)
          await fetch(`/api/contact/${message.id}`, { method: 'DELETE' })
        }
        
        // Delete all question messages from JSON file
        const questionMessages = messages.filter(msg => msg.source === 'question')
        console.log('Question messages to delete:', questionMessages)
        for (const message of questionMessages) {
          console.log('Deleting question message:', message.id)
          await fetch(`/api/messages?messageId=${message.id}`, { method: 'DELETE' })
        }
        
        await fetchMessages()
        setSelectedMessage(null)
        
        // Dispatch custom event to update navbar count
        console.log('🗑️ All messages deleted, updating navbar count...')
        window.dispatchEvent(new CustomEvent('messageRead'))
        
        alert('All messages deleted permanently from both admin and user sides')
      } catch (error) {
        console.error('Error deleting all messages:', error)
        alert('Failed to delete all messages. Please try again.')
      }
    }
  }

  const handleClearContactMessages = async () => {
    if (confirm('Are you sure you want to delete ALL CONTACT messages permanently? This action cannot be undone.')) {
      try {
        console.log('🗑️ Deleting all contact messages...')
        
        // Delete only contact messages from database
        const contactMessages = messages.filter(msg => msg.source === 'contact')
        console.log('Contact messages to delete:', contactMessages)
        for (const message of contactMessages) {
          console.log('Deleting contact message:', message.id)
          await fetch(`/api/contact/${message.id}`, { method: 'DELETE' })
        }
        
        // Reset to zero messages after clearing
        setMessages([])
        setSelectedMessage(null)
        
        // Dispatch custom event to update navbar count to zero
        console.log('🗑️ All contact messages deleted, resetting count to zero...')
        window.dispatchEvent(new CustomEvent('messageRead'))
        
        alert('All contact messages deleted permanently. Count reset to zero.')
      } catch (error) {
        console.error('Error deleting contact messages:', error)
        alert('Failed to delete contact messages. Please try again.')
      }
    }
  }

  const handleReply = (message: ContactMessage) => {
    // Mark message as read when admin views it
    markAsRead(message.id)
    
    // Also mark as seen to reduce alert count
    console.log('👁️ Marking message as seen:', message.id)
    window.dispatchEvent(new CustomEvent('messageSeen', { 
      detail: { messageId: message.id } 
    }))
    
    setSelectedMessage(message)
    setShowReplyForm(true)
    setReplyText('')
  }

  const markAsRead = async (messageId: string) => {
    try {
      console.log('📖 Marking message as read:', messageId)
      
      // Update local state
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
        console.log('📝 Updated messages state:', updated)
        return updated
      })
      
      // Update in backend based on message source
      const message = messages.find(msg => msg.id === messageId)
      if (message?.source === 'contact') {
        // Update contact message in database
        await fetch(`/api/contact/${messageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true })
        })
      } else if (message?.source === 'question') {
        // Update question message in JSON file
        await fetch('/api/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId, read: true })
        })
      }
      
      // Dispatch custom event to update navbar count
      console.log('📨 Dispatching messageRead event...')
      window.dispatchEvent(new CustomEvent('messageRead'))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const sendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    setIsReplying(true)
    try {
      let response
      
      // Handle different message types
      if (selectedMessage.source === 'contact') {
        // Reply to contact message (database)
        response = await fetch('/api/admin/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messageId: selectedMessage.id,
            reply: replyText.trim()
          })
        })
      } else if (selectedMessage.source === 'question') {
        // Reply to question message (JSON file)
        response = await fetch('/api/messages', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messageId: selectedMessage.id,
            reply: replyText.trim(),
            sender: 'admin'
          })
        })
      }

      if (response && response.ok) {
        const result = await response.json()
        
        // Update the message in the local state
        setMessages(prev => prev.map(msg => 
          msg.id === selectedMessage.id 
            ? { 
                ...msg, 
                reply: replyText.trim(), 
                repliedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : msg
        ))

        // Update selected message
        setSelectedMessage(prev => prev ? {
          ...prev,
          reply: replyText.trim(),
          repliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : null)

        // Reset form
        setReplyText('')
        setShowReplyForm(false)
        
        alert('Reply sent successfully!')
      } else {
        throw new Error('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setIsReplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading messages...</div>
      </div>
    )
  }

  return (
    <AdminAuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Contact Messages</h1>
              <p className="text-muted-foreground">Manage messages from visitors</p>
              {messages.length > 0 && (
                <div className="flex gap-2">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleClearContactMessages}
                    className="px-4 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear Contact Messages
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleDeleteAllMessages}
                    className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete All Messages
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-4">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-card rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
                    selectedMessage?.id === message.id ? 'border-primary shadow-md' : ''
                  } ${!message.read ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message)
                    markAsRead(message.id)
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold">{message.name}</h3>
                        {!message.read && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                            New
                          </span>
                        )}
                        {message.reply && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                            Replied
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(message.createdAt).toLocaleDateString()}
                        </div>
                        {message.repliedAt && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Reply size={14} />
                            Replied {new Date(message.repliedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReply(message)
                        }}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Reply size={16} />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(message.id)
                        }}
                        className="p-2 text-muted-foreground hover:text-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      {message.source === 'contact' ? 'Contact' : 'Chat'}
                    </span>
                    {message.replies && message.replies.length > 0 && (
                      <span className="text-xs text-green-600 dark:text-green-300">
                        {message.replies.length} repl{message.replies.length === 1 ? 'y' : 'ies'}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">
                    {message.message}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-1">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-lg border p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold mb-4">Message Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail size={16} />
                      {selectedMessage.email}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(selectedMessage.createdAt).toLocaleDateString()} at {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Message</label>
                    <div className="mt-2 p-4 bg-secondary/30 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {(selectedMessage.replies && selectedMessage.replies.length > 0) || selectedMessage.reply ? (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Conversation</label>
                      <div className="mt-3 space-y-3">
                        {selectedMessage.replies?.map((reply) => (
                          <div
                            key={reply.id}
                            className={`p-4 rounded-lg border ${reply.sender === 'admin' ? 'bg-green-50 border-green-200' : 'bg-secondary/20 border-border'}`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                                {reply.sender === 'admin' ? 'Admin' : 'Client'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        ))}

                        {selectedMessage.reply && (
                          <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Admin Reply</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(selectedMessage.repliedAt || selectedMessage.updatedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.reply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Reply Form */}
                  {showReplyForm && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reply to {selectedMessage.name}</label>
                      <div className="mt-2 space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <motion.button
                            onClick={sendReply}
                            disabled={!replyText.trim() || isReplying}
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: replyText.trim() && !isReplying ? 1.02 : 1 }}
                            whileTap={{ scale: replyText.trim() && !isReplying ? 0.98 : 1 }}
                          >
                            {isReplying ? (
                              <>
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Reply size={16} />
                                Send Reply
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              setShowReplyForm(false)
                              setReplyText('')
                            }}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4">
                    {!selectedMessage.reply && !showReplyForm && (
                      <motion.button
                        onClick={() => handleReply(selectedMessage)}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Reply size={16} />
                        Reply
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-card rounded-lg border p-6 text-center">
                <MessageSquare className="mx-auto text-muted-foreground mb-4" size={48} />
                <p className="text-muted-foreground">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </AdminAuthGuard>
  )
}
