import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE_URL } from './services/api.js'
import Splash from './components/Splash.jsx'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Skills from './pages/Skills.jsx'
import Contact from './pages/Contact.jsx'
import CV from './pages/CV.jsx'
import AllProjects from './pages/AllProjects.jsx'
import SourceCode from './pages/SourceCode.jsx'

/* App.jsx: top-level composition of the single-page portfolio & standalone /cv, /projects & /source-code routes. */
export default function App(){
  const [showSplash, setShowSplash] = useState(true)
  const [isServerWaking, setIsServerWaking] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/'
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase())
    }
    window.addEventListener('popstate', handlePopState)

    // Server waking states
    const handleWaking = () => setIsServerWaking(true)
    const handleReady = () => setIsServerWaking(false)
    window.addEventListener('server_waking', handleWaking)
    window.addEventListener('server_ready', handleReady)

    // Server-Sent Events for real-time updates from Admin Dashboard
    const eventSource = new EventSource(`${API_BASE_URL}/api/stream`)
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'refresh') {
          // Force a full component re-mount to fetch fresh data instantly
          setRefreshKey(prev => prev + 1)
        }
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('server_waking', handleWaking)
      window.removeEventListener('server_ready', handleReady)
      eventSource.close()
    }
  }, [])

  const isCvPage = currentPath.startsWith('/cv')
  const isProjectsPage = currentPath.startsWith('/projects')
  const isSourceCodePage = currentPath.startsWith('/source-code')

  if (isCvPage) {
    return <CV key={refreshKey} />
  }

  if (isProjectsPage) {
    return <AllProjects key={refreshKey} />
  }

  if (isSourceCodePage) {
    return <SourceCode key={refreshKey} />
  }

  return (
    <>
      {/* Server Waking Notification popup */}
      <AnimatePresence>
        {isServerWaking && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full glass-card border border-accent-teal/30 shadow-2xl shadow-accent-teal/20 flex items-center gap-3 backdrop-blur-xl"
          >
            <svg className="animate-spin h-5 w-5 text-accent-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span className="text-sm font-bold text-white tracking-wide">Waking up server, please wait...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {showSplash && <Splash onComplete={() => setShowSplash(false)} duration={2600} transitionStyle="fade" />}

      {!showSplash && (
        <Layout key={refreshKey}>
          <main className="w-full">
            <Home />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </main>
        </Layout>
      )}
    </>
  )
}

