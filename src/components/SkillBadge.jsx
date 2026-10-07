import React from 'react'
import { getTechIcon } from './TechIcons.jsx'

export default function SkillBadge({ name, level = 80 }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-card border border-gray-200/60 dark:border-white/10 hover:border-accent-teal/50 dark:hover:border-accent-teal/50 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-accent-teal/10 hover:-translate-y-1 select-none flex-shrink-0 cursor-default group backdrop-blur-md">
      {/* Real Tech Icon */}
      <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 p-0.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
        {getTechIcon(name, 'w-5 h-5')}
      </div>

      {/* Tech Name */}
      <span className="font-semibold text-sm md:text-base text-text-main whitespace-nowrap tracking-tight transition-colors duration-300">
        {name}
      </span>

      {/* Percentage Badge */}
      {level !== undefined && level !== null && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-teal/10 dark:bg-accent-teal/20 text-accent-teal border border-accent-teal/30 ml-1 whitespace-nowrap shadow-xs">
          {level}%
        </span>
      )}
    </div>
  )
}
