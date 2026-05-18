import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messageId, reply } = body

    if (!messageId || !reply) {
      return NextResponse.json(
        { error: 'Message ID and reply are required' },
        { status: 400 }
      )
    }

    // Update the contact message with the reply
    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: {
        reply,
        repliedAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Get the message details for email notification
    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // TODO: Send email notification to user about the reply
    // This would require an email service integration

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully',
      data: updatedMessage
    })

  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(message)

  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    )
  }
}
