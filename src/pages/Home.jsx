import React from 'react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'
import Typewriter from '../components/Typewriter'
import { LiquidButton, GlassFilter } from '../components/ui/liquid-glass-button'

export default function Home() {
  return (
    <>
      <SEO
        title="CaleByte | Full-Stack & Backend Software Engineer | SaaS & Mobile Architect"
        description="Official portfolio of CaleByte (CaleByte Technologies) — Full-Stack & Backend Software Engineer, Mobile Application Developer, and Cloud Infrastructure Architect specializing in scalable SaaS systems, React, Node.js, Python FastAPI, and PostgreSQL."
        keywords="CaleByte, CaleByte Technologies, CaleByte Technology, Caleb Anayolico, Caleb Anayo, Full-Stack Engineer, Backend Engineer, Mobile Application Developer, Cloud Infrastructure Architect, SaaS Products, React, Node.js, Python FastAPI, PostgreSQL, Nigeria"
        url="/"
      />
      <section id="home" className="pt-36 sm:pt-40 md:pt-44 pb-20 md:pb-32 relative overflow-hidden">
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

            {/* Main Title Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-main font-display leading-[1.1]"
            >
              Hi, I’m{' '}
              <span>
                Cale<span className="text-accent-teal">Byte</span>
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
              Software Engineer specializing in scalable SaaS products, custom backend APIs, and AI automation. I also create hands-on courses teaching developers how to build and launch them independently.
            </motion.p>

            {/* CTA Buttons - Professional & Neatly Grouped Together */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <a href="/cv">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-teal to-cyan-500 text-white text-sm sm:text-base font-semibold shadow-lg shadow-accent-teal/25 hover:shadow-accent-teal/40 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Download CV</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </motion.button>
              </a>

              <a href="#contact" className="inline-block">
                <LiquidButton
                  className="px-6 sm:px-8 py-3.5 h-auto rounded-full border border-white/10 dark:border-white/15 text-text-main dark:text-white hover:border-accent-teal text-sm sm:text-base font-semibold flex items-center justify-center cursor-pointer whitespace-nowrap bg-black/20 dark:bg-black/40 backdrop-blur-md transition-all"
                >
                  Let’s Talk
                </LiquidButton>
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

                {/* Floating "Hello, I'm CaleByte." Liquid Glass Pill Badge (21st.dev Exact Recreation) */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full flex items-center gap-2.5 whitespace-nowrap cursor-default group overflow-hidden select-none bg-black/60 dark:bg-black/75 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                >
                  {/* Liquid Glass Highlight & Inset Shadow Layers */}
                  <div className="absolute inset-0 z-0 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.12),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all pointer-events-none" />
                  
                  {/* Liquid Glass Distortion Filter Layer */}
                  <div
                    className="absolute inset-0 isolate -z-10 overflow-hidden rounded-full pointer-events-none"
                    style={{ backdropFilter: 'url("#container-glass")' }}
                  />

                  {/* Badge Content without green dot */}
                  <div className="relative z-10 flex items-center justify-center">
                    <span className="text-sm sm:text-base font-semibold font-display tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      Hello, I'm Cale<span className="text-accent-teal font-bold">Byte</span>.
                    </span>
                  </div>


                  <GlassFilter />
                </motion.div>


              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

