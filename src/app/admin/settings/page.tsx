"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Facebook, Linkedin, Twitter, Github, Mail, Phone, MessageCircle, Globe } from 'lucide-react'
import { AdminAuthGuard } from '@/components/admin-auth-guard'

interface SocialMediaSettings {
  github: string
  linkedin: string
  twitter: string
  facebook: string
  tiktok: string
  email: string
  phone: string
  whatsapp: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SocialMediaSettings>({
    github: 'mohsindev',
    linkedin: 'mohsinraza-dev',
    twitter: 'mohsindev',
    facebook: 'mohsindev',
    tiktok: 'moshinkhan2055',
    email: 'hmohsinkhan5@gmail.com',
    phone: '+923037327992',
    whatsapp: '+923037327992'
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Failed to save settings')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SocialMediaSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const socialMediaFields = [
    { key: 'github', label: 'GitHub Username', icon: Github, placeholder: 'username' },
    { key: 'linkedin', label: 'LinkedIn Username/ID', icon: Linkedin, placeholder: 'username-or-id' },
    { key: 'twitter', label: 'Twitter Username', icon: Twitter, placeholder: 'username' },
    { key: 'facebook', label: 'Facebook Username', icon: Facebook, placeholder: 'username' },
    { key: 'tiktok', label: 'TikTok Username', icon: MessageCircle, placeholder: 'username' },
    { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'email@example.com' },
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+1234567890' },
    { key: 'whatsapp', label: 'WhatsApp Number', icon: MessageCircle, placeholder: '+1234567890' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <a href="/admin" className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                <motion.div whileHover={{ x: -2 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                </motion.div>
              </a>
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your social media accounts and contact information</p>
              </div>
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Settings Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Social Media Accounts
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {socialMediaFields.map((field) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: socialMediaFields.indexOf(field) * 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <field.icon className="w-4 h-4 text-primary" />
                      {field.label}
                    </label>
                    <input
                      type={field.key === 'email' ? 'email' : 'text'}
                      value={settings[field.key as keyof SocialMediaSettings]}
                      onChange={(e) => handleInputChange(field.key as keyof SocialMediaSettings, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}
