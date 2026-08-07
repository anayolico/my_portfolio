import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'

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
      <SEO
        title="About | Anayolico"
        description="Learn more about Caleb Anayolico, a Web Developer and Mobile App Developer with a keen eye for UX/UI."
        keywords="Anayolico, Caleb Anayolico, Anayo, About, Web Developer, UX, UI, Resume, Experience"
        url="/about"
      />
      <section id="about" className="py-20 space-y-16">
        {/* Intro Section - 2 Column Grid (Bio Text on Left, 5+ Years Card on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bio Text */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
              About Me
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <CmsStatus isLive={isLive} isLoading={false} />
            </div>
            <div className="space-y-4 text-text-muted text-base md:text-lg leading-relaxed font-sans transition-colors duration-300">
              <p>
                I’m Caleb Anayolico — a Full-Stack Software Engineer and Mobile Developer passionate about building high-impact digital products. With expertise spanning client-side interfaces (React.js, Next.js, React Native) and robust backends (Node.js, Python FastAPI, Java), I transform complex ideas into elegant, secure, and performant solutions.
              </p>
              <p>
                My engineering philosophy centers on clean maintainable code, optimized database structures (PostgreSQL, Prisma, MongoDB), and user-centric UI/UX design. Whether building secure payment integrations (Paystack, Flutterwave) or cloud deployments, I deliver scalable software built for real-world growth.
              </p>
            </div>
          </div>

          {/* Right Column: Animated Floating "5+ Years Experience" Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
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
              whileHover={{ y: -14, scale: 1.04 }}
              className="w-full max-w-sm glass-card p-8 rounded-3xl border border-accent-teal/30 dark:border-accent-teal/20 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group shadow-[0_20px_50px_rgba(23,162,184,0.2)] hover:shadow-[0_25px_60px_rgba(23,162,184,0.35)] transition-all duration-500 cursor-pointer"
            >
              {/* Pulsing Ambient Backdrop Glow */}
              <div className="absolute -inset-10 bg-gradient-to-tr from-accent-teal/30 via-cyan-400/20 to-amber-400/30 rounded-full blur-2xl -z-10 animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-teal/10 to-amber-400/10 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Pulsing Circular Icon Badge */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-accent-teal/15 border border-accent-teal/40 flex items-center justify-center text-accent-teal group-hover:bg-accent-teal group-hover:text-white transition-all duration-500 shadow-lg shadow-accent-teal/20"
              >
                {/* Briefcase Icon */}
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>

              {/* Bold Animated Stat Counter */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-5xl sm:text-6xl font-extrabold font-display bg-gradient-to-r from-accent-teal via-cyan-400 to-amber-400 bg-clip-text text-transparent drop-shadow-md tracking-tight"
              >
                5+
              </motion.div>

              {/* Label */}
              <p className="text-base sm:text-lg font-bold text-text-main tracking-wide font-sans group-hover:text-accent-teal transition-colors duration-300">
                Years Experience
              </p>

              {/* Animated Accent Underline */}
              <div className="w-16 h-1 bg-gradient-to-r from-accent-teal via-cyan-400 to-amber-400 rounded-full opacity-70 group-hover:w-28 group-hover:opacity-100 transition-all duration-500 shadow-sm" />
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
                    {experiences.map((exp, idx) => (
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
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="strengths"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {strengths.map((s, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl flex gap-4 items-start">
                      <div className={`w-3 h-3 rounded-full ${s.dot || 'bg-accent-teal'} mt-1.5 flex-shrink-0`} />
                      <div className="space-y-1">
                        <h4 className="font-bold text-text-main font-display text-lg">{s.title}</h4>
                        <p className="text-sm text-text-muted leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* What I Do Cards Section */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-text-main font-display text-center">Services & Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: UI/UX & Web Design */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-cyan flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-teal-rgb),0.25)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-teal-rgb),0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-teal-rgb),0.35)]">
                {/* Palette Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.61 0-.43-.17-.83-.44-1.12-.27-.29-.44-.69-.44-1.12 0-.89.72-1.61 1.61-1.61H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/>
                  <circle cx="7.5" cy="11.5" r=".75" fill="currentColor"/>
                  <circle cx="12" cy="7.5" r=".75" fill="currentColor"/>
                  <circle cx="16.5" cy="11.5" r=".75" fill="currentColor"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">UI/UX & Web Design</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Designing immersive digital interfaces, wireframes, and fluid visual systems with micro-animations.
              </p>
            </div>

            {/* Card 2: Frontend Engineering */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-purple-rgb),0.25)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-purple-rgb),0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-purple-rgb),0.35)]">
                {/* Code Brackets Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Frontend Engineering</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Building lightning-fast single-page apps (SPAs) and SSR platforms using React.js, Next.js, and Vite.
              </p>
            </div>

            {/* Card 3: Backend Architectures */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-purple flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-teal-rgb),0.18)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-purple-rgb),0.18)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-teal-rgb),0.25)]">
                {/* Server Stack Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Backend Architectures</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Formulating scalable RESTful APIs, secure OAuth authorization systems, and server pipelines with Node.js and FastAPI.
              </p>
            </div>

            {/* Card 4: Mobile Development */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-rose-500 flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-purple-rgb),0.25)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-purple-rgb),0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-purple-rgb),0.35)]">
                {/* Smartphone Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2.5" ry="2.5"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Mobile Development</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Building cross-platform mobile experiences with React Native and Java tailored for iOS and Android.
              </p>
            </div>

            {/* Card 5: Database & Payment Integrations */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-accent-teal flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(16,185,129,0.25)] dark:shadow-[0_8px_24px_rgba(16,185,129,0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(16,185,129,0.35)]">
                {/* Database & Card Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Database & Payment Integrations</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Architecting relational schemas with PostgreSQL & Prisma, and implementing Paystack and Flutterwave checkouts.
              </p>
            </div>

            {/* Card 6: Cloud & DevOps Deployment */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-teal flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(6,182,212,0.25)] dark:shadow-[0_8px_24px_rgba(6,182,212,0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(6,182,212,0.35)]">
                {/* Cloud Upload Icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Cloud & DevOps Deployment</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Deploying, mapping custom domains, and monitoring live apps across Vercel, Render, Host Africa, and Supabase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
