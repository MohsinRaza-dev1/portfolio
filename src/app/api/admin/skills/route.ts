import { NextRequest, NextResponse } from 'next/server'
import { readSkillsData, writeSkillsData, defaultSkills } from '@/lib/skill-storage'

export async function GET() {
  try {
    const data = await readSkillsData()
    return NextResponse.json({ success: true, skills: data.skills })
  } catch (error) {
    console.error('Error loading admin skills:', error)
    return NextResponse.json({ success: true, skills: defaultSkills }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, level, color, iconName } = body

    if (!name || !level || !color) {
      return NextResponse.json({ error: 'Name, level, and color are required' }, { status: 400 })
    }

    const data = await readSkillsData()
    const newSkill = {
      id: Date.now().toString(),
      name: String(name).trim(),
      level: Number(level),
      color: String(color).trim(),
      iconName: String(iconName || 'ReactIcon').trim(),
    }

    data.skills.push(newSkill)
    await writeSkillsData(data)

    return NextResponse.json({ success: true, skill: newSkill })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, level, color, iconName } = body

    if (!id || !name || !level || !color) {
      return NextResponse.json({ error: 'ID, name, level, and color are required' }, { status: 400 })
    }

    const data = await readSkillsData()
    const index = data.skills.findIndex((skill) => skill.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }

    data.skills[index] = {
      ...data.skills[index],
      name: String(name).trim(),
      level: Number(level),
      color: String(color).trim(),
      iconName: String(iconName || 'ReactIcon').trim(),
    }

    await writeSkillsData(data)

    return NextResponse.json({ success: true, skill: data.skills[index] })
  } catch (error) {
    console.error('Error updating skill:', error)
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 })
    }

    const data = await readSkillsData()
    data.skills = data.skills.filter((skill) => skill.id !== id)
    await writeSkillsData(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}
