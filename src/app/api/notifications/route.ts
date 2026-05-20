import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'

const NOTIFICATIONS_FILE = join(process.cwd(), 'data', 'notifications.json')

interface Notification {
  id: number
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  time: string
  read: boolean
  targetUsers?: string
  status?: string
  createdAt?: string
  createdBy?: string
  updatedAt?: string
}

async function ensureDataDir() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
  } catch (error) {
    // ignore
  }
}

async function readNotifications(): Promise<Notification[]> {
  try {
    await ensureDataDir()
    const data = await readFile(NOTIFICATIONS_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) {
      return parsed
    }
    if (parsed && Array.isArray(parsed.notifications)) {
      return parsed.notifications
    }
    return []
  } catch (error) {
    return []
  }
}

async function writeNotifications(notifications: Notification[]) {
  await ensureDataDir()
  await writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const notifications = await readNotifications()
    return NextResponse.json({ success: true, notifications })
  } catch (error) {
    console.error('Error reading notifications:', error)
    return NextResponse.json({ error: 'Failed to read notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, message, targetUsers = 'all', createdBy = 'Admin' } = await request.json()

    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Type, title, and message are required' }, { status: 400 })
    }

    const notifications = await readNotifications()
    const newNotification: Notification = {
      id: Date.now(),
      type,
      title,
      message,
      time: 'Just now',
      read: false,
      targetUsers,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy
    }

    notifications.unshift(newNotification)
    await writeNotifications(notifications)

    return NextResponse.json({ success: true, notification: newNotification })
  } catch (error) {
    console.error('Error saving notification:', error)
    return NextResponse.json({ error: 'Failed to save notification' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json()

    if (!id || !updates) {
      return NextResponse.json({ error: 'Notification ID and updates are required' }, { status: 400 })
    }

    const notifications = await readNotifications()
    let found = false

    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        found = true
        return {
          ...notification,
          ...updates,
          updatedAt: new Date().toISOString(),
          time: 'Just now'
        }
      }
      return notification
    })

    if (!found) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    await writeNotifications(updatedNotifications)
    return NextResponse.json({ success: true, notifications: updatedNotifications })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const id = Number(idParam)
    const notifications = await readNotifications()
    const filtered = notifications.filter(notification => notification.id !== id)

    await writeNotifications(filtered)
    return NextResponse.json({ success: true, notifications: filtered })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
  }
}
