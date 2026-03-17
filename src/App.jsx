import React, { useState } from 'react'
import Splash from './components/Splash.jsx'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Projects from './pages/Projects.jsx'
import Skills from './pages/Skills.jsx'
import Contact from './pages/Contact.jsx'

/* App.jsx: top-level composition of the single-page portfolio. Shows a splash screen before main layout. */
export default function App(){
  const [showSplash, setShowSplash] = useState(true)

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
