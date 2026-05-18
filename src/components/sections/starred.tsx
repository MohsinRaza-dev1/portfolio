'use client'

import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'

export function Starred() {
  return (
    <section id="starred" className="py-20 px-6 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Starred Items
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your favorite and most important projects and content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 text-center"
        >
          <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500 opacity-50" />
          <h3 className="text-xl font-semibold mb-3">No starred items yet</h3>
          <p className="text-muted-foreground mb-6">
            Star your favorite projects and content to see them here
          </p>
          <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
            Browse Projects
          </button>
        </motion.div>
      </div>
    </section>
  )
}
