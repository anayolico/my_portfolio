import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from "./ima-and/caleb-profile.png"

export default function Splash({ duration = 2600, onComplete = () => {}, transitionStyle = 'fade' }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Smooth progress simulation
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)
    }, 50)

    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 350)
    }, duration)

    return () => {
      clearInterval(tick)
      clearTimeout(timer)
    }
  }, [duration, onComplete])

  // Select exit animation based on transitionStyle prop
  const exitVariants = {
    fade: { opacity: 0, scale: 1.05, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    slide: { y: '-100%', opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
    scale: { scale: 1.15, opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={exitVariants[transitionStyle] || exitVariants.fade}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070b14] text-white selection:bg-accent-teal selection:text-white overflow-hidden"
        >
          {/* Ambient Glowing Orbs */}
          <div className="absolute w-96 h-96 rounded-full bg-accent-teal/15 blur-[120px] pointer-events-none -top-20 -left-20 animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full bg-amber-400/10 blur-[120px] pointer-events-none -bottom-20 -right-20 animate-pulse" />
          <div className="absolute w-80 h-80 rounded-full bg-accent-purple/15 blur-[100px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Center Content Wrapper */}
          <div className="relative flex flex-col items-center justify-center px-6 py-10 z-10 max-w-md w-full text-center">
            
            {/* Main Portrait with Rotating Arc Ring (Matching Home.jsx) */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* Outer Rotating Arc Ring */}
              <svg
                className="absolute -inset-5 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)] pointer-events-none text-accent-teal/60 animate-[spin_25s_linear_infinite]"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="14 10 55 14"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="url(#splash-arc-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="45 175"
                />
                <defs>
                  <linearGradient id="splash-arc-grad" x1="0" y1="0" x2="200" y2="200">
                    <stop offset="0%" stopColor="#17A2B8" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#6A5ACD" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Counter-rotating subtle dash ring */}
              <svg
                className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] pointer-events-none text-white/10 animate-[spin_35s_linear_infinite_reverse]"
                viewBox="0 0 200 200"
                fill="none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="6 12"
                />
              </svg>

              {/* Inner Circular Photo Frame */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full p-2 bg-gradient-to-b from-accent-teal/30 via-transparent to-amber-400/20 shadow-[0_15px_45px_rgba(23,162,184,0.3)] flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-slate-900 shadow-inner relative">
                  <img
                    src={image1}
                    alt="CaleByte"
                    className="w-full h-full object-cover object-top scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-7 text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white"
            >
              Cale<span className="text-accent-teal">Byte</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-slate-400"
            >
              Better Code. Smarter Solutions.
            </motion.p>

            {/* Clean Glassmorphic Loading Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 flex flex-col items-center gap-2.5 w-56 sm:w-64"
            >
              {/* Ultra-Clean Glassmorphic Progress Bar */}
              <div className="h-1.5 w-full bg-white/5 backdrop-blur-md rounded-full overflow-hidden border border-white/10 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-teal to-cyan-400 rounded-full shadow-[0_0_10px_rgba(23,162,184,0.6)]"
                  style={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
              </div>

              {/* Minimal Clean Status */}
              <span className="text-[11px] font-sans font-medium tracking-widest uppercase text-slate-400">
                {progress < 100 ? 'Loading' : 'Ready'}
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
