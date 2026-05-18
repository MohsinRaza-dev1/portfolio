import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

interface VisitData {
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
}

interface AnalyticsData {
  visits: VisitData[]
  pageViews: Record<string, number>
  uniqueVisitors: Record<string, number>
  dailyStats: Record<string, { visits: number; uniqueVisitors: number }>
  deviceStats: Record<string, number>
  referrerStats: Record<string, number>
}

const ANALYTICS_FILE = join(process.cwd(), 'data', 'analytics.json')

// Ensure data directory exists
if (!existsSync(join(process.cwd(), 'data'))) {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true })
}

function getDeviceInfo(userAgent: string) {
  const ua = userAgent.toLowerCase()
  
  // Device detection
  let device = 'desktop'
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    device = /tablet|ipad/i.test(ua) ? 'tablet' : 'mobile'
  }
  
  // Browser detection
  let browser = 'unknown'
  if (ua.includes('chrome')) browser = 'chrome'
  else if (ua.includes('firefox')) browser = 'firefox'
  else if (ua.includes('safari')) browser = 'safari'
  else if (ua.includes('edge')) browser = 'edge'
  
  // OS detection
  let os = 'unknown'
  if (ua.includes('windows')) os = 'windows'
  else if (ua.includes('mac')) os = 'macos'
  else if (ua.includes('linux')) os = 'linux'
  else if (ua.includes('android')) os = 'android'
  else if (ua.includes('ios')) os = 'ios'
  
  return { device, browser, os }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || real || 'unknown'
  return ip.trim()
}

async function loadAnalyticsData(): Promise<AnalyticsData> {
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

async function saveAnalyticsData(data: AnalyticsData): Promise<void> {
  try {
    await writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving analytics data:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer } = body
    
    // Get client information
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = getClientIP(request)
    const { device, browser, os } = getDeviceInfo(userAgent)
    
    // Generate session ID (simplified - in production, use proper session management)
    const sessionId = `${ip}-${new Date().toDateString()}`
    
    const visitData: VisitData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      path: path || '/',
      userAgent,
      referrer: referrer || 'direct',
      ip,
      device,
      browser,
      os,
      sessionId
    }
    
    // Load existing data
    const analyticsData = await loadAnalyticsData()
    
    // Add new visit
    analyticsData.visits.push(visitData)
    
    // Update page views
    analyticsData.pageViews[path] = (analyticsData.pageViews[path] || 0) + 1
    
    // Update unique visitors
    if (!analyticsData.uniqueVisitors[ip]) {
      analyticsData.uniqueVisitors[ip] = 0
    }
    analyticsData.uniqueVisitors[ip]++
    
    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    if (!analyticsData.dailyStats[today]) {
      analyticsData.dailyStats[today] = { visits: 0, uniqueVisitors: 0 }
    }
    analyticsData.dailyStats[today].visits++
    
    // Check if this is a new unique visitor for today
    const todayVisits = analyticsData.visits.filter(v => 
      v.timestamp.startsWith(today) && v.ip === ip
    )
    if (todayVisits.length === 1) {
      analyticsData.dailyStats[today].uniqueVisitors++
    }
    
    // Update device stats
    analyticsData.deviceStats[device] = (analyticsData.deviceStats[device] || 0) + 1
    
    // Update referrer stats
    const referrerSource = referrer ? new URL(referrer).hostname : 'direct'
    analyticsData.referrerStats[referrerSource] = (analyticsData.referrerStats[referrerSource] || 0) + 1
    
    // Keep only last 10000 visits to prevent file from growing too large
    if (analyticsData.visits.length > 10000) {
      analyticsData.visits = analyticsData.visits.slice(-10000)
    }
    
    // Save updated data
    await saveAnalyticsData(analyticsData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}
