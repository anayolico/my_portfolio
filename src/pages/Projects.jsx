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
  const [hackathonProject, setHackathonProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getProjects() {
      try {
        const cvRes = await fetchFromApi('/api/cv')
        const cv = cvRes?.data || cvRes
        if (cv && cv.hackathonProject) {
          setHackathonProject(cv.hackathonProject)
        }
      } catch (e) { }

      const data = await fetchFromApi('/api/projects')
      if (data && Array.isArray(data)) {
        const seenTitles = new Set()
        const mapped = []

        data.forEach(item => {
          const attrs = item.attributes || item
          const title = attrs.title || ''
          if (!title || seenTitles.has(title.toLowerCase())) return;
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

          mapped.push({
            id: attrs.id || title,
            title,
            desc: attrs.desc || attrs.description || '',
            image: imageUrl || '',
            tech: techArray,
            demoLink: attrs.demoLink || attrs.demo_link || '#',
            codeLink: attrs.codeLink || attrs.code_link || '#'
          })
        })
        setProjects(mapped)
        setIsLive(mapped.length > 0)
      } else {
        setProjects([])
        setIsLive(false)
      }
      setLoading(false)
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

        {/* Special Award-Winning Hackathon Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8 rounded-3xl border-2 border-accent-teal/30 bg-gradient-to-br from-teal-950/20 via-slate-900/90 to-slate-900 shadow-2xl relative overflow-hidden space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center sm:items-start md:items-center gap-4 border-b border-accent-teal/20 pb-4 text-center sm:text-left">
            <div className="space-y-1 flex flex-col items-center sm:items-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/30 text-xs font-bold uppercase tracking-wider">
                Hackathon 1st Place Winner
              </span>
              <h3 className="text-2xl font-black text-white font-display">Nigeria SecureVote</h3>
              <p className="text-xs text-accent-teal font-semibold">Lead Architect & Full-Stack Developer — Award-Winning E-Voting Platform</p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full md:w-auto">
              <a
                href="https://nigeria-secure-vote.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-accent-teal hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial"
              >
                <span>Live App</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Square Award Trophy / Certificate Photo Container */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl bg-black/60 border-2 border-accent-teal/40 shadow-xl overflow-hidden flex items-center justify-center relative aspect-square group">
                {hackathonProject?.awardImage && hackathonProject.awardImage.trim().startsWith('http') ? (
                  <img
                    src={hackathonProject.awardImage}
                    alt="Hackathon Award Trophy / Certificate"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-950 p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-4xl group-hover:scale-110 transition-transform">🏆</span>
                    <span className="text-xs font-extrabold text-accent-teal font-display uppercase tracking-widest">
                      Hackathon Winner
                    </span>
                    <span className="text-[10px] text-teal-200/70 leading-tight">
                      Award Certificate / Trophy Photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Deep Technical Overview & Features */}
            <div className="lg:col-span-8 space-y-4 text-center sm:text-left">
              <p className="text-sm text-gray-300 leading-relaxed font-sans">
                Next-generation cryptographic E-Voting & Identity Ingestion platform engineered for high-security multi-service elections. Combines NIMC NIN citizen lookup, PWA offline vote protection, WebAuthn biometric authorization, and real-time audit streaming.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300 text-left">
                <div className="flex items-start gap-2">
                  <span className="text-accent-teal font-bold">•</span>
                  <span><strong>Real-Time NIMC NIN Verification:</strong> Identity ingestion via Prembly API.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-teal font-bold">•</span>
                  <span><strong>PWA Offline Vote Resilience:</strong> Local cryptographic signing & background sync.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-teal font-bold">•</span>
                  <span><strong>WebAuthn Biometric Check:</strong> Native fingerprint/TouchID double-vote prevention.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent-teal font-bold">•</span>
                  <span><strong>FastAPI Analytics Engine:</strong> State voter distribution & fraud detection.</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                {["React", "Node.js", "Python (FastAPI)", "Neon DB", "Prembly NIMC API", "PWA"].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/30 text-[11px] sm:text-xs font-semibold backdrop-blur-sm shadow-sm transition-all hover:bg-accent-teal/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

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

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map(p => (
                <motion.div
                  layout
                  key={p.id || p.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard
                    title={p.title}
                    desc={p.desc}
                    image={p.image}
                    tech={p.tech}
                    demoLink={p.demoLink}
                    codeLink={p.codeLink}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="glass-card p-12 rounded-3xl text-center max-w-md mx-auto space-y-3 border border-amber-500/20">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">📡</div>
            <h3 className="text-lg font-bold text-text-main font-display">Server Offline</h3>

          </div>
        )}
      </section>
    </>
  )
}
