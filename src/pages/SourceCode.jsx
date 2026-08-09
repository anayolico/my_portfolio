import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchFromApi } from '../services/api.js'
import SEO from '../components/SEO'
import Footer from '../components/Footer.jsx'

export default function SourceCode() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sourceCodes, setSourceCodes] = useState([])
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
      const res = await fetchFromApi('/api/source-codes')
      if (res && Array.isArray(res)) {
        setSourceCodes(res)
      } else if (res && Array.isArray(res.data)) {
        setSourceCodes(res.data)
      } else {
        // Default fallback templates
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
      setLoading(false)
    }
    getSourceCodes()
  }, [])

  // Extract all unique technology tags for filter pills
  const allTechTags = ['All']
  sourceCodes.forEach(item => {
    const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
    techArr.forEach(t => {
      const trimmed = t.trim()
      if (trimmed && !allTechTags.includes(trimmed)) {
        allTechTags.push(trimmed)
      }
    })
  })

  // Filter items by active tag & search query
  const filteredItems = sourceCodes.filter(item => {
    const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
    const matchesFilter = activeFilter === 'All' || techArr.some(t => t.trim().toLowerCase() === activeFilter.toLowerCase())
    const matchesSearch = searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techArr.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

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

      <div className="min-h-screen bg-bg-body text-text-main flex flex-col justify-between selection:bg-accent-teal selection:text-white">
        
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
              <span>● SOURCE CODE MARKETPLACE</span>
            </div>
          </motion.div>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center max-w-3xl mx-auto border-b border-gray-200 dark:border-gray-800 pb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-extrabold uppercase tracking-widest">
              ⚡ Open Source & Production Codebases
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-main font-display leading-tight">
              Source Code
            </h1>
            <p className="text-text-muted text-base sm:text-xl font-sans leading-relaxed">
              Complete project ZIPs — download the whole codebase, open it and build on it.
            </p>
          </motion.div>

          {/* Search Input & Tech Tag Filters */}
          <div className="space-y-6">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search source code or stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-white/60 dark:bg-slate-900/80 border border-gray-200 dark:border-white/10 text-text-main placeholder-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 transition-all text-sm font-sans shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Technology Pill Filters */}
            <div className="flex flex-wrap justify-center gap-2.5">
              {allTechTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${activeFilter === tag
                      ? 'bg-accent-teal text-white border-accent-teal font-bold shadow-md shadow-accent-teal/30'
                      : 'bg-white/40 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/5 hover:border-accent-teal/50 hover:text-text-main'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Source Code Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="glass-card rounded-3xl p-8 h-64 border border-white/5 animate-pulse bg-slate-900/40" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map(item => {
                  const techArr = Array.isArray(item.tech) ? item.tech : (typeof item.tech === 'string' ? item.tech.split(',') : [])
                  const formattedPrice = `₦${(item.price || 15000).toLocaleString()}`

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
                      {/* Top ZIP File Badge */}
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-semibold">
                          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                            📦
                          </div>
                          <div>
                            <p className="font-bold text-amber-200 leading-tight">{item.filename || 'source-code.zip'}</p>
                            <p className="text-[10px] text-amber-400/80 font-mono">ZIP archive · {item.filesize || '10 MB'}</p>
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

                      {/* Bottom Pricing & Checkout Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Price</span>
                          <span className="text-2xl font-extrabold font-display text-text-main">{formattedPrice}</span>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center max-w-md mx-auto space-y-6 relative"
            >
              {/* Soft Pulsing Ambient Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent-teal/20 via-cyan-500/10 to-amber-500/20 rounded-full blur-3xl -z-10 animate-pulse" />

              {/* Animated AI Bot Head */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-32 h-32 mx-auto relative flex items-center justify-center"
              >
                {/* Robot Antenna LED */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-amber-300 absolute -top-3 shadow-lg shadow-amber-400/80 z-10"
                />
                <div className="w-1.5 h-4 bg-slate-700 absolute -top-1" />

                {/* Robot Head Body */}
                <div className="w-28 h-24 rounded-3xl bg-slate-900 border-2 border-accent-teal/40 shadow-2xl p-3 flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-xl">
                  {/* Visor Display */}
                  <div className="w-full h-12 rounded-2xl bg-slate-950 border border-accent-teal/30 p-2 flex items-center justify-around relative">
                    {/* Animated Pupils Looking Left & Right */}
                    <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ x: [-5, 5, -5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2.5 h-2.5 rounded-full bg-accent-teal shadow-md shadow-accent-teal"
                      />
                    </div>
                    <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center overflow-hidden">
                      <motion.div
                        animate={{ x: [-5, 5, -5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2.5 h-2.5 rounded-full bg-accent-teal shadow-md shadow-accent-teal"
                      />
                    </div>
                  </div>

                  {/* Animated Digital Mouth Line */}
                  <motion.div
                    animate={{ width: ['40%', '70%', '40%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-1 rounded-full bg-cyan-400/70 shadow-sm shadow-cyan-400"
                  />
                </div>

                {/* Ear Bolts */}
                <div className="w-2 h-5 rounded-l-md bg-slate-700 absolute left-0 top-1/2 -translate-y-1/2" />
                <div className="w-2 h-5 rounded-r-md bg-slate-700 absolute right-0 top-1/2 -translate-y-1/2" />
              </motion.div>

              {/* Headline & Subtitle */}
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-text-main font-display tracking-tight flex items-center justify-center gap-2">
                  <span>No Codebase Found</span>
                  <span className="text-xl">🤖</span>
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-sans">
                  Check back soon for new releases!
                </p>
              </div>
            </motion.div>
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
