import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '6')
    
    const projects = await prisma.project.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        category: true,
        featured: true,
        createdAt: true,
        techStack: true,
        githubUrl: true,
        liveUrl: true
      }
    })
    
    // Parse techStack from JSON string to array
    const formattedProjects = projects.map(project => ({
      ...project,
      techStack: JSON.parse(project.techStack || '[]')
    }))
    
    return NextResponse.json({
      success: true,
      projects: formattedProjects
    })
  } catch (error) {
    console.error('Error fetching recent projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent projects' },
      { status: 500 }
    )
  }
}
