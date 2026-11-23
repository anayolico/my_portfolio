import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import audio1 from "./ima-and/audio1.mp3"
import { API_BASE_URL, fetchFromApi } from '../services/api.js'

function pickRandomIndex(length, excludeIndex = -1) {
  if (length <= 1) return 0
  let next = Math.floor(Math.random() * length)
  if (next === excludeIndex) {
    next = (next + 1 + Math.floor(Math.random() * (length - 1))) % length
  }
  return next
}

function resolveAudioUrl(url) {
  if (!url) return audio1
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`
  }
  return url
}

/**
 * BackgroundAudio.jsx
 * - Fetches playlist tracks from backend database (/api/music), falling back to bundled audio1
 * - Picks a random track when played, and automatically plays another random track when the current one ends
 * - Remembers user preference in localStorage
 */
export default function BackgroundAudio() {
  const audioRef = useRef(null)
  const wasPlayingBeforeCallRef = useRef(false)
  const [tracks, setTracks] = useState([{ id: 'default', title: 'Default Track', url: audio1 }])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(null)

  // Pause background music automatically during a Gemini Live voice call
  useEffect(() => {
    const handleCallStart = () => {
      setPlaying((currentlyPlaying) => {
        wasPlayingBeforeCallRef.current = currentlyPlaying
        return false
      })
    }
    const handleCallEnd = () => {
      if (wasPlayingBeforeCallRef.current) {
        wasPlayingBeforeCallRef.current = false
        setPlaying(true)
      }
    }
    window.addEventListener('ai_live_call_start', handleCallStart)
    window.addEventListener('ai_live_call_end', handleCallEnd)
    return () => {
      window.removeEventListener('ai_live_call_start', handleCallStart)
      window.removeEventListener('ai_live_call_end', handleCallEnd)
    }
  }, [])

  // Fetch playlist from database
  useEffect(() => {
    async function loadMusic() {
      const data = await fetchFromApi('/api/music')
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data
          .filter(t => t && t.url)
          .map(t => ({
            id: t.id,
            title: t.title || 'Portfolio Track',
            url: resolveAudioUrl(t.url),
          }))
        if (mapped.length > 0) {
          setTracks(mapped)
          setCurrentIndex(pickRandomIndex(mapped.length))
        }
      }
    }
    loadMusic()
  }, [])

  // Restore previous preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bg_music_playing')
      if (saved === 'true') setPlaying(true)
    } catch (e) {}
  }, [])

  // Control audio playback whenever playing state or current track changes
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
    }

    try {
      localStorage.setItem('bg_music_playing', playing ? 'true' : 'false')
    } catch (e) {}
  }, [playing, currentIndex, tracks])

  const handleTogglePlay = () => {
    if (!playing && tracks.length > 1) {
      // Pick a random track when starting playback from paused/stopped state
      const audio = audioRef.current
      if (!audio || audio.currentTime === 0 || audio.ended) {
        setCurrentIndex(prev => pickRandomIndex(tracks.length, prev))
      }
    }
    setPlaying((prev) => !prev)
  }

  const handleTrackEnded = () => {
    if (tracks.length > 1) {
      setCurrentIndex(prev => pickRandomIndex(tracks.length, prev))
    }
  }

  const currentSrc = tracks[currentIndex]?.url || audio1

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSrc}
        loop={tracks.length <= 1}
        onEnded={handleTrackEnded}
        preload="auto"
      />

      {/* Floating Compact Shiny Music Control Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5"
      >
        {/* Outer pulsating sound waves and orbit ring when "singing" */}
        <div className="relative flex items-center justify-center">
          {playing && (
            <>
              {/* Expanding audio pulse rings */}
              <motion.div
                className="absolute -inset-2 sm:-inset-2.5 rounded-full bg-cyan-500/20 pointer-events-none"
                animate={{
                  scale: [1, 1.35, 1.65],
                  opacity: [0.6, 0.25, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className="absolute -inset-2 sm:-inset-2.5 rounded-full bg-purple-500/20 pointer-events-none"
                animate={{
                  scale: [1, 1.25, 1.45],
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
                className="absolute -inset-1.5 rounded-full border border-cyan-400/40 border-dashed pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}

          {/* Compact Shiny Button Component Styled for Audio */}
          <motion.button
            onClick={handleTogglePlay}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            data-playing={playing ? "true" : "false"}
            className={`shiny-cta shiny-cta-circle relative group shadow-2xl transition-all duration-300 ${
              playing ? 'is-playing shadow-cyan-500/40 ring-1 ring-cyan-400/50' : 'hover:shadow-cyan-500/30'
            }`}
            aria-pressed={playing}
            aria-label={playing ? 'Pause background music' : 'Play background music'}
          >
            {/* Center Content with Animated Icons */}
            <span className="shiny-content flex items-center justify-center relative z-10 w-full h-full text-white">
              {playing ? (
                <div className="flex items-center justify-center gap-1">
                  {/* Compact equalizer animated bars */}
                  <div className="flex items-end gap-0.5 h-4">
                    <motion.span
                      className="w-0.5 sm:w-1 bg-cyan-400 rounded-full"
                      animate={{ height: ['4px', '14px', '7px', '16px', '4px'] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.span
                      className="w-0.5 sm:w-1 bg-pink-400 rounded-full"
                      animate={{ height: ['12px', '5px', '15px', '8px', '12px'] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    />
                    <motion.span
                      className="w-0.5 sm:w-1 bg-purple-400 rounded-full"
                      animate={{ height: ['7px', '16px', '4px', '13px', '7px'] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                    />
                  </div>
                  <Pause className="w-4 h-4 text-white drop-shadow-md" />
                </div>
              ) : (
                <div className="flex items-center justify-center pl-0.5">
                  <Play className="w-5 h-5 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
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
