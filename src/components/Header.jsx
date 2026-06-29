import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext.jsx'
import image1 from "./ima-and/ima1.png"
import image2 from "./ima-and/ima2..jpg"
import logo from "./ima-and/logo.png"

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
  const { theme, toggleTheme } = useTheme()
  const images = [image1, image2]

  // cycle profile images every 8 seconds
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

  // close menu when resizing to desktop
  useEffect(()=>{
    function onResize(){ if(window.innerWidth >= 768 && open) setOpen(false) }
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  }, [open])

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      {/* Floating Island Navigation Container */}
      <div className="backdrop-blur-md bg-bg-surface/85 border border-gray-200/50 dark:border-white/10 shadow-lg px-6 py-2.5 rounded-full flex items-center justify-between transition-colors duration-300 relative">
        
        {/* Left: Brand Identity */}
        <a href="#home" className="flex items-center gap-2" onClick={()=>setOpen(false)}>
          <img 
            src={logo} 
            alt="CA Logo" 
            className="h-8 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300"
          />
          <span className="text-lg font-extrabold tracking-wide font-display text-text-main transition-colors duration-300">
            Anayolico
          </span>
        </a>

        {/* Desktop Links (Horizontal list) */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(l => (
            <a 
              key={l.id} 
              href={`#${l.id}`} 
              className="text-xs uppercase tracking-widest font-extrabold text-text-muted hover:text-accent-teal transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-muted hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none transition-transform transform hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-teal">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              // Moon Icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Mobile Hamburger menu */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={()=>setOpen(v => !v)}
            className="md:hidden p-2 rounded-full text-text-main hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <motion.path
                initial={false}
                animate={open ? { d: 'M4 6L20 18' } : { d: 'M3 6h18' }}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={false}
                animate={open ? { d: 'M4 18L20 6' } : { d: 'M3 12h18' }}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={false}
                animate={open ? { opacity: 0 } : { d: 'M3 18h18', opacity: 1 }}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Floating Mobile Dropdown Menu Card */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[calc(100%+0.75rem)] left-0 right-0 p-6 rounded-3xl bg-bg-surface/95 border border-gray-200/50 dark:border-white/10 shadow-2xl backdrop-blur-lg flex flex-col gap-4 md:hidden transition-colors duration-300"
            >
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="text-lg font-bold font-display text-text-main hover:text-accent-teal transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="h-px bg-gray-200 dark:bg-white/5 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-text-muted">Connect Direct</span>
                <div className="flex gap-2">
                  <a href="mailto:acnwa1234@gmail.com" onClick={() => setOpen(false)} className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-xs font-semibold text-text-main transition-colors">Email</a>
                  <a href="#contact" onClick={() => setOpen(false)} className="px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-xs font-semibold text-text-main transition-colors">Contact</a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
