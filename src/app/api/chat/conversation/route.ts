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

// GET handler for complete conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    const chatData = await readChatData()
    let allMessages: ChatMessage[] = []

    // Add sample messages if no data exists
    if (chatData.sessions.length === 0) {
      const now = new Date()
      const sampleMessages: ChatMessage[] = [
        {
          id: '1',
          sender: 'admin',
          message: 'Welcome to our support system! How can I help you today?',
          timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
          sessionId: 'sample_session',
          isPublic: true
        },
        {
          id: '2',
          sender: 'admin',
          message: 'We\'re here to assist you with any questions or concerns you may have.',
          timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
          sessionId: 'sample_session',
          isPublic: true
        },
        {
          id: '3',
          sender: 'admin',
          message: 'Feel free to reach out through the contact form above.',
          timestamp: new Date(now.getTime() - 2400000).toISOString(), // 40 minutes ago
          sessionId: 'sample_session',
          isPublic: true
        },
        {
          id: '4',
          sender: 'admin',
          message: 'Our team typically responds within 24 business hours.',
          timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
          sessionId: 'sample_session',
          isPublic: true
        },
        {
          id: '5',
          sender: 'admin',
          message: 'Thank you for visiting our website!',
          timestamp: new Date(now.getTime() - 1200000).toISOString(), // 20 minutes ago
          sessionId: 'sample_session',
          isPublic: true
        }
      ]
      allMessages = sampleMessages
    } else {
      if (email) {
        // Get conversation history for specific user
        const userEmailForSession = email.replace(/[@.]/g, '_')
        
        chatData.sessions.forEach(session => {
          // Check if this session contains messages from the user
          const hasUserMessages = session.messages.some(msg => 
            msg.email === email || 
            (msg.sender === 'user' && (session.id.includes(userEmailForSession) || msg.email === email))
          )
          
          // If session has user messages, include all messages from this session
          if (hasUserMessages) {
            session.messages.forEach(message => {
              allMessages.push({
                ...message,
                email: message.sender === 'user' ? email : message.email
              })
            })
          }
        })
      } else {
        // Get all messages (public view)
        chatData.sessions.forEach(session => {
          session.messages.forEach(message => {
            allMessages.push(message)
          })
        })
      }
    }

    // Sort messages by timestamp
    allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    return NextResponse.json({
      success: true,
      messages: allMessages,
      email: email,
      count: allMessages.length
    })

  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversation history' },
      { status: 500 }
    )
  }
}
