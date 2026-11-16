import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fetchFromApi } from '../services/api.js'
import {
  PremiumCodebaseCard,
  FreeCodebaseCard,
  SourceCodeCheckoutModals,
  useSourceCodeCheckout,
} from './CodebaseCards.jsx'

export default function SourceCodePreview() {
  const [freeCodebases, setFreeCodebases] = useState([])
  const [premiumCodebases, setPremiumCodebases] = useState([])
  const [loading, setLoading] = useState(true)
  const checkout = useSourceCodeCheckout()

  useEffect(() => {
    async function loadPreviewCodebases() {
      const [freeRes, premiumRes] = await Promise.all([
        fetchFromApi('/api/free-source-codes').catch(() => null),
        fetchFromApi('/api/source-codes').catch(() => null),
      ])

      const freeList = Array.isArray(freeRes) ? freeRes : (freeRes?.data || [])
      const premiumList = Array.isArray(premiumRes) ? premiumRes : (premiumRes?.data || [])

      setFreeCodebases(freeList.slice(0, 2))
      setPremiumCodebases(premiumList.slice(0, 2))
      setLoading(false)
    }

    loadPreviewCodebases()
  }, [])

  if (!loading && freeCodebases.length === 0 && premiumCodebases.length === 0) {
    return null
  }

  return (
    <section id="source-code-preview" className="py-12 space-y-10">
      {/* Single unified header covering both free/testing and paid/production codebases */}
      <div className="space-y-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-text-main tracking-tight">
          Codebases &amp; Source Code
        </h3>
        <p className="text-sm sm:text-base text-text-muted font-sans max-w-2xl">
          Download free starter codebases to test and experiment with, or unlock complete production-ready systems built for real-world deployment.
        </p>
      </div>

      {loading ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-3xl p-8 h-64 border border-white/5 animate-pulse bg-slate-900/40" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="glass-card rounded-3xl p-8 h-64 border border-white/5 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Free Codebases Preview (max 2 cards, no button underneath) */}
          {freeCodebases.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {freeCodebases.map(item => (
                <FreeCodebaseCard key={item.id || item.title} item={item} />
              ))}
            </div>
          )}

          {/* Premium Codebases Preview (max 2 cards, no section heading above, Source Code button pushed right) */}
          {premiumCodebases.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {premiumCodebases.map(item => (
                  <PremiumCodebaseCard
                    key={item.id || item.title}
                    item={item}
                    onCheckout={checkout.handleOpenCheckout}
                  />
                ))}
              </div>

              <div className="flex justify-end pt-2 w-full">
                <a
                  href="/source-code"
                  onClick={(e) => {
                    e.preventDefault()
                    window.history.pushState({}, '', '/source-code')
                    window.dispatchEvent(new Event('popstate'))
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs sm:text-base shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer tracking-wide whitespace-nowrap"
                  >
                    <span>Source Code</span>
                  </motion.button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      <SourceCodeCheckoutModals {...checkout} />
    </section>
  )
}
