import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, Check } from 'lucide-react'

const PRESET_AMOUNTS = [2000, 5000, 10000, 20000]

export default function SupportModal({ isOpen, onClose, initialAmount = 2000 }) {
  const [selectedAmount, setSelectedAmount] = useState(initialAmount)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialAmount) {
      if (PRESET_AMOUNTS.includes(Number(initialAmount))) {
        setSelectedAmount(Number(initialAmount))
        setIsCustom(false)
        setCustomAmount('')
      } else {
        setSelectedAmount(Number(initialAmount) || 2000)
        setIsCustom(true)
        setCustomAmount(String(initialAmount))
      }
    }
    setError('')
    setSuccessData(null)
  }, [initialAmount, isOpen])

  const getActiveAmount = () => {
    if (isCustom) {
      const parsed = parseInt(customAmount.replace(/\D/g, ''), 10)
      return isNaN(parsed) ? 0 : parsed
    }
    return selectedAmount
  }

  const handleSelectPreset = (amt) => {
    setSelectedAmount(amt)
    setIsCustom(false)
    setCustomAmount('')
    setError('')
  }

  const handleSelectCustom = () => {
    setIsCustom(true)
    setError('')
  }

  const handlePaystackSupport = (e) => {
    e.preventDefault()
    setError('')

    const finalAmount = getActiveAmount()
    if (!finalAmount || finalAmount < 100) {
      setError('Please enter a valid amount of at least ₦100.')
      return
    }

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_d3a016629910d635c02b28c8dbbb7190f84501a3'
    const amountInKobo = finalAmount * 100

    if (window.PaystackPop) {
      try {
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: email.trim(),
          amount: amountInKobo,
          currency: 'NGN',
          ref: 'SUP_' + Math.floor(Math.random() * 1000000000 + 1),
          metadata: {
            custom_fields: [
              {
                display_name: 'Supporter Name',
                variable_name: 'supporter_name',
                value: name.trim() || 'Anonymous'
              },
              {
                display_name: 'Support Type',
                variable_name: 'support_type',
                value: 'Portfolio & Work Support'
              }
            ]
          },
          callback: function (response) {
            setIsSubmitting(false)
            setSuccessData({
              amount: finalAmount,
              reference: response.reference
            })
          },
          onClose: function () {
            setIsSubmitting(false)
          }
        })
        handler.openIframe()
      } catch (err) {
        console.error('Paystack setup error:', err)
        setIsSubmitting(false)
        setError('Could not open payment window. Please try again.')
      }
    } else {
      setIsSubmitting(false)
      // Fallback
      setSuccessData({
        amount: finalAmount,
        reference: 'DEV_' + Date.now()
      })
    }
  }

  const formattedActiveAmount = getActiveAmount().toLocaleString()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/85 overflow-hidden z-10 border border-white/15 text-white"
            style={{
              background: 'radial-gradient(ellipse 95% 70% at 50% 0%, #303746 0%, #151924 45%, #080a11 100%)',
              boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.18)'
            }}
          >
            {/* Top Spotlight Radial Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-44 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none -z-10" />

            {/* Header: Title and Close Button (Hide top X button on success screen) */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold font-display text-white">
                Support CaleByte
              </h3>
              {!successData && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {successData ? (
              /* Celebratory Thank-You View with Animated Rolling Hearts & Vibrant Ambient Gradients */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="py-4 sm:py-6 text-center space-y-4 relative overflow-hidden"
              >
                {/* Ambient Mixing Gradients in the Background */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-tr from-pink-500/20 via-amber-400/15 to-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
                <div className="absolute -bottom-10 right-0 w-48 h-48 bg-accent-purple/15 rounded-full blur-2xl pointer-events-none -z-10" />

                {/* Floating / Rolling Animated Hearts in the Background */}
                <motion.div
                  initial={{ y: 30, opacity: 0, rotate: -25, scale: 0.5 }}
                  animate={{ y: [-10, -50], opacity: [0, 0.7, 0], rotate: [-25, 30], scale: [0.6, 1.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
                  className="absolute top-8 left-6 text-pink-500/40 pointer-events-none"
                >
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>

                <motion.div
                  initial={{ y: 40, opacity: 0, rotate: 25, scale: 0.5 }}
                  animate={{ y: [-15, -65], opacity: [0, 0.8, 0], rotate: [20, -35], scale: [0.7, 1.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
                  className="absolute top-12 right-6 text-amber-400/40 pointer-events-none"
                >
                  <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.div>

                {/* Central Celebratory Checkmark Badge */}
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-500/25 blur-md"
                  />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-400/60 shadow-xl flex items-center justify-center text-emerald-400">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.25, 1] }}
                      transition={{ duration: 0.5, ease: 'backOut' }}
                    >
                      <Check className="w-8 h-8 text-emerald-400 stroke-[2.5]" />
                    </motion.div>
                  </div>
                </div>

                {/* Heading */}
                <h4 className="text-2xl sm:text-3xl font-extrabold font-display bg-gradient-to-r from-amber-300 via-pink-400 to-teal-300 bg-clip-text text-transparent">
                  Thank You So Much!
                </h4>

                {/* Appreciation Description */}
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your generous support of <span className="font-bold text-base sm:text-lg text-accent-teal">₦{successData.amount.toLocaleString()}</span> directly fuels our independent engineering, open tools, and keeps the caffeine flowing!
                </p>

                {/* Close Button */}
                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-accent-teal via-cyan-500 to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-accent-teal/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Payment Form */
              <form onSubmit={handlePaystackSupport} className="pt-5 space-y-5">
                {/* Amount Display & Quick Selectors */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Amount
                  </label>

                  {/* Main Display Input Box */}
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-lg text-slate-400 pointer-events-none">
                      ₦
                    </span>
                    {isCustom ? (
                      <input
                        type="text"
                        autoFocus
                        value={customAmount}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setCustomAmount(val ? parseInt(val, 10).toLocaleString() : '')
                        }}
                        placeholder="Enter custom amount"
                        className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-black/45 border border-amber-400/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white text-lg font-bold outline-none transition-all shadow-inner"
                      />
                    ) : (
                      <div className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-black/45 border border-white/10 text-white text-lg font-bold shadow-inner">
                        {formattedActiveAmount}
                      </div>
                    )}
                  </div>

                  {/* Quick Preset Amount Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRESET_AMOUNTS.map((amt) => {
                      const isSelected = !isCustom && selectedAmount === amt
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectPreset(amt)}
                          className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                            isSelected
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                              : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={handleSelectCustom}
                      className={`flex-1 min-w-[65px] py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer text-center ${
                        isCustom
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                {/* Supporter Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20 text-white text-sm outline-none transition-all placeholder:text-slate-500 shadow-inner"
                  />
                </div>

                {/* Supporter Name (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Name</span>
                    <span className="text-[10px] font-normal lowercase text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or handle"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20 text-white text-sm outline-none transition-all placeholder:text-slate-500 shadow-inner"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>
                )}

                {/* Submit Shiny CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="shiny-cta w-full py-4 rounded-2xl text-white font-bold text-sm sm:text-base shadow-[0_8px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.5)] active:scale-[0.99] disabled:opacity-70 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                  style={{
                    '--shiny-cta-bg': '#0f1118',
                    '--shiny-cta-bg-subtle': '#1a1f2c',
                    '--shiny-cta-highlight': '#f59e0b',
                    '--shiny-cta-highlight-subtle': '#fb923c',
                    '--shiny-cta-fg': '#ffffff',
                  }}
                >
                  <span className="shiny-content flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Connecting to Paystack...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        Support with ₦{formattedActiveAmount}
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  )
}
