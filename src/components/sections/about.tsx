"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Download, Database, Globe, Smartphone } from 'lucide-react'

// Professional Technology Icons with Official Logos
const ReactIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#61DAFB" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-2.5-6c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm5 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
  </svg>
)

const TypeScriptIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <rect fill="#3178C6" width="24" height="24" rx="2"/>
    <path fill="white" d="M6 6h4v1H7v1h3v1H7v1h3v1H7v1h3v1H7v1h3v1H6V6zm8 0h4v1h-3v1h3v1h-3v1h3v1h-3v1h3v1h-3v1h3v1h-4V6z"/>
    <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">TS</text>
  </svg>
)

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#06B6D4" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-7c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/>
  </svg>
)

const PrismaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#0D3558" d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7.5 3.75v7.5L12 19.5l-7.5-3.75V8.25L12 4.5z"/>
    <path fill="#0D3558" d="M12 7l-5 2.5v5l5 2.5 5-2.5v-5L12 7z"/>
  </svg>
)

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#339933" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>
)

const GitIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#F05032" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-7-7c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7-7-3.13-7-7zm5-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
)

interface Skill {
  id: string
  name: string
  level: number
  color: string
  iconName: string
}

const defaultSkills: Skill[] = [
  { id: '1', name: 'React/Next.js', level: 90, color: '#61DAFB', iconName: 'ReactIcon' },
  { id: '2', name: 'TypeScript', level: 85, color: '#3178C6', iconName: 'TypeScriptIcon' },
  { id: '3', name: 'Tailwind CSS', level: 88, color: '#06B6D4', iconName: 'TailwindIcon' },
  { id: '4', name: 'Prisma ORM', level: 82, color: '#0D3558', iconName: 'PrismaIcon' },
  { id: '5', name: 'Node.js', level: 80, color: '#339933', iconName: 'NodeIcon' },
  { id: '6', name: 'Git/GitHub', level: 90, color: '#F05032', iconName: 'GitIcon' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ReactIcon,
  TypeScriptIcon,
  TailwindIcon,
  PrismaIcon,
  NodeIcon,
  GitIcon,
}

export function About() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (!response.ok) {
          throw new Error('Failed to load skills')
        }
        const data = await response.json()
        if (Array.isArray(data.skills)) {
          setSkills(data.skills)
        }
      } catch (error) {
        console.error('Error loading skills:', error)
      }
    }

    fetchSkills()
  }, [])

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* Building Digital Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Building Digital Experiences</h3>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="w-full">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="text-muted-foreground mb-6">
                  Hi, I'm Mohsin Raza, a passionate full-stack developer with a keen eye for design and a love for creating seamless user experiences. With expertise in modern web technologies, I specialize in building scalable, performant applications that solve real-world problems.
                </p>
                <p className="text-muted-foreground mb-6">
                  My journey in web development started with a curiosity about how things work on the internet, and it has evolved into a career where I get to bring ideas to life through code. I believe in writing clean, maintainable code and staying up-to-date with the latest industry trends and best practices.
                </p>
                <p className="text-muted-foreground mb-8">
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.
                </p>
                
                <motion.a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={20} />
                  Download CV
                </motion.a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-card p-6 rounded-lg border text-center">
                  <Database className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Full-Stack Development</h4>
                  <p className="text-sm text-muted-foreground">End-to-end application development</p>
                </div>
                <div className="bg-card p-6 rounded-lg border text-center">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Web Applications</h4>
                  <p className="text-sm text-muted-foreground">Modern, responsive web solutions</p>
                </div>
                <div className="bg-card p-6 rounded-lg border text-center">
                  <Smartphone className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Mobile-First Design</h4>
                  <p className="text-sm text-muted-foreground">Optimized for all devices</p>
                </div>
                <div className="bg-card p-6 rounded-lg border text-center">
                  <Database className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h4 className="font-semibold mb-2">Database Design</h4>
                  <p className="text-sm text-muted-foreground">Efficient data architecture</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Technical Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Technical Skills</h3>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => {
                const Icon = iconMap[skill.iconName] ?? ReactIcon
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded" style={{ backgroundColor: `${skill.color}20` }}>
                          <Icon />
                        </div>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: skill.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1, delay: 1 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
