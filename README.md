# Mohsin Raza Portfolio

A modern, dynamic, fully responsive portfolio website built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## 🚀 Features

### Core Features
- **Landing Page**: Animated hero section with CTA buttons
- **About Section**: Bio, skills with progress bars, and CV download
- **Projects Section**: Dynamic project showcase with filtering by category
- **Blog Section**: Markdown-based blog system with individual post pages
- **Contact Section**: Functional contact form with database storage
- **Admin Panel**: Secure admin dashboard for managing projects and blog posts
- **Dark/Light Mode**: Theme toggle with system preference detection
- **Responsive Design**: Mobile-first approach, fully responsive
- **SEO Optimized**: Meta tags, structured data, and performance optimization

### Technical Features
- **Animations**: Framer Motion for smooth animations and micro-interactions
- **Database**: SQLite with Prisma ORM for data management
- **Authentication**: JWT-based admin authentication
- **API Routes**: RESTful API for dynamic content management
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, minimalist design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Markdown**: Markdown rendering
- **Lucide React**: Icon library
- **Next Themes**: Theme management

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma ORM**: Database management
- **SQLite**: Database engine
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

## 📁 Project Structure

```
mohsin-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel routes
│   │   ├── api/               # API routes
│   │   ├── blog/              # Blog pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── sections/          # Page sections
│   │   ├── footer.tsx         # Footer component
│   │   ├── navbar.tsx         # Navigation
│   │   └── theme-provider.tsx # Theme context
│   └── lib/
│       └── prisma.ts          # Prisma client
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed
├── public/                    # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mohsin-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add the following environment variables:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses the following database models:

### Project
- `id`: Unique identifier
- `title`: Project title
- `description`: Project description
- `image`: Project image URL
- `techStack`: Array of technologies used
- `githubUrl`: GitHub repository link
- `liveUrl`: Live demo link
- `category`: Project category
- `featured`: Featured project flag
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Blog
- `id`: Unique identifier
- `title`: Blog post title
- `slug`: URL-friendly slug
- `content`: Markdown content
- `excerpt`: Post excerpt
- `coverImage`: Cover image URL
- `published`: Publication status
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### ContactMessage
- `id`: Unique identifier
- `name`: Sender name
- `email`: Sender email
- `message`: Message content
- `createdAt`: Creation timestamp

### AdminUser
- `id`: Unique identifier
- `username`: Admin username
- `password`: Hashed password
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🔐 Admin Panel

### Access
- URL: `/admin`
- Default credentials:
  - Username: `admin`
  - Password: `admin123`

### Features
- **Projects Management**: Add, edit, delete projects
- **Blog Management**: Create, edit, delete blog posts
- **Authentication**: Secure login system

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- Session management

## 🎨 Customization

### Personal Information
Update the following files to personalize your portfolio:

1. **Hero Section** (`src/components/sections/hero.tsx`):
   - Name and professional title
   - Social media links
   - Hero text content

2. **About Section** (`src/components/sections/about.tsx`):
   - Personal bio
   - Skills and proficiency levels
   - CV download link

3. **Contact Section** (`src/components/sections/contact.tsx`):
   - Contact information
   - Email address
   - Phone number
   - Location

4. **SEO Metadata** (`src/app/layout.tsx`):
   - Page title and description
   - OpenGraph tags
   - Meta keywords

### Styling
- **Colors**: Modify `src/app/globals.css` and `tailwind.config.js`
- **Fonts**: Update font imports in `src/app/layout.tsx`
- **Animations**: Adjust Framer Motion settings in component files

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel link
   ```

2. **Set environment variables**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add NEXT_PUBLIC_APP_URL
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/your-username/mohsin-portfolio/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with ❤️ by Mohsin Raza
