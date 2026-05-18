import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ActivityLogger } from '@/lib/activity-logger'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get('file') as File
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const techStack = formData.get('techStack') as string
      const githubUrl = formData.get('githubUrl') as string
      const liveUrl = formData.get('liveUrl') as string
      const category = formData.get('category') as string
      const featured = formData.get('featured') === 'true'
      
      if (!title || !description || !techStack || !githubUrl || !liveUrl || !category) {
        return NextResponse.json(
          { error: 'Missing required fields: title, description, techStack, githubUrl, liveUrl, category are required' },
          { status: 400 }
        )
      }

      // Handle image upload if provided
      let imageUrl = null
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: 'Invalid file type. Only images are allowed.' },
            { status: 400 }
          )
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB in bytes
        if (file.size > maxSize) {
          return NextResponse.json(
            { error: 'File too large. Maximum size is 5MB.' },
            { status: 400 }
          )
        }

        // In a real implementation, you would upload to a cloud storage
        // For now, we'll create a local URL using the upload API
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/upload`, {
          method: 'POST',
          body: uploadFormData
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          imageUrl = uploadResult.fileUrl
        } else {
          return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
          )
        }
      }

      // Validate techStack is an array if provided
      let parsedTechStack: string[] = []
      if (techStack && typeof techStack === 'string') {
        try {
          parsedTechStack = JSON.parse(techStack)
        } catch {
          parsedTechStack = [techStack] // Fallback to array if JSON parsing fails
        }
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          image: imageUrl,
          techStack: JSON.stringify(parsedTechStack),
          githubUrl,
          liveUrl,
          category,
          featured
        }
      })

      // Log project creation activity
      await ActivityLogger.logActivity({
        type: 'project',
        title: `New project "${title}" added`,
        description: `Project in ${category} category created`
      })

      return NextResponse.json(project, { status: 201 })
    } else {
      // Handle JSON request (no file upload)
      const body = await request.json()
      
      // Validate required fields
      const { title, description, image, techStack, githubUrl, liveUrl, category, featured } = body
      
      if (!title || !description || !techStack || !githubUrl || !liveUrl || !category) {
        return NextResponse.json(
          { error: 'Missing required fields: title, description, techStack, githubUrl, liveUrl, category are required' },
          { status: 400 }
        )
      }

      // Validate techStack is an array if provided
      let parsedTechStack = techStack
      if (techStack && typeof techStack === 'string') {
        try {
          parsedTechStack = JSON.parse(techStack)
        } catch {
          parsedTechStack = [techStack] // Fallback to array if JSON parsing fails
        }
      }

      const project = await prisma.project.create({
        data: {
          title,
          description,
          image,
          techStack: JSON.stringify(parsedTechStack),
          githubUrl,
          liveUrl,
          category,
          featured: featured || false
        }
      })

      // Log project creation activity
      await ActivityLogger.logActivity({
        type: 'project',
        title: `New project "${title}" added`,
        description: `Project in ${category} category created`
      })

      return NextResponse.json(project, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

// PUT - Update a project
export async function PUT(request: NextRequest) {
  try {
    // Handle JSON request only
    const body = await request.json()
    
    // Validate required fields
    const { id, title, description, image, techStack, githubUrl, liveUrl, category, featured } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    if (!title || !description || !techStack || !githubUrl || !liveUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, techStack, githubUrl, liveUrl, category are required' },
        { status: 400 }
      )
    }

    // Validate techStack is an array if provided
    let parsedTechStack = techStack
    if (techStack && typeof techStack === 'string') {
      try {
        parsedTechStack = JSON.parse(techStack)
      } catch {
        parsedTechStack = [techStack] // Fallback to array if JSON parsing fails
      }
    }

    // Convert array to JSON string for database storage
    const techStackString = JSON.stringify(parsedTechStack)

    // Update the project
    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        image: image || undefined,
        techStack: techStackString,
        githubUrl,
        liveUrl,
        category,
        featured: featured || false
      }
    })

    // Log activity
    await ActivityLogger.logActivity({
      type: 'project',
      title: 'Project updated',
      description: `Project "${title}" in ${category} category updated`
    })

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}
