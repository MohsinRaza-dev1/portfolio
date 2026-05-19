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
  userEmail?: string
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

// GET handler for admin messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const chatData = await readChatData()
    
    // Filter admin messages related to the user
    const adminMessages: ChatMessage[] = []
    const userEmailForSession = email.replace(/[@.]/g, '_')
    
    chatData.sessions.forEach(session => {
      // Check if this session contains messages from the user
      const hasUserMessages = session.messages.some(msg => 
        msg.email === email || 
        (msg.sender === 'user' && (session.id.includes(userEmailForSession) || msg.email === email))
      )
      
      // If session has user messages, include admin messages from this session
      if (hasUserMessages) {
        session.messages.forEach(message => {
          if (message.sender === 'admin') {
            adminMessages.push({
              ...message,
              userEmail: email // Add user email for context
            })
          }
        })
      }
    })

    // Sort messages by timestamp (newest first for admin responses)
    adminMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      success: true,
      messages: adminMessages,
      email: email,
      count: adminMessages.length
    })

  } catch (error) {
    console.error('Error fetching admin messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin messages' },
      { status: 500 }
    )
  }
}
