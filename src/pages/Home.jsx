import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

export default function Home() {
  return (
    <>
      <SEO
        title="Caleb Anayolico | Full-Stack Engineer & SaaS Builder"
        description="Official portfolio of Caleb Anayolico, Full-Stack Engineer & SaaS Builder specializing in React.js, Node.js, Python FastAPI, WebAuthn biometrics, and high-performance web & mobile architectures."
        keywords="Caleb Anayolico, Anayolico, Caleb Anayo, Anayolico Portfolio, Full-Stack Engineer, SaaS Builder, Web Developer, Mobile App Developer, Nigeria SecureVote"
        url="/"
      />
      <section id="home" className="pt-28 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Ambient glowing background blur spots */}
        <div className="absolute left-[-10%] top-10 -z-10 w-[450px] h-[450px] bg-accent-teal/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute right-[-10%] bottom-10 -z-10 w-[450px] h-[450px] bg-accent-purple/15 rounded-full blur-[120px] pointer-events-none" />

        {/* 2-Column Responsive Grid Layout (Matching Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-7xl mx-auto px-4 sm:px-6">
          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-xs md:text-sm font-semibold backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              Available for full-time roles & collaboration
            </motion.div>

            {/* Main Title Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-main font-display leading-[1.1]"
            >
              Hi, I’m{' '}
              <span className="bg-gradient-to-r from-accent-teal via-cyan-400 to-accent-purple bg-clip-text text-transparent drop-shadow-sm">
                Caleb Anayolico
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-main/90 font-display"
            >
              Full-stack Web & Mobile Developer
            </motion.h2>

            {/* Paragraph Bio */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-text-muted text-base md:text-lg leading-relaxed max-w-xl font-sans mx-auto lg:mx-0"
            >
              I engineer modern, high-performance web and mobile applications with polished user interfaces, seamless animations, and clean, scalable backend architectures.
            </motion.p>

            {/* CTA Buttons - One Line on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-row justify-center lg:justify-start items-center gap-3 pt-2 w-full max-w-md mx-auto lg:mx-0"
            >
              <a href="#projects" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full px-4 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 text-white text-xs sm:text-base font-semibold shadow-lg shadow-accent-teal/25 hover:shadow-accent-teal/40 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Explore Projects</span>
                  <svg className="w-4 h-4 hidden sm:inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </a>

              <a href="#contact" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full px-4 sm:px-8 py-3.5 rounded-2xl border border-accent-teal/40 text-text-main hover:bg-accent-teal/10 hover:border-accent-teal transition-all text-xs sm:text-base font-semibold justify-center text-center cursor-pointer whitespace-nowrap"
                >
                  Let’s Talk
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Animated 3D Tech Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0"
          >
            {/* Soft backdrop glow ring */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-accent-teal/20 to-accent-purple/20 blur-2xl -z-10 animate-pulse" />

            {/* Main Floating 3D Graphic */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [0, 1.5, 0, -1.5, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full max-w-md p-4 glass-card rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-[0_20px_50px_rgba(23,162,184,0.12)] flex items-center justify-center overflow-hidden group"
            >
              <img
                src="/hero-3d.png"
                alt="3D Developer Workstation Illustration"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating tech badge 1 (Top Left) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-6 left-6 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-accent-teal/30 text-accent-teal text-xs font-mono font-bold shadow-lg flex items-center gap-1.5"
              >
                <span className="text-cyan-400">&lt;/&gt;</span> Clean Code
              </motion.div>

              {/* Floating tech badge 2 (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-6 right-6 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-accent-purple/30 text-accent-purple text-xs font-mono font-bold shadow-lg flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Full-Stack Architecture
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

