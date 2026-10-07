import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BackgroundParticles from './components/BackgroundParticles.jsx'
import BackgroundAudio from './components/BackgroundAudio.jsx'
import SupportModal from './components/SupportModal.jsx'

/* Layout: wraps pages and provides header/footer */
export default function Layout({children}){
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [supportInitialAmount, setSupportInitialAmount] = useState(2000)

  useEffect(() => {
    const handleOpenSupport = (e) => {
      const amt = e?.detail?.amount
      if (amt !== undefined && amt !== null) {
        setSupportInitialAmount(amt)
      } else {
        setSupportInitialAmount(2000)
      }
      setSupportModalOpen(true)
    }

    window.addEventListener('open_support_modal', handleOpenSupport)
    return () => window.removeEventListener('open_support_modal', handleOpenSupport)
  }, [])

  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Background canvas - fixed and behind content */}
      <BackgroundParticles />
      {/* Background music control (floating button) - using free Pixabay music */}
      <BackgroundAudio />
      <Header />
      <div className="flex-1 container mx-auto px-2 sm:px-6 md:px-12 py-12 w-full max-w-full overflow-x-hidden">
        {children}
      </div>
      <Footer />
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        initialAmount={supportInitialAmount}
      />
    </div>
  )
}

