import React from 'react'
import { motion } from 'framer-motion'

/* ProjectCard: visual card for projects with placeholders.
   Props: title, desc, image, tech (array), demoLink, codeLink */
export default function ProjectCard({title,desc,image='',tech=[],demoLink='#',codeLink='#'}){
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-panel rounded-xl p-5 shadow-neon floaty"
    >
      <div className="w-full h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md mb-4 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-300 mb-3">{desc}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t)=> (
          <span key={t} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">{t}</span>
        ))}
      </div>
      <div className="flex gap-3">
        <a href={demoLink} className="ml-auto" target="_blank" rel="noopener noreferrer">
          <motion.button whileHover={{ scale: 1.04 }} className="px-3 py-2 rounded bg-neon-cyan text-black font-medium shadow-md hover:brightness-105">Live Demo</motion.button>
        </a>
        <a href={codeLink} target="_blank" rel="noopener noreferrer">
          <motion.button whileHover={{ scale: 1.04 }} className="px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700">GitHub</motion.button>
        </a>
      </div>
    </motion.div>
  )
}
