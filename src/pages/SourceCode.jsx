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
            title: 'MR Bayo AI Agent Source Code',
            filename: 'mr-bayo.zip',
            filesize: '10.1 MB',
            description: 'Includes the complete Mr. Bayo AI Agent source code, project structure, setup requirements, and everything you need to run and understand the system.',
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
        title="Source Code Marketplace | Caleb Anayolico"
        description="Download complete production project ZIP codebases built by Caleb Anayolico. Battle-tested backend engines, AI agents, SaaS architectures, and utility tools."
        keywords="Source Code, Download Codebase, Mr Bayo AI Agent, Caleb Anayolico, React, Python FastAPI, ZIP Architecture"
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
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted hover:text-accent-teal transition-colors duration-200 cursor-pointer group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Portfolio</span>
            </button>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-teal/10 border border-accent-teal/30 text-accent-teal text-xs font-bold uppercase tracking-wider shadow-sm">
              <span>SOURCE CODE MARKETPLACE</span>
            </div>
          </motion.div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center max-w-3xl mx-auto border-b border-gray-200 dark:border-gray-800 pb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-widest">
              Open Source & Production Codebases
            </div>
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
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Premium Codebases</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">Paid</span>
                </div>
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
                            className="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/20 dark:border-amber-400/15 flex flex-col justify-between space-y-6 hover:border-amber-400/40 transition-all duration-300 group shadow-xl bg-gradient-to-br from-amber-500/5 via-slate-900/40 to-slate-950/80"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
                                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    📦
                                  </div>
                                  <div>
                                    <p className="font-bold text-amber-200 leading-tight">Source Code Archive</p>
                                    <p className="text-[10px] text-amber-400/80 font-mono">Ready to download</p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-extrabold text-text-main font-display leading-tight group-hover:text-amber-400 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {techArr.map(t => (
                                  <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-accent-teal border border-accent-teal/20 font-semibold">
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Price</span>
                                <span className="text-2xl font-extrabold font-display text-text-main">₦{(item.price || 15000).toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleOpenCheckout(item)}
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-teal to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-accent-teal/25 hover:shadow-accent-teal/40 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
                              >
                                <span>Get the code</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Free Codebases</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">Free Download</span>
                </div>
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
                            className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/20 dark:border-emerald-400/15 flex flex-col justify-between space-y-6 hover:border-emerald-400/40 transition-all duration-300 group shadow-xl bg-gradient-to-br from-emerald-500/5 via-slate-900/40 to-slate-950/80"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
                                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                    📦
                                  </div>
                                  <div>
                                    <p className="font-bold text-emerald-200 leading-tight">Free Archive</p>
                                    <p className="text-[10px] text-emerald-400/80 font-mono">Direct download</p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-extrabold text-text-main font-display leading-tight group-hover:text-emerald-400 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {item.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {techArr.map(t => (
                                  <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 text-[11px] text-accent-teal border border-accent-teal/20 font-semibold">
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center justify-end pt-4 border-t border-white/10">
                              <a
                                href={item.downloadLink || item.download_link || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
                              >
                                <span>Download Now</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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

        {/* Email Entry Modal for Paystack Checkout */}
        {emailModalOpen && purchasingItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-5 border border-accent-teal/30 bg-slate-900/90 text-white"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <span>💳</span> Paystack Checkout
                </h3>
                <button onClick={() => setEmailModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-sm">✕</button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-300">
                  Purchasing: <strong className="text-accent-teal">{purchasingItem.title}</strong>
                </p>
                <p className="text-xs text-gray-400">
                  Amount: <strong className="text-amber-400 font-mono text-sm">₦{(purchasingItem.price || 15000).toLocaleString()}</strong>
                </p>
              </div>

              <form onSubmit={triggerPaystackCheckout} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1.5">Your Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. buyer@example.com"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent-teal"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Your codebase ZIP file link will be sent to this email upon payment.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setEmailModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 text-xs font-semibold">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-teal to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-accent-teal/30">Proceed to Paystack ↗</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Payment Success Confirmation Modal */}
        {paymentSuccessData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl max-w-md w-full text-center space-y-4 border border-emerald-500/40 bg-slate-900 text-white"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold font-display text-white">Payment Successful!</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Thank you for purchasing <strong className="text-accent-teal">{paymentSuccessData.item.title}</strong>!
                <br />Payment Reference: <code className="text-amber-400 font-mono text-[11px]">{paymentSuccessData.ref}</code>
              </p>

              <div className="pt-3 flex justify-center">
                <a
                  href={paymentSuccessData.item.download_link || paymentSuccessData.item.downloadLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Download Codebase ZIP</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
              
              <button
                onClick={() => setPaymentSuccessData(null)}
                className="text-xs text-gray-400 hover:text-white pt-2 cursor-pointer block mx-auto underline"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </>
  )
}
