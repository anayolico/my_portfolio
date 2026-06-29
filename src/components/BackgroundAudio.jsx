import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import audio1 from "./ima-and/audio1.mp3";

/**
 * BackgroundAudio.jsx
 * - Background music control with spinning, color-changing button
 * - Uses direct MP3 URL (no CORS issues)
 * - Remembers user preference in localStorage
 */
export default function BackgroundAudio() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [isHovering, setIsHovering] = useState(false)

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
          // console.log('Music playing')
          setError(null)
        }).catch((err) => {
          // console.error('Playback error:', err)
          setError('Unable to play')
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
      {/* Direct MP3 URL - works without CORS issues */}
      <audio
        ref={audioRef}
        src={audio1}
        loop
        preload="auto"
      />

      {/* Floating music control button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setPlaying((p) => !p)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            background: isHovering
              ? 'linear-gradient(135deg, #6a5acd, #0b2046)'
              : 'linear-gradient(135deg, #17a2b8, #6a5acd)',
            boxShadow: isHovering
              ? '0 0 30px rgba(106, 90, 205, 0.6), 0 0 60px rgba(23, 162, 184, 0.3)'
              : '0 10px 40px rgba(23, 162, 184, 0.2)',
          }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg relative"
          aria-pressed={playing}
          aria-label={playing ? 'Pause background music' : 'Play background music'}
        >
          {/* Spinning ring background when playing */}
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-white border-r-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Icon */}
          <motion.span
            animate={{ rotate: playing ? 360 : 0 }}
            transition={{ duration: playing ? 3 : 0.5, repeat: playing ? Infinity : 0 }}
          >
            {playing ? (
              // Pause icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="4" height="14" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" fill="currentColor" />
              </svg>
            ) : (
              // Play icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
              </svg>
            )}
          </motion.span>
        </motion.button>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-rose-600 text-white text-xs rounded whitespace-nowrap"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

