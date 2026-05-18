'use client'

import { motion } from 'framer-motion'
import { Archive as ArchiveIcon, ExternalLink } from 'lucide-react'

export function Archive() {
  return (
    <section id="archive" className="py-20 px-6 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-950/20 dark:to-slate-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <ArchiveIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent">
            Archive
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Previously completed projects and historical content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 text-center"
        >
          <ArchiveIcon className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
          <h3 className="text-xl font-semibold mb-3">Archive is empty</h3>
          <p className="text-muted-foreground mb-6">
            Old projects and content will be moved here when they're archived
          </p>
          <button className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  )
}
