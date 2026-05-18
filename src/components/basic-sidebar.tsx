"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { Home, User, Briefcase, FileText, MessageSquare, Menu, X, ChevronLeft, ChevronRight, Settings, Moon, Sun, Github, Linkedin, Mail, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

// Create context for sidebar state
export const SidebarContext = createContext<{
  isCollapsed: boolean
  sidebarWidth: number
}>({
  isCollapsed: false,
  sidebarWidth: 240
})

export const useSidebar = () => useContext(SidebarContext)

export function BasicSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'About', icon: User, href: '#about' },
    { name: 'Projects', icon: Briefcase, href: '#projects' },
    { name: 'Blog', icon: FileText, href: '#blog' },
    { name: 'Contact', icon: MessageSquare, href: '#contact' },
  ]

  const moreOptions = [
    { name: 'Settings', icon: Settings, href: '/admin/login', action: 'navigate' },
    { name: 'GitHub', icon: Github, href: 'https://github.com', action: 'external' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', action: 'external' },
    { name: 'Email', icon: Mail, href: 'mailto:contact@example.com', action: 'external' },
    { name: 'Phone', icon: Phone, href: 'tel:+1234567890', action: 'external' },
  ]

  // Calculate sidebar width based on collapse state
  const sidebarWidth = isCollapsed ? 80 : 240

  return (
    <SidebarContext.Provider value={{ isCollapsed, sidebarWidth }}>
      <>
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed left-4 top-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors md:hidden"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Sidebar - Always Visible */}
        <motion.div
          initial={{ width: 240 }}
          animate={{ width: isCollapsed ? 80 : 240 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden md:flex md:flex-col md:bg-background md:border-r md:h-screen md:fixed md:left-0 md:top-0"
        >
          {/* Desktop Header */}
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

          {/* Desktop Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground ${isCollapsed ? 'justify-center' : ''}`}
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

          {/* Desktop Bottom Section */}
          <div className="p-4 border-t space-y-2">
            {/* More Options Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground ${isCollapsed ? 'justify-center' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Menu size={20} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      More Options
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* More Options Dropdown */}
              <AnimatePresence>
                {showMoreOptions && !isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full left-0 mb-2 w-full bg-background border rounded-lg shadow-lg z-50"
                  >
                    {moreOptions.map((option, index) => {
                      const Icon = option.icon
                      return (
                        <motion.a
                          key={option.name}
                          href={option.href}
                          target={option.action === 'external' ? '_blank' : '_self'}
                          rel={option.action === 'external' ? 'noopener noreferrer' : ''}
                          className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          onClick={() => setShowMoreOptions(false)}
                        >
                          <Icon size={16} />
                          <span className="text-sm font-medium">{option.name}</span>
                        </motion.a>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground ${isCollapsed ? 'justify-center' : ''}`}
                whileHover={{ scale: 1.02 }}
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
                      {theme === 'dark' ? 'Light' : 'Dark'}
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
                className="fixed left-0 top-0 h-full w-64 bg-background border-r z-40 flex flex-col"
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
                    return (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.name}</span>
                      </motion.a>
                    )
                  })}
                </nav>

                {/* Mobile Bottom Section */}
                <div className="p-4 border-t space-y-2">
                  {/* Mobile More Options */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Menu size={20} />
                      <span className="font-medium">More Options</span>
                    </motion.button>

                    {/* Mobile More Options Dropdown */}
                    <AnimatePresence>
                      {showMoreOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 mb-2 w-full bg-background border rounded-lg shadow-lg z-50"
                        >
                          {moreOptions.map((option, index) => {
                            const Icon = option.icon
                            return (
                              <motion.a
                                key={option.name}
                                href={option.href}
                                target={option.action === 'external' ? '_blank' : '_self'}
                                rel={option.action === 'external' ? 'noopener noreferrer' : ''}
                                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => {
                                  setShowMoreOptions(false)
                                  setIsMobileOpen(false)
                                }}
                              >
                                <Icon size={16} />
                                <span className="text-sm font-medium">{option.name}</span>
                              </motion.a>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile Theme Toggle */}
                  {mounted && (
                    <motion.button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-muted text-foreground"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                      <span className="font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Mobile Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-30"
                onClick={() => setIsMobileOpen(false)}
              />
            </>
          )}
        </AnimatePresence>
      </>
    </SidebarContext.Provider>
  )
}
