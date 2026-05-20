"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit, Check, X } from 'lucide-react'
import { AdminAuthGuard } from '@/components/admin-auth-guard'

interface Skill {
  id: string
  name: string
  level: number
  color: string
  iconName: string
}

const iconOptions = [
  'ReactIcon',
  'TypeScriptIcon',
  'TailwindIcon',
  'PrismaIcon',
  'NodeIcon',
  'GitIcon',
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    level: '75',
    color: '#3178C6',
    iconName: 'ReactIcon',
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/skills')
      const data = await response.json()
      setSkills(data.skills || [])
      setError(null)
    } catch (error) {
      console.error('Error loading skills:', error)
      setError('Unable to load skills')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
      level: '75',
      color: '#3178C6',
      iconName: 'ReactIcon',
    })
    setIsEditing(false)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (skill: Skill) => {
    setFormState({
      id: skill.id,
      name: skill.name,
      level: skill.level.toString(),
      color: skill.color,
      iconName: skill.iconName || 'ReactIcon',
    })
    setIsEditing(true)
  }

  const handleDelete = async (skillId: string) => {
    if (!confirm('Delete this skill permanently?')) return

    try {
      await fetch(`/api/admin/skills?id=${encodeURIComponent(skillId)}`, {
        method: 'DELETE',
      })
      await fetchSkills()
    } catch (error) {
      console.error('Error deleting skill:', error)
      alert('Failed to delete skill')
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formState.name.trim() || !formState.level.trim() || !formState.color.trim()) {
      alert('Please fill in all required fields.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...formState,
        level: Number(formState.level),
      }

      const response = await fetch('/api/admin/skills', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save skill')
      }

      resetForm()
      await fetchSkills()
    } catch (error) {
      console.error('Error saving skill:', error)
      alert('Unable to save skill. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminAuthGuard>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Skills Management</h1>
            <p className="text-muted-foreground mt-2">Add, edit, or remove technical skills shown on the portfolio.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <Plus size={16} />
              New Skill
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8">
          <div className="space-y-4">
            {loading ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                Loading skills...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                {error}
              </div>
            ) : skills.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                No skills available yet.
              </div>
            ) : (
              <div className="space-y-4">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-lg font-semibold">{skill.name}</p>
                      <p className="text-sm text-muted-foreground">Level: {skill.level}%</p>
                      <p className="text-sm text-muted-foreground">Icon: {skill.iconName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-10 w-10 rounded-full" style={{ backgroundColor: skill.color }} />
                      <button
                        onClick={() => handleEdit(skill)}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Skill' : 'Add Skill'}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Skill Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder="React / Next.js"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Skill Level (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formState.level}
                  onChange={(e) => handleFormChange('level', e.target.value)}
                  placeholder="90"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Skill Color</label>
                <input
                  type="color"
                  value={formState.color}
                  onChange={(e) => handleFormChange('color', e.target.value)}
                  className="mt-2 h-10 w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Icon Name</label>
                <select
                  value={formState.iconName}
                  onChange={(e) => handleFormChange('iconName', e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? <Spinner /> : isEditing ? 'Update Skill' : 'Add Skill'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  )
}

function Spinner() {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
  )
}
