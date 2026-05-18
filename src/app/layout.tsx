import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { ModernSidebar, useModernSidebar } from '@/components/modern-sidebar'
import { ModernLayoutWrapper } from '@/components/modern-layout-wrapper'
import { AdminProvider } from '@/contexts/admin-context'
import { NotificationProvider } from '@/contexts/notification-context'
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper'
import { LanguageProvider } from '@/contexts/language-context'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mohsin Raza - Full Stack Developer',
  description: 'Portfolio of Mohsin Raza, a passionate full-stack developer specializing in modern web technologies.',
  keywords: ['Mohsin Raza', 'Full Stack Developer', 'Web Developer', 'Portfolio', 'Next.js', 'React'],
  authors: [{ name: 'Mohsin Raza' }],
  openGraph: {
    title: 'Mohsin Raza - Full Stack Developer',
    description: 'Portfolio of Mohsin Raza, a passionate full-stack developer specializing in modern web technologies.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background dark:bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AdminProvider>
              <AdminLayoutWrapper>
                <AdminProvider>
                  <NotificationProvider>
                    <AnalyticsTracker />
                    {children}
                  </NotificationProvider>
                </AdminProvider>
              </AdminLayoutWrapper>
            </AdminProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
