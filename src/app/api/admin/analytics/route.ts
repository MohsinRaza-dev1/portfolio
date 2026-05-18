import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface AnalyticsData {
  totalVisits: number
  uniqueVisitors: number
  pageViews: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
  }>
  dailyVisits: Array<{
    date: string
    visits: number
    uniqueVisitors: number
  }>
  devices: Array<{
    type: string
    count: number
    percentage: number
  }>
  referrers: Array<{
    source: string
    count: number
    percentage: number
  }>
}

interface RawAnalyticsData {
  visits: Array<{
    id: string
    timestamp: string
    path: string
    userAgent: string
    referrer: string
    ip: string
    device: string
    browser: string
    os: string
    sessionId: string
  }>
  pageViews: Record<string, number>
  uniqueVisitors: Record<string, number>
  dailyStats: Record<string, { visits: number; uniqueVisitors: number }>
  deviceStats: Record<string, number>
  referrerStats: Record<string, number>
}

const ANALYTICS_FILE = join(process.cwd(), 'data', 'analytics.json')

async function loadRawAnalyticsData(): Promise<RawAnalyticsData> {
  try {
    if (existsSync(ANALYTICS_FILE)) {
      const data = await readFile(ANALYTICS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading analytics data:', error)
  }
  
  return {
    visits: [],
    pageViews: {},
    uniqueVisitors: {},
    dailyStats: {},
    deviceStats: {},
    referrerStats: {}
  }
}

function generateAnalyticsData(rawData: RawAnalyticsData, range: '7d' | '30d' | '90d'): AnalyticsData {
  const now = new Date()
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const cutoffDate = new Date(now)
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Filter visits within the date range
  const filteredVisits = rawData.visits.filter(visit => 
    new Date(visit.timestamp) >= cutoffDate
  )

  // Calculate total visits and unique visitors
  const totalVisits = filteredVisits.length
  const uniqueVisitors = new Set(filteredVisits.map(v => v.ip)).size
  const totalPageViews = Object.values(rawData.pageViews).reduce((sum, count) => sum + count, 0)

  // Generate daily visits data
  const dailyVisits = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayStats = rawData.dailyStats[dateStr] || { visits: 0, uniqueVisitors: 0 }
    dailyVisits.push({
      date: dateStr,
      visits: dayStats.visits,
      uniqueVisitors: dayStats.uniqueVisitors
    })
  }

  // Calculate top pages
  const topPages = Object.entries(rawData.pageViews)
    .map(([path, views]) => ({
      path,
      views,
      uniqueViews: new Set(filteredVisits.filter(v => v.path === path).map(v => v.ip)).size
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  // Calculate device distribution
  const totalDeviceCount = Object.values(rawData.deviceStats).reduce((sum, count) => sum + count, 0)
  const devices = Object.entries(rawData.deviceStats)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalDeviceCount > 0 ? Math.round((count / totalDeviceCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)

  // Calculate referrer distribution
  const totalReferrerCount = Object.values(rawData.referrerStats).reduce((sum, count) => sum + count, 0)
  const referrers = Object.entries(rawData.referrerStats)
    .map(([source, count]) => ({
      source: source === 'direct' ? 'Direct' : source,
      count,
      percentage: totalReferrerCount > 0 ? Math.round((count / totalReferrerCount) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  return {
    totalVisits,
    uniqueVisitors,
    pageViews: totalPageViews,
    averageSessionDuration: 180, // Placeholder - would need session tracking
    bounceRate: 35, // Placeholder - would need session tracking
    topPages,
    dailyVisits,
    devices,
    referrers
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = (searchParams.get('range') || '30d') as '7d' | '30d' | '90d'
    
    const rawData = await loadRawAnalyticsData()
    const analyticsData = generateAnalyticsData(rawData, range)
    
    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
