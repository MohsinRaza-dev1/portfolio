"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { 
  Home, 
  User, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Menu, 
  X, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Archive,
  Star,
  Trash2,
  Users,
  HelpCircle,
  Shield,
  Zap,
  Sun,
  Moon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/contexts/language-context'

// Create context for sidebar state
export interface ModernSidebarContextType {
  activeItem: string
  setActiveItem: (item: string) => void
  isCollapsed: boolean
  sidebarWidth: number
  isMobileOpen: boolean
  toggleSidebar: () => void
  toggleMobile: () => void
  setCollapsed: (collapsed: boolean) => void
}

export const ModernSidebarContext = createContext<ModernSidebarContextType>({
  activeItem: '',
  setActiveItem: () => {},
  isCollapsed: false,
  sidebarWidth: 280,
  isMobileOpen: false,
  toggleSidebar: () => {},
  toggleMobile: () => {},
  setCollapsed: () => {}
})

export const useModernSidebar = () => useContext(ModernSidebarContext)

export function ModernSidebar() {
  const { t } = useLanguage()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeItem, setActiveItem] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()

  // Load saved state from localStorage
  useEffect(() => {
    setMounted(true)
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Save state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed, mounted])

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen])

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)
  const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed)

  const sidebarWidth = isCollapsed ? 72 : 280

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveItem(sectionId.replace('#', ''))
    }
  }

  // Handle navigation click
  const handleNavigationClick = (item: any) => {
    if (item.action === 'scroll') {
      scrollToSection(item.href)
    } else if (item.action === 'navigate') {
      // Check if the link is external (starts with http)
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank')
      } else {
        window.location.href = item.href
      }
    }
    setActiveItem(item.id)
  }

  // Navigation items
  const navigationItems = [
    { id: 'home', name: 'Home', icon: Home, href: '#home', action: 'scroll' },
    { id: 'about', name: 'About', icon: User, href: '#about', action: 'scroll' },
    { id: 'projects', name: 'Projects', icon: Briefcase, href: '#projects', action: 'scroll' },
    { id: 'blog', name: 'Blog', icon: FileText, href: '#blog', action: 'scroll' },
    { id: 'contact', name: 'Contact', icon: MessageSquare, href: '#get-in-touch', action: 'scroll' },
  ]

  const secondaryItems = [
    { id: 'archive', name: 'Archive', icon: Archive, href: '#archive', action: 'scroll' },
    { id: 'starred', name: 'Starred', icon: Star, href: '#starred', action: 'scroll' },
    { id: 'trash', name: 'Trash', icon: Trash2, href: '#trash', action: 'scroll' },
  ]

  const bottomItems = [
    { id: 'notifications', name: 'Notifications', icon: Bell, href: '#notifications', action: 'scroll' },
    { id: 'help', name: 'Help', icon: HelpCircle, href: '#help', action: 'scroll' },
  ]

  // Filter items based on search query
  const filteredNavigationItems = navigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredSecondaryItems = secondaryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredBottomItems = bottomItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ModernSidebarContext.Provider value={{ 
      activeItem, 
      setActiveItem, 
      isCollapsed, 
      sidebarWidth, 
      isMobileOpen, 
      toggleSidebar, 
      toggleMobile, 
      setCollapsed 
    }}>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={toggleMobile}
        className="fixed left-4 top-4 z-50 p-3 bg-background/80 backdrop-blur-sm border border-border rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 md:hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-72 bg-background/95 backdrop-blur-md border-r border-border z-50 flex flex-col md:hidden"
          >
            <MobileSidebarContent 
              navigationItems={navigationItems}
              secondaryItems={secondaryItems}
              bottomItems={bottomItems}
              filteredNavigationItems={filteredNavigationItems}
              filteredSecondaryItems={filteredSecondaryItems}
              filteredBottomItems={filteredBottomItems}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              onClose={toggleMobile}
              onNavigationClick={handleNavigationClick}
              mounted={mounted}
              searchQuery={searchQuery}
              onSearch={handleSearch}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="hidden md:flex md:flex-col bg-background/95 backdrop-blur-md border-r border-border h-screen fixed left-0 top-0 z-30 sidebar-container"
      >
        <DesktopSidebarContent 
          navigationItems={navigationItems}
          secondaryItems={secondaryItems}
          bottomItems={bottomItems}
          filteredNavigationItems={filteredNavigationItems}
          filteredSecondaryItems={filteredSecondaryItems}
          filteredBottomItems={filteredBottomItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          onNavigationClick={handleNavigationClick}
          mounted={mounted}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
      </motion.div>
    </ModernSidebarContext.Provider>
  )
}

