import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Typewriter from '../components/Typewriter'

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

            {/* Subtitle with Auto-Typing & Backspacing Animation */}
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-main/90 font-display min-h-[1.6em] flex items-center justify-center lg:justify-start"
            >
              <Typewriter
                words={[
                  'Full-stack Web & Mobile Developer',
                  'SaaS Product Builder & Engineer',
                  'React.js & Node.js Architecture Specialist',
                  'Python FastAPI & Cloud API Developer',
                  'UI/UX & Interactive Web Engineer'
                ]}
              />
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
              <a href="/cv" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full px-4 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 text-white text-xs sm:text-base font-semibold shadow-lg shadow-accent-teal/25 hover:shadow-accent-teal/40 hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>View Executive CV</span>
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

          {/* Right Column: Premium Circular Hero Portrait (Matching Reference Design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0"
          >
            {/* Ambient Background Glows */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-accent-teal/30 via-cyan-400/20 to-accent-purple/30 blur-3xl -z-10 animate-pulse" />
            <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-amber-400/10 blur-2xl -z-10" />

            {/* Main Portrait Wrapper with Outer Glowing Arc Ring */}
            <div className="relative flex items-center justify-center">

              {/* Decorative Arc Accent Ring around Circle (Matching Reference Image) */}
              <svg
                className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] pointer-events-none text-accent-teal/40 animate-[spin_40s_linear_infinite]"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="12 8 60 12"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="url(#accent-grad)"
                  strokeWidth="2.5"
                  strokeDasharray="40 180"
                />
                <defs>
                  <linearGradient id="accent-grad" x1="0" y1="0" x2="200" y2="200">
                    <stop offset="0%" stopColor="#17A2B8" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#6A5ACD" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Circular Frame & Photo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] rounded-full p-2.5 bg-gradient-to-b from-accent-teal/40 via-amber-400/30 to-accent-purple/40 shadow-[0_20px_60px_rgba(23,162,184,0.25)] flex items-center justify-center overflow-visible"
              >
                {/* Photo container */}
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10 bg-slate-900 shadow-inner relative">
                  <img
                    src="/caleb-profile.jpg"
                    alt="Caleb Anayolico"
                    className="w-full h-full object-cover object-top scale-105 hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Subtle portrait gradient overlay at the bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating "Hello, I'm Caleb." Pill Badge (Exact Reference Recreation) */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-accent-teal/40 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2 whitespace-nowrap cursor-default group"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-sm sm:text-base font-semibold font-display tracking-tight text-slate-800 dark:text-white group-hover:text-accent-teal transition-colors">
                    Hello, I'm <span className="bg-gradient-to-r from-accent-teal via-cyan-400 to-accent-purple bg-clip-text text-transparent">Caleb</span>.
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

