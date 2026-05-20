import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MESSAGES_FILE = join(process.cwd(), 'data', 'messages.json')

interface Message {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  read?: boolean
  replies?: Reply[]
}

interface Reply {
  id: string
  message: string
  timestamp: string
  sender: 'admin' | 'user'
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(join(process.cwd(), 'data'), { recursive: true })
  } catch (error) {
    // Directory already exists
  }
}

// Read messages data
async function readMessagesData(): Promise<{ messages: Message[] }> {
  try {
    await ensureDataDir()
    const data = await readFile(MESSAGES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or is empty
    return { messages: [] }
  }
}

// Write messages data
async function writeMessagesData(data: { messages: Message[] }) {
  await ensureDataDir()
  await writeFile(MESSAGES_FILE, JSON.stringify(data, null, 2))
}

// Translate message content based on language
function translateMessage(message: string, language: string): string {
  const translations: { [key: string]: { [key: string]: string } } = {
    'hi': {
      'en': 'hi',
      'es': 'hola',
      'fr': 'salut',
      'de': 'hallo',
      'ur': 'ہیلو'
    },
    'Hello! I really love your website. The design is amazing and very user-friendly.': {
      'en': 'Hello! I really love your website. The design is amazing and very user-friendly.',
      'es': '¡Hola! Realmente me encanta tu sitio web. El diseño es increíble y muy fácil de usar.',
      'fr': 'Bonjour! J\'adore vraiment votre site web. Le design est incroyable et très convivial.',
      'de': 'Hallo! Ich liebe wirklich Ihre Website. Das Design ist erstaunlich und sehr benutzerfreundlich.',
      'ur': 'ہیلو! میں واقعی آپ کی ویب سائٹ سے محبت کرتا ہوں۔ ڈیزائن حیرت انگیز اور بہت صارف دوست ہے۔'
    },
    'I have a question about your services. Do you offer custom solutions for businesses?': {
      'en': 'I have a question about your services. Do you offer custom solutions for businesses?',
      'es': 'Tengo una pregunta sobre tus servicios. ¿Ofrecen soluciones personalizadas para empresas?',
      'fr': 'J\'ai une question sur vos services. Offrez-vous des solutions personnalisées pour les entreprises?',
      'de': 'Ich habe eine Frage zu Ihren Dienstleistungen. Bieten Sie maßgeschneiderte Lösungen für Unternehmen an?',
      'ur': 'میرے آپ کی خدمات کے بارے میں ایک سوال ہے۔ کیا آپ کاروبار کے لیے حسب ضرورت حل پیشکشت کرتے ہیں؟'
    },
    'Great work on the recent update! The new features are fantastic.': {
      'en': 'Great work on the recent update! The new features are fantastic.',
      'es': '¡Excelente trabajo en la actualización reciente! Las nuevas características son fantásticas.',
      'fr': 'Excellent travail sur la mise à jour récente! Les nouvelles fonctionnalités sont fantastiques.',
      'de': 'Große Arbeit an der letzten Aktualisierung! Die neuen Funktionen sind fantastisch.',
      'ur': 'حالیہ اپ ڈیٹ پر بہت کام کیا! نئی خصوصیات شاندار ہیں۔'
    },
    'Is there a way to schedule a demo of your product? I\'m interested in learning more.': {
      'en': 'Is there a way to schedule a demo of your product? I\'m interested in learning more.',
      'es': '¿Hay alguna manera de programar una demostración de tu producto? Estoy interesado en aprender más.',
      'fr': 'Y a-t-il un moyen de planifier une démonstration de votre produit? Je suis intéressé à en savoir plus.',
      'de': 'Gibt es eine Möglichkeit, eine Demo Ihres Produkts zu planen? Ich bin interessiert mehr zu erfahren.',
      'ur': 'کیا آپ کے پروڈکٹ کا ڈیمو شیڈول کرنے کا کوئی طریقہ ہے؟ میں مزید جاننے میں دلچسپی رکھتا ہوں۔'
    },
    'Thank you for the excellent customer support! You resolved my issue quickly.': {
      'en': 'Thank you for the excellent customer support! You resolved my issue quickly.',
      'es': '¡Gracias por el excelente servicio al cliente! Resolviste mi problema rápidamente.',
      'fr': 'Merci pour l\'excellent service client! Vous avez résolu mon problème rapidement.',
      'de': 'Vielen Dank für den hervorragenden Kundenservice! Sie haben mein Problem schnell gelöst.',
      'ur': 'بہت عمدہ کسٹمر سپورٹ کے لیے شکریہ! آپ نے میرا مسئلہ جلد حل کر دیا۔'
    },
    'Thank you for your message, Muneeb! We have received your inquiry and will get back to you shortly with a detailed response.': {
      'en': 'Thank you for your message, Muneeb! We have received your inquiry and will get back to you shortly with a detailed response.',
      'es': '¡Gracias por tu mensaje, Muneeb! Hemos recibido tu consulta y te responderemos pronto con una respuesta detallada.',
      'fr': 'Merci pour votre message, Muneeb! Nous avons reçu votre demande et vous répondrons shortly avec une réponse détaillée.',
      'de': 'Vielen Dank für Ihre Nachricht, Muneeb! Wir haben Ihre Anfrage erhalten und werden Ihnen shortly mit einer detaillierten Antwort antworten.',
      'ur': 'آپ کے پیغام کے لیے شکریہ، منیب! ہم نے آپ کی استفساد حاصل کر لی ہے اور جلد ہی تفصیلی جواب کے ساتھ آپ سے رابطہ کریں گے۔'
    },
    'yes how can you do': {
      'en': 'yes how can you do',
      'es': 'sí, ¿cómo puedes hacerlo?',
      'fr': 'oui, comment peux-tu le faire?',
      'de': 'ja, wie kannst du das machen?',
      'ur': 'ہاں، آپ یہ کیسے کر سکتے ہیں؟'
    }
  }
  
  return translations[message]?.[language] || message
}

// GET - Retrieve all messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get('lang') || 'en'
    
    const data = await readMessagesData()
    
    // Apply translations to all messages and replies
    const translatedMessages = data.messages.map(message => ({
      ...message,
      message: translateMessage(message.message, language),
      read: message.read ?? false,
      replies: message.replies ? message.replies.map(reply => ({
        ...reply,
        message: translateMessage(reply.message, language)
      })) : []
    }))
    
    // Sort messages by timestamp (newest first)
    translatedMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return NextResponse.json({
      success: true,
      messages: translatedMessages,
      count: translatedMessages.length
    })
  } catch (error) {
    console.error('Error reading messages:', error)
    return NextResponse.json(
      { error: 'Failed to read messages' },
      { status: 500 }
    )
  }
}

