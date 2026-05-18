import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  // Sample projects
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform with payment integration, user authentication, and admin dashboard.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['Next.js', 'React', 'Stripe', 'Prisma', 'Tailwind CSS']),
      githubUrl: 'https://github.com/mohsinraza/ecommerce',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates and team features.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['React', 'Node.js', 'Socket.io', 'MongoDB']),
      githubUrl: 'https://github.com/mohsinraza/taskapp',
      liveUrl: 'https://taskapp-demo.vercel.app',
      category: 'Web Development',
      featured: false,
    },
    {
      title: 'Weather Dashboard',
      description: 'A beautiful weather dashboard with forecasts, maps, and location-based services.',
      image: 'https://images.unsplash.com/photo-1592210454359-554bb97c8657?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['Vue.js', 'Express', 'OpenWeather API', 'Chart.js']),
      githubUrl: 'https://github.com/mohsinraza/weather',
      liveUrl: 'https://weather-demo.vercel.app',
      category: 'Web Development',
      featured: false,
    },
    {
      title: 'Mobile Banking App',
      description: 'A secure mobile banking application with biometric authentication and transaction management.',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['React Native', 'Node.js', 'JWT', 'PostgreSQL']),
      githubUrl: 'https://github.com/mohsinraza/banking',
      liveUrl: null,
      category: 'Mobile Development',
      featured: true,
    },
    {
      title: 'Portfolio Website',
      description: 'A modern portfolio website built with Next.js, featuring smooth animations and responsive design.',
      image: 'https://images.unsplash.com/photo-1467232004588-a771b81c9f7f?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion']),
      githubUrl: 'https://github.com/mohsinraza/portfolio',
      liveUrl: 'https://mohsinportfolio.vercel.app',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media management with real-time data visualization.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['React', 'D3.js', 'Express', 'MongoDB', 'Socket.io']),
      githubUrl: 'https://github.com/mohsinraza/social-dashboard',
      liveUrl: 'https://social-demo.vercel.app',
      category: 'Web Development',
      featured: false,
    },
    {
      title: 'Fitness Tracker Mobile App',
      description: 'A comprehensive fitness tracking application with workout plans, nutrition tracking, and progress analytics.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['React Native', 'Firebase', 'Redux', 'Chart.js', 'Node.js']),
      githubUrl: 'https://github.com/mohsinraza/fitness-tracker',
      liveUrl: null,
      category: 'Mobile Development',
      featured: true,
    },
    {
      title: 'Content Creator Platform',
      description: 'A modern platform for content creators to manage, schedule, and analyze their social media content across multiple platforms.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['Next.js', 'React', 'Prisma', 'PostgreSQL', 'Cloudinary API', 'Buffer API']),
      githubUrl: 'https://github.com/mohsinraza/content-creator',
      liveUrl: 'https://creator-platform.vercel.app',
      category: 'Web Development',
      featured: true,
    },
    {
      title: 'Advanced Calculator App',
      description: 'A sophisticated calculator application with scientific functions, graph plotting, and history tracking capabilities.',
      image: 'https://images.unsplash.com/photo-1599452819045-727c3a7e8818?w=600&h=400&fit=crop&crop=auto',
      techStack: JSON.stringify(['React', 'TypeScript', 'Math.js', 'Chart.js', 'PWA']),
      githubUrl: 'https://github.com/mohsinraza/advanced-calculator',
      liveUrl: 'https://calculator-demo.vercel.app',
      category: 'Web Development',
      featured: false,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.title.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: project,
    })
  }

  // Sample blog posts
  const blogs = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-nextjs-14',
      content: `# Getting Started with Next.js 14

Next.js 14 brings exciting new features and improvements that make building web applications even better.

## What's New?

### Server Components
Server Components are now the default, providing better performance out of the box.

### Improved Performance
- Faster builds
- Better caching
- Optimized bundle sizes

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Conclusion

Next.js 14 is a significant step forward for the React ecosystem...`,
      excerpt: 'Learn about the exciting new features in Next.js 14 and how to get started with your next project.',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop&crop=auto',
      published: true,
    },
    {
      title: 'Building Responsive Design with Tailwind CSS',
      slug: 'responsive-design-tailwind',
      content: `# Building Responsive Design with Tailwind CSS

Tailwind CSS makes building responsive designs incredibly simple and efficient.

## Mobile-First Approach

Always start with mobile designs and progressively enhance for larger screens.

\`\`\`html
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Content -->
  </div>
</div>
\`\`\`

## Best Practices

- Use semantic HTML
- Test on real devices
- Optimize images
- Consider touch interactions

## Conclusion

Tailwind's utility-first approach makes responsive design a breeze...`,
      excerpt: 'Discover how to create beautiful responsive designs using Tailwind CSS utility classes.',
      coverImage: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=600&h=400&fit=crop&crop=auto',
      published: true,
    },
    {
      title: 'Modern Web Development with TypeScript',
      slug: 'modern-web-development-typescript',
      content: `# Modern Web Development with TypeScript

TypeScript has become an essential tool for building robust and maintainable web applications.

## Why TypeScript?

### Type Safety
Catch errors at compile time instead of runtime
Better IDE support with autocompletion
Improved code documentation

### Advanced Features
- Generics
- Decorators
- Advanced type inference
- Intersection and union types

## Getting Started

\`\`\`bash
npm install typescript @types/node @types/react @types/react-dom
npx tsc --init
\`\`\`

## Conclusion

TypeScript elevates JavaScript development to the next level...`,
      excerpt: 'Explore how TypeScript can improve your web development workflow and code quality.',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop&crop=auto',
      published: true,
    },
    {
      title: 'Database Design with Prisma ORM',
      slug: 'database-design-prisma-orm',
      content: `# Database Design with Prisma ORM

Prisma makes database access safe, fast, and easy with type-safe database access.

## What is Prisma?

Prisma is an open-source next-generation ORM that consists of:
- Prisma Client: Auto-generated and type-safe query builder
- Prisma Migrate: Declarative data modeling and migrations
- Prisma Studio: Visual database browser

## Key Features

- Type safety at compile time
- Auto-completion in IDEs
- Better developer experience
- Database migrations
- Visual database tools

## Schema Example

\`\`\`prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
\`\`\`

## Conclusion

Prisma simplifies database work while maintaining type safety...`,
      excerpt: 'Learn how to design and manage databases efficiently using Prisma ORM.',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbcc31a?w=600&h=400&fit=crop&crop=auto',
      published: true,
    },
  ]

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
