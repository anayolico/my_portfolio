import React from 'react'
import { motion } from 'framer-motion'

/* SkillBadge: display skill name and progress bar */
export default function SkillBadge({name,level=70}){
  return (
    <motion.div whileHover={{ y:-6 }} className="bg-panel p-3 rounded-lg w-full md:w-60 neon-glow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-100">{name}</span>
        <span className="text-xs text-gray-300">{level}%</span>
      </div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div initial={{ width:0 }} whileInView={{ width: `${level}%` }} transition={{duration:1}} className="h-2 bg-neon-cyan rounded-full"></motion.div>
      </div>
    </motion.div>
  )
}
