import React from 'react'
import { motion } from 'framer-motion'

/* Home (Hero) Section */
export default function Home(){
  return (
    <section id="home" className="py-16">
      <div className="relative overflow-hidden rounded-xl animated-bg p-6">
        <div className="absolute inset-0 -z-10 opacity-10">
          {/* Decorative moving blobs */}
          <div className="w-80 h-80 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full blur-3xl opacity-30 absolute left-[-10%] top-[-20%] animate-[spin_40s_linear_infinite]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.h1 initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1}} className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Hi, I’m <motion.span whileHover={{ y:-6, color: '#00f0ff' }} className="text-neon-cyan">Anayolico</motion.span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}} className="mt-3 text-gray-300 max-w-xl">Web Developer & Java Programmer crafting modern, performant web applications with attention to UX and polished animations.</motion.p>

            <div className="mt-6 flex gap-4">
              <a href="#projects">
                <motion.button whileHover={{ scale: 1.03 }} className="px-5 py-3 rounded-lg bg-neon-cyan text-black font-semibold neon-glow">View Projects</motion.button>
              </a>
              <a href="#contact">
                <motion.button whileHover={{ scale: 1.03 }} className="px-5 py-3 rounded-lg border border-gray-700 text-gray-200">Contact Me</motion.button>
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <motion.div initial={{scale:0.9,opacity:0}} whileInView={{scale:1,opacity:1}} transition={{duration:0.6}} className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
              {/* Profile placeholder with subtle animation */}
              <div className="w-44 h-44 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-800" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
