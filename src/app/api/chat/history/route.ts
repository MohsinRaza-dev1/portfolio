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

// GET handler for chat history
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
    
    // Filter messages by email
    const userMessages: ChatMessage[] = []
    const userEmailForSession = email.replace(/[@.]/g, '_')
    
    chatData.sessions.forEach(session => {
      // Check if this session contains messages from the user
      const hasUserMessages = session.messages.some(msg => 
        msg.email === email || 
        (msg.sender === 'user' && (session.id.includes(userEmailForSession) || msg.email === email))
      )
      
      // If session has user messages, include all messages from this session (user + admin responses)
      if (hasUserMessages) {
        session.messages.forEach(message => {
          userMessages.push({
            ...message,
            email: message.sender === 'user' ? email : undefined // Keep email only for user messages
          })
        })
      }
    })

    // Sort messages by timestamp
    userMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({
      success: true,
      messages: userMessages,
      email: email,
      count: userMessages.length
    })

  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}