// Desktop Sidebar Content
function DesktopSidebarContent({ 
  navigationItems, 
  secondaryItems, 
  bottomItems,
  filteredNavigationItems,
  filteredSecondaryItems,
  filteredBottomItems,
  activeItem, 
  setActiveItem, 
  isCollapsed, 
  toggleSidebar,
  onNavigationClick,
  mounted,
  searchQuery,
  onSearch
}: any) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      
      {/* Top Collapse Button */}
      <div className="flex justify-center p-3 border-b border-border bg-muted/30">
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all duration-200 sidebar-item"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 sidebar-animation"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Portfolio</h1>
                <p className="text-xs text-muted-foreground">Mohsin Raza</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </motion.button>
      </div>

      {/* Search Bar */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Main
            </h3>
          )}
          {filteredNavigationItems.map((item: any) => (
            <SidebarItem
              key={item.name}
              item={item}
              isActive={activeItem === item.id}
              onClick={onNavigationClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Secondary
            </h3>
          )}
          {filteredSecondaryItems.map((item: any) => (
            <SidebarItem
              key={item.name}
              item={item}
              isActive={activeItem === item.id}
              onClick={onNavigationClick}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border space-y-1">
        {filteredBottomItems.map((item: any) => (
          <SidebarItem
            key={item.name}
            item={item}
            isActive={activeItem === item.id}
            onClick={onNavigationClick}
            isCollapsed={isCollapsed}
          />
        ))}
        
        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        
        {/* User Profile */}
        <motion.div
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1"
              >
                <p className="text-sm font-medium">Mohsin Raza</p>
                <p className="text-xs text-muted-foreground">Developer</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}

// Mobile Sidebar Content
function MobileSidebarContent({ 
  navigationItems, 
  secondaryItems, 
  bottomItems,
  filteredNavigationItems,
  filteredSecondaryItems,
  filteredBottomItems,
  activeItem, 
  setActiveItem, 
  onClose,
  onNavigationClick,
  mounted,
  searchQuery,
  onSearch
}: any) {
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Portfolio</h1>
            <p className="text-xs text-muted-foreground">Mohsin Raza</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main
          </h3>
          {filteredNavigationItems.map((item: any) => (
            <SidebarItem
              key={item.name}
              item={item}
              isActive={activeItem === item.id}
              onClick={(navItem: any) => {
                onNavigationClick(navItem)
                onClose()
              }}
              isCollapsed={false}
            />
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Secondary
          </h3>
          {filteredSecondaryItems.map((item: any) => (
            <SidebarItem
              key={item.name}
              item={item}
              isActive={activeItem === item.id}
              onClick={(navItem: any) => {
                onNavigationClick(navItem)
                onClose()
              }}
              isCollapsed={false}
            />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border space-y-1">
          {filteredBottomItems.map((item: any) => (
            <SidebarItem
              key={item.name}
              item={item}
              isActive={activeItem === item.id}
              onClick={(navItem: any) => {
                onNavigationClick(navItem)
                onClose()
              }}
              isCollapsed={false}
            />
          ))}
          
          {/* Theme Toggle */}
          {mounted && (
            <motion.button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </motion.button>
          )}

          
          {/* User Profile */}
          <motion.div
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Mohsin Raza</p>
              <p className="text-xs text-muted-foreground">Developer</p>
            </div>
          </motion.div>
        </div>
      </nav>
    </>
  )
}

// Sidebar Item Component
function SidebarItem({ item, isActive, onClick, isCollapsed }: any) {
  const Icon = item.icon
  
  return (
    <motion.button
      onClick={() => onClick(item)}
      className={`group relative flex items-center gap-3 p-3 rounded-lg w-full text-left sidebar-item ${
        isActive 
          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      } ${isCollapsed ? 'justify-center' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon size={18} className={isActive ? 'text-blue-500' : ''} />
      
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-sm font-medium"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute left-full ml-2 px-2 py-1 bg-background border border-border rounded-md text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50"
        >
          {item.name}
        </motion.div>
      )}
    </motion.button>
  )
}
