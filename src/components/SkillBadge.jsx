import React from 'react'
import { motion } from 'framer-motion'

export default function SkillBadge({name,level=70}){
  return (
    <div className="w-full space-y-2">
      {/* Label and Percent */}
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-text-main transition-colors duration-300">{name}</span>
        <span className="text-xs font-bold text-accent-teal transition-colors duration-300">{level}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-bg-body rounded-full border border-gray-200/50 dark:border-white/5 overflow-hidden transition-all duration-300 relative">
        <motion.div 
          initial={{ width: 0 }} 
          whileInView={{ width: `${level}%` }} 
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }} 
          className="h-full bg-gradient-to-r from-accent-teal to-accent-purple rounded-full relative"
        >
          {/* Subtle glowing tip for a high-end feel */}
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/70 blur-xs rounded-full" />
        </motion.div>
      </div>
    </div>
  )
}
