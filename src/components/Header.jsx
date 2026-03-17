import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from "./ima-and/ima1.png";
import image2 from "./ima-and/ima2..jpg";

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Header(){
  const [open, setOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const images = [image1, image2]

  // cycle profile images every 3 seconds
  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrentImage(i => (i + 1) % images.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [images.length])

  // close on Escape
  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  // prevent background scroll when open
  useEffect(()=>{
    const prev = document.body.style.overflow
    document.body.style.overflow = open ? 'hidden' : prev || ''
    return ()=> { document.body.style.overflow = prev || '' }
  }, [open])

  // close menu when resizing to desktop
  useEffect(()=>{
    function onResize(){ if(window.innerWidth >= 768 && open) setOpen(false) }
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  }, [open])

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.18 } }
  }
  const panel = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
    exit: { x: '100%', transition: { ease: 'easeInOut', duration: 0.22 } }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-sm bg-black/40 border-b border-gray-800">
        <div className="container mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 neon-glow" onClick={()=>setOpen(false)}>
            {/* Profile image placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold text-black overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  alt="Anayolico"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
              
            </div>
            <span className="text-xl font-semibold tracking-wider text-neon-cyan">Anayolico</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map(l => (
              <a key={l.id} href={`#${l.id}`} className="text-sm text-gray-300 hover:text-neon-cyan transition-transform transform hover:-translate-y-0.5">{l.label}</a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={()=>setOpen(v => !v)}
              className="p-2 rounded-md text-gray-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block">
                <motion.path
                  initial={false}
                  animate={open ? { d: 'M4 6L20 18' } : { d: 'M3 6h18' }}
                  transition={{ duration: 0.18 }}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <motion.path
                  initial={false}
                  animate={open ? { d: 'M4 18L20 6' } : { d: 'M3 12h18' }}
                  transition={{ duration: 0.18 }}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <motion.path
                  initial={false}
                  animate={open ? { opacity: 0 } : { d: 'M3 18h18', opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop" initial="hidden" animate="visible" exit="hidden" variants={backdrop} className="fixed inset-0 z-40 bg-black/55 md:hidden" onClick={()=>setOpen(false)} />

            <motion.aside key="panel" initial="hidden" animate="visible" exit="exit" variants={panel} className="fixed top-0 right-0 z-50 w-full max-w-xs sm:max-w-sm h-full bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-md border-l border-gray-800 md:hidden" role="dialog" aria-modal="true">
              <div className="h-full flex flex-col px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                  <a href="#home" className="flex items-center gap-2" onClick={()=>setOpen(false)}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xs font-bold text-black overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImage}
                          src={images[currentImage]}
                          alt="Anayolico"
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                        />
                      </AnimatePresence>
                    </div>
                    <span className="text-lg font-semibold text-neon-cyan">Anayolico</span>
                  </a>
                  <button onClick={()=>setOpen(false)} aria-label="Close menu" className="p-2 rounded-md text-gray-200 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-neon-cyan">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <nav className="flex-1">
                  <ul className="flex flex-col gap-6">
                    {NAV_LINKS.map((link, i) => (
                      <motion.li key={link.id} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.04 * i, duration: 0.32 }}>
                        <a href={`#${link.id}`} onClick={()=>setOpen(false)} className="text-2xl font-medium text-gray-100 hover:text-neon-cyan block">{link.label}</a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 text-sm text-gray-400">
                  <p>Quick links</p>
                  <div className="flex gap-3 mt-3">
                    <a href="mailto:example@domain.com" onClick={()=>setOpen(false)} className="px-3 py-2 bg-gray-800 rounded text-gray-200">Email</a>
                    <a href="#contact" onClick={()=>setOpen(false)} className="px-3 py-2 bg-gray-800 rounded text-gray-200">Contact</a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
