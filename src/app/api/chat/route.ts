import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
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

// Read chat sessions from file
async function readChatSessions(): Promise<ChatSession[]> {
  try {
    await ensureDataDir()
    const data = await readFile(CHAT_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Write chat sessions to file
async function writeChatSessions(sessions: ChatSession[]): Promise<void> {
  await ensureDataDir()
  await writeFile(CHAT_FILE, JSON.stringify(sessions, null, 2))
}

// GET - Retrieve chat messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const sessions = await readChatSessions()
    const session = sessions.find(s => s.id === sessionId)

    if (!session) {
      return NextResponse.json({ messages: [] })
    }

    return NextResponse.json({ messages: session.messages })
  } catch (error) {
    console.error('Error reading chat messages:', error)
    return NextResponse.json({ error: 'Failed to read messages' }, { status: 500 })
  }
}

// POST - Send a new chat message
export async function POST(request: NextRequest) {
  try {
    const { sessionId, sender, message, email } = await request.json()

    if (!sessionId || !sender || !message) {
      return NextResponse.json({ error: 'Session ID, sender, and message are required' }, { status: 400 })
    }

    if (sender !== 'user' && sender !== 'admin') {
      return NextResponse.json({ error: 'Sender must be either "user" or "admin"' }, { status: 400 })
    }

    const sessions = await readChatSessions()
    let session = sessions.find(s => s.id === sessionId)

    // Create new session if it doesn't exist
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      sessions.push(session)
    }

    // Add new message
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date().toISOString(),
      sessionId,
      email: sender === 'user' ? email : undefined
    }

    session.messages.push(newMessage)
    session.updatedAt = new Date().toISOString()

    await writeChatSessions(sessions)

    return NextResponse.json({ 
      success: true, 
      message: newMessage,
      allMessages: session.messages
    })
  } catch (error) {
    console.error('Error sending chat message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

// DELETE - Clear chat session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const sessions = await readChatSessions()
    const filteredSessions = sessions.filter(s => s.id !== sessionId)

    await writeChatSessions(filteredSessions)

    return NextResponse.json({ success: true, message: 'Chat session deleted' })
  } catch (error) {
    console.error('Error deleting chat session:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
