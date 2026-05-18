'use client'

import { motion } from 'framer-motion'
import { Trash2 as TrashIcon, ExternalLink } from 'lucide-react'

export function Trash() {
  return (
    <section id="trash" className="py-20 px-6 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <TrashIcon className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Trash
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deleted items and content waiting for permanent removal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 text-center"
        >
          <TrashIcon className="w-12 h-12 mx-auto mb-4 text-red-500 opacity-50" />
          <h3 className="text-xl font-semibold mb-3">Trash is empty</h3>
          <p className="text-muted-foreground mb-6">
            Deleted items will appear here for 30 days before permanent removal
          </p>
          <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
            Restore Items
          </button>
        </motion.div>
      </div>
    </section>
  )
}
