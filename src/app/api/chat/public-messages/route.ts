import { NextRequest, NextResponse } from 'next/server'
import { readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const CHAT_FILE = join(process.cwd(), 'data', 'chat.json')

interface ChatMessage {
  id: string
  sender: 'user' | 'admin'
  message: string
  timestamp: string
  sessionId: string
  email?: string
  isPublic?: boolean
}

interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
  } catch (error) {
    // Directory already exists
  }
}

// Read chat data
async function readChatData(): Promise<{ sessions: ChatSession[] }> {
  try {
    await ensureDataDir()
    const data = await readFile(CHAT_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty
    return { sessions: [] }
  }
}

// GET handler for public messages
export async function GET(request: NextRequest) {
  try {
    const chatData = await readChatData()
    const publicMessages: ChatMessage[] = []
    
    // Add sample messages if no data exists
    if (chatData.sessions.length === 0) {
      const now = new Date()
      const sampleMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'admin',
          message: '📢 Welcome to our public announcement board!',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
          sessionId: 'public_session',
          isPublic: true
        },
        {
          id: '2',
          sender: 'admin',
          message: 'Our support team is available 24/7 to assist you.',
          timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
          sessionId: 'public_session',
          isPublic: true
        },
        {
          id: '3',
          sender: 'admin',
          message: 'New feature: Live chat support is now available!',
          timestamp: new Date(now.getTime() - 2400000).toISOString(), // 40 minutes ago
          sessionId: 'public_session',
          isPublic: true
        },
        {
          id: '4',
          sender: 'admin',
          message: 'Thank you for being a valued member of our community.',
          timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
          sessionId: 'public_session',
          isPublic: true
        },
        {
          id: '5',
          sender: 'admin',
          message: 'Visit our FAQ section for quick answers to common questions.',
          timestamp: new Date(now.getTime() - 1200000).toISOString(), // 20 minutes ago
          sessionId: 'public_session',
          isPublic: true
        }
      ]
      publicMessages.push(...sampleMessages)
    } else {
      // Collect all messages and mark admin messages as public
      chatData.sessions.forEach(session => {
        session.messages.forEach(message => {
          // Mark admin messages as public, and user messages can be public too
          const enhancedMessage = {
            ...message,
            isPublic: message.sender === 'admin' || message.isPublic
          }
          publicMessages.push(enhancedMessage)
        })
      })
    }

    // Sort by timestamp (newest first for public view)
    publicMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Limit to recent messages for public view
    const recentMessages = publicMessages.slice(0, 50)

    return NextResponse.json({
      success: true,
      messages: recentMessages,
      count: recentMessages.length
    })

  } catch (error) {
    console.error('Error fetching public messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch public messages' },
      { status: 500 }
    )
  }
}
