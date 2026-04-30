import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const CONTACT_API_URL = `${API_BASE_URL}/api/contact`

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
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          description: description.trim(),
        }),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors)
        }

        throw new Error(result.message || 'Message could not be sent')
      }

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
  const phoneNumber = '+1249165587681'
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('Hello Anayo!')}`

  return (
    <section id="contact" className="py-16">
      <h2 className="text-2xl font-bold text-white mb-6">Contact</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-panel p-6 rounded-xl neon-glow"
        >
          <label className="block text-sm text-gray-300 mb-2">Full Name</label>
          <input
            name="fullName"
            value={fullName}
            onChange={(e) => {
               setFullName(e.target.value)
               setTouched((prev) => ({ ...prev, fullName: true }))
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-2 input-glow"
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-xs text-rose-400 mb-2">{errors.fullName}</p>
          )}

          <label className="block text-sm text-gray-300 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setTouched((prev) => ({ ...prev, email: true }))
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-2 input-glow"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-rose-400 mb-2">{errors.email}</p>
          )}

          <label className="block text-sm text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setTouched((prev) => ({ ...prev, description: true }))
            }}
            className="w-full p-3 rounded bg-gray-900 text-gray-200 mb-3 input-glow"
            rows={6}
            placeholder="Tell me about your project or inquiry"
          />
          {errors.description && (
            <p className="text-xs text-rose-400 mb-2">{errors.description}</p>
          )}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-neon-cyan text-black rounded font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : submitted ? 'Sent' : 'Send Message'}
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              onClick={onClear}
              className="px-4 py-2 border border-gray-700 text-gray-200 rounded"
            >
              Clear
            </motion.button>
          </div>
        </motion.form>

        <div className="flex flex-col gap-4 justify-center">
          <div className="bg-panel p-6 rounded-xl">
            <h4 className="text-sm font-medium text-gray-100 mb-2">Get in touch</h4>
            <p className="text-gray-300 text-sm mb-3">Email: <a className="text-neon-cyan hover:underline" href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
            <p className="text-gray-300 text-sm mb-3">Phone: <a className="text-neon-cyan hover:underline" href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
            <div className="flex gap-3 mt-2">
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href={`mailto:${contactEmail}`}>Email</a>
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href={whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="px-3 py-2 bg-gray-800 rounded text-gray-200" href="https://github.com/anayolico" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
