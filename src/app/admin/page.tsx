"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, FileText, MessageSquare, Users, TrendingUp, Calendar, Activity, Camera, Upload, CheckCircle, LogOut, Plus, Edit, User, Mail, Image, Cog, Bell, Sun, Moon } from 'lucide-react'
import { profileConfig } from '@/config/profile'
import { useAdmin } from '@/contexts/admin-context'
import { AdminAuthGuard } from '@/components/admin-auth-guard'
import Link from 'next/link'

interface DashboardStats {
  totalProjects: number
  totalBlogPosts: number
  totalMessages: number
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description?: string
    timeAgo: string
    createdAt: string
  }>
}

export default function AdminPage() {
  const { isAdmin, adminUser, logout } = useAdmin()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalBlogPosts: 0,
    totalMessages: 0,
    recentActivity: []
  })
  const [newMessageCount, setNewMessageCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [profileImage, setProfileImage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [recentProjects, setRecentProjects] = useState<any[]>([])

  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Projects', href: '/admin/projects', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Cog },
  ]

  useEffect(() => {
    // Check if user is logged in and fetch stats if they are
    if (isAdmin) {
      fetchDashboardStats()
      setProfileImage(profileConfig.profileImage)
      fetchMessageCount()
    }
  }, [isAdmin])

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchMessageCount = async () => {
    try {
      // Fetch both contact messages and question messages
      const [contactResponse, messagesResponse] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/messages')
      ])
      
      const contactData = await contactResponse.json()
      const messagesData = await messagesResponse.json()
      
      // Count unread messages
      const contactUnreadCount = Array.isArray(contactData) 
        ? contactData.filter((msg: any) => !msg.read).length 
        : 0
      const questionUnreadCount = messagesData.messages && Array.isArray(messagesData.messages)
        ? messagesData.messages.filter((msg: any) => !msg.read).length
        : 0
      const totalUnreadCount = contactUnreadCount + questionUnreadCount
      
      setNewMessageCount(totalUnreadCount)
    } catch (error) {
      console.error('Error fetching message count:', error)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FileText size={16} className="text-blue-500" />
      case 'blog':
        return <Edit size={16} className="text-green-500" />
      case 'message':
        return <Mail size={16} className="text-purple-500" />
      case 'profile':
        return <Image size={16} className="text-orange-500" />
      case 'login':
        return <User size={16} className="text-indigo-500" />
      case 'logout':
        return <LogOut size={16} className="text-red-500" />
      default:
        return <Activity size={16} className="text-gray-500" />
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const [projectsRes, blogRes, contactRes, messagesRes, activitiesRes, recentProjectsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blog'),
        fetch('/api/contact'),
        fetch('/api/messages'),
        fetch('/api/admin/activities?limit=10'),
        fetch('/api/admin/recent-projects?limit=6')
      ])

      const [projects, blogs, contactMessages, messagesData, activitiesData, recentProjectsData] = await Promise.all([
        projectsRes.json(),
        blogRes.json(),
        contactRes.json(),
        messagesRes.json(),
        activitiesRes.json(),
        recentProjectsRes.json()
      ])

      // Combine contact messages and question messages
      const totalContactMessages = Array.isArray(contactMessages) ? contactMessages.length : 0
      const totalQuestionMessages = messagesData.messages && Array.isArray(messagesData.messages) ? messagesData.messages.length : 0
      const totalMessages = totalContactMessages + totalQuestionMessages

      setDashboardStats({
        totalProjects: projects.length,
        totalBlogPosts: blogs.length,
        totalMessages: totalMessages,
        recentActivity: activitiesData.success ? activitiesData.activities : []
      })
      
      setRecentProjects(recentProjectsData.success ? recentProjectsData.projects : [])
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Upload the file
      const uploadResponse = await fetch('/api/admin/upload-profile', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        
        // Update the profile configuration
        const updateResponse = await fetch('/api/admin/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileImage: uploadResult.url }),
        })

        if (updateResponse.ok) {
          setProfileImage(uploadResult.url)
          setUploadSuccess(true)
          
          // Refresh dashboard stats to show new activity
          fetchDashboardStats()
          
          // Reset success message after 3 seconds
          setTimeout(() => setUploadSuccess(false), 3000)
        } else {
          const error = await updateResponse.json()
          alert(error.error || 'Failed to update profile configuration')
        }
      } else {
        const error = await uploadResponse.json()
        alert(error.error || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Failed to upload profile picture')
    } finally {
      setUploading(false)
    }
  }

  // If not admin, redirect to login
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to access the admin panel.</p>
          <Link 
            href="/admin/login"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-background">
      {/* Header with integrated navbar */}
      <div className="flex flex-col border-b">
        {/* Top row - Title and user info */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {adminUser?.username}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
        
        {/* Navigation row */}
        <div className="px-6 pb-4">
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
            </Link>
            
            {/* Site link */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Site
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{dashboardStats.totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blog Posts</p>
                <p className="text-2xl font-bold">{dashboardStats.totalBlogPosts}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <FileText className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{dashboardStats.totalMessages}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <MessageSquare className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Users</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Users className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-lg border p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Camera size={20} />
              Profile Management
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {adminUser?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{adminUser?.username}</p>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Profile Picture</label>
                <div className="space-y-4">
                  {/* Current profile picture preview */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Camera size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Profile Picture</p>
                      <p className="text-xs text-muted-foreground">
                        {profileImage ? 'Click upload to change' : 'No profile picture set'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Upload button */}
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileUpload}
                      className="hidden"
                      id="profile-upload"
                    />
                    <label
                      htmlFor="profile-upload"
                      className="cursor-pointer px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <Upload size={16} />
                      {uploading ? 'Uploading...' : 'Upload Picture'}
                    </label>
                  </div>
                  
                  {uploadSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 dark:text-green-400"
                    >
                      <CheckCircle size={16} className="inline mr-1" />
                      Profile picture updated successfully!
                    </motion.p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card rounded-lg border p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Content Management
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/admin/projects"
                className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">Manage Projects</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or delete projects</p>
                <p className="text-xs text-primary mt-2">{dashboardStats.totalProjects} projects</p>
              </Link>
              <Link
                href="/admin/blog"
                className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">Manage Blog Posts</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or delete blog posts</p>
                <p className="text-xs text-primary mt-2">{dashboardStats.totalBlogPosts} posts</p>
              </Link>
              <Link
                href="/admin/messages"
                className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">View Messages</h3>
                <p className="text-sm text-muted-foreground">Read and manage contact messages</p>
                <p className="text-xs text-primary mt-2">{dashboardStats.totalMessages} messages</p>
              </Link>
              <Link
                href="/admin/analytics"
                className="block p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors group"
              >
                <h3 className="font-medium group-hover:text-primary transition-colors">Analytics</h3>
                <p className="text-sm text-muted-foreground">View detailed analytics and reports</p>
                <p className="text-xs text-primary mt-2">View insights</p>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-lg border p-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {dashboardStats.recentActivity.length > 0 ? (
                dashboardStats.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{activity.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <Activity size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground mt-1">Activities will appear here as you use the admin panel</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText size={24} />
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View All
              <BarChart3 size={16} />
            </Link>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Project Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.techStack.slice(0, 3).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-secondary/50 rounded-full text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-secondary/50 rounded-full text-xs text-muted-foreground">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Category and Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                        {project.category}
                      </span>
                      <div className="flex gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="View on GitHub"
                          >
                            <BarChart3 size={16} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            title="View Live Demo"
                          >
                            <TrendingUp size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card rounded-lg border"
            >
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first project to showcase your work.</p>
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                Add Your First Project
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
    </AdminAuthGuard>
  )
}
