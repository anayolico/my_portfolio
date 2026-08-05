import React from 'react'
import { motion } from 'framer-motion'

/**
 * A small badge that indicates whether data is live from Custom Express API
 * or falling back to local static mock data.
 */
export default function CmsStatus({ isLive, isLoading }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center justify-center p-2 rounded-full bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors"
        title="Loading from API..."
      >
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      </motion.div>
    )
  }

  if (isLive) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 transition-colors"
        title="Live from Custom API"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="inline-flex items-center justify-center p-2 rounded-full bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors"
      title="Static data"
    >
      <span className="w-2 h-2 rounded-full bg-gray-400" />
    </motion.div>
  )
}
