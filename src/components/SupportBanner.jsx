import React from 'react'
import { motion } from 'framer-motion'

const PRESET_AMOUNTS = [2000, 5000, 10000, 20000]

export default function SupportBanner({ onOpenModal }) {
  const handleClickAmount = (amt) => {
    if (onOpenModal) {
      onOpenModal(amt)
    } else {
      window.dispatchEvent(new CustomEvent('open_support_modal', { detail: { amount: amt } }))
    }
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 my-4">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Title & Description with no container / card */}
        <div className="space-y-1.5 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <svg 
              className="w-5 h-5 text-amber-500 fill-amber-500/20 stroke-amber-500" 
              viewBox="0 0 24 24" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg md:text-xl font-bold font-display text-text-main">
              Support the work
            </h3>
          </div>
          <p className="text-xs md:text-sm text-text-muted">
            If a class, a file or a guide here helped you, chip in whatever you like.
          </p>
        </div>

        {/* Right Side: Preset amount pills - responsive wrapping on mobile, single line on tablet/desktop */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleClickAmount(amt)}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white dark:bg-white/10 hover:bg-amber-400/20 text-slate-800 dark:text-white hover:text-amber-500 dark:hover:text-amber-300 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap border border-gray-200/60 dark:border-white/10"
            >
              ₦{amt.toLocaleString()}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleClickAmount(null)}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white dark:bg-white/10 hover:bg-amber-400/20 text-text-muted hover:text-amber-500 dark:hover:text-amber-300 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap border border-gray-200/60 dark:border-white/10"
          >
            Other
          </button>
        </div>
      </div>
    </section>
  )
}
