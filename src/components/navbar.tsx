"use client"

import { useState, useEffect } from 'react'
import { Lock, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Name - Left Side */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold gradient-text">Mohsin Raza</h1>
          </div>
          
          {/* Right Side Controls - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            
            {/* Admin Login Button */}
            <motion.a
              href="/admin/login"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock size={16} />
              Admin
            </motion.a>
          </div>

          {/* Right Side Controls - Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Switcher - Mobile */}
            <LanguageSwitcher />
            
            {/* Theme Toggle - Mobile */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            
            {/* Admin Login Button - Mobile */}
            <motion.a
              href="/admin/login"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock size={12} />
              Admin
            </motion.a>
          </div>
        </div>
      </div>
    </nav>
  )
}
