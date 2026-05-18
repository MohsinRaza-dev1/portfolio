import { writeFile, readFile } from 'fs/promises'
import { mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface Activity {
  id: string
  type: 'project' | 'blog' | 'message' | 'profile' | 'login' | 'logout'
  title: string
  description?: string
  metadata?: Record<string, any>
  createdAt: string
}

const ACTIVITIES_FILE = join(process.cwd(), 'data', 'activities.json')

// Ensure data directory exists
if (!existsSync(join(process.cwd(), 'data'))) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true })
}

export class ActivityLogger {
  private static activities: Activity[] = []
  private static maxActivities = 50 // Keep only last 50 activities

  static async loadActivities(): Promise<Activity[]> {
    try {
      if (existsSync(ACTIVITIES_FILE)) {
        const data = await readFile(ACTIVITIES_FILE, 'utf-8')
        this.activities = JSON.parse(data)
      } else {
        this.activities = []
      }
    } catch (error) {
      console.error('Error loading activities:', error)
      this.activities = []
    }
    return this.activities
  }

  static async saveActivities(): Promise<void> {
    try {
      await writeFile(ACTIVITIES_FILE, JSON.stringify(this.activities, null, 2), 'utf-8')
    } catch (error) {
      console.error('Error saving activities:', error)
    }
  }

  static async logActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Promise<void> {
    await this.loadActivities()
    
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    this.activities.unshift(newActivity) // Add to beginning
    
    // Keep only the most recent activities
    if (this.activities.length > this.maxActivities) {
      this.activities = this.activities.slice(0, this.maxActivities)
    }

    await this.saveActivities()
  }

  static async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    await this.loadActivities()
    return this.activities.slice(0, limit)
  }

  static formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
}
