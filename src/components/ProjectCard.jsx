import React from 'react'
import { motion } from 'framer-motion'

export default function ProjectCard({title,desc,image='',tech=[],demoLink='#',codeLink='#'}){
  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col h-full border border-gray-200/50 dark:border-white/5 transition-colors duration-300">
      {/* Zoomable Image Container */}
      <div className="w-full h-48 rounded-2xl mb-4 overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300 relative group">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
        />
        {/* Soft shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Text Info */}
      <div className="space-y-2 flex-grow">
        <h3 className="text-xl font-bold text-text-main font-display leading-snug transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed transition-colors duration-300">
          {desc}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="flex flex-wrap gap-2 mt-4 mb-5">
        {tech.map((t)=> (
          <span 
            key={t} 
            className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-white/50 dark:bg-white/5 text-text-muted border border-gray-200 dark:border-white/5 rounded-full transition-colors duration-300"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-gray-200/50 dark:border-white/5 mt-auto transition-colors duration-300">
        <a href={codeLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-full bg-white/40 dark:bg-white/5 text-text-main border border-gray-300 dark:border-gray-700 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold flex items-center justify-center"
          >
            {/* GitHub SVG Icon */}
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub
          </motion.button>
        </a>

        <a href={demoLink} target="_blank" rel="noopener noreferrer" className="flex-1">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-full bg-accent-teal text-white font-semibold shadow-md hover:brightness-105 transition-all text-xs flex items-center justify-center"
          >
            Live Demo
            {/* External Link SVG Icon */}
            <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </motion.button>
        </a>
      </div>
    </div>
  )
}
