import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'
import Footer from '../components/Footer.jsx'
import {
  PremiumCodebaseCard,
  FreeCodebaseCard,
  SourceCodeCheckoutModals,
  useSourceCodeCheckout,
} from '../components/CodebaseCards.jsx'

export default function SourceCode() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceCodes, setSourceCodes] = useState([])
  const [freeSourceCodes, setFreeSourceCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const checkout = useSourceCodeCheckout()

  useEffect(() => {
    async function getSourceCodes() {
      try {
        const premiumRes = await fetchFromApi('/api/source-codes')
        const premiumList = Array.isArray(premiumRes) ? premiumRes : (premiumRes?.data || [])
        setSourceCodes(premiumList)
      } catch (err) {
        console.error('Error fetching premium source codes from database:', err)
        setSourceCodes([])
      }

      try {
        const freeRes = await fetchFromApi('/api/free-source-codes')
        const freeList = Array.isArray(freeRes) ? freeRes : (freeRes?.data || [])
        setFreeSourceCodes(freeList)
      } catch (err) {
        console.error('Error fetching free source codes from database:', err)
        setFreeSourceCodes([])
      }

      setLoading(false)
    }
    getSourceCodes()
  }, [])

  // Extract all unique technology tags for filter pills
  const allTechTags = ['All']
  const addTags = (items) => {
    items.forEach(item => {
      const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
      techArr.forEach(t => {
        const trimmed = t.trim()
        if (trimmed && !allTechTags.includes(trimmed)) {
          allTechTags.push(trimmed)
        }
      })
    })
  }
  addTags(sourceCodes)
  addTags(freeSourceCodes)

  // Filter items by active tag & search query
  const filterItems = (items) => {
    return items.filter(item => {
      const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
      const matchesFilter = activeFilter === 'All' || techArr.some(t => t.trim().toLowerCase() === activeFilter.toLowerCase())
      const matchesSearch = searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        techArr.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesFilter && matchesSearch
    })
  }

  const filteredPremiumItems = filterItems(sourceCodes)
  const filteredFreeItems = filterItems(freeSourceCodes)

  const goBackToHome = () => {
    window.location.href = '/'
  }

  return (
    <>
      <SEO
        title="Source Code Marketplace | CaleByte Technologies"
        description="Download complete production project ZIP codebases built by CaleByte Technologies. Battle-tested backend engines, AI agents, SaaS architectures, and utility tools."
        keywords="Source Code, Download Codebase, CaleByte, CaleByte Technologies, Caleb Anayolico, React, Python FastAPI, ZIP Architecture"
        url="/source-code"
      />

      <div className="min-h-screen text-text-main flex flex-col justify-between selection:bg-accent-teal selection:text-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full flex-grow space-y-12">
          {/* Top Bar: Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={goBackToHome}
              className="text-xs sm:text-sm font-semibold text-text-muted hover:text-accent-teal transition-colors duration-200 cursor-pointer"
            >
              <span>Back to Portfolio</span>
            </button>
          </motion.div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center max-w-3xl mx-auto border-b border-gray-200 dark:border-gray-800 pb-10"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-main font-display leading-tight">
              Source Code
            </h1>
            <p className="text-text-muted text-base sm:text-xl font-sans leading-relaxed">
              Complete project ZIPs — download the whole codebase, open it and build on it.
            </p>
          </motion.div>

          {/* Source Code Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card rounded-3xl p-8 h-64 border border-white/5 animate-pulse bg-slate-900/40" />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {/* Premium Section */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Premium Codebases</h2>
                {filteredPremiumItems.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredPremiumItems.map(item => (
                        <PremiumCodebaseCard
                          key={item.id || item.title}
                          item={item}
                          onCheckout={checkout.handleOpenCheckout}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <p className="text-text-muted text-xs font-mono">No premium codebases found matching the filters.</p>
                )}
              </div>

              {/* Dividing Line */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative px-4 bg-bg-body text-xs font-extrabold tracking-widest text-text-muted uppercase font-mono transition-colors duration-300">
                  ◇ ◇ ◇
                </div>
              </div>

              {/* Free Section */}
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Free Codebases</h2>
                {filteredFreeItems.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                      {filteredFreeItems.map(item => (
                        <FreeCodebaseCard
                          key={item.id || item.title}
                          item={item}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <p className="text-text-muted text-xs font-mono">No free codebases found matching the filters.</p>
                )}
              </div>
            </div>
          )}
        </main>

        <SourceCodeCheckoutModals {...checkout} />

        <Footer />
      </div>
    </>
  )
}
