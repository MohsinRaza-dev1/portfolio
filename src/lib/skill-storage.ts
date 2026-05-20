import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export interface Skill {
  id: string
  name: string
  level: number
  color: string
  iconName: string
}

const SKILLS_FILE = join(process.cwd(), 'data', 'skills.json')

export const defaultSkills: Skill[] = [
  { id: '1', name: 'React/Next.js', level: 90, color: '#61DAFB', iconName: 'ReactIcon' },
  { id: '2', name: 'TypeScript', level: 85, color: '#3178C6', iconName: 'TypeScriptIcon' },
  { id: '3', name: 'Tailwind CSS', level: 88, color: '#06B6D4', iconName: 'TailwindIcon' },
  { id: '4', name: 'Prisma ORM', level: 82, color: '#0D3558', iconName: 'PrismaIcon' },
  { id: '5', name: 'Node.js', level: 80, color: '#339933', iconName: 'NodeIcon' },
  { id: '6', name: 'Git/GitHub', level: 90, color: '#F05032', iconName: 'GitIcon' },
]

async function ensureDataDir() {
  await mkdir(join(process.cwd(), 'data'), { recursive: true })
}

export async function readSkillsData(): Promise<{ skills: Skill[] }> {
  try {
    await ensureDataDir()
    const data = await readFile(SKILLS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return { skills: defaultSkills }
  }
}

export async function writeSkillsData(data: { skills: Skill[] }) {
  await ensureDataDir()
  await writeFile(SKILLS_FILE, JSON.stringify(data, null, 2))
}
