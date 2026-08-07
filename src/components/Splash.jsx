import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from "./ima-and/caleb-profile.png"

export default function Splash({duration = 2500, onComplete = () => {}, transitionStyle = 'fade'}){
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress simulation
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(p)
    }, 120)

    const timer = setTimeout(() => {
      setProgress(100)
      // finish with a slight delay to show 100%
      setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 260)
    }, duration)

    return () => {
      clearInterval(tick)
      clearTimeout(timer)
    }
  }, [duration, onComplete])

  // Select exit animation based on transitionStyle prop
  const exitVariants = {
    fade: { opacity: 0, transition: { duration: 0.6 } },
    slide: { x: '-100%', opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
    scale: { scale: 1.12, opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={exitVariants[transitionStyle] || exitVariants.fade}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-body transition-colors duration-300"
        >
          <div className="relative flex flex-col items-center justify-center px-6 py-8">
            {/* Logo / Image */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-full p-1 bg-gradient-to-br from-accent-teal to-accent-purple shadow-lg"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-bg-surface overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <img src={image1} alt="Anayolico" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-text-main transition-colors duration-300">
              Caleb Anayolico
            </motion.h1>

            <motion.p initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28, duration: 0.6 }} className="mt-2 text-sm md:text-base text-text-muted transition-colors duration-300">
              FULL-STACK WEB & MOBILE DEVELOPER
            </motion.p>

            {/* Progress / loading */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-6 w-56 md:w-72">
              <div className="h-2 bg-bg-surface rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <motion.div className="h-full bg-gradient-to-r from-accent-teal to-accent-purple rounded-full" style={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 60 }} />
              </div>
              <div className="mt-2 text-xs text-text-muted text-center transition-colors duration-300">{progress < 100 ? 'Loading...' : 'Ready'}</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
