import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

interface SocialMediaSettings {
  github: string
  linkedin: string
  twitter: string
  facebook: string
  tiktok: string
  email: string
  phone: string
  whatsapp: string
}

const SETTINGS_FILE = join(process.cwd(), 'data', 'social-media-settings.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await writeFile(join(process.cwd(), 'data', '.gitkeep'), '', { flag: 'wx' })
  } catch (error) {
    // Directory already exists, ignore error
  }
}

// Default settings
const defaultSettings: SocialMediaSettings = {
  github: 'mohsindev',
  linkedin: 'mohsinraza-dev',
  twitter: 'mohsindev',
  facebook: 'mohsindev',
  tiktok: 'moshinkhan2055',
  email: 'hmohsinkhan5@gmail.com',
  phone: '+923037327992',
  whatsapp: '+923037327992'
}

// GET - Load settings
export async function GET() {
  try {
    await ensureDataDir()
    
    try {
      const data = await readFile(SETTINGS_FILE, 'utf-8')
      const settings = JSON.parse(data)
      return NextResponse.json(settings)
    } catch (error) {
      // File doesn't exist or is invalid, return default settings
      return NextResponse.json(defaultSettings)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

// POST - Save settings
export async function POST(request: NextRequest) {
  try {
    const settings: SocialMediaSettings = await request.json()
    
    // Validate settings
    const requiredFields = ['github', 'linkedin', 'twitter', 'facebook', 'tiktok', 'email', 'phone', 'whatsapp']
    for (const field of requiredFields) {
      if (!settings[field as keyof SocialMediaSettings]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    await ensureDataDir()
    await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2))
    
    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
      settings
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
