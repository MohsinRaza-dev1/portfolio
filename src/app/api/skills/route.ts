import { NextResponse } from 'next/server'
import { readSkillsData, defaultSkills } from '@/lib/skill-storage'

export async function GET() {
  try {
    const data = await readSkillsData()
    return NextResponse.json({ success: true, skills: data.skills })
  } catch (error) {
    console.error('Error loading skills:', error)
    return NextResponse.json({ success: false, skills: defaultSkills }, { status: 500 })
  }
}
