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
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) {
      return { sessions: parsed }
    }
    if (parsed && Array.isArray(parsed.sessions)) {
      return { sessions: parsed.sessions }
    }
    return { sessions: [] }
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
    
    if (chatData.sessions.length > 0) {
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
