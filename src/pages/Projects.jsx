import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.jsx'
import CmsStatus from '../components/CmsStatus.jsx'
import ima3 from '../components/ima-and/ima3.jpg'
import ima4 from '../components/ima-and/ima4.jpg'
import ima5 from '../components/ima-and/ima5.jpeg'
import ima6 from '../components/ima-and/ima6.png'
import { fetchFromStrapi } from '../services/api.js'
import SEO from '../components/SEO'

const CATEGORIES = ['All', 'React', 'Node.js', 'Next.js', 'AI']

const MOCK_PROJECTS = [
  {
    title: 'Construction Company Website',
    desc: 'A modern, responsive website built for a Nigerian construction company, showcasing residential and commercial projects, service offerings, and client engagement features. Optimized for performance, clean UI, and seamless contact integration to strengthen the company’s online presence.',
    image: ima4,
    tech: ['React.js','Node.js', 'Tailwind'],
    demoLink: 'https://construction-website-eosin-alpha.vercel.app/',
    codeLink: 'https://github.com/anayolico/construction-website'
  },
  {
    title: 'AI Calculator Web App',
    desc: 'Interactive calculator powered by AI-assisted suggestions and advanced UX patterns.',
    image: ima3,
    tech: ['Next.js', 'AI', 'React'],
    demoLink: 'https://my-ai-calculator.vercel.app/',
    codeLink: 'https://github.com/anayolico/my-ai-calculator'
  },
  {
    title: 'Task Management Dashboard',
    desc: 'Full-featured dashboard with real-time task tracking, filtering, and user collaboration features.',
    image: ima5,
    tech: ['React', 'Node.js', 'MongoDB'],
    demoLink: 'https://task-dashboard-frontend-two.vercel.app',
    codeLink: 'https://github.com/anayolico/task-dashboard-backend'
  },
  {
    title: 'Weather Forecast App',
    desc: 'Real-time weather application with location search, forecasts, and animated weather visualizations.',
    image: ima6,
    tech: ['React', 'API', 'CSS Animations'],
    demoLink: 'https://weather-app-xi-tawny-68.vercel.app',
    codeLink: 'https://github.com/anayolico/weather-app'
  }
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getProjects() {
      const data = await fetchFromStrapi('/api/projects?populate=*')
      if (data && Array.isArray(data)) {
        const mapped = data.map(item => {
          const attrs = item.attributes || item

          let imageUrl = ''
          const imgObj = attrs.image
          if (imgObj) {
            const imgData = imgObj.data || imgObj
            const imgAttrs = imgData.attributes || imgData
            const url = imgAttrs.url || ''
            imageUrl = url.startsWith('/')
              ? `${import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337'}${url}`
              : url
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

          return {
            title: attrs.title || '',
            desc: attrs.desc || attrs.description || '',
            image: imageUrl || '',
            tech: techArray,
            demoLink: attrs.demoLink || '#',
            codeLink: attrs.codeLink || '#'
          }
        })
        setProjects(mapped)
        setIsLive(true)
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
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(p => (
              <motion.div
                layout
                key={p.title}
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
      </section>
    </>
  )
}
