import React from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BackgroundParticles from './components/BackgroundParticles.jsx'
import BackgroundAudio from './components/BackgroundAudio.jsx'

/* Layout: wraps pages and provides header/footer */
export default function Layout({children}){
  return (
    <div className="min-h-screen flex flex-col">
      {/* Background canvas - fixed and behind content */}
      <BackgroundParticles />
      {/* Background music control (floating button) - using free Pixabay music */}
      <BackgroundAudio />
      <Header />
      <div className="flex-1 container mx-auto px-6 md:px-12 py-12">
        {children}
      </div>
      <Footer />
    </div>
  )
}
