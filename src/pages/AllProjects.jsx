import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.jsx'
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function AllProjects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getProjects() {
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

  // Extract all unique tech tags for filter pills
  const allTechTags = ['All']
  projects.forEach(p => {
    p.tech.forEach(t => {
      if (!allTechTags.includes(t)) {
        allTechTags.push(t)
      }
    })
  })

  // Filter projects by active filter tab & search query
  const filteredProjects = projects.filter(p => {
    const matchesFilter = activeFilter === 'All' || p.tech.some(t => t.toLowerCase() === activeFilter.toLowerCase())
    const matchesSearch = searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const goBackToHome = () => {
    window.location.href = '/'
  }

  return (
    <>
      <SEO
        title="All Projects | Caleb Anayolico"
        description="A complete collection of full-stack web applications, mobile apps, SaaS tools, and backend architectures built by Caleb Anayolico."
        keywords="Caleb Anayolico, Projects, Portfolio, All Projects, React, Node.js, Python, SaaS"
        url="/projects"
      />

      <div className="min-h-screen bg-bg-body text-text-main flex flex-col justify-between selection:bg-accent-teal selection:text-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full flex-grow space-y-12">
          {/* Top Bar: Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={goBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-accent-teal transition-colors duration-200 cursor-pointer group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Portfolio</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-xs font-bold uppercase tracking-wider">
              <span>● FULL PORTFOLIO</span>
            </div>
          </motion.div>

          {/* Hero Header (Matching Image 2 Reference) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left border-b border-gray-200 dark:border-gray-800 pb-8"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-main font-display leading-tight">
              All Projects
            </h1>
            <p className="text-text-muted text-base sm:text-xl max-w-2xl font-sans">
              A complete collection of my work — full-stack apps, tools, and everything in between.{' '}
              <span className="text-amber-500 dark:text-amber-400 font-extrabold font-mono">({projects.length})</span>
            </p>
            <div className="pt-2">
              <CmsStatus isLive={isLive} isLoading={loading} />
            </div>
          </motion.div>

          {/* Search Input & Tech Tag Filters */}
          <div className="space-y-6">
            {/* Search Input */}
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search projects or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white/60 dark:bg-slate-900/80 border border-gray-200 dark:border-white/10 text-text-main placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all text-sm font-sans shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Technology Pill Filters */}
            <div className="flex flex-wrap gap-2.5">
              {allTechTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${activeFilter === tag
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-white/40 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/5 hover:border-accent-teal/50 hover:text-text-main'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Count Header */}
          <div className="text-xs font-mono font-bold text-text-muted uppercase tracking-widest">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'PROJECT' : 'PROJECTS'}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="glass-card rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/5 animate-pulse h-80 bg-slate-900/40" />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">🔍</div>
              <h3 className="text-lg font-bold text-text-main font-display">No Matching Projects</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                No projects matched your search criteria. Try selecting another technology filter or search term.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  )
}
