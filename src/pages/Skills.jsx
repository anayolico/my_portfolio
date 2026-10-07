import React, { useState, useEffect } from 'react'
import SkillBadge from '../components/SkillBadge.jsx'
import CmsStatus from '../components/CmsStatus.jsx'
import { fetchFromApi } from '../services/api.js'
import ServerOfflineBot from '../components/ServerOfflineBot.jsx'

export default function Skills() {
  const [frontend, setFrontend] = useState([])
  const [backend, setBackend] = useState([])
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    async function getSkills() {
      const data = await fetchFromApi('/api/skills')
      if (data && Array.isArray(data)) {
        const seenNames = new Set()
        const skillsList = []

        data.forEach(item => {
          const attrs = item.attributes || item
          const name = attrs.name || ''
          if (!name || seenNames.has(name.toLowerCase())) return
          seenNames.add(name.toLowerCase())
          skillsList.push(attrs)
        })

        // Filter by category (case-insensitive)
        const fe = skillsList.filter(s => s.category?.toLowerCase().includes('front') || s.category?.toLowerCase() === 'frontend')
        const be = skillsList.filter(s => s.category?.toLowerCase().includes('back') || s.category?.toLowerCase() === 'backend')
        const tl = skillsList.filter(s => s.category?.toLowerCase().includes('tool') || s.category?.toLowerCase() === 'tools')

        setFrontend(fe)
        setBackend(be)
        setTools(tl)
        setIsLive(fe.length > 0 || be.length > 0 || tl.length > 0)
      } else {
        setFrontend([])
        setBackend([])
        setTools([])
        setIsLive(false)
      }
      setLoading(false)
    }
    getSkills()
  }, [])

  // Helper to ensure seamless looping and uniform calm speed across all tracks
  const getTrackConfig = (list, speedMultiplier = 5.8) => {
    if (!list || list.length === 0) return { items: [], duration: 60 }
    
    // Expand to ensure full screen coverage on ultrawide monitors
    let baseSet = [...list]
    while (baseSet.length < 12) {
      baseSet = [...baseSet, ...list]
    }
    
    // Infinite loop translates -50% (exactly 1 baseSet width)
    const items = [...baseSet, ...baseSet]
    
    // Slower duration = smoother, calmer, more relaxed scrolling
    const duration = baseSet.length * speedMultiplier

    return { items, duration }
  }

  if (loading) {
    return (
      <section id="skills" className="py-20 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
            Skills & Proficiencies
          </h2>
          <CmsStatus isLoading={true} />
        </div>
        <div className="space-y-8 max-w-6xl mx-auto px-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-gray-200 dark:bg-white/5 rounded-full w-36 animate-pulse" />
              <div className="flex gap-4 overflow-hidden py-2 animate-pulse">
                {[1, 2, 3, 4, 5].map(j => (
                  <div key={j} className="h-12 w-48 bg-gray-200 dark:bg-white/5 rounded-2xl flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const hasSkills = frontend.length > 0 || backend.length > 0 || tools.length > 0

  // Calibrated speeds: overall much calmer, and Developer Tools extra relaxed and smooth
  const feTrack = getTrackConfig(frontend, 5.8)
  const beTrack = getTrackConfig(backend, 6.0)
  const tlTrack = getTrackConfig(tools, 6.8)

  return (
    <section id="skills" className="py-20 space-y-12 overflow-hidden">
      <div className="text-center space-y-4 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
          Skills & Proficiencies
        </h2>
        <div className="flex justify-center">
          <CmsStatus isLive={isLive} isLoading={false} />
        </div>
      </div>

      {hasSkills ? (
        <div className="space-y-10 max-w-7xl mx-auto">
          {/* Line 1: Frontend */}
          {frontend.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-6">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-teal animate-pulse" />
                <h3 className="text-sm md:text-base font-bold text-text-main uppercase tracking-wider font-display">
                  Frontend
                </h3>
                <span className="text-xs text-text-muted font-medium ml-1">
                  ({frontend.length} skills)
                </span>
              </div>

              <div className="marquee-wrapper marquee-mask overflow-hidden py-2">
                <div 
                  className="animate-marquee-left flex gap-4 items-center"
                  style={{ animationDuration: `${feTrack.duration}s` }}
                >
                  {feTrack.items.map((s, idx) => (
                    <SkillBadge key={`fe-${s.id || s.name}-${idx}`} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Line 2: Backend & Logic */}
          {backend.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-6">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-purple animate-pulse" />
                <h3 className="text-sm md:text-base font-bold text-text-main uppercase tracking-wider font-display">
                  Backend & Logic
                </h3>
                <span className="text-xs text-text-muted font-medium ml-1">
                  ({backend.length} skills)
                </span>
              </div>

              <div className="marquee-wrapper marquee-mask overflow-hidden py-2">
                <div 
                  className="animate-marquee-right flex gap-4 items-center"
                  style={{ animationDuration: `${beTrack.duration}s` }}
                >
                  {beTrack.items.map((s, idx) => (
                    <SkillBadge key={`be-${s.id || s.name}-${idx}`} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Line 3: Developer Tools */}
          {tools.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-6">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm md:text-base font-bold text-text-main uppercase tracking-wider font-display">
                  Developer Tools
                </h3>
                <span className="text-xs text-text-muted font-medium ml-1">
                  ({tools.length} skills)
                </span>
              </div>

              <div className="marquee-wrapper marquee-mask overflow-hidden py-2">
                <div 
                  className="animate-marquee-left flex gap-4 items-center"
                  style={{ animationDuration: `${tlTrack.duration}s` }}
                >
                  {tlTrack.items.map((s, idx) => (
                    <SkillBadge key={`tl-${s.id || s.name}-${idx}`} name={s.name} level={s.level} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ServerOfflineBot 
          title="Server Offline" 
          message="Could not connect to the database to load skills." 
        />
      )}
    </section>
  )
}
