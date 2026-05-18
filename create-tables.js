const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTablesAndData() {
  try {
    console.log('🔧 Creating database tables...');
    
    // Create tables using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "projects" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "techStack" TEXT NOT NULL,
        "githubUrl" TEXT,
        "liveUrl" TEXT,
        "category" TEXT NOT NULL,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "blogs" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "excerpt" TEXT NOT NULL,
        "coverImage" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id"),
        UNIQUE ("slug")
      )
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "reply" TEXT,
        "repliedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("id")
      )
    `;
    
    console.log('✅ Tables created successfully');
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.adminUser.create({
      data: {
        id: 'admin-' + Date.now(),
        username: 'admin',
        password: hashedPassword,
      },
    });
    
    console.log('✅ Admin user created:', admin.username);
    
    // Create sample projects
    console.log('Creating sample projects...');
    const projects = [
      {
        id: 'ecommerce-platform',
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
        id: 'portfolio-website',
        title: 'Portfolio Website',
        description: 'A modern portfolio website built with Next.js, featuring smooth animations and responsive design.',
        image: 'https://images.unsplash.com/photo-1467232004588-a771b81c9f7f?w=600&h=400&fit=crop&crop=auto',
        techStack: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion']),
        githubUrl: 'https://github.com/mohsinraza/portfolio',
        liveUrl: 'https://mohsinportfolio.vercel.app',
        category: 'Web Development',
        featured: true,
      }
    ];

    for (const project of projects) {
      await prisma.project.upsert({
        where: { id: project.id },
        update: {},
        create: project,
      });
    }
    
    console.log(`✅ Created ${projects.length} sample projects`);
    
    // Create sample blog posts
    console.log('Creating sample blog posts...');
    const blogs = [
      {
        id: 'getting-started-nextjs-14',
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
      }
    ];

    for (const blog of blogs) {
      await prisma.blog.upsert({
        where: { id: blog.id },
        update: {},
        create: blog,
      });
    }
    
    console.log(`✅ Created ${blogs.length} sample blog posts`);
    
    // Create a sample contact message to test reply functionality
    console.log('Creating sample contact message...');
    const sampleMessage = await prisma.contactMessage.create({
      data: {
        id: 'sample-' + Date.now(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'Hi! I love your portfolio. I was wondering if you are available for freelance work?',
      },
    });
    
    console.log('✅ Created sample contact message');
    console.log('Message ID:', sampleMessage.id);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n🔑 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n📧 Sample message created for testing reply functionality');
    console.log('   Message ID:', sampleMessage.id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTablesAndData();
