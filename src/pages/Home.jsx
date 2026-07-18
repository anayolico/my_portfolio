import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

export default function Home(){
  return (
    <>
      <SEO
        title="Anayolico — Web Developer & Mobile App Developer"
        description="I build modern, performant web applications with highly polished user experiences, smooth animations, and clean, modular architectures."
        keywords="Anayolico, Caleb Anayolico, Anayo, Portfolio, Web Developer, Mobile App Developer"
        url="/"
      />
      <section id="home" className="pt-40 pb-24 md:pt-52 md:pb-36 relative overflow-hidden">
        {/* Centered glowing background blobs for visual depth */}
        <div className="absolute left-[-10%] top-10 -z-10 w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-3xl opacity-60 animate-[pulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute right-[-10%] bottom-10 -z-10 w-[500px] h-[500px] bg-accent-purple/10 rounded-full blur-3xl opacity-50 animate-[pulse_8s_ease-in-out_infinite_1s]"></div>

        {/* Main Hero Container - Centered Single Column Layout */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 md:space-y-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md text-xs md:text-sm font-semibold text-text-muted transition-colors duration-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Available for new opportunities
          </motion.div>

          {/* Heading */}
          <div className="space-y-5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl md:text-8xl font-black tracking-tight text-text-main font-display leading-[1.1] transition-colors duration-300"
            >
              Hi, I’m <br className="sm:hidden" />
              <span className="text-accent-teal hover:brightness-105 transition-all">
                Caleb Anayolico
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-sm md:text-base uppercase tracking-[0.25em] text-accent-teal font-extrabold"
            >
              Web Developer & Mobile App Developer
            </motion.p>
          </div>

          {/* Bio Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-text-muted leading-relaxed max-w-3xl font-sans transition-colors duration-300 font-light"
          >
            I build modern, performant web applications with highly polished user experiences, smooth animations, and clean, modular architectures.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <a href="#projects">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-full bg-accent-teal text-white text-base md:text-lg font-bold shadow-lg shadow-accent-teal/10 hover:shadow-accent-teal/20 hover:brightness-105 transition-all"
              >
                Explore Projects
              </motion.button>
            </a>
            <a href="#contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-full border border-gray-300 dark:border-gray-700 text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-all text-base md:text-lg font-bold"
              >
                Let’s Talk
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
