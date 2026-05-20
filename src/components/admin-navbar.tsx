"use client"

import { useState, useEffect } from 'react'
import { Menu, X, Moon, Sun, Home, FileText, MessageSquare, BarChart3, LogOut, Bell, Cog, Settings, BookOpen } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useNotifications } from '@/contexts/notification-context'

export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [seenMessages, setSeenMessages] = useState<Set<string>>(new Set())
  const { notifications, unreadCount } = useNotifications()
  const { theme, setTheme } = useTheme()

  const fetchMessageCount = async (currentSeenMessages: Set<string> = seenMessages) => {
    try {
      const [contactResponse, messagesResponse] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/messages')
      ])
      
      const contactData = await contactResponse.json()
      const messagesData = await messagesResponse.json()
      
      const contactUnreadCount = Array.isArray(contactData)
        ? contactData.filter((msg: any) => !msg.read && !currentSeenMessages.has(msg.id)).length
        : 0
      const questionUnreadCount = messagesData.messages && Array.isArray(messagesData.messages)
        ? messagesData.messages.filter((msg: any) => !msg.read && !currentSeenMessages.has(msg.id)).length
        : 0
      const totalUnreadCount = contactUnreadCount + questionUnreadCount
      setNewMessageCount(totalUnreadCount)
    } catch (error) {
      console.error('Error fetching message count:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('admin-token')
      const user = localStorage.getItem('admin-user')
      setIsAuthenticated(!!token && !!user)
    }
    
    checkAuth()
    fetchMessageCount()
    
    // Listen for storage changes (login/logout)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    // Listen for custom event when messages are read
    const handleMessageRead = () => {
      console.log('📨 Message read event received, updating count...')
      fetchMessageCount()
    }
    
    // Listen for message seen events
    const handleMessageSeen = (event: CustomEvent) => {
      const messageId = event.detail.messageId
      console.log('👁️ Message seen:', messageId)
      setSeenMessages(prev => {
        const next = new Set(prev)
        next.add(messageId)
        fetchMessageCount(next)
        return next
      })
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('messageRead', handleMessageRead)
    window.addEventListener('messageSeen', handleMessageSeen as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('messageRead', handleMessageRead)
      window.removeEventListener('messageSeen', handleMessageSeen as EventListener)
    }
  }, [])

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Projects', href: '/admin/projects', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Skills', href: '/admin/skills', icon: BookOpen },
    { name: 'Settings', href: '/admin/settings', icon: Cog },
  ]

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-md z-50 border-b">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <BarChart3 className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
              
              {/* Messages */}
              <Link
                href="/admin/messages"
                className="p-2 rounded-md text-foreground hover:text-primary transition-colors relative flex items-center"
              >
                <MessageSquare size={20} />
                {newMessageCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {newMessageCount > 99 ? '99+' : newMessageCount}
                  </span>
                )}
              </Link>
              
              {/* Notifications */}
              <Link
                href="/admin/notifications"
                className="p-2 rounded-md text-foreground hover:text-primary transition-colors relative flex items-center"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-md text-foreground hover:text-primary transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Home size={16} />
                Site
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-foreground hover:text-primary transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
              
              {/* Messages */}
              <Link
                href="/admin/messages"
                className="flex items-center gap-2 text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium border-t pt-4 mt-4 relative"
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare size={18} />
                Messages
                {newMessageCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {newMessageCount > 99 ? '99+' : newMessageCount}
                  </span>
                )}
              </Link>
              
              {/* Notifications */}
              <Link
                href="/admin/notifications"
                className="flex items-center gap-2 text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium relative"
                onClick={() => setIsOpen(false)}
              >
                <Bell size={18} />
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              
              <Link
                href="/"
                className="flex items-center gap-2 text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium border-t pt-4 mt-4"
                onClick={() => setIsOpen(false)}
              >
                <Home size={18} />
                Back to Site
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
