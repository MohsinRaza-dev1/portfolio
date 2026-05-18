"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, ExternalLink, Github, Upload } from 'lucide-react'
import { AdminAuthGuard } from '@/components/admin-auth-guard'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  description: string
  image: string
  techStack: string
  githubUrl?: string
  liveUrl?: string
  category: string
  featured: boolean
  createdAt: string
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    category: '',
    featured: false
  })

  useEffect(() => {
    fetchProjects()
    
    // Check if we should show the form for new project
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('action') === 'new') {
      setShowForm(true)
    }
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const techStackArray = formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech)
      
      if (editingProject) {
        // Update existing project - use simple JSON approach
        const projectData = {
          id: editingProject.id,
          title: formData.title,
          description: formData.description,
          image: formData.image, // Image URL is already set from upload
          techStack: techStackArray,
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl,
          category: formData.category,
          featured: formData.featured
        }

        console.log('Updating project with JSON:', projectData)
        
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        
        console.log('PUT response status:', response.status)
        
        if (response.ok) {
          const result = await response.json()
          console.log('PUT response data:', result)
          alert('Project updated successfully!')
        } else {
          const errorData = await response.json()
          console.error('PUT error:', errorData)
          alert(`Failed to update project: ${errorData.error || 'Unknown error'}`)
          return // Don't proceed if update failed
        }
      } else {
        // Create new project
        const projectData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          techStack: techStackArray,
          githubUrl: formData.githubUrl,
          liveUrl: formData.liveUrl,
          category: formData.category,
          featured: formData.featured
        }

        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          alert(`Failed to create project: ${errorData.error || 'Unknown error'}`)
          return
        }
      }

      await fetchProjects()
      setShowForm(false)
      setEditingProject(null)
      setFormData({
        title: '',
        description: '',
        image: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        category: '',
        featured: false
      })
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project. Please try again.')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      techStack: JSON.parse(project.techStack).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      category: project.category,
      featured: project.featured
    })
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== IMAGE UPLOAD START ===')
    const file = e.target.files?.[0]
    
    if (!file) {
      console.log('No file selected')
      alert('Please select a file first.')
      return
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      alert(`Invalid file type: ${file.type}. Please upload JPEG, PNG, WebP, or GIF images.`)
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size)
      alert(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`)
      return
    }

    console.log('✅ File validation passed')

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    
    try {
      const uploadUrl = '/api/upload' // Use relative URL instead of absolute
      console.log('📤 Starting upload to:', uploadUrl)
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: uploadFormData
      })
      
      console.log('📡 Upload response status:', uploadResponse.status)
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        console.log('✅ Upload successful:', uploadResult)
        
        const imageUrl = uploadResult.fileUrl
        console.log('🖼️ Image URL:', imageUrl)
        
        // Update form state
        setFormData(prev => ({ ...prev, image: imageUrl }))
        console.log('📝 Form updated with image URL')
        
        // Show success message
        alert(`✅ Image uploaded successfully!\nFile: ${file.name}\nURL: ${imageUrl}`)
        
        // Reset the file input
        e.target.value = ''
        console.log('🔄 File input reset')
      } else {
        const errorData = await uploadResponse.json()
        console.error('❌ Upload failed:', errorData)
        alert(`❌ Upload failed: ${errorData.error || 'Unknown error'}\nStatus: ${uploadResponse.status}`)
      }
    } catch (error) {
      console.error('💥 Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`💥 Upload failed: ${errorMessage}\nPlease check your internet connection and try again.`)
    }
    
    console.log('=== IMAGE UPLOAD END ===')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' })
        await fetchProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <AdminAuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects Management</h1>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              Back to Dashboard
            </Link>
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              Add Project
            </motion.button>
          </div>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter image URL or upload file"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      id="image-upload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData(prev => ({ ...prev, techStack: e.target.value }))}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="React, Next.js, TypeScript"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Live URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Project
                </label>
              </div>

              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProject(null)
                    setFormData({
                      title: '',
                      description: '',
                      image: '',
                      techStack: '',
                      githubUrl: '',
                      liveUrl: '',
                      category: '',
                      featured: false
                    })
                  }}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg border p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-secondary rounded">{project.category}</span>
                    {project.featured && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">Featured</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit size={20} />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {JSON.parse(project.techStack).map((tech: string, techIndex: number) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 text-xs bg-secondary text-muted-foreground rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </AdminAuthGuard>
  )
}
