"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { Home, User, Briefcase, FileText, MessageSquare, Menu, X, Moon, Sun, Lock, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

// Create context for sidebar state
export const SidebarContext = createContext<{
  isCollapsed: boolean
  sidebarWidth: number
}>({
  isCollapsed: false,
  sidebarWidth: 256
})

export const useSidebar = () => useContext(SidebarContext)

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeItem, setActiveItem] = useState('home')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'blog', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveItem(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', icon: Home, href: '#home', id: 'home' },
    { name: 'About', icon: User, href: '#about', id: 'about' },
    { name: 'Projects', icon: Briefcase, href: '#projects', id: 'projects' },
    { name: 'Blog', icon: FileText, href: '#blog', id: 'blog' },
    { name: 'Contact', icon: MessageSquare, href: '#contact', id: 'contact' },
  ]

  // Calculate sidebar width based on collapse state
  const sidebarWidth = isCollapsed ? 80 : 256

  return (
    <SidebarContext.Provider value={{ isCollapsed, sidebarWidth }}>
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-[60] p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors md:hidden"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ width: 256 }}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-background border-r z-50 hidden md:flex flex-col"
      >
        {/* Header with Collapse Toggle */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-lg font-semibold"
                >
                  Navigation
                </motion.h2>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <motion.a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                } ${isCollapsed ? 'justify-center' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            )
          })}
        </nav>

        {/* Settings and Theme Section */}
        <div className="p-4 border-t space-y-2">
          {/* Settings */}
          <motion.a
            href="/admin/login"
            className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground ${isCollapsed ? 'justify-center' : ''}`}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Settings size={20} />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>

          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground ${isCollapsed ? 'justify-center' : ''}`}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-full w-64 bg-background border-r z-50 md:hidden flex flex-col"
            >
              {/* Mobile Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeItem === item.id
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </motion.a>
                  )
                })}
              </nav>

              {/* Mobile Settings and Theme */}
              <div className="p-4 border-t space-y-2">
                {/* Mobile Settings */}
                <motion.a
                  href="/admin/login"
                  className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Settings size={20} />
                  <span className="font-medium">Settings</span>
                </motion.a>

                {/* Mobile Theme Toggle */}
                {mounted && (
                  <motion.button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
    </SidebarContext.Provider>
  )
}
