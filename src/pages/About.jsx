import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from "../components/ima-and/ima2..jpg"
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromStrapi } from '../services/api.js'
import SEO from '../components/SEO'

const MOCK_EXPERIENCES = [
  {
    period: '2024 - Present',
    role: 'Full Stack Developer',
    description: 'Building complex, responsive React applications powered by scalable backend technologies. Focus on performance tuning, fluid state transitions, and responsive mobile architecture.',
    dotColor: 'bg-accent-teal',
    textColor: 'text-accent-teal'
  },
  {
    period: '2022 - 2024',
    role: 'Mobile App Developer',
    description: 'Designed, engineered, and maintained cross-platform mobile applications. Optimized performance, implemented complex UI/UX designs, and guaranteed seamless user experiences across devices.',
    dotColor: 'bg-accent-purple',
    textColor: 'text-accent-purple'
  },
  {
    period: '2020 - 2022',
    role: 'Frontend Developer (Freelance)',
    description: 'Created highly responsive landing pages and custom websites. Partnered closely with international clients to deliver pixel-perfect user interfaces and custom assets.',
    dotColor: 'bg-gray-400 dark:bg-gray-600',
    textColor: 'text-text-muted'
  }
]

const MOCK_STRENGTHS = [
  { title: 'Problem Solving', desc: 'Capable of tracing performance bottlenecks, refactoring legacy architecture, and structuring logical processes.', dot: 'bg-accent-teal' },
  { title: 'Performance Optimization', desc: 'Focus on minifying client bundles, optimizing image resources, caching API calls, and maintaining 60FPS animations.', dot: 'bg-accent-teal' },
  { title: 'Responsive Design', desc: 'Developing fluid and pixel-perfect mobile-first designs matching complex device layouts.', dot: 'bg-accent-purple' },
  { title: 'Effective Collaboration', desc: 'Strong partner communicator. Able to clarify user stories, provide visual guides, and coordinate development.', dot: 'bg-accent-purple' }
]

export default function About(){
  const [activeTab, setActiveTab] = useState('experience')
  const [experiences, setExperiences] = useState(MOCK_EXPERIENCES)
  const [strengths, setStrengths] = useState(MOCK_STRENGTHS)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function loadAboutData() {
      const expData = await fetchFromStrapi('/api/experiences')
      if (expData && Array.isArray(expData)) {
        const list = expData.map(item => {
          const attrs = item.attributes || item
          return {
            period: attrs.period || attrs.duration || '',
            role: attrs.role || attrs.title || '',
            description: attrs.description || attrs.desc || '',
            dotColor: attrs.dotColor || attrs.dot || 'bg-accent-teal',
            textColor: attrs.textColor || 'text-accent-teal'
          }
        })
        setExperiences(list)
        setIsLive(true)
      }

      const strData = await fetchFromStrapi('/api/strengths')
      if (strData && Array.isArray(strData)) {
        const list = strData.map(item => {
          const attrs = item.attributes || item
          return {
            title: attrs.title || '',
            desc: attrs.desc || attrs.description || '',
            dot: attrs.dot || attrs.dotColor || 'bg-accent-teal'
          }
        })
        setStrengths(list)
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
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Bio info */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
              About Me
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <CmsStatus isLive={isLive} isLoading={false} />
            </div>
            <div className="space-y-4 text-text-muted text-base leading-relaxed font-sans transition-colors duration-300">
              <p>
                I'm Anayolico — a passionate Web Developer and Mobile App Developer dedicated to crafting modern, responsive, and beautifully animated web and mobile experiences. With a keen eye for UX/UI and a strong foundation in both frontend and mobile development, I transform complex requirements into elegant, performant solutions.
              </p>
              <p>
                My approach combines technical excellence with creative design thinking. I believe in writing clean, maintainable code and creating interfaces that not only look stunning but are also intuitive, fast, and accessible to everyone.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {['HTML5', 'CSS3', 'JavaScript', 'React.js', 'React Native', 'Node.js', 'Git', 'Next.js'].map(s => (
                <span
                  key={s}
                  className="px-3.5 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-semibold text-accent-teal hover:border-accent-purple/50 hover:text-accent-purple transition-all duration-300 cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Premium rotating profile card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              className="w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-gradient-to-br from-accent-teal to-accent-purple p-1 flex items-center justify-center shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring' }}
            >
              {/* Overlay border animation effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-teal opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-full h-full rounded-[2.35rem] bg-bg-surface flex items-center justify-center overflow-hidden z-10 transition-colors duration-300">
                <img
                  src={image1}
                  alt="Anayolico"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
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
            {/* Card 1 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-brand-navy flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-teal-rgb),0.25)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-teal-rgb),0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-teal-rgb),0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">UI/UX & Web Design</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Designing immersive digital interfaces using fluid layouts, custom brand systems, and engaging micro-animations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-brand-navy flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-purple-rgb),0.25)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-purple-rgb),0.2)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-purple-rgb),0.35)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9.4 16.6L4.8 12l-1.4 1.4L9.4 19 21 7.4 19.6 6z" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Frontend Engineering</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Developing rich single-page interfaces and responsive server-side web builds utilizing React.js, Tailwind, and Vite.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-6 rounded-2xl space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-teal to-accent-purple flex items-center justify-center text-white transition-all duration-300 shadow-[0_8px_20px_rgba(var(--color-accent-teal-rgb),0.18)] dark:shadow-[0_8px_24px_rgba(var(--color-accent-purple-rgb),0.18)] group-hover:scale-105 group-hover:shadow-[0_8px_25px_rgba(var(--color-accent-teal-rgb),0.25)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-text-main font-display">Backend Architectures</h4>
              <p className="text-text-muted text-sm leading-relaxed">
                Formulating scalable data APIs, handling secure user authorization, and orchestrating mobile integrations with Node and React Native.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
