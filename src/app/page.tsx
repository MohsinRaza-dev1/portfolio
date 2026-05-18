"use client"

import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Projects } from '@/components/sections/projects'
import { Blog } from '@/components/sections/blog'
import { Help } from '@/components/sections/help'
import { Starred } from '@/components/sections/starred'
import { Archive } from '@/components/sections/archive'
import { Trash } from '@/components/sections/trash'
import { Notifications } from '@/components/sections/notifications'
import { GetInTouch } from '@/components/sections/get-in-touch'
import { Footer } from '@/components/footer'
import { ResponsiveLayout } from '@/components/responsive-layout'

export default function Home() {
  return (
    <ResponsiveLayout>
      <div className="w-full">
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Starred />
        <Archive />
        <Trash />
        <Help />
        <Notifications />
        <GetInTouch />
        <Footer />
      </div>
    </ResponsiveLayout>
  )
}
