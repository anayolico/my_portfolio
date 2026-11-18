import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Full-screen lightbox modal to view the Hackathon Award image in full.
 */
export default function AwardImageModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full flex flex-col items-center gap-4"
          >
            {/* Header with title & close button */}
            <div className="w-full flex items-center justify-between gap-4 px-1">
              <div className="space-y-0.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 font-mono block">
                  HACKATHON WINNER — 1ST PLACE
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
                  {project.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close award preview"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Award Image */}
            <div className="w-full rounded-2xl overflow-hidden border border-amber-400/40 bg-black/60 shadow-2xl shadow-amber-500/10 flex items-center justify-center">
              {project.image && project.image.trim() !== '' ? (
                <img
                  src={project.image}
                  alt={`${project.title} Hackathon Award`}
                  className="w-full max-h-[80vh] object-contain"
                />
              ) : (
                <div className="py-20 px-6 text-center text-amber-200/80 text-sm font-sans">
                  Award image is not available.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
