import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ActivityLogger } from '@/lib/activity-logger'

export async function GET() {
  try {
    const posts = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
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
      const slug = formData.get('slug') as string
      const content = formData.get('content') as string
      const excerpt = formData.get('excerpt') as string
      const coverImage = formData.get('coverImage') as string
      const published = formData.get('published') === 'true'
      
      if (!title || !slug || !content || !excerpt) {
        return NextResponse.json(
          { error: 'Missing required fields: title, slug, content, excerpt are required' },
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
        
        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'}/api/upload`, {
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

      const blog = await prisma.blog.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage: imageUrl || coverImage,
          published
        }
      })

      // Log blog creation activity
      await ActivityLogger.logActivity({
        type: 'blog',
        title: `New blog post "${title}" ${published ? 'published' : 'created as draft'}`,
        description: `Blog post created${published ? ' and published' : ' as draft'}`
      })

      return NextResponse.json(blog, { status: 201 })
    } else {
      // Handle JSON request (no file upload)
      const body = await request.json()
      
      // Validate required fields
      const { title, slug, content, excerpt, coverImage, published } = body
      
      if (!title || !slug || !content || !excerpt) {
        return NextResponse.json(
          { error: 'Missing required fields: title, slug, content, excerpt are required' },
          { status: 400 }
        )
      }

      const blog = await prisma.blog.create({
        data: {
          title,
          slug,
          content,
          excerpt,
          coverImage,
          published
        }
      })

      // Log blog creation activity
      await ActivityLogger.logActivity({
        type: 'blog',
        title: `New blog post "${title}" ${published ? 'published' : 'created as draft'}`,
        description: `Blog post created${published ? ' and published' : ' as draft'}`
      })

      return NextResponse.json(blog, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
