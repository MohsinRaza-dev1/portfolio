import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { profileImage } = await request.json()

    if (!profileImage) {
      return NextResponse.json({ error: 'Profile image URL is required' }, { status: 400 })
    }

    // Read the current profile config
    const configPath = join(process.cwd(), 'src', 'config', 'profile.ts')
    const configContent = await readFile(configPath, 'utf-8')
    
    // Simple string replacement approach - find and replace the profileImage line
    const profileImageRegex = /profileImage:\s*"[^"]*"/
    const newProfileImageLine = `profileImage: "${profileImage}"`
    
    if (!profileImageRegex.test(configContent)) {
      return NextResponse.json({ error: 'Profile image not found in config' }, { status: 500 })
    }
    
    // Replace the profileImage line
    const updatedConfigContent = configContent.replace(profileImageRegex, newProfileImageLine)
    
    // Write the updated config back to the file
    await writeFile(configPath, updatedConfigContent, 'utf-8')

    return NextResponse.json({ 
      success: true,
      message: 'Profile configuration updated successfully'
    })

  } catch (error) {
    console.error('Error updating profile config:', error)
    return NextResponse.json({ error: 'Failed to update profile configuration' }, { status: 500 })
  }
}
