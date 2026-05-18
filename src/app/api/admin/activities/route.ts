import { NextResponse } from 'next/server'
import { ActivityLogger } from '@/lib/activity-logger'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const activities = await ActivityLogger.getRecentActivities(limit)
    
    // Format activities with time ago
    const formattedActivities = activities.map(activity => ({
      ...activity,
      timeAgo: ActivityLogger.formatTimeAgo(activity.createdAt)
    }))
    
    return NextResponse.json({
      success: true,
      activities: formattedActivities
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
