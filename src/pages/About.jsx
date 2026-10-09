import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFromApi } from '../services/api.js'
import ServerOfflineBot from '../components/ServerOfflineBot.jsx'

export default function About(){
  const [activeTab, setActiveTab] = useState('experience')
  const [experiences, setExperiences] = useState([])
  const [strengths, setStrengths] = useState([])
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function loadAboutData() {
      const expData = await fetchFromApi('/api/experiences')
      if (expData && Array.isArray(expData)) {
        const seenRoles = new Set()
        const list = []
        expData.forEach(item => {
          const attrs = item.attributes || item
          const role = attrs.role || attrs.title || ''
          if (!role || seenRoles.has(role.toLowerCase())) return;
          seenRoles.add(role.toLowerCase())

          list.push({
            period: attrs.period || attrs.duration || '',
            role,
            description: attrs.description || attrs.desc || '',
            dotColor: attrs.dotColor || attrs.dot || 'bg-accent-teal',
            textColor: attrs.textColor || 'text-accent-teal'
          })
        })
        setExperiences(list)
        if (list.length > 0) setIsLive(true)
      } else {
        setExperiences([])
      }

      const strData = await fetchFromApi('/api/strengths')
      if (strData && Array.isArray(strData)) {
        const seenTitles = new Set()
        const list = []
        strData.forEach(item => {
          const attrs = item.attributes || item
          const title = attrs.title || ''
          if (!title || seenTitles.has(title.toLowerCase())) return;
          seenTitles.add(title.toLowerCase())

          list.push({
            title,
            desc: attrs.desc || attrs.description || '',
            dot: attrs.dot || attrs.dotColor || 'bg-accent-teal'
          })
        })
        setStrengths(list)
      } else {
        setStrengths([])
      }
    }
    loadAboutData()
  }, [])

  return (
    <>
      <section id="about" className="py-20 space-y-16">
        {/* Intro Section - 2 Column Grid (Bio Text on Left, 5+ Years Card on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
              About Me
            </h2>
            <div className="space-y-4 text-text-muted text-base md:text-lg leading-relaxed font-sans transition-colors duration-300">
              <p>
                "If it's complex, tedious, or critical, that's my lane."
              </p>
              <p>
                Software Engineer experienced in building real, production-grade systems—from multi-tenant SaaS platforms to AI automation and robust backend APIs. I specialize in turning complex ideas into scalable products using Python, Django, React, and DevOps, while teaching developers to ship their own through live courses and source code.
              </p>
            </div>
          </div>

          {/* Right Column: Animated Floating "5+ Years Experience" Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="w-full max-w-sm"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.04 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="w-full p-8 rounded-3xl border border-white/15 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group shadow-2xl shadow-black/85 transition-all duration-300 cursor-pointer hover:border-accent-teal/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(23,162,184,0.3)] text-white"
                style={{
                  background: 'radial-gradient(ellipse 95% 70% at 50% 0%, #303746 0%, #151924 45%, #080a11 100%)',
                  boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
                }}
              >
                {/* Top Spotlight Radial Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-36 bg-gradient-to-b from-white/10 to-transparent blur-xl pointer-events-none -z-10" />

                {/* Subtle Hover Aura Glow */}
                <div className="absolute inset-0 bg-accent-teal/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10" />

                {/* Circular Icon Badge */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-full bg-accent-teal/15 border border-accent-teal/40 flex items-center justify-center text-accent-teal group-hover:bg-accent-teal group-hover:text-white group-hover:border-accent-teal transition-all duration-300 shadow-lg shadow-accent-teal/20"
                >
                  {/* Briefcase Icon */}
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>

                {/* Stat Counter with Brand Accent Teal */}
                <div className="text-5xl sm:text-6xl font-extrabold font-display text-accent-teal drop-shadow-[0_2px_15px_rgba(23,162,184,0.5)] tracking-tight group-hover:scale-105 transition-transform duration-300">
                  5+
                </div>

                {/* Label */}
                <p className="text-base sm:text-lg font-bold text-white tracking-wide font-sans group-hover:text-accent-teal transition-colors duration-300">
                  Years Experience
                </p>

                {/* Animated Accent Underline */}
                <div className="w-16 h-1 bg-accent-teal rounded-full opacity-80 group-hover:w-28 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_rgba(23,162,184,0.6)]" />
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Tabs System: Work Experience vs Core Strengths */}
        <div className="space-y-6">
          <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6 pb-px">
            {['experience', 'strengths'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold font-display uppercase tracking-wider relative transition-colors duration-300 ${activeTab === tab ? 'text-accent-teal' : 'text-text-muted hover:text-text-main'
                  }`}
              >
                {tab === 'experience' ? 'Work Experience' : 'Core Strengths'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabBorder"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-teal"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {activeTab === 'experience' ? (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="relative border-l-2 border-gray-200 dark:border-gray-800 pl-6 ml-3 space-y-8">
                    {experiences.length > 0 ? (
                      experiences.map((exp, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full ${exp.dotColor || 'bg-accent-teal'} border-4 border-bg-body transition-all`} />
                          <div>
                            <span className={`text-xs font-bold ${exp.textColor || 'text-accent-teal'} uppercase tracking-widest`}>{exp.period}</span>
                            <h4 className="text-xl font-bold text-text-main font-display">{exp.role}</h4>
                            <p className="text-text-muted mt-2 text-sm leading-relaxed max-w-2xl">
                              {exp.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <ServerOfflineBot 
                        title="Server Offline" 
                        message="Could not load work experience." 
                      />
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="strengths"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className={strengths.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : ""}
                >
                  {strengths.length > 0 ? (
                    strengths.map((s, idx) => (
                      <div key={idx} className="glass-card p-6 rounded-2xl space-y-1.5 group hover:border-accent-teal/30 transition-all duration-300">
                        <h4 className="font-bold text-text-main font-display text-lg group-hover:text-accent-teal transition-colors duration-300">{s.title}</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                      </div>
                    ))
                  ) : (
                    <ServerOfflineBot 
                      title="Server Offline" 
                      message="Could not load core strengths." 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* What I Do Cards Section */}
        <div className="space-y-8">
          <h3 className="text-2xl md:text-3xl font-bold text-text-main font-display text-center">Services & Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: AI & Automation Tools */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-accent-teal/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-accent-teal transition-colors duration-300">
                AI & Automation Tools
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Building custom AI-powered workflows, automated bots, LLM integrations, and intelligent agent systems to streamline complex operations.
              </p>
            </div>

            {/* Card 2: Frontend Engineering */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-accent-purple/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-accent-purple transition-colors duration-300">
                Frontend Engineering
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Building high-performance user interfaces and responsive web applications using React.js, Next.js and Vite.
              </p>
            </div>

            {/* Card 3: Backend Architectures */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-accent-teal/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-accent-teal transition-colors duration-300">
                Backend Architectures
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Architecting production-ready RESTful APIs, asynchronous task queues, and secure backends using Python, Node.js and FastAPI.
              </p>
            </div>

            {/* Card 4: Mobile Development */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-rose-400/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-rose-400 transition-colors duration-300">
                Mobile Development
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Building cross-platform mobile experiences with React Native and Java tailored for iOS and Android.
              </p>
            </div>

            {/* Card 5: Database & Payment Integrations */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-emerald-400/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-emerald-400 transition-colors duration-300">
                Database & Payment Integrations
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Designing relational database schemas with PostgreSQL & Supabase, integrated with escrow and payment systems like Paystack, stripe and Flutterwave.
              </p>
            </div>

            {/* Card 6: Cloud & DevOps Deployment */}
            <div className="glass-card p-6 md:p-7 rounded-2xl space-y-3 group hover:border-cyan-400/40 transition-all duration-300">
              <h4 className="text-lg md:text-xl font-bold text-text-main font-display group-hover:text-cyan-400 transition-colors duration-300">
                Cloud & DevOps Deployment
              </h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Deploying, configuring, and maintaining production applications on AWS (EC2), Render, Vercel, and Supabase with automated CI/CD pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
