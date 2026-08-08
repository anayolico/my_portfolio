import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.jsx'
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'

const CATEGORIES = ['All', 'React', 'Node.js', 'Next.js', 'AI']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getProjects() {
      try {
        const data = await fetchFromApi('/api/projects')
        const items = Array.isArray(data) ? data : (data?.data || [])

        if (items && items.length > 0) {
          const seenTitles = new Set()
          const mapped = []

          items.forEach(item => {
            const attrs = item.attributes || item
            const title = attrs.title || ''
            if (!title || seenTitles.has(title.toLowerCase())) return
            seenTitles.add(title.toLowerCase())

            let imageUrl = attrs.image || ''
            if (imageUrl.startsWith('/')) {
              imageUrl = `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`
            }

            let techArray = []
            if (Array.isArray(attrs.tech)) {
              techArray = attrs.tech
            } else if (attrs.tech) {
              try {
                techArray = typeof attrs.tech === 'string' ? JSON.parse(attrs.tech) : attrs.tech
              } catch (e) {
                techArray = attrs.tech.split(',').map(s => s.trim())
              }
            }

            const isWinner = title.toLowerCase().includes('securevote') || Boolean(attrs.is_hackathon)

            mapped.push({
              id: attrs.id || title,
              title,
              desc: attrs.desc || attrs.description || '',
              image: imageUrl || '',
              tech: techArray,
              demoLink: attrs.demoLink || attrs.demo_link || '#',
              codeLink: attrs.codeLink || attrs.code_link || '#',
              isHackathonWinner: isWinner
            })
          })

          // Ensure Nigeria SecureVote Gold Card is placed first at index 0 (Card #1)
          mapped.sort((a, b) => {
            if (a.isHackathonWinner) return -1
            if (b.isHackathonWinner) return 1
            return 0
          })

          setProjects(mapped)
          setIsLive(true)
        } else {
          setProjects([])
          setIsLive(false)
        }
      } catch (err) {
        console.error('Error loading projects from backend:', err)
        setIsLive(false)
      } finally {
        setLoading(false)
      }
    }
    getProjects()
  }, [])

  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'All') return true;
    return p.tech.some(t => t.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  if (loading) {
    return (
      <section id="projects" className="py-20 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">Featured Projects</h2>
          <CmsStatus isLoading={true} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/5 animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-full" />
                <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-5/6" />
                <div className="flex gap-2 pt-1">
                  <div className="h-6 w-14 bg-gray-200 dark:bg-white/5 rounded-full" />
                  <div className="h-6 w-14 bg-gray-200 dark:bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <SEO
        title="Projects | Anayolico"
        description="A showcase of recent client applications, backend architectures, and developer utilities."
        keywords="Anayolico, Caleb Anayolico, Anayo, Projects, Portfolio, Web Development, React, Node.js, Next.js"
        url="/projects"
      />
      <section id="projects" className="py-20 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
            Featured Projects
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto transition-colors duration-300">
            A showcase of recent client applications, backend architectures, and developer utilities.
          </p>
          <div className="flex justify-center">
            <CmsStatus isLive={isLive} isLoading={false} />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide border transition-all duration-300 ${activeFilter === category
                ? 'bg-accent-teal text-white border-accent-teal shadow-md'
                : 'bg-white/40 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/5 hover:border-accent-teal/50 hover:text-text-main'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid (Max 3 Cards on Homepage) */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-12">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.slice(0, 3).map(p => (
                  <motion.div
                    layout
                    key={p.id || p.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.isHackathonWinner ? (
                      <div className="glass-card p-6 rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 shadow-xl shadow-amber-500/15 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all duration-300 group relative">
                        <div className="space-y-3">
                          {/* Top Gold Pill Badge */}
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-wider font-mono">
                              🏆 HACKATHON WINNER
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80 font-mono">1ST PLACE</span>
                          </div>

                          {/* Trophy Image Preview */}
                          <div className="w-full h-44 rounded-2xl bg-black/60 border border-amber-400/30 overflow-hidden flex items-center justify-center relative aspect-video">
                            {p.image && p.image.trim().startsWith('http') ? (
                              <img src={p.image} alt="Hackathon Trophy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-950 flex flex-col items-center justify-center text-center p-3 space-y-1">
                                <span className="text-3xl">🏆</span>
                                <span className="text-xs font-bold text-amber-300 font-display">Nigeria SecureVote</span>
                                <span className="text-[10px] text-amber-400/70 font-mono">1st Place Award Winner</span>
                              </div>
                            )}
                          </div>

                          <h3 className="text-xl font-extrabold text-white font-display leading-tight group-hover:text-amber-400 transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-xs text-amber-200/80 font-semibold leading-tight">
                            Lead Architect & Full-Stack Developer — Award-Winning E-Voting Platform
                          </p>
                          <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 font-sans">
                            {p.desc}
                          </p>

                          {/* Tech Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.tech.map(t => (
                              <span key={t} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Button */}
                        <div className="pt-3 border-t border-amber-500/20 flex justify-end">
                          <a
                            href={p.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Live App ↗</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <ProjectCard
                        title={p.title}
                        desc={p.desc}
                        image={p.image}
                        tech={p.tech}
                        demoLink={p.demoLink}
                        codeLink={p.codeLink}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Buttons Row (View More Projects & Source Code Store) */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="/projects"
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState({}, '', '/projects')
                  window.dispatchEvent(new Event('popstate'))
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-accent-teal/25 hover:shadow-accent-teal/40 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group tracking-wide border border-cyan-400/30"
                >
                  <span>View More Projects</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </a>

              <a
                href="/source-code"
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState({}, '', '/source-code')
                  window.dispatchEvent(new Event('popstate'))
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-sm sm:text-base shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group tracking-wide"
                >
                  <span>⚡ Source Code Store</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </a>
            </div>
          </div>
        ) : (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-3 border border-accent-teal/20">
            <div className="w-12 h-12 rounded-full bg-accent-teal/10 text-accent-teal flex items-center justify-center mx-auto text-xl font-bold">📡</div>
            <h3 className="text-lg font-bold text-text-main font-display">Server Offline</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              No live projects found. Please start your backend server (<code className="text-accent-teal font-mono">node src/server.js</code> in <code className="text-accent-teal font-mono">backend/</code>) to load your live portfolio content.
            </p>
          </div>
        )}
      </section>
    </>
  )
}
