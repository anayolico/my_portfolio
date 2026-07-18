import React, { useState, useEffect } from 'react'
import SkillBadge from '../components/SkillBadge.jsx'
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromStrapi } from '../services/api.js'
import SEO from '../components/SEO'

const MOCK_FRONTEND = [
  { name: 'HTML5', level: 90 }, { name: 'CSS3 & Sass', level: 88 }, { name: 'JavaScript (ES6+)', level: 85 }, { name: 'React.js', level: 82 }
]
const MOCK_BACKEND = [{ name: 'React Native', level: 75 }, { name: 'Node.js', level: 60 }, { name: 'MongoDB', level: 70 }]
const MOCK_TOOLS = [{ name: 'Git & GitHub', level: 82 }]

export default function Skills() {
  const [frontend, setFrontend] = useState(MOCK_FRONTEND)
  const [backend, setBackend] = useState(MOCK_BACKEND)
  const [tools, setTools] = useState(MOCK_TOOLS)
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getSkills() {
      const data = await fetchFromStrapi('/api/skills')
      if (data && Array.isArray(data)) {
        const skillsList = data.map(item => item.attributes || item)

        // Filter by category (case-insensitive)
        const fe = skillsList.filter(s => s.category?.toLowerCase().includes('front') || s.category?.toLowerCase() === 'frontend')
        const be = skillsList.filter(s => s.category?.toLowerCase().includes('back') || s.category?.toLowerCase() === 'backend')
        const tl = skillsList.filter(s => s.category?.toLowerCase().includes('tool') || s.category?.toLowerCase() === 'tools')

        if (fe.length > 0) setFrontend(fe)
        if (be.length > 0) setBackend(be)
        if (tl.length > 0) setTools(tl)
        if (fe.length > 0 || be.length > 0 || tl.length > 0) setIsLive(true)
      }
      setLoading(false)
    }
    getSkills()
  }, [])

  if (loading) {
    return (
      <section id="skills" className="py-20 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">Skills & Proficiencies</h2>
          <CmsStatus isLoading={true} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-5 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-white/5 rounded-full w-1/2" />
              {[1, 2, 3].map(j => (
                <div key={j} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-white/5 rounded-full w-8" />
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/5 rounded-full w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <>
      <SEO
        title="Skills | Anayolico"
        description="Technical proficiencies across frontend frameworks, backend engines, and developer pipelines."
        keywords="Anayolico, Caleb Anayolico, Anayo, Skills, React, JavaScript, React Native, Mobile Development, Frontend, Backend, Full Stack"
        url="/skills"
      />
      <section id="skills" className="py-20 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
            Skills & Proficiencies
          </h2>
          <p className="text-text-muted text-base max-w-xl mx-auto transition-colors duration-300">
            An overview of technical proficiencies across frontend frameworks, backend engines, and developer pipelines.
          </p>
          <div className="flex justify-center">
            <CmsStatus isLive={isLive} isLoading={false} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Frontend Section */}
          <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-6 transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bold text-text-main font-display tracking-wide uppercase transition-colors duration-300">Frontend</h3>
            </div>
            <div className="flex flex-col gap-5">
              {frontend.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
            </div>
          </div>

          {/* Backend Section */}
          <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-6 transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bold text-text-main font-display tracking-wide uppercase transition-colors duration-300">Backend & logic</h3>
            </div>
            <div className="flex flex-col gap-5">
              {backend.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
            </div>
          </div>

          {/* Tools Section */}
          <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-6 transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bold text-text-main font-display tracking-wide uppercase transition-colors duration-300">Developer Tools</h3>
            </div>
            <div className="flex flex-col gap-5">
              {tools.map(s => <SkillBadge key={s.name} name={s.name} level={s.level} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
