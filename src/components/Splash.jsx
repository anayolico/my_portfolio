import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import image1 from "./ima-and/ima2..jpg";

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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-bg-dark via-panel to-bg-dark"
        >
          <div className="relative flex flex-col items-center justify-center px-6 py-8">
            {/* Logo / Image */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="rounded-full p-1 bg-gradient-to-br from-neon-cyan to-neon-purple"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex items-center justify-center">
                <img src={image1} alt="Anayolico" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Name */}
            <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Anayolico
            </motion.h1>

            <motion.p initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28, duration: 0.6 }} className="mt-2 text-sm md:text-base text-gray-300">
              Web Developer & Java Programmer
            </motion.p>

            {/* Progress / loading */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-6 w-56 md:w-72">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <motion.div className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full" style={{ width: `${progress}%` }} transition={{ type: 'spring', stiffness: 60 }} />
              </div>
              <div className="mt-2 text-xs text-gray-400 text-center">{progress < 100 ? 'Loading...' : 'Ready'}</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
