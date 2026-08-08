import React, { useState, useEffect } from 'react'
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
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/'
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const isCvPage = currentPath.startsWith('/cv')
  const isProjectsPage = currentPath.startsWith('/projects')
  const isSourceCodePage = currentPath.startsWith('/source-code')

  if (isCvPage) {
    return <CV />
  }

  if (isProjectsPage) {
    return <AllProjects />
  }

  if (isSourceCodePage) {
    return <SourceCode />
  }

  return (
    <>
      {showSplash && <Splash onComplete={() => setShowSplash(false)} duration={2600} transitionStyle="fade" />}

      {!showSplash && (
        <Layout>
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

