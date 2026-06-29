import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { submitContactForm } from '../services/api.js'
import SEO from '../components/SEO'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateContactForm({ fullName, email, description }) {
  const nextErrors = {}

  if (!fullName.trim()) {
    nextErrors.fullName = 'Full name is required'
  } else if (fullName.trim().length < 3) {
    nextErrors.fullName = 'Full name must be at least 3 characters'
  } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
    nextErrors.fullName = 'Full name can only contain letters'
  }

  if (!email.trim()) {
    nextErrors.email = 'Email is required'
  } else if (!EMAIL_RE.test(email.trim())) {
    nextErrors.email = 'Invalid email address'
  }

  if (!description.trim()) {
    nextErrors.description = 'Description is required'
  } else if (description.trim().length < 10) {
    nextErrors.description = 'At least 10 characters required'
  }

  return nextErrors
}

export default function Contact(){
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    description: false,
  })

  useEffect(() => {
    const formErrors = validateContactForm({ fullName, email, description })
    const touchedErrors = {}

    if (touched.fullName && formErrors.fullName) {
      touchedErrors.fullName = formErrors.fullName
    }

    if (touched.email && formErrors.email) {
      touchedErrors.email = formErrors.email
    }

    if (touched.description && formErrors.description) {
      touchedErrors.description = formErrors.description
    }

    setErrors(touchedErrors)
  }, [fullName, email, description, touched])

  const onSubmit = async (e) => {
    e.preventDefault()

    const nextTouched = {
      fullName: true,
      email: true,
      description: true,
    }
    const nextErrors = validateContactForm({ fullName, email, description })

    setTouched(nextTouched)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix the errors first')
      return
    }

    setIsSubmitting(true)
    setSubmitted(false)

    try {
      await submitContactForm({
        fullName: fullName.trim(),
        email: email.trim(),
        description: description.trim(),
      })

      setSubmitted(true)
      toast.success('Message sent!')
      onClear()

      setTimeout(() => {
        setSubmitted(false)
      }, 2500)
    } catch (error) {
      toast.error(error.message || 'Message failed to send')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onClear = () => {
    setFullName('')
    setEmail('')
    setDescription('')
    setErrors({})
    setTouched({
      fullName: false,
      email: false,
      description: false,
    })
  }

  const contactEmail = 'acnwa1234@gmail.com'
  const phoneNumber = '+2349165587681'
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello Anayo!')}`

  return (
    <>
      <SEO 
        title="Contact | Anayolico" 
        description="Have an exciting project idea, a role, or simply want to connect? Send a message." 
        keywords="Anayolico, Caleb Anayolico, Anayo, Contact, Hire, Freelance, Web Developer"
        url="/contact"
      />
      <section id="contact" className="py-20 space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight font-display transition-colors duration-300">
          Get In Touch
        </h2>
        <p className="text-text-muted text-base max-w-xl mx-auto transition-colors duration-300">
          Have an exciting project idea, a role, or simply want to connect? Send a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left: Sleek Form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7 glass-card p-8 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-6"
        >
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-widest font-extrabold text-text-muted transition-colors duration-300">Full Name</label>
            <input
              name="fullName"
              value={fullName}
              onChange={(e) => {
                 setFullName(e.target.value)
                 setTouched((prev) => ({ ...prev, fullName: true }))
              }}
              className="w-full p-3 modern-input text-text-main"
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="text-xs text-rose-500 font-semibold">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-widest font-extrabold text-text-muted transition-colors duration-300">Email Address</label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setTouched((prev) => ({ ...prev, email: true }))
              }}
              className="w-full p-3 modern-input text-text-main"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-widest font-extrabold text-text-muted transition-colors duration-300">Message Details</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setTouched((prev) => ({ ...prev, description: true }))
              }}
              className="w-full p-3 modern-input text-text-main h-32 resize-none"
              placeholder="Tell me about your project or inquiry..."
            />
            {errors.description && (
              <p className="text-xs text-rose-500 font-semibold">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-full bg-accent-teal text-white font-semibold shadow-lg shadow-accent-teal/10 hover:shadow-accent-teal/20 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 transition-all text-sm"
            >
              {isSubmitting ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClear}
              className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-text-main hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm font-semibold"
            >
              Clear
            </motion.button>
          </div>
        </motion.form>

        {/* Right: Contact details */}
        <div className="md:col-span-5 space-y-6">
          {/* Card: Email */}
          <div className="glass-card p-5 rounded-2xl border border-gray-200/50 dark:border-white/5 flex items-center gap-4 transition-colors duration-300 group hover:shadow-[0_8px_30px_rgba(var(--color-accent-teal-rgb),0.08)]">
            <div className="w-10 h-10 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center transition-all duration-300 border border-accent-teal/20 shadow-[0_0_15px_rgba(var(--color-accent-teal-rgb),0.2)] dark:shadow-[0_0_20px_rgba(var(--color-accent-teal-rgb),0.15)] group-hover:scale-105 group-hover:bg-accent-teal/15">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Email Me</p>
              <a className="text-text-main font-semibold hover:text-accent-teal hover:underline transition-all text-sm" href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
          </div>

          {/* Card: Phone */}
          <div className="glass-card p-5 rounded-2xl border border-gray-200/50 dark:border-white/5 flex items-center gap-4 transition-colors duration-300 group hover:shadow-[0_8px_30px_rgba(var(--color-accent-purple-rgb),0.08)]">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center transition-all duration-300 border border-accent-purple/20 shadow-[0_0_15px_rgba(var(--color-accent-purple-rgb),0.2)] dark:shadow-[0_0_20px_rgba(var(--color-accent-purple-rgb),0.15)] group-hover:scale-105 group-hover:bg-accent-purple/15">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Call Me</p>
              <a className="text-text-main font-semibold hover:text-accent-purple hover:underline transition-all text-sm" href={`tel:${phoneNumber}`}>{phoneNumber}</a>
            </div>
          </div>

          {/* Quick links panel */}
          <div className="glass-card p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 space-y-4 transition-colors duration-300">
            <h4 className="font-bold text-text-main font-display text-lg">Follow & Connect</h4>
            <div className="flex flex-wrap gap-2.5">
              <a className="px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-text-main border border-gray-200 dark:border-white/5 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_4px_12px_rgba(var(--color-accent-teal-rgb),0.12)] hover:border-accent-teal/30" href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <svg className="w-3.5 h-3.5 text-[#25D366] fill-currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a className="px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold text-text-main border border-gray-200 dark:border-white/5 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_4px_12px_rgba(var(--color-accent-purple-rgb),0.12)] hover:border-accent-purple/30" href="https://github.com/anayolico" target="_blank" rel="noopener noreferrer">
                <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
