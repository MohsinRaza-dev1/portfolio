'use client'

import { motion } from 'framer-motion'
import { HelpCircle, Mail, MessageSquare, BookOpen, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Help() {
  const { t } = useLanguage()

  return (
    <section id="help" className="py-20 px-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('help.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('help.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <Mail className="w-8 h-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-3">{t('help.emailSupport')}</h3>
            <p className="text-muted-foreground mb-4">
              Get direct help via email for technical questions and support requests
            </p>
            <a 
              href="mailto:hmohsinkhan5@gmail.com" 
              className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-2"
            >
              hmohsinkhan5@gmail.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <MessageSquare className="w-8 h-8 mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-3">{t('help.liveChat')}</h3>
            <p className="text-muted-foreground mb-4">
              Chat with our support team for immediate assistance during business hours
            </p>
            <button className="text-purple-500 hover:text-purple-600 font-medium inline-flex items-center gap-2">
              Start Chat
              <ExternalLink className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <BookOpen className="w-8 h-8 mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-3">{t('help.documentation')}</h3>
            <p className="text-muted-foreground mb-4">
              Browse our comprehensive documentation for guides and tutorials
            </p>
            <a 
              href="/docs" 
              className="text-green-500 hover:text-green-600 font-medium inline-flex items-center gap-2"
            >
              View Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-8 mb-12"
        >
          <h3 className="text-2xl font-semibold mb-6">{t('help.faq')}</h3>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h4 className="font-medium mb-2">{t('help.faq.getStarted')}</h4>
              <p className="text-muted-foreground">
                {t('help.faq.getStartedAns')}
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h4 className="font-medium mb-2">{t('help.faq.collaborate')}</h4>
              <p className="text-muted-foreground">
                {t('help.faq.collaborateAns')}
              </p>
            </div>
            <div className="border-b border-border pb-4">
              <h4 className="font-medium mb-2">{t('help.faq.technologies')}</h4>
              <p className="text-muted-foreground">
                {t('help.faq.technologiesAns')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">{t('help.faq.stayUpdated')}</h4>
              <p className="text-muted-foreground">
                {t('help.faq.stayUpdatedAns')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
