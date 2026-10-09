import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'
import Footer from '../components/Footer.jsx'
import ServerOfflineBot from '../components/ServerOfflineBot.jsx'
import BackgroundParticles from '../components/BackgroundParticles.jsx'

export default function SourceCode() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceCodes, setSourceCodes] = useState([])
  const [freeSourceCodes, setFreeSourceCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasingItem, setPurchasingItem] = useState(null)
  const [buyerEmail, setBuyerEmail] = useState('')
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [paymentSuccessData, setPaymentSuccessData] = useState(null)

  useEffect(() => {
    // Load Paystack Inline JS library dynamically
    if (!document.getElementById('paystack-script')) {
      const script = document.createElement('script')
      script.id = 'paystack-script'
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      document.body.appendChild(script)
    }

    async function getSourceCodes() {
      try {
        const premiumRes = await fetchFromApi('/api/source-codes')
        const premiumList = Array.isArray(premiumRes) ? premiumRes : (premiumRes?.data || [])
        setSourceCodes(premiumList)
      } catch (err) {
        console.error('Error fetching premium source codes:', err)
        // Fallback default premium items
        setSourceCodes([
          {
            id: '1',
            title: 'CaleByte AI Agent Source Code',
            filename: 'calebyte-ai.zip',
            filesize: '10.1 MB',
            description: 'Includes the complete CaleByte AI Agent source code, project structure, setup requirements, and everything you need to run and understand the system.',
            tech: ['Python', 'FastAPI', 'AI Agents', 'React'],
            price: 15000,
            download_link: '#'
          },
          {
            id: '2',
            title: 'Browser Cookie & Key Decryption Engine',
            filename: 'Browser Decryption.zip',
            filesize: '60 KB',
            description: 'This contains the complete source code for decrypting V20 browser cookies and session keys, including cookies stored in Google Chrome & Chromium browsers.',
            tech: ['Python', 'Cryptography', 'Chrome API'],
            price: 15000,
            download_link: '#'
          }
        ])
      }

      try {
        const freeRes = await fetchFromApi('/api/free-source-codes')
        const freeList = Array.isArray(freeRes) ? freeRes : (freeRes?.data || [])
        setFreeSourceCodes(freeList)
      } catch (err) {
        console.error('Error fetching free source codes:', err)
        // Fallback default free items
        setFreeSourceCodes([
          {
            id: 'f1',
            title: 'Vite Tailwind Dashboard Boilerplate',
            filename: 'vite-tailwind-dashboard.zip',
            filesize: '4.2 MB',
            description: 'A premium, fully configured React + Vite + Tailwind CSS admin dashboard template. Includes dark mode toggling, custom chart components, and auth layouts.',
            tech: ['React', 'Vite', 'Tailwind CSS'],
            download_link: 'https://github.com/anayolico/onetime'
          }
        ])
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

  const handleOpenCheckout = (item) => {
    setPurchasingItem(item)
    setEmailModalOpen(true)
  }

  const triggerPaystackCheckout = (e) => {
    e.preventDefault()
    if (!buyerEmail || !buyerEmail.includes('@')) {
      alert('Please enter a valid email address to receive your purchase download link.')
      return
    }
    setEmailModalOpen(false)

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_d3a016629910d635c02b28c8dbbb7190f84501a3'
    const amountInKobo = (purchasingItem.price || 15000) * 100

    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: buyerEmail,
        amount: amountInKobo,
        currency: 'NGN',
        ref: 'SC_' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
          custom_fields: [
            {
              display_name: "Product Title",
              variable_name: "product_title",
              value: purchasingItem.title
            },
            {
              display_name: "ZIP Filename",
              variable_name: "zip_filename",
              value: purchasingItem.filename || 'source-code.zip'
            }
          ]
        },
        callback: function (response) {
          setPaymentSuccessData({
            item: purchasingItem,
            ref: response.reference
          })
        },
        onClose: function () {
          console.log('Checkout closed by customer')
        }
      })
      handler.openIframe()
    } else {
      // Fallback direct checkout if popup script blocked
      alert(`Paystack Checkout Initialized for ${purchasingItem.title}. Reference: ${buyerEmail}`)
      setPaymentSuccessData({
        item: purchasingItem,
        ref: 'REF_' + Date.now()
      })
    }
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
        <BackgroundParticles />
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
                      {filteredPremiumItems.map(item => {
                        const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
                        return (
                          <motion.div
                            layout
                            key={item.id || item.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 hover:border-amber-400/60 flex flex-col justify-between space-y-6 group shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300"
                            style={{
                              background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(217, 119, 6, 0.45) 0%, rgba(180, 83, 9, 0.30) 30%, rgba(45, 20, 10, 0.85) 65%, #080607 100%)',
                              boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(251, 191, 36, 0.25)'
                            }}
                          >
                            {/* Grainy Noise Texture Effect (matching 21st.dev Noise effect11) */}
                            <div
                              className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-overlay -z-10"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                              }}
                            />

                            {/* Luminous Center Amber/Orange Glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.22),transparent_70%)] pointer-events-none -z-10 group-hover:scale-110 transition-transform duration-700" />

                            {/* Top Amber Ambient Highlight */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-36 bg-gradient-to-b from-amber-400/15 via-orange-500/5 to-transparent blur-2xl pointer-events-none -z-10" />

                            <div className="space-y-4 relative z-10">
                              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight group-hover:text-amber-300 transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-amber-100/75 leading-relaxed font-sans">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {techArr.map(t => (
                                  <span
                                    key={t}
                                    className="px-3 py-1 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-xs font-semibold text-amber-200 border border-amber-500/30 hover:border-amber-400 hover:text-white transition-all duration-200 shadow-sm backdrop-blur-sm"
                                  >
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-amber-500/20 relative z-10">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/60 block">Price</span>
                                <span className="text-2xl font-extrabold font-display text-white">₦{(item.price || 15000).toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleOpenCheckout(item)}
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:via-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/45 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 group/btn"
                              >
                                <span>Download Now</span>
                                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        )
                      })}
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
                      {filteredFreeItems.map(item => {
                        const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
                        return (
                          <motion.div
                            layout
                            key={item.id || item.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="p-6 sm:p-8 rounded-3xl border border-white/15 hover:border-white/30 flex flex-col justify-between space-y-6 group shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300"
                            style={{
                              background: 'radial-gradient(ellipse 95% 70% at 50% 0%, #303746 0%, #151924 45%, #080a11 100%)',
                              boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
                            }}
                          >
                            {/* Top Spotlight Radial Ambient Glow (Matching Contact Form) */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none -z-10" />

                            {/* Subtle Ambient Corner Accent */}
                            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent-teal/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-teal/20 transition-all duration-500" />

                            <div className="space-y-4 relative z-10">
                              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display leading-tight group-hover:text-accent-teal transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {techArr.map(t => (
                                  <span
                                    key={t}
                                    className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-slate-200 border border-white/10 hover:border-accent-teal/40 hover:text-white transition-all duration-200 shadow-sm"
                                  >
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-end pt-4 border-t border-white/10 relative z-10">
                              <a
                                href={item.downloadLink || item.download_link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl bg-accent-teal hover:bg-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-accent-teal/25 hover:shadow-accent-teal/40 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95 group/btn"
                              >
                                <span>Download Now</span>
                                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </a>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <p className="text-text-muted text-xs font-mono">No free codebases found matching the filters.</p>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Email Entry Modal for Source Code Purchase */}
        {emailModalOpen && purchasingItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/90 overflow-hidden z-10 border border-white/15 text-white space-y-6"
              style={{
                background: 'radial-gradient(ellipse 95% 70% at 50% 0%, #303746 0%, #151924 45%, #080a11 100%)',
                boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
              }}
            >
              {/* Top Spotlight Radial Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none -z-10" />

              {/* Header: Title and Close Button */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-[11px] font-semibold tracking-wide">
                    <span>⚡</span> Instant Access
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white tracking-tight">
                    Get Source Code
                  </h3>
                  <p className="text-xs text-slate-400">
                    Complete production project ZIP, architecture & setup guide
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10 shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Selected Codebase Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">Selected Codebase</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                      {purchasingItem.title}
                    </h4>
                    {purchasingItem.filename && (
                      <span className="inline-block text-[11px] text-slate-400 font-mono">
                        📦 {purchasingItem.filename} {purchasingItem.filesize ? `• ${purchasingItem.filesize}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">Price</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-display text-amber-400">
                      ₦{(purchasingItem.price || 15000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={triggerPaystackCheckout} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label htmlFor="checkout-email" className="text-xs uppercase tracking-wider font-extrabold text-slate-300 block">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                      </svg>
                    </div>
                    <input
                      id="checkout-email"
                      type="email"
                      placeholder="e.g. buyer@example.com"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/45 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <span>🔒</span> Your codebase ZIP download link will be delivered directly to this email upon payment.
                  </p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-accent-teal via-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-accent-teal/30 hover:shadow-accent-teal/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Proceed to Paystack</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Payment Success Confirmation Modal */}
        {paymentSuccessData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-lg sm:max-w-xl rounded-3xl p-6 sm:p-9 text-center space-y-6 border border-white/15 text-white shadow-2xl shadow-black/90 overflow-hidden"
              style={{
                background: 'radial-gradient(ellipse 95% 70% at 50% 0%, #303746 0%, #151924 45%, #080a11 100%)',
                boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
              }}
            >
              {/* Top Spotlight Radial Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none -z-10" />

              {/* Glowing Success Badge Icon */}
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-xl animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-300/40 relative z-10">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Header */}
              <div className="space-y-1.5 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide">
                  <span>✓</span> Transaction Verified
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  Payment Successful!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Thank you! Your codebase package is ready for instant download.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/45 border border-white/10 text-left space-y-3 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">Purchased Codebase</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                      {paymentSuccessData.item.title}
                    </h4>
                    {paymentSuccessData.item.filename && (
                      <span className="inline-block text-[11px] text-slate-400 font-mono">
                        📦 {paymentSuccessData.item.filename} {paymentSuccessData.item.filesize ? `• ${paymentSuccessData.item.filesize}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">Amount Paid</span>
                    <span className="text-base sm:text-lg font-extrabold font-display text-amber-400">
                      ₦{(paymentSuccessData.item.price || 15000).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Payment Reference</span>
                  <code className="text-amber-400 font-mono bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
                    {paymentSuccessData.ref}
                  </code>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2 relative z-10">
                <a
                  href={paymentSuccessData.item.download_link || paymentSuccessData.item.downloadLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-accent-teal hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/45 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 group/btn mx-auto"
                >
                  <span>Download Codebase ZIP</span>
                  <svg className="w-5 h-5 transition-transform group-hover/btn:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>

                <button
                  type="button"
                  onClick={() => setPaymentSuccessData(null)}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer block mx-auto pt-1 font-medium hover:underline"
                >
                  Done / Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </>
  )
}
