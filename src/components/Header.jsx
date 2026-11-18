import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import logo from './ima-and/calebytelogo.png'

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'source-code', label: 'Source Code', href: '/source-code' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'support', label: 'Support me', href: '#support' },
]

export default function Header(){
  const [open, setOpen] = useState(false)
  const [colorMenuOpen, setColorMenuOpen] = useState(false)
  const colorMenuRef = useRef(null)
  const { colorTheme, setColorTheme, colorThemes } = useTheme()
  const activePalette = colorThemes.find(t => t.id === colorTheme) || colorThemes[0]

  // close on Escape
  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape') {
        setOpen(false)
        setColorMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  // close color dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target)) {
        setColorMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
        <a href="#home" className="flex items-center gap-2.5 group" onClick={()=>setOpen(false)}>
          <img 
            src={logo} 
            alt="CaleByte Logo" 
            className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-lg font-extrabold tracking-wide font-display text-text-main transition-colors duration-300">
            Cale<span className="text-accent-teal">Byte</span>
          </span>
        </a>

        {/* Desktop Links (Horizontal list) */}
        <nav className="hidden md:flex items-center space-x-5">
          {NAV_LINKS.filter(l => l.id !== 'support').map(l => {
            const isSource = l.id === 'source-code'

            return (
              <a 
                key={l.id} 
                href={l.href}
                onClick={(e) => {
                  if (l.href.startsWith('/')) {
                    e.preventDefault()
                    window.history.pushState({}, '', l.href)
                    window.dispatchEvent(new Event('popstate'))
                  }
                }}
                className={`text-xs uppercase tracking-widest font-extrabold transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isSource 
                    ? 'text-amber-400 hover:text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full' 
                    : 'text-text-muted hover:text-accent-teal'
                }`}
              >
                <span>{l.label}</span>
              </a>
            )
          })}

          {/* Support Me pushed to the right, no icon */}
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('open_support_modal', { detail: { amount: 2000 } }))
            }}
            className="text-xs uppercase tracking-widest font-extrabold transition-all duration-200 transform hover:-translate-y-0.5 text-text-muted hover:text-amber-400 cursor-pointer ml-3 pl-3 border-l border-gray-200 dark:border-white/10"
          >
            <span>Support me</span>
          </a>
        </nav>

        {/* Actions Section (Color Theme Picker + Mobile Hamburger) */}
        <div className="flex items-center gap-2">
          {/* Desktop Color Theme Picker */}
          <div className="relative hidden md:block" ref={colorMenuRef}>
            <button
              type="button"
              onClick={() => setColorMenuOpen(v => !v)}
              aria-expanded={colorMenuOpen}
              aria-label="Choose theme color"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-accent-teal/40 text-xs font-bold text-text-main transition-all cursor-pointer"
            >
              <span
                className="w-3 h-3 rounded-full ring-2 ring-white/20 shrink-0"
                style={{ backgroundColor: activePalette.accent }}
              />
              <span className="text-[11px] uppercase tracking-wider font-extrabold">Color</span>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${colorMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {colorMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-3 w-52 p-2 rounded-2xl bg-bg-surface/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 space-y-1"
                >
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-text-muted">
                    Theme Color
                  </div>
                  {colorThemes.map(t => {
                    const isSelected = t.id === colorTheme
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setColorTheme(t.id)
                          setColorMenuOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 text-white'
                            : 'text-text-muted hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full ring-1 ring-white/25 shrink-0"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span>{t.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-accent-teal" />}
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
              className="absolute top-[calc(100%+0.75rem)] left-0 right-0 p-6 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl backdrop-blur-xl flex flex-col gap-4 md:hidden z-50"
            >
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      setOpen(false)
                      if (link.id === 'support') {
                        e.preventDefault()
                        window.dispatchEvent(new CustomEvent('open_support_modal', { detail: { amount: 2000 } }))
                        return
                      }
                      if (link.href.startsWith('/')) {
                        e.preventDefault()
                        window.history.pushState({}, '', link.href)
                        window.dispatchEvent(new Event('popstate'))
                      }
                    }}
                    className={`text-lg font-bold font-display transition-colors duration-200 ${
                      link.id === 'source-code' 
                        ? 'text-amber-400 font-mono' 
                        : link.id === 'support'
                        ? 'text-amber-400'
                        : 'text-text-main hover:text-accent-teal'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="h-px bg-gray-200 dark:bg-white/5 my-2" />
              {/* Mobile Theme Color Swatches */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-text-muted block">Theme Color</span>
                <div className="flex flex-wrap gap-2">
                  {colorThemes.map(t => {
                    const isSelected = t.id === colorTheme
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setColorTheme(t.id)}
                        title={t.name}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-white/30 text-white'
                            : 'bg-white/[0.03] border-white/10 text-text-muted'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                        <span>{t.name.split(' ')[1] || t.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="h-px bg-gray-200 dark:bg-white/5 my-1" />
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
