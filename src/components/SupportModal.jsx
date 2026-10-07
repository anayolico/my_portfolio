import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
            className="relative w-full max-w-lg glass-card bg-bg-surface/95 dark:bg-[#0f1624]/95 border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 overflow-hidden z-10"
          >
            {/* Header: Title and Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/50 dark:border-white/10">
              <h3 className="text-xl font-bold font-display text-text-main">
                Support CaleByte
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-text-muted hover:text-text-main flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {successData ? (
              /* Success Thank-You View */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold font-display text-text-main">Thank You So Much!</h4>
                <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                  Your generous support of <span className="font-bold text-accent-teal">₦{successData.amount.toLocaleString()}</span> keeps our projects, tools, and servers running.
                </p>
                <p className="text-[11px] text-text-muted font-mono pt-2">
                  Reference: {successData.reference}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-accent-teal text-white font-bold text-sm shadow-md hover:brightness-110 transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Payment Form */
              <form onSubmit={handlePaystackSupport} className="pt-5 space-y-5">
                {/* Amount Display & Quick Selectors */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Amount
                  </label>

                  {/* Main Display Input Box */}
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-lg text-text-main/70 pointer-events-none">
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
                        className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-white/70 dark:bg-black/30 border border-amber-400/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-text-main text-lg font-bold outline-none transition-all"
                      />
                    ) : (
                      <div className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-white/70 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 text-text-main text-lg font-bold">
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
                              ? 'bg-amber-400/15 text-amber-500 dark:text-amber-300 border-amber-400/60 shadow-sm'
                              : 'bg-white/40 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
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
                          ? 'bg-amber-400/15 text-amber-500 dark:text-amber-300 border-amber-400/60 shadow-sm'
                          : 'bg-white/40 dark:bg-white/5 text-text-muted border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                {/* Supporter Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-text-main text-sm outline-none transition-all placeholder:text-text-muted/50"
                  />
                </div>

                {/* Supporter Name (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
                    <span>Name</span>
                    <span className="text-[10px] font-normal lowercase text-text-muted/70">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or handle"
                    className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-black/30 border border-gray-200/80 dark:border-white/10 focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 text-text-main text-sm outline-none transition-all placeholder:text-text-muted/50"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-semibold text-center">{error}</p>
                )}

                {/* Submit Paystack Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
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
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Support with ₦{formattedActiveAmount}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
