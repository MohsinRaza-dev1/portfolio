"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Eye, MousePointer, Clock, Calendar, BarChart3, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { useAdmin } from '@/contexts/admin-context'
import { AdminAuthGuard } from '@/components/admin-auth-guard'
import Link from 'next/link'

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

export default function AnalyticsPage() {
  const { isAdmin, logout } = useAdmin()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    if (isAdmin) {
      fetchAnalyticsData()
    }
  }, [isAdmin, timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your website performance and visitor insights</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="px-4 py-2 border border-border rounded-lg bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : analyticsData ? (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Eye className="w-8 h-8 text-blue-500" />
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <ArrowUp size={16} />
                    +12%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{formatNumber(analyticsData.totalVisits)}</h3>
                <p className="text-sm text-muted-foreground">Total Visits</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-lg border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-green-500" />
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <ArrowUp size={16} />
                    +8%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{formatNumber(analyticsData.uniqueVisitors)}</h3>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-lg border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <MousePointer className="w-8 h-8 text-purple-500" />
                  <span className="text-sm text-red-500 flex items-center gap-1">
                    <ArrowDown size={16} />
                    -3%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{formatNumber(analyticsData.pageViews)}</h3>
                <p className="text-sm text-muted-foreground">Page Views</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-lg border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-orange-500" />
                  <span className="text-sm text-green-500 flex items-center gap-1">
                    <ArrowUp size={16} />
                    +15%
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{formatDuration(analyticsData.averageSessionDuration)}</h3>
                <p className="text-sm text-muted-foreground">Avg. Session Duration</p>
              </motion.div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Top Pages */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg border p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Top Pages
                </h2>
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <div>
                          <p className="font-medium">{page.path}</p>
                          <p className="text-xs text-muted-foreground">{formatNumber(page.uniqueViews)} unique views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatNumber(page.views)}</p>
                        <p className="text-xs text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Device Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card rounded-lg border p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity size={20} />
                  Device Distribution
                </h2>
                <div className="space-y-3">
                  {analyticsData.devices.map((device) => (
                    <div key={device.type} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <span className="font-medium capitalize">{device.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${device.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Traffic Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Traffic Sources
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.referrers.map((referrer) => (
                  <div key={referrer.source} className="text-center p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold text-lg">{formatNumber(referrer.count)}</h3>
                    <p className="text-sm text-muted-foreground">{referrer.source}</p>
                    <p className="text-xs text-primary mt-1">{referrer.percentage}%</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
            <p className="text-muted-foreground">Analytics data will appear here as visitors access your website.</p>
          </div>
        )}
      </div>
    </div>
    </AdminAuthGuard>
  )
}