// POST - Save a new message
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const data = await readMessagesData()
    
    const newMessage: Message = {
      id: Date.now().toString(),
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      replies: []
    }

    data.messages.push(newMessage)
    await writeMessagesData(data)

    return NextResponse.json({
      success: true,
      message: newMessage,
      allMessages: data.messages
    })
  } catch (error) {
    console.error('Error saving message:', error)
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    )
  }
}

// PUT - Update message read status or add a reply
export async function PUT(request: NextRequest) {
  try {
    const { messageId, reply, sender = 'admin', read } = await request.json()

    if (!messageId || (reply === undefined && read === undefined)) {
      return NextResponse.json(
        { error: 'Message ID and either reply or read status are required' },
        { status: 400 }
      )
    }

    const data = await readMessagesData()
    const message = data.messages.find(msg => msg.id === messageId)

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    if (read !== undefined) {
      message.read = Boolean(read)
    }

    let newReply: Reply | null = null
    if (reply) {
      newReply = {
        id: Date.now().toString(),
        message: reply,
        timestamp: new Date().toISOString(),
        sender
      }

      if (!message.replies) {
        message.replies = []
      }
      message.replies.push(newReply)
    }

    await writeMessagesData(data)

    return NextResponse.json({
      success: true,
      reply: newReply,
      message: message
    })
  } catch (error) {
    console.error('Error adding reply:', error)
    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const data = await readMessagesData()
    const messageIndex = data.messages.findIndex(msg => msg.id === messageId)

    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    // Remove the message
    data.messages.splice(messageIndex, 1)
    await writeMessagesData(data)

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
