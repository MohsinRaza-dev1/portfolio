"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, EyeOff, Key, Smartphone, Mail, Globe, AlertTriangle, CheckCircle, Bell } from 'lucide-react'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function PrivacySecurity() {
  const [showPasswords, setShowPasswords] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)
  const [analyticsTracking, setAnalyticsTracking] = useState(true)
  const [cookiesEnabled, setCookiesEnabled] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState<number>(30)
  const [passwordStrength, setPasswordStrength] = useState('strong')
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showManageDevices, setShowManageDevices] = useState(false)
  const [showEmailPrefs, setShowEmailPrefs] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Chrome on Windows', lastActive: '2 hours ago', location: 'New York, USA', current: true },
    { id: 2, name: 'Safari on iPhone', lastActive: '1 day ago', location: 'New York, USA', current: false },
    { id: 3, name: 'Firefox on Mac', lastActive: '3 days ago', location: 'Boston, USA', current: false }
  ])
  const [emailPreferences, setEmailPreferences] = useState({
    security: true,
    marketing: false,
    updates: true,
    newsletter: false
  })

  const privacySettings = [
    {
      id: 'profile-visibility',
      title: 'Profile Visibility',
      description: 'Control who can see your profile information',
      icon: Eye,
      type: 'toggle',
      value: profileVisibility,
      onChange: setProfileVisibility,
      status: 'Enabled'
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      description: 'Share anonymous usage data to improve our services',
      icon: Globe,
      type: 'toggle',
      value: dataSharing,
      onChange: setDataSharing,
      status: 'Disabled'
    },
    {
      id: 'analytics',
      title: 'Analytics Tracking',
      description: 'Allow us to track website usage for improvements',
      icon: Globe,
      type: 'toggle',
      value: analyticsTracking,
      onChange: setAnalyticsTracking,
      status: 'Enabled'
    },
    {
      id: 'cookies',
      title: 'Cookie Preferences',
      description: 'Manage cookie settings for personalized experience',
      icon: Shield,
      type: 'toggle',
      value: cookiesEnabled,
      onChange: setCookiesEnabled,
      status: 'Enabled'
    }
  ]

  const securitySettings = [
    {
      id: 'two-factor',
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: Smartphone,
      type: 'toggle',
      value: twoFactorEnabled,
      onChange: setTwoFactorEnabled
    },
    {
      id: 'password-strength',
      title: 'Password Requirements',
      description: 'Enforce strong password policies',
      icon: Lock,
      type: 'info',
      status: passwordStrength
    },
    {
      id: 'session-timeout',
      title: 'Session Timeout',
      description: 'Automatically log out after inactivity',
      icon: Key,
      type: 'select',
      value: sessionTimeout,
      onChange: (value: number) => setSessionTimeout(value),
      options: [15, 30, 60, 120]
    },
    {
      id: 'login-alerts',
      title: 'Login Alerts',
      description: 'Get notified of new login attempts',
      icon: Bell,
      type: 'toggle',
      value: loginAlerts,
      onChange: setLoginAlerts
    }
  ]

  return (
    <ResponsiveLayout>
      <div className="w-full">
        <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Privacy & Security</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Manage your privacy settings and security preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Privacy Settings
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Control how your data is used and shared
              </p>
            </div>
            <div className="divide-y divide-border">
              {privacySettings.map((setting, index) => (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <setting.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{setting.title}</h3>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => setting.onChange(!setting.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    {setting.type === 'info' && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        {setting.status || 'Enabled'}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                Security Settings
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Protect your account with advanced security features
              </p>
            </div>
            <div className="divide-y divide-border">
              {securitySettings.map((setting, index) => (
                <motion.div
                  key={setting.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                        <setting.icon className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{setting.title}</h3>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    {setting.type === 'toggle' && setting.onChange && (
                      <button
                        onClick={() => setting.onChange && setting.onChange(!setting.value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                    {setting.type === 'info' && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {setting.status}
                      </span>
                    )}
                    {setting.type === 'select' && setting.options && (
                      <select
                        value={setting.value}
                        onChange={(e) => setting.onChange(Number(e.target.value))}
                        className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {setting.options.map((option) => (
                          <option key={option} value={option}>
                            {option} minutes
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Security Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Security Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Key className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-semibold">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
              </button>
              <button 
                onClick={() => setShowManageDevices(!showManageDevices)}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Manage Devices</h3>
                  <p className="text-sm text-muted-foreground">View and manage connected devices</p>
                </div>
              </button>
              <button 
                onClick={() => setShowEmailPrefs(!showEmailPrefs)}
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Mail className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="font-semibold">Email Preferences</h3>
                  <p className="text-sm text-muted-foreground">Control email notifications</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Change Password Modal */}
        {showChangePassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowChangePassword(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    // Handle password change
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setShowChangePassword(false)
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Manage Devices Modal */}
        {showManageDevices && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowManageDevices(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Connected Devices</h3>
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.location} • {device.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.current && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowManageDevices(false)}
                className="w-full mt-6 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Email Preferences Modal */}
        {showEmailPrefs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEmailPrefs(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailPreferences.security}
                    onChange={(e) => setEmailPreferences(prev => ({ ...prev, security: e.target.checked }))}
                    className="rounded"
                  />
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Login attempts and security updates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailPreferences.marketing}
                    onChange={(e) => setEmailPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                    className="rounded"
                  />
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Product updates and promotions</p>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailPreferences.updates}
                    onChange={(e) => setEmailPreferences(prev => ({ ...prev, updates: e.target.checked }))}
                    className="rounded"
                  />
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Feature announcements and updates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={emailPreferences.newsletter}
                    onChange={(e) => setEmailPreferences(prev => ({ ...prev, newsletter: e.target.checked }))}
                    className="rounded"
                  />
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted-foreground">Weekly digest and news</p>
                  </div>
                </label>
              </div>
              <button
                onClick={() => setShowEmailPrefs(false)}
                className="w-full mt-6 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Save Preferences
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Privacy Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">Your Data Protection</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Data Encryption</h3>
                <p className="text-sm text-muted-foreground">All your data is encrypted using industry-standard AES-256 encryption.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">We comply with GDPR and other privacy regulations worldwide.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Minimization</h3>
                <p className="text-sm text-muted-foreground">We only collect data necessary to provide our services.</p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
