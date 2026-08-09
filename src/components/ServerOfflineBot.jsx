import React from 'react'
import { motion } from 'framer-motion'

export default function ServerOfflineBot({ title = "Server Offline", message = "Could not connect to the database." }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 text-center max-w-md mx-auto space-y-6 relative"
    >
      {/* Soft Pulsing Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent-teal/20 via-cyan-500/10 to-amber-500/20 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Animated AI Bot Head */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 mx-auto relative flex items-center justify-center"
      >
        {/* Robot Antenna LED */}
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-amber-300 absolute -top-3 shadow-lg shadow-amber-400/80 z-10"
        />
        <div className="w-1.5 h-4 bg-slate-700 absolute -top-1" />

        {/* Robot Head Body */}
        <div className="w-28 h-24 rounded-3xl bg-slate-900 border-2 border-accent-teal/40 shadow-2xl p-3 flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-xl">
          {/* Visor Display */}
          <div className="w-full h-12 rounded-2xl bg-slate-950 border border-accent-teal/30 p-2 flex items-center justify-around relative">
            {/* Animated Pupils Looking Left & Right */}
            <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2.5 h-2.5 rounded-full bg-accent-teal shadow-md shadow-accent-teal"
              />
            </div>
            <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center overflow-hidden">
              <motion.div
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2.5 h-2.5 rounded-full bg-accent-teal shadow-md shadow-accent-teal"
              />
            </div>
          </div>

          {/* Animated Digital Mouth Line */}
          <motion.div
            animate={{ width: ['40%', '70%', '40%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1 rounded-full bg-cyan-400/70 shadow-sm shadow-cyan-400"
          />
        </div>

        {/* Ear Bolts */}
        <div className="w-2 h-5 rounded-l-md bg-slate-700 absolute left-0 top-1/2 -translate-y-1/2" />
        <div className="w-2 h-5 rounded-r-md bg-slate-700 absolute right-0 top-1/2 -translate-y-1/2" />
      </motion.div>

      {/* Headline & Subtitle */}
      <div className="space-y-2 relative z-10">
        <h3 className="text-2xl font-extrabold text-text-main font-display tracking-tight flex items-center justify-center gap-2">
          <span>{title}</span>
          {/* Add a tiny bot emoji only if title doesn't already contain one (SourceCode had it originally) */}
          <span className="text-xl">🤖</span>
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
          {message}
        </p>
      </div>
    </motion.div>
  )
}
