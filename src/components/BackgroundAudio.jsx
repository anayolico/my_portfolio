import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import audio1 from "./ima-and/audio1.mp3"

/**
 * BackgroundAudio.jsx
 * - Background music control with 21st.dev Shiny Button styling
 * - Full rotating conic gradient, shimmer, and breathing aura animation when playing ("singing")
 * - Remembers user preference in localStorage
 */
export default function BackgroundAudio() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)

  // Restore previous preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bg_music_playing')
      if (saved === 'true') setPlaying(true)
    } catch (e) {}
  }, [])

  // Control audio playback
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      const p = audio.play()
      if (p && typeof p.then === 'function') {
        p.then(() => {
          setError(null)
        }).catch((err) => {
          console.warn('Playback error / Autoplay blocked:', err)
          setError('Click to play audio')
          setPlaying(false)
        })
      }
    } else {
      audio.pause()
      audio.currentTime = 0
    }

    try {
      localStorage.setItem('bg_music_playing', playing ? 'true' : 'false')
    } catch (e) {}
  }, [playing])

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audio1}
        loop
        preload="auto"
      />

      {/* Floating Shiny Music Control Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      >
        {/* Outer pulsating sound waves and orbit ring when "singing" */}
        <div className="relative flex items-center justify-center">
          {playing && (
            <>
              {/* Expanding audio pulse rings */}
              <motion.div
                className="absolute -inset-3.5 sm:-inset-4 rounded-full bg-cyan-500/20 pointer-events-none"
                animate={{
                  scale: [1, 1.45, 1.8],
                  opacity: [0.6, 0.25, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute -inset-3.5 sm:-inset-4 rounded-full bg-purple-500/20 pointer-events-none"
                animate={{
                  scale: [1, 1.3, 1.55],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2.2,
                  delay: 0.7,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              {/* Rotating outer orbital sound ring around the button */}
              <motion.div
                className="absolute -inset-2 sm:-inset-2.5 rounded-full border-2 border-cyan-400/40 border-dashed pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}

          {/* 21st.dev Shiny Button Component Styled for Audio (Enlarged) */}
          <motion.button
            onClick={() => setPlaying((prev) => !prev)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            data-playing={playing ? "true" : "false"}
            className={`shiny-cta shiny-cta-circle w-16 h-16 sm:w-20 sm:h-20 relative group shadow-2xl transition-all duration-300 ${
              playing ? 'is-playing shadow-cyan-500/40 ring-1 ring-cyan-400/50' : 'hover:shadow-cyan-500/30'
            }`}
            aria-pressed={playing}
            aria-label={playing ? 'Pause background music' : 'Play background music'}
          >
            {/* Center Content with Animated Icons */}
            <span className="shiny-content flex items-center justify-center relative z-10 w-full h-full text-white">
              {playing ? (
                <div className="flex items-center justify-center gap-2">
                  {/* Equalizer animated bars (Larger and bolder) */}
                  <div className="flex items-end gap-1 h-6 sm:h-7">
                    <motion.span
                      className="w-1 sm:w-1.5 bg-cyan-400 rounded-full"
                      animate={{ height: ['6px', '22px', '10px', '26px', '6px'] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="w-1 sm:w-1.5 bg-pink-400 rounded-full"
                      animate={{ height: ['18px', '8px', '24px', '12px', '18px'] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    />
                    <motion.span
                      className="w-1 sm:w-1.5 bg-purple-400 rounded-full"
                      animate={{ height: ['10px', '26px', '6px', '20px', '10px'] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                    />
                  </div>
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-md" />
                </div>
              ) : (
                <div className="flex items-center justify-center pl-1">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                </div>
              )}
            </span>
          </motion.button>
        </div>


        {/* Error notification badge */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-rose-600/90 text-white text-xs rounded-lg shadow-lg whitespace-nowrap backdrop-blur"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
